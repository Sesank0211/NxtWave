const { Student } = require('../models/Student');

async function overview(_req, res, next) {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const [total, today, referred] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ registeredAt: { $gte: start } }),
      Student.countDocuments({ referredBy: { $exists: true, $nin: [null, ''] } }),
    ]);
    const target = 500;
    res.json({ success: true, totalRegistrations: total, registrationsToday: today, referralRegistrations: referred, target, percentComplete: Math.min(100, total / target * 100), remaining: Math.max(0, target - total) });
  } catch (error) { next(error); }
}

async function daily(_req, res, next) {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 29);
    since.setHours(0, 0, 0, 0);
    const rows = await Student.aggregate([
      { $match: { registeredAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$registeredAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const counts = new Map(rows.map((row) => [row._id, row.count]));
    const days = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(since);
      date.setDate(since.getDate() + index);
      const key = date.toISOString().slice(0, 10);
      return { date: key, count: counts.get(key) || 0 };
    });
    res.json({ success: true, daily: days });
  } catch (error) { next(error); }
}

async function sources(_req, res, next) {
  try {
    const [referred, total] = await Promise.all([
      Student.countDocuments({ referredBy: { $exists: true, $nin: [null, ''] } }),
      Student.countDocuments(),
    ]);
    res.json({ success: true, sources: [{ source: 'Referral', count: referred }, { source: 'Direct', count: total - referred }] });
  } catch (error) { next(error); }
}

async function recent(_req, res, next) {
  try {
    const registrations = await Student.find().sort({ registeredAt: -1 }).limit(50).select('name collegeName graduationYear referredBy registeredAt -_id').lean();
    res.json({ success: true, registrations: registrations.map((item) => ({ ...item, source: item.referredBy ? 'Referral' : 'Direct' })) });
  } catch (error) { next(error); }
}

module.exports = { overview, daily, sources, recent };
