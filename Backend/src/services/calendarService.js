const calendar = require('../config/googleCalendar');

const getUpcomingMeetings = async (userEmail) => {
  try {
    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60000);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: tenMinutesLater.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });

    const events = response.data.items || [];
    
    const meetings = events.map(event => {
      const attendees = event.attendees || [];
      const externalAttendees = attendees
        .filter(att => att.email !== userEmail)
        .map(att => att.email);

      return {
        id: event.id,
        title: event.summary || 'No Title',
        startTime: event.start.dateTime || event.start.date,
        attendees: externalAttendees
      };
    }).filter(meeting => meeting.attendees.length > 0);

    return meetings;
  } catch (error) {
    console.error('Calendar API error:', error);
    return [];
  }
};

module.exports = { getUpcomingMeetings };
