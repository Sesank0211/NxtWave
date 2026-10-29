const crypto = require('crypto');

const SESSION_HOURS = 8;

function createSignature(encodedPayload) {
  return crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(encodedPayload).digest('base64url');
}

function issueAdminSession(username) {
  const payload = Buffer.from(JSON.stringify({
    sub: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_HOURS * 60 * 60,
  })).toString('base64url');
  return `${payload}.${createSignature(payload)}`;
}

function verifyAdminSession(token) {
  if (!process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32 || typeof token !== 'string') return false;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;
  const expected = Buffer.from(createSignature(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof session.sub === 'string' && session.sub === process.env.ADMIN_USERNAME && Number.isInteger(session.exp) && session.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function requireAdmin(req, res, next) {
  const supplied = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) {
    return res.status(503).json({ success: false, message: 'Administrator login is not configured.' });
  }
  if (!verifyAdminSession(supplied)) {
    return res.status(401).json({ success: false, message: 'Administrator login required. Please sign in again.' });
  }
  next();
}

module.exports = { issueAdminSession, requireAdmin, verifyAdminSession };
