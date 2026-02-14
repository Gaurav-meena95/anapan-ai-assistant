const getCalendar = require('../Config/googleCalendar');

const LOOKAHEAD_HOURS = parseInt(process.env.CALENDAR_LOOKAHEAD_HOURS || '24', 10) || 24;

const getUpcomingMeetings = async (userEmail) => {
  try {
    const calendar = getCalendar();
    const now = new Date();
    const timeMax = new Date(now.getTime() + LOOKAHEAD_HOURS * 60 * 60 * 1000);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      showDeleted: false
    });

    const events = response.data?.items || [];
    const userEmailLower = (userEmail || '').trim().toLowerCase();

    const meetings = events.map((event) => {
      const attendees = event.attendees || [];
      const externalAttendees = attendees
        .filter((att) => att.email && att.email.trim().toLowerCase() !== userEmailLower)
        .map((att) => att.email);

      return {
        id: event.id,
        title: event.summary || 'No Title',
        startTime: event.start?.dateTime || event.start?.date || new Date().toISOString(),
        attendees: externalAttendees
      };
    });

    return { meetings };
  } catch (error) {
    const isAuthError = !process.env.GOOGLE_REFRESH_TOKEN ||
      process.env.GOOGLE_REFRESH_TOKEN === 'your-refresh-token' ||
      error.code === 401 ||
      (error.message && (error.message.includes('invalid_grant') || 
       error.message.includes('refresh_token') || 
       error.message.includes('Missing GOOGLE')));
    
    const message = isAuthError
      ? 'Google Calendar not connected. Add credentials in Backend .env.'
      : 'Could not load calendar. Check backend logs.';
    
    return { meetings: [], calendarError: message };
  }
};

module.exports = { getUpcomingMeetings };
