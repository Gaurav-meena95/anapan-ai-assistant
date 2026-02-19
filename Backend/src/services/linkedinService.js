const axios = require('axios');

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'linkedin-scraper-api-real-time-fast-affordable.p.rapidapi.com';
const RAPIDAPI_HEADERS = {
  'x-rapidapi-key': RAPIDAPI_KEY,
  'x-rapidapi-host': RAPIDAPI_HOST
};

function normalizeProfile(data) {
  if (!data || typeof data !== 'object') return null;
  
  const basicInfo = data.basic_info || {};
  const experience = data.experience || [];
  
  const name = basicInfo.fullname || basicInfo.first_name + ' ' + basicInfo.last_name || 'N/A';
  const headline = basicInfo.headline || 'N/A';
  const location = basicInfo.location?.full || basicInfo.location?.city || 'N/A';
  const about = basicInfo.about || 'N/A';
  const company = basicInfo.current_company || (experience[0] && experience[0].company) || 'N/A';
  
  return {
    name,
    headline,
    company,
    location,
    about,
    experience: Array.isArray(experience) ? experience : []
  };
}

const fetchLinkedInProfile = async (email, linkedinUrl = null) => {
  if (!RAPIDAPI_KEY) {
    return { success: false, message: 'RAPIDAPI_KEY not set in .env.' };
  }

  try {
    if (linkedinUrl) {
      const profileRes = await axios.request({
        method: 'GET',
        url: `https://${RAPIDAPI_HOST}/profile/detail`,
        params: { username: linkedinUrl },
        headers: RAPIDAPI_HEADERS,
        validateStatus: () => true,
        timeout: 15000
      });

      console.log('LinkedIn API Response:', JSON.stringify(profileRes.data, null, 2));

      if (profileRes.status === 200 && profileRes.data && profileRes.data.success) {
        const profile = normalizeProfile(profileRes.data.data);
        if (profile && profile.name !== 'N/A') {
          return { success: true, profile };
        }
      }

      return {
        success: false,
        message: profileRes.data?.message || 'Failed to fetch LinkedIn profile data.'
      };
    }

    return {
      success: false,
      message: 'Please provide your LinkedIn profile URL.'
    };

  } catch (error) {
    console.error('LinkedIn API Error:', error.message);
    return {
      success: false,
      message: 'Failed to fetch LinkedIn profile. Please check API key and quota.'
    };
  }
};

module.exports = { fetchLinkedInProfile };
