const Meeting = require('../models/Meeting');
const { fetchLinkedInProfile } = require('../services/linkedinService');
const { generateMeetingPrep } = require('../services/llmService');

const generatePrep = async (req, res) => {
  try {
    const { meetingId, attendeeEmail } = req.body;

    if (!meetingId || !attendeeEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingPrep = await Meeting.findOne({ meetingId, attendeeEmail });
    if (existingPrep) {
      return res.json({ prep: existingPrep.generatedPrep, cached: true });
    }

    const linkedInResult = await fetchLinkedInProfile(attendeeEmail);

    if (!linkedInResult.success) {
      const prep = linkedInResult.message;
      await Meeting.create({ meetingId, attendeeEmail, generatedPrep: prep });
      return res.json({ prep, cached: false });
    }

    const prep = await generateMeetingPrep(linkedInResult.profile);
    await Meeting.create({ meetingId, attendeeEmail, generatedPrep: prep });

    res.json({ prep, cached: false });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate prep' });
  }
};

module.exports = { generatePrep };
