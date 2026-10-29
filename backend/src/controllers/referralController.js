const Student = require('../models/Student');

function validateReferralCode(req, res, next) {
  try {
    const code = (req.params.code || '').trim().toUpperCase();
    if (!code) return res.status(400).json({ success: false, valid: false, message: 'Referral code is required' });
    const referrer = Student.findStudentByReferralCode(code);
    if (!referrer) return res.status(404).json({ success: false, valid: false, message: 'Invalid referral code' });
    return res.status(200).json({ success: true, valid: true, referralCode: referrer.referralCode, referrerName: referrer.name });
  } catch (error) {
    return next(error);
  }
}

function getReferralStats(req, res, next) {
  try {
    const code = (req.params.code || '').trim().toUpperCase();
    if (!code) return res.status(400).json({ success: false, message: 'Referral code is required' });
    const student = Student.findStudentByReferralCode(code);
    if (!student) return res.status(404).json({ success: false, message: 'Referral code not found' });
    return res.status(200).json({
      success: true,
      referralCode: student.referralCode,
      studentName: student.name,
      referralCount: Student.countReferralsFor(code),
      registeredAt: student.registeredAt,
    });
  } catch (error) {
    return next(error);
  }
}

function getReferralLeaderboard(_req, res, next) {
  try {
    const leaderboard = Student.getPublicLeaderboard(10).map((entry) => {
      const parts = String(entry.name || 'Student').trim().split(/\s+/);
      const name = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : `${parts[0].slice(0, 1)}***`;
      return { ...entry, name };
    });
    return res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getReferralLeaderboard, getReferralStats, validateReferralCode };
