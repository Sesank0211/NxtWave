const Student = require('../models/Student');

function getAdminMetrics(_req, res, next) {
  try {
    const totalStudents = Student.countStudents();
    const referredStudents = Student.countReferredStudents();
    const targetBatchStudents = Student.countGraduationYear('2027');
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const registrationsToday = Student.countRegisteredSince(todayStart.toISOString());
    const uniqueCollegesCount = Student.countUniqueColleges();
    const viralRate = totalStudents ? Number(((referredStudents / totalStudents) * 100).toFixed(1)) : 0;
    const targetBatchRate = totalStudents ? Number(((targetBatchStudents / totalStudents) * 100).toFixed(1)) : 0;

    return res.status(200).json({
      success: true,
      metrics: {
        totalStudents,
        referredStudents,
        directStudents: totalStudents - referredStudents,
        targetBatchStudents,
        targetBatchRate,
        viralRate,
        uniqueCollegesCount,
        registrationsToday,
        target: 500,
        targetProgress: Math.min(100, totalStudents / 500 * 100),
        registrationsRemaining: Math.max(0, 500 - totalStudents),
      },
    });
  } catch (error) {
    return next(error);
  }
}

function getChartData(_req, res, next) {
  try {
    const timelineStart = new Date();
    timelineStart.setDate(timelineStart.getDate() - 13);
    timelineStart.setHours(0, 0, 0, 0);
    const batchDistribution = Student.countByGraduationYear();
    const topColleges = Student.countByCollege(5);
    const timeline = Student.getDailyTimeline(timelineStart.toISOString());
    const referredSourceCount = Student.countReferredStudents();
    const totalSourceCount = Student.countStudents();

    return res.status(200).json({
      success: true,
      batchDistribution,
      topColleges,
      timeline,
      sourceDistribution: [
        { source: 'Referral', count: referredSourceCount },
        { source: 'Direct', count: totalSourceCount - referredSourceCount },
      ],
    });
  } catch (error) {
    return next(error);
  }
}

function getStudentsList(req, res, next) {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 100) : '';
    const batch = typeof req.query.batch === 'string' ? req.query.batch.trim().slice(0, 20) : '';
    const referred = typeof req.query.referred === 'string' ? req.query.referred.trim() : '';
    const pageValue = Number.parseInt(req.query.page, 10);
    const limitValue = Number.parseInt(req.query.limit, 10);
    const page = Number.isFinite(pageValue) ? Math.max(1, pageValue) : 1;
    const limit = Number.isFinite(limitValue) ? Math.min(100, Math.max(1, limitValue)) : 10;
    const { total, students } = Student.listStudents({ search, batch, referred, page, limit });

    return res.status(200).json({
      success: true,
      students,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    });
  } catch (error) {
    return next(error);
  }
}

function exportStudentsCsv(_req, res, next) {
  try {
    const students = Student.getAllStudents();
    const headers = ['Registration ID', 'Full Name', 'Email', 'College', 'Graduation Year', 'Referral Code', 'Referred By', 'Registered At'];
    const escapeCsv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const rows = students.map((student) => [
      student.id,
      student.name,
      student.email,
      student.collegeName,
      student.graduationYear,
      student.referralCode,
      student.referredBy || 'Direct',
      student.registeredAt,
    ].map(escapeCsv).join(','));

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="projectzero-registrations.csv"');
    return res.status(200).send([headers.join(','), ...rows].join('\n'));
  } catch (error) {
    return next(error);
  }
}

module.exports = { exportStudentsCsv, getAdminMetrics, getChartData, getStudentsList };
