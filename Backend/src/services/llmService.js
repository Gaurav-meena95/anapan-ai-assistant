const axios = require('axios');

const generateMeetingPrep = async (profileData) => {
  try {
    const prompt = `You are a B2B sales intelligence assistant.

Given this LinkedIn profile:
Name: ${profileData.name || 'N/A'}
Headline: ${profileData.headline || 'N/A'}
Company: ${profileData.company || 'N/A'}
Location: ${profileData.location || 'N/A'}
About: ${profileData.about || 'N/A'}
Experience: ${JSON.stringify(profileData.experience || [])}

Generate a meeting preparation brief answering:
1. Who are they?
2. Where do they work / have worked?
3. What is their role like?
4. Are they likely a buyer?
5. Personality traits inference.
6. Best conversation approach.

Be concise but strategic.
Use bullet points.
Professional tone.`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    return 'Unable to generate meeting prep at this time. Please try again later.';
  }
};

module.exports = { generateMeetingPrep };
