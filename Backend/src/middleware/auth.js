const { getAuth, firebaseReady } = require('../Config/firebase');
const User = require('../models/User');

function shouldSkipAuth() {
  const v = (process.env.DEV_SKIP_AUTH || '').trim().toLowerCase();
  if (v === '1' || v === 'true' || v === 'yes') return true;
  if (process.env.NODE_ENV !== 'production' && !firebaseReady) return true;
  return false;
}

function decodeJwtPayload(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], 'base64').toString('utf8');
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

const verifyToken = async (req, res, next) => {
  const devMode = shouldSkipAuth();
  
  if (devMode) {
    const token = req.headers.authorization?.split('Bearer ')[1];
    const payload = decodeJwtPayload(token);
    const email = (payload && payload.email) || 'dev@local.dev';
    req.user = { email };
    
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email });
    return next();
  }
  
  if (!firebaseReady) {
    return res.status(503).json({ 
      error: 'Auth not configured. Add firebase credentials in Backend .env.' 
    });
  }
  
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;

    let user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      user = await User.create({ email: decodedToken.email });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = verifyToken;
