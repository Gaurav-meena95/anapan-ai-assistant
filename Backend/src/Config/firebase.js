const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let firebaseReady = false;

function fixPrivateKey(key) {
  if (!key || typeof key !== 'string') return null;
  let k = key.trim().replace(/\\n/g, '\n');
  
  const begin = '-----BEGIN PRIVATE KEY-----';
  const end = '-----END PRIVATE KEY-----';
  
  if (!k.includes(begin) || !k.includes(end)) return k;
  
  const mid = k.split(begin)[1].split(end)[0].replace(/\s/g, '');
  if (mid.length === 0) return k;
  
  const lines = [];
  for (let i = 0; i < mid.length; i += 64) {
    lines.push(mid.slice(i, i + 64));
  }
  
  return `${begin}\n${lines.join('\n')}\n${end}\n`;
}

function loadCredentials() {
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  
  if (filePath) {
    const candidates = [
      path.isAbsolute(filePath) ? filePath : null,
      path.resolve(__dirname, '..', '..', filePath),
      path.resolve(process.cwd(), filePath),
      path.resolve(process.cwd(), 'Backend', filePath)
    ].filter(Boolean);
    
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        if (data.private_key) data.private_key = fixPrivateKey(data.private_key);
        return data;
      }
    }
  }
  
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  
  if (projectId && clientEmail && rawKey) {
    return {
      type: 'service_account',
      project_id: projectId,
      private_key: fixPrivateKey(rawKey),
      client_email: clientEmail
    };
  }
  
  return null;
}

try {
  const cred = loadCredentials();
  
  if (cred && cred.private_key && cred.client_email) {
    admin.initializeApp({ credential: admin.credential.cert(cred) });
    firebaseReady = true;
  }
} catch (err) {
  console.error('Firebase init:', err.message);
}

function getAuth() {
  if (!firebaseReady) throw new Error('Firebase not configured');
  return admin.auth();
}

module.exports = admin;
module.exports.firebaseReady = firebaseReady;
module.exports.getAuth = getAuth;
