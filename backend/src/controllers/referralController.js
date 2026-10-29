"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReferralLeaderboard = exports.getReferralStats = exports.validateReferralCode = void 0;
const Student_1 = require("../models/Student");
/**
 * Validate a referral code.
 * GET /api/referrals/validate/:code
 */
const validateReferralCode = async (req, res, next) => {
    try {
        const rawCode = Array.isArray(req.params.code) ? req.params.code[0] : req.params.code;
        const code = (rawCode || '').toString().trim().toUpperCase();
        if (!code) {
            res.status(400).json({
                success: false,
                valid: false,
                message: 'Referral code is required',
            });
            return;
        }
        const referrer = await Student_1.Student.findOne({ referralCode: code }).select('name referralCode');
        if (!referrer) {
            res.status(404).json({
                success: false,
                valid: false,
                message: 'Invalid referral code',
            });
            return;
        }
        res.status(200).json({
            success: true,
            valid: true,
            referralCode: referrer.referralCode,
            referrerName: referrer.name,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.validateReferralCode = validateReferralCode;
/**
 * Fetch real-time referral statistics for a student.
 * GET /api/referrals/stats/:code
 */
const getReferralStats = async (req, res, next) => {
    try {
        const rawCode = Array.isArray(req.params.code) ? req.params.code[0] : req.params.code;
        const code = (rawCode || '').toString().trim().toUpperCase();
        if (!code) {
            res.status(400).json({
                success: false,
                message: 'Referral code is required',
            });
            return;
        }
        const student = await Student_1.Student.findOne({ referralCode: code }).select('name referralCode registeredAt');
        if (!student) {
            res.status(404).json({
                success: false,
                message: 'Referral code not found',
            });
            return;
        }
        // Attribute referrals only after a new registration is successfully saved in MongoDB
        const referralCount = await Student_1.Student.countDocuments({ referredBy: code });
        res.status(200).json({
            success: true,
            referralCode: student.referralCode,
            studentName: student.name,
            referralCount,
            registeredAt: student.registeredAt,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getReferralStats = getReferralStats;
/**
 * Get public referral leaderboard.
 * GET /api/referrals/leaderboard
 * Never exposes emails or sensitive information.
 */
const getReferralLeaderboard = async (_req, res, next) => {
    try {
        const leaderboard = await Student_1.Student.aggregate([
            {
                $match: {
                    referredBy: { $exists: true, $nin: [null, ''] },
                },
            },
            {
                $group: {
                    _id: '$referredBy',
                    referralCount: { $sum: 1 },
                },
            },
            {
                $sort: { referralCount: -1 },
            },
            {
                $limit: 10,
            },
            {
                $lookup: {
                    from: 'students',
                    localField: '_id',
                    foreignField: 'referralCode',
                    as: 'referrer',
                },
            },
            {
                $unwind: '$referrer',
            },
            {
                $project: {
                    _id: 0,
                    referralCode: '$_id',
                    name: '$referrer.name',
                    collegeName: '$referrer.collegeName',
                    graduationYear: '$referrer.graduationYear',
                    referralCount: 1,
                },
            },
        ]);
        const privacySafeLeaderboard = leaderboard.map((entry) => {
            const parts = String(entry.name || 'Student').trim().split(/\s+/);
            return { ...entry, name: parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : `${parts[0].slice(0, 1)}***` };
        });
        res.status(200).json({
            success: true,
            leaderboard: privacySafeLeaderboard,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getReferralLeaderboard = getReferralLeaderboard;
