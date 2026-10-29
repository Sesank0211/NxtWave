const Student = require('../models/Student');
const { generateUniqueReferralCode } = require('../utils/referralCode');

async function registerStudent(req, res, next) {
  try {
    const { name, fullName, email, collegeName, graduationYear, referredBy } = req.body;
    const resolvedName = (name || fullName || '').toString().trim();
    const normalisedEmail = (email || '').toString().trim().toLowerCase();
    const clientOrigin = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').replace(/\/$/, '');

    if (Student.findStudentByEmail(normalisedEmail)) {
      return res.status(409).json({ success: false, message: 'A student with this email address has already registered for the workshop.' });
    }

    let verifiedReferredBy = null;
    if (referredBy) {
      const code = referredBy.toString().trim().toUpperCase();
      const referrer = Student.findStudentByReferralCode(code);
      if (!referrer) {
        return res.status(400).json({ success: false, message: 'Invalid referral code. Please verify the invitation link.' });
      }
      if (referrer.email.toLowerCase() === normalisedEmail) {
        return res.status(400).json({ success: false, message: 'Self-referral is not permitted. You cannot refer your own email address.' });
      }
      verifiedReferredBy = referrer.referralCode;
    }

    const student = Student.createStudent({
      name: resolvedName,
      email: normalisedEmail,
      collegeName: collegeName.toString().trim(),
      graduationYear: graduationYear.toString().trim(),
      referralCode: generateUniqueReferralCode(),
      referredBy: verifiedReferredBy,
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Your workshop seat has been reserved.',
      data: {
        id: student.id,
        name: student.name,
        email: student.email,
        collegeName: student.collegeName,
        graduationYear: student.graduationYear,
        referralCode: student.referralCode,
        referralLink: `${clientOrigin}/register?ref=${student.referralCode}`,
        referralCount: 0,
        referredBy: student.referredBy,
        registeredAt: student.registeredAt,
      },
    });
  } catch (error) {
    if (error.code === 'ERR_SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ success: false, message: 'A student with this email address has already registered for the workshop.' });
    }
    return next(error);
  }
}

function getRegistrationCount(_req, res, next) {
  try {
    return res.status(200).json({ success: true, count: Student.countStudents() });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getRegistrationCount, registerStudent };
