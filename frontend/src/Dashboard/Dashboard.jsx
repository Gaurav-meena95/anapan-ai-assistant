import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Calendar, Clock, X, Loader2, Linkedin } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [calendarError, setCalendarError] = useState('');
  const [selectedPrep, setSelectedPrep] = useState(null);
  const [generatingPrep, setGeneratingPrep] = useState(null);
  const [showUrlModal, setShowUrlModal] = useState(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      } else {
        fetchMeetings();
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchMeetings = async () => {
    setCalendarError('');
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`${API_URL}/api/meetings/upcoming`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || `Failed to fetch meetings (${response.status})`);
      }
      setMeetings(data.meetings ?? []);
      setCalendarError(data.calendarError || '');
    } catch (err) {
      setError(err.message || 'Failed to fetch meetings. Is the backend running on port 3000?');
    } finally {
      setLoading(false);
    }
  };

  const openUrlModal = (meetingId, attendeeEmail) => {
    setShowUrlModal({ meetingId, attendeeEmail });
    setLinkedinUrl('');
  };

  const handleGeneratePrep = async (meetingId, attendeeEmail, providedUrl = null) => {

    if (showUrlModal) {
      setShowUrlModal(null);
    }

    setGeneratingPrep(`${meetingId}-${attendeeEmail}`);
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`${API_URL}/api/prep/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          meetingId,
          attendeeEmail,
          linkedinUrl: providedUrl || undefined
        })
      });

      const data = await response.json().catch(() => ({}));
      console.log('data :',data)
      if (!response.ok) throw new Error(data.error || 'Failed to generate prep');

      setSelectedPrep({
        attendeeEmail,
        prep: data.prep
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setGeneratingPrep(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading meetings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Meeting Prep Assistant</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-gray-600">{auth.currentUser?.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Meetings</h2>
          <p className="text-gray-600 text-sm">Meetings in the next 24 hours (from your Google Calendar)</p>
        </div>

        {calendarError && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm">
            {calendarError}
          </div>
        )}

        {meetings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming meetings</h3>
            <p className="text-gray-600 text-sm">{calendarError ? 'Connect Google Calendar in Backend .env to see meetings here.' : 'No meetings in the next 24 hours.'}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {new Date(meeting.startTime).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Attendees:</p>
                  {meeting.attendees.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No other attendees</p>
                  ) : (
                    meeting.attendees.map((email) => (
                      <div key={email} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-blue-600 text-sm font-medium">
                              {email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-700 truncate">{email}</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleGeneratePrep(meeting.id, email)}
                            disabled={generatingPrep === `${meeting.id}-${email}`}
                            className="flex-1 sm:flex-none bg-blue-600 text-white text-sm py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                          >
                            {generatingPrep === `${meeting.id}-${email}` ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin h-4 w-4" />
                                Generating...
                              </span>
                            ) : (
                              'Generate Prep'
                            )}
                          </button>
                          <button
                            onClick={() => openUrlModal(meeting.id, email)}
                            disabled={generatingPrep === `${meeting.id}-${email}`}
                            className="flex-1 sm:flex-none bg-gray-100 text-gray-700 text-sm py-2 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 transition"
                            title="Provide LinkedIn URL"
                          >
                            <Linkedin className="w-4 h-4 inline" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prep Modal */}
      {selectedPrep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Meeting Preparation</h2>
                <p className="text-xs text-gray-600 mt-1">{selectedPrep.attendeeEmail}</p>
              </div>
              <button
                onClick={() => setSelectedPrep(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6 bg-white">
              <div className="space-y-4 text-gray-800 text-sm leading-relaxed">
                {selectedPrep.prep.split('\n\n').map((section, idx) => {
                  const lines = section.trim().split('\n');
                  const question = lines[0];
                  const answer = lines.slice(1).join(' ').trim();
                  
                  if (!question) return null;
                  
                  return (
                    <div key={idx} className="pb-4 border-b border-gray-100 last:border-0">
                      <h3 className="font-medium text-gray-900 mb-2">{question}</h3>
                      <p className="text-gray-700 leading-relaxed">{answer || 'No information available.'}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setSelectedPrep(null)}
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Provide LinkedIn URL
              </h2>
              <p className="text-sm text-gray-600">{showUrlModal.attendeeEmail}</p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">
                Paste your LinkedIn profile URL to generate prep even if automatic search fails.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowUrlModal(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (linkedinUrl.trim()) {
                    handleGeneratePrep(showUrlModal.meetingId, showUrlModal.attendeeEmail, linkedinUrl.trim());
                  }
                }}
                disabled={!linkedinUrl.trim()}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                Generate Prep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
