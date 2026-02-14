const { getUpcomingMeetings } = require('../services/calendarService');

const getUpcoming = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const result = await getUpcomingMeetings(userEmail);
    res.status(200).json({ meetings: result.meetings, calendarError: result.calendarError });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
};

module.exports = { getUpcoming };
