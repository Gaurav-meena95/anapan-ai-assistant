const { getUpcomingMeetings } = require('../services/calendarService');

const getUpcoming = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const meetings = await getUpcomingMeetings(userEmail);
    
    res.json({ meetings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
};

module.exports = { getUpcoming };
