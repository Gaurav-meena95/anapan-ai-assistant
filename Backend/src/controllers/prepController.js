const Meeting = require('../models/Meeting');
const { fetchLinkedInProfile } = require('../services/linkedinService.mock');
const { generateMeetingPrep } = require('../services/llmService');

const generatePrep = async (req, res) => {
  try {
    const { meetingId, attendeeEmail, linkedinUrl } = req.body;

    if (!meetingId || !attendeeEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingPrep = await Meeting.findOne({ meetingId, attendeeEmail });
    if (existingPrep) {
      return res.json({ prep: existingPrep.generatedPrep, cached: true });
    }

    const linkedInResult = await fetchLinkedInProfile(attendeeEmail, linkedinUrl);

    if (!linkedInResult.success) {
      const prep = linkedInResult.message;
      try {
        await Meeting.create({ meetingId, attendeeEmail, generatedPrep: prep });
      } catch (e) {
        const cached = await Meeting.findOne({ meetingId, attendeeEmail });
        if (cached) return res.json({ prep: cached.generatedPrep, cached: true });
      }
      return res.json({ prep, cached: false });
    }

    const prep = await generateMeetingPrep(linkedInResult.profile);
    try {
      await Meeting.create({ meetingId, attendeeEmail, generatedPrep: prep });
    } catch (e) {
      const cached = await Meeting.findOne({ meetingId, attendeeEmail });
      if (cached) return res.json({ prep: cached.generatedPrep, cached: true });
    }

    res.json({ prep, cached: false });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate prep' });
  }
};

module.exports = { generatePrep };
