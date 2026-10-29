const Student = require('../models/Student');

function overview(_req, res, next) {
  try {
    const total = Student.countStudents();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const today = Student.countRegisteredSince(todayStart.toISOString());
    const referred = Student.countReferredStudents();
    const target = 500;
    return res.json({
      success: true,
      totalRegistrations: total,
      registrationsToday: today,
      referralRegistrations: referred,
      target,
      percentComplete: Math.min(100, total / target * 100),
      remaining: Math.max(0, target - total),
    });
  } catch (error) {
    return next(error);
  }
}

function daily(_req, res, next) {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 29);
    since.setHours(0, 0, 0, 0);
    const rows = Student.getDailyCounts(since.toISOString());
    const counts = new Map(rows.map((row) => [row.date, row.count]));
    const days = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(since);
      date.setDate(since.getDate() + index);
      const key = date.toISOString().slice(0, 10);
      return { date: key, count: counts.get(key) || 0 };
    });
    return res.json({ success: true, daily: days });
  } catch (error) {
    return next(error);
  }
}

function sources(_req, res, next) {
  try {
    const referred = Student.countReferredStudents();
    const total = Student.countStudents();
    return res.json({ success: true, sources: [{ source: 'Referral', count: referred }, { source: 'Direct', count: total - referred }] });
  } catch (error) {
    return next(error);
  }
}

function recent(_req, res, next) {
  try {
    const registrations = Student.getRecentStudents(50).map((student) => ({
      ...student,
      source: student.referredBy ? 'Referral' : 'Direct',
    }));
    return res.json({ success: true, registrations });
  } catch (error) {
    return next(error);
  }
}

module.exports = { daily, overview, recent, sources };
