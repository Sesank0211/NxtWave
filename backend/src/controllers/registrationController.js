"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegistrationCount = exports.registerStudent = void 0;
const Student_1 = require("../models/Student");
const referralCode_1 = require("../utils/referralCode");
/**
 * Handle student registration for the workshop.
 * POST /api/registrations
 */
const registerStudent = async (req, res, next) => {
    try {
        const { name, fullName, email, collegeName, graduationYear, referredBy } = req.body;
        const resolvedName = (name || fullName || '').toString().trim();
        const normalisedEmail = (email || '').toString().trim().toLowerCase();
        const clientOrigin = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').replace(/\/$/, '');
        // 1. Check whether the email is already registered
        const existingStudent = await Student_1.Student.findOne({ email: normalisedEmail });
        if (existingStudent) {
            res.status(409).json({
                success: false,
                message: 'A student with this email address has already registered for the workshop.',
            });
            return;
        }
        // 2. Validate referral code if provided
        let verifiedReferredBy = null;
        if (referredBy) {
            const codeUpper = referredBy.toString().trim().toUpperCase();
            const referrer = await Student_1.Student.findOne({ referralCode: codeUpper });
            if (!referrer) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid referral code. Please verify the invitation link.',
                });
                return;
            }
            // Check self-referral
            if (referrer.email === normalisedEmail) {
                res.status(400).json({
                    success: false,
                    message: 'Self-referral is not permitted. You cannot refer your own email address.',
                });
                return;
            }
            verifiedReferredBy = referrer.referralCode;
        }
        // 3. Generate a unique referral code for the new student
        const newReferralCode = await (0, referralCode_1.generateUniqueReferralCode)();
        // 4. Save new student record
        const newStudent = await Student_1.Student.create({
            name: resolvedName,
            email: normalisedEmail,
            collegeName: collegeName.toString().trim(),
            graduationYear: graduationYear.toString().trim(),
            referralCode: newReferralCode,
            referredBy: verifiedReferredBy,
        });
        const referralLink = `${clientOrigin}/register?ref=${newStudent.referralCode}`;
        // 5. Return safe success response (no internal __v or sensitive server metadata)
        res.status(201).json({
            success: true,
            message: 'Registration successful! Your workshop seat has been reserved.',
            data: {
                id: newStudent._id,
                name: newStudent.name,
                email: newStudent.email,
                collegeName: newStudent.collegeName,
                graduationYear: newStudent.graduationYear,
                referralCode: newStudent.referralCode,
                referralLink,
                referralCount: 0,
                referredBy: newStudent.referredBy,
                registeredAt: newStudent.registeredAt,
            },
        });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(409).json({
                success: false,
                message: 'A student with this email address has already registered for the workshop.',
            });
            return;
        }
        next(error);
    }
};
exports.registerStudent = registerStudent;
/**
 * Get registration summary count.
 * GET /api/registrations/count
 */
const getRegistrationCount = async (_req, res, next) => {
    try {
        const count = await Student_1.Student.countDocuments();
        res.status(200).json({
            success: true,
            count,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getRegistrationCount = getRegistrationCount;
