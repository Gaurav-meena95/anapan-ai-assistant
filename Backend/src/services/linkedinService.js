const axios = require('axios');

const fetchLinkedInProfile = async (email) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-email',
      params: { email },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'linkedin-data-api.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    
    if (response.data && response.data.data) {
      return {
        success: true,
        profile: response.data.data
      };
    }
    
    return {
      success: false,
      message: 'This email does not have a LinkedIn profile.'
    };
  } catch (error) {
    return {
      success: false,
      message: 'This email does not have a LinkedIn profile.'
    };
  }
};

module.exports = { fetchLinkedInProfile };
