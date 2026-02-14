const axios = require('axios');

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HEADERS = {
  'X-RapidAPI-Key': RAPIDAPI_KEY,
  'X-RapidAPI-Host': 'linkedin-data-api.p.rapidapi.com'
};

function normalizeProfile(data) {
  if (!data || typeof data !== 'object') return null;
  
  const name = data.fullName || data.name || [data.firstName, data.lastName].filter(Boolean).join(' ') || 'N/A';
  const headline = data.headline || data.title || 'N/A';
  const location = data.location || data.geoLocationName || 'N/A';
  const about = data.about || data.summary || 'N/A';
  const experience = data.experiences || data.experience || data.positions || [];
  const company = data.companyName || (experience[0] && experience[0].companyName) || 'N/A';
  
  return {
    name,
    headline,
    company,
    location,
    about,
    experience: Array.isArray(experience) ? experience : [experience]
  };
}

function extractNameFromEmail(email) {
  const username = email.split('@')[0].toLowerCase();
  const commonNames = {
    gaurav: true, meena: true, sharma: true, singh: true, kumar: true, 
    raj: true, amit: true, rahul: true, ankit: true, priya: true, 
    neha: true, pooja: true, riya: true
  };

  const cleaned = username.replace(/[0-9_.-]/g, ' ').trim();
  const parts = cleaned.split(/\s+/).filter(p => p.length > 2);
  const nameTokens = parts.filter(p => commonNames[p]).map(p => p.charAt(0).toUpperCase() + p.slice(1));

  if (nameTokens.length >= 2) return nameTokens.join(' ');
  if (nameTokens.length === 1) return nameTokens[0];
  
  return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') || username;
}

async function searchPeople(keywords) {
  const searchRes = await axios.request({
    method: 'GET',
    url: 'https://linkedin-data-api.p.rapidapi.com/search-people',
    params: { keywords, limit: '10' },
    headers: RAPIDAPI_HEADERS,
    validateStatus: () => true,
    timeout: 15000
  });

  if (searchRes.status !== 200 || !searchRes.data) return null;

  const list = searchRes.data.data || searchRes.data.results || searchRes.data.people || 
               (Array.isArray(searchRes.data) ? searchRes.data : []);
  const results = Array.isArray(list) ? list : [];

  if (results.length === 0) return null;

  for (let i = 0; i < Math.min(results.length, 3); i++) {
    const candidate = results[i];

    if (candidate.fullName || candidate.name || candidate.headline) {
      const profile = normalizeProfile(candidate);
      if (profile && profile.name !== 'N/A') return profile;
    }

    const profileUrl = candidate.profileUrl || candidate.url || candidate.linkedinUrl || candidate.publicIdentifier;
    if (!profileUrl) continue;

    const fullUrl = profileUrl.startsWith('http') ? profileUrl : `https://www.linkedin.com/in/${profileUrl}`;

    try {
      const profileRes = await axios.request({
        method: 'GET',
        url: 'https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url',
        params: { url: fullUrl },
        headers: RAPIDAPI_HEADERS,
        validateStatus: () => true,
        timeout: 15000
      });

      if (profileRes.status === 200 && profileRes.data) {
        const profile = normalizeProfile(profileRes.data.data || profileRes.data);
        if (profile) return profile;
      }
    } catch (err) {
      continue;
    }
  }

  return null;
}

const fetchLinkedInProfile = async (email, linkedinUrl = null) => {
  if (!RAPIDAPI_KEY) {
    return { success: false, message: 'RAPIDAPI_KEY not set in .env.' };
  }

  try {
    if (linkedinUrl) {
      const profileRes = await axios.request({
        method: 'GET',
        url: 'https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url',
        params: { url: linkedinUrl },
        headers: RAPIDAPI_HEADERS,
        validateStatus: () => true,
        timeout: 15000
      });

      if (profileRes.status === 200 && profileRes.data) {
        if (profileRes.data.success === false) {
          return {
            success: false,
            message: 'LinkedIn API service is no longer available.'
          };
        }

        const profile = normalizeProfile(profileRes.data.data || profileRes.data);
        if (profile) return { success: true, profile };
      }
    }

    const searchTerms = [email];
    const extractedName = extractNameFromEmail(email);
    if (extractedName && extractedName !== email) searchTerms.push(extractedName);
    
    const username = email.split('@')[0];
    if (username && username !== email && username !== extractedName) searchTerms.push(username);

    for (const term of searchTerms) {
      const profile = await searchPeople(term);
      if (profile) return { success: true, profile };
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return {
      success: false,
      message: 'LinkedIn profile not found. Try providing your LinkedIn profile URL.'
    };

  } catch (error) {
    return {
      success: false,
      message: 'Failed to search LinkedIn. Please check API key and quota.'
    };
  }
};

module.exports = { fetchLinkedInProfile };
