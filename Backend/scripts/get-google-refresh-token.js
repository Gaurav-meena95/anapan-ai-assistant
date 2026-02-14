/**
 * One-time script to get GOOGLE_REFRESH_TOKEN.
 * Run: node scripts/get-google-refresh-token.js
 * Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env (or pass as env vars).
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { google } = require('googleapis');
const readline = require('readline');

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost';

if (!clientId || !clientSecret) {
  console.error('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Backend/.env');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
const scopes = ['https://www.googleapis.com/auth/calendar.events.readonly'];
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent'
});

console.log('Open this URL in your browser, sign in with the Google account that has the calendar:\n');
console.log(authUrl);
console.log('\nAfter allowing, Google will redirect to ' + redirectUri + '. Copy the FULL URL from the browser address bar and paste below.\n');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Paste the redirect URL or just the code parameter: ', async (input) => {
  rl.close();
  let code = input.trim();
  if (code.startsWith('http')) {
    const match = code.match(/[?&]code=([^&]+)/);
    code = match ? decodeURIComponent(match[1]) : '';
  }
  if (!code) {
    console.error('No code found.');
    process.exit(1);
  }
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\nAdd this to Backend/.env:\n');
    console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
});
