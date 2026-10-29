const { randomInt, randomUUID } = require('crypto');
const Student = require('../models/Student');

function generateUniqueReferralCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  for (let attempt = 0; attempt < 50; attempt += 1) {
    let suffix = '';
    for (let index = 0; index < 4; index += 1) suffix += chars[randomInt(chars.length)];
    const code = `SZ${suffix}`;
    if (!Student.findStudentByReferralCode(code)) return code;
  }
  return `SZ${randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`;
}

module.exports = { generateUniqueReferralCode };
