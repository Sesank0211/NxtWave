"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegistrationInput = void 0;
/**
 * Request validation middleware for workshop registration.
 */
const validateRegistrationInput = (req, res, next) => {
    const { name, fullName, email, collegeName, graduationYear, referredBy, ref } = req.body;
    const errors = {};
    const resolvedName = (name || fullName || '').toString().trim();
    const resolvedEmail = (email || '').toString().trim();
    const resolvedCollege = (collegeName || '').toString().trim();
    const resolvedYear = (graduationYear || '').toString().trim();
    const rawReferredBy = (referredBy || ref || '').toString().trim().toUpperCase();
    // 1. Name validation
    if (!resolvedName) {
        errors.name = 'Full name is required';
    }
    else if (resolvedName.length < 2) {
        errors.name = 'Name must be at least 2 characters long';
    }
    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!resolvedEmail) {
        errors.email = 'Email address is required';
    }
    else if (!emailRegex.test(resolvedEmail)) {
        errors.email = 'Please provide a valid email format';
    }
    // 3. College name validation
    if (!resolvedCollege) {
        errors.collegeName = 'College name is required';
    }
    else if (resolvedCollege.length < 2) {
        errors.collegeName = 'Please enter a valid college or university name';
    }
    // 4. Graduation year validation
    const validYearRegex = /^(20[2-3][0-9]|Other)$/;
    if (!resolvedYear) {
        errors.graduationYear = 'Graduation year is required';
    }
    else if (!validYearRegex.test(resolvedYear)) {
        errors.graduationYear = 'Please provide a valid graduation year (e.g. 2027 or Other)';
    }
    if (Object.keys(errors).length > 0) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors,
        });
        return;
    }
    // Normalise values in req.body for controller
    req.body.name = resolvedName;
    req.body.fullName = resolvedName;
    req.body.email = resolvedEmail.toLowerCase();
    req.body.collegeName = resolvedCollege;
    req.body.graduationYear = resolvedYear;
    req.body.referredBy = rawReferredBy || null;
    next();
};
exports.validateRegistrationInput = validateRegistrationInput;
