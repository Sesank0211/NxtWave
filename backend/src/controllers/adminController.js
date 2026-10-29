"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportStudentsCsv = exports.getStudentsList = exports.getChartData = exports.getAdminMetrics = void 0;
const Student_1 = require("../models/Student");
/**
 * Fetch top-level growth metrics for the admin dashboard.
 * GET /api/admin/metrics
 */
const getAdminMetrics = async (_req, res, next) => {
    try {
        const totalStudents = await Student_1.Student.countDocuments();
        const referredStudents = await Student_1.Student.countDocuments({
            referredBy: { $exists: true, $nin: [null, ''] },
        });
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const registrationsToday = await Student_1.Student.countDocuments({ registeredAt: { $gte: todayStart } });
        const targetBatchStudents = await Student_1.Student.countDocuments({
            graduationYear: '2027',
        });
        // Unique colleges count
        const uniqueColleges = await Student_1.Student.distinct('collegeName');
        const viralRate = totalStudents > 0
            ? Number(((referredStudents / totalStudents) * 100).toFixed(1))
            : 0;
        const targetBatchRate = totalStudents > 0
            ? Number(((targetBatchStudents / totalStudents) * 100).toFixed(1))
            : 0;
        res.status(200).json({
            success: true,
            metrics: {
                totalStudents,
                referredStudents,
                directStudents: totalStudents - referredStudents,
                targetBatchStudents,
                targetBatchRate,
                viralRate,
                uniqueCollegesCount: uniqueColleges.length,
                registrationsToday,
                target: 500,
                targetProgress: Math.min(100, totalStudents / 500 * 100),
                registrationsRemaining: Math.max(0, 500 - totalStudents),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminMetrics = getAdminMetrics;
/**
 * Fetch chart analytics for registration trends and demographic distribution.
 * GET /api/admin/chart-data
 */
const getChartData = async (_req, res, next) => {
    try {
        // 1. Batch distribution breakdown
        const batchDistribution = await Student_1.Student.aggregate([
            {
                $group: {
                    _id: '$graduationYear',
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);
        // 2. Top Colleges breakdown
        const topColleges = await Student_1.Student.aggregate([
            {
                $group: {
                    _id: '$collegeName',
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 },
            },
            {
                $limit: 5,
            },
        ]);
        // 3. Registrations timeline for the last 14 days
        const timelineStart = new Date();
        timelineStart.setDate(timelineStart.getDate() - 13);
        timelineStart.setHours(0, 0, 0, 0);
        const timeline = await Student_1.Student.aggregate([
            { $match: { registeredAt: { $gte: timelineStart } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$registeredAt' },
                    },
                    count: { $sum: 1 },
                    viralCount: {
                        $sum: {
                            $cond: [
                                { $and: [{ $ne: ['$referredBy', null] }, { $ne: ['$referredBy', ''] }] },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);
        const [referredSourceCount, totalSourceCount] = await Promise.all([
            Student_1.Student.countDocuments({ referredBy: { $exists: true, $nin: [null, ''] } }),
            Student_1.Student.countDocuments(),
        ]);
        res.status(200).json({
            success: true,
            batchDistribution: batchDistribution.map((item) => ({
                batch: item._id || 'Unknown',
                count: item.count,
            })),
            topColleges: topColleges.map((item) => ({
                college: item._id || 'Unknown',
                count: item.count,
            })),
            timeline: timeline.map((item) => ({
                date: item._id,
                total: item.count,
                viral: item.viralCount,
            })),
            sourceDistribution: [
                { source: 'Referral', count: referredSourceCount },
                { source: 'Direct', count: totalSourceCount - referredSourceCount },
            ],
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getChartData = getChartData;
/**
 * Fetch searchable, filterable, paginated student list.
 * GET /api/admin/students
 */
const getStudentsList = async (req, res, next) => {
    try {
        const search = (req.query.search || '').toString().trim();
        const batch = (req.query.batch || '').toString().trim();
        const referredFilter = (req.query.referred || '').toString().trim();
        const page = Math.max(1, parseInt((req.query.page || '1').toString(), 10));
        const limit = Math.min(100, Math.max(1, parseInt((req.query.limit || '10').toString(), 10)));
        const skip = (page - 1) * limit;
        const filter = {};
        // Search by name, email, college, or referralCode
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { collegeName: { $regex: search, $options: 'i' } },
                { referralCode: { $regex: search, $options: 'i' } },
                { referredBy: { $regex: search, $options: 'i' } },
            ];
        }
        // Filter by batch
        if (batch && batch !== 'all') {
            filter.graduationYear = batch;
        }
        // Filter by referral status
        if (referredFilter === 'referred') {
            filter.referredBy = { $exists: true, $nin: [null, ''] };
        }
        else if (referredFilter === 'direct') {
            filter.$or = [{ referredBy: null }, { referredBy: '' }, { referredBy: { $exists: false } }];
        }
        const total = await Student_1.Student.countDocuments(filter);
        const students = await Student_1.Student.find(filter)
            .sort({ registeredAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');
        // Also enrich each student with their successful referral count
        const enriched = await Promise.all(students.map(async (student) => {
            const referralCount = await Student_1.Student.countDocuments({
                referredBy: student.referralCode,
            });
            return {
                id: student._id,
                name: student.name,
                email: student.email,
                collegeName: student.collegeName,
                graduationYear: student.graduationYear,
                referralCode: student.referralCode,
                referredBy: student.referredBy || null,
                referralCount,
                registeredAt: student.registeredAt,
            };
        }));
        res.status(200).json({
            success: true,
            students: enriched,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStudentsList = getStudentsList;
/**
 * Export all registered students as CSV.
 * GET /api/admin/export
 */
const exportStudentsCsv = async (_req, res, next) => {
    try {
        const students = await Student_1.Student.find().sort({ registeredAt: -1 });
        const headers = [
            'Registration ID',
            'Full Name',
            'Email',
            'College',
            'Graduation Year',
            'Referral Code',
            'Referred By',
            'Registered At',
        ];
        const escapeCsv = (str) => {
            if (str === null || str === undefined)
                return '""';
            const text = String(str).replace(/"/g, '""');
            return `"${text}"`;
        };
        const rows = students.map((s) => [
            escapeCsv(s._id),
            escapeCsv(s.name),
            escapeCsv(s.email),
            escapeCsv(s.collegeName),
            escapeCsv(s.graduationYear),
            escapeCsv(s.referralCode),
            escapeCsv(s.referredBy || 'Direct'),
            escapeCsv(new Date(s.registeredAt).toISOString()),
        ]);
        const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="projectzero-registrations.csv"');
        res.status(200).send(csvContent);
    }
    catch (error) {
        next(error);
    }
};
exports.exportStudentsCsv = exportStudentsCsv;
