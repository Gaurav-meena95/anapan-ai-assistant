const axios = require('axios');

const generateMeetingPrep = async (profileData) => {
  try {
    const profileText = [
      `Name: ${profileData.name || 'N/A'}`,
      `Headline: ${profileData.headline || 'N/A'}`,
      `Company: ${profileData.company || 'N/A'}`,
      `Location: ${profileData.location || 'N/A'}`,
      `About: ${profileData.about || 'N/A'}`,
      `Experience: ${JSON.stringify(profileData.experience || [])}`
    ].join('\n');

    const prompt = `You are a meeting preparation assistant. Analyze this LinkedIn profile and provide brief, clear answers.

Profile:
${profileText}

Answer these questions in simple, short paragraphs (2-3 sentences each):

Who are they?

Where do they work / have worked?

What is their role like in their company?

Can they be the right buyer?

What is their personality like?

How should you approach talking to them?

Keep answers concise and professional. No markdown formatting, no bullet points, no bold text. Just plain text with question headings.`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    return content || 'Unable to generate meeting prep at this time. Please try again later.';
  } catch (error) {
    return 'Unable to generate meeting prep at this time. Please try again later.';
  }
};

module.exports = { generateMeetingPrep };
