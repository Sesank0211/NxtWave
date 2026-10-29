const crypto = require('crypto');
const { issueAdminSession } = require('../middleware/adminAuth');

function safeEqual(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') return false;
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function loginAdmin(req, res) {
  const configuredUsername = process.env.ADMIN_USERNAME;
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!configuredUsername || !configuredPassword || !sessionSecret || sessionSecret.length < 32) {
    return res.status(503).json({ success: false, message: 'Administrator login is not configured on the server.' });
  }

  const { username, password } = req.body || {};
  if (!safeEqual(username, configuredUsername) || !safeEqual(password, configuredPassword)) {
    return res.status(401).json({ success: false, message: 'Username or password is incorrect.' });
  }

  return res.status(200).json({
    success: true,
    token: issueAdminSession(configuredUsername),
    expiresIn: 8 * 60 * 60,
  });
}

module.exports = { loginAdmin };
