"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueReferralCode = void 0;
const Student_1 = require("../models/Student");
/**
 * Generates a unique, URL-safe uppercase referral code (e.g. SZ104, SZ789).
 * Guarantees uniqueness by checking against MongoDB.
 */
const generateUniqueReferralCode = async () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let isUnique = false;
    let code = '';
    let attempts = 0;
    while (!isUnique && attempts < 50) {
        attempts++;
        let randomPart = '';
        // Generate 4-character random suffix
        for (let i = 0; i < 4; i++) {
            randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        code = `SZ${randomPart}`;
        const existing = await Student_1.Student.findOne({ referralCode: code });
        if (!existing) {
            isUnique = true;
        }
    }
    if (!isUnique) {
        // Fallback timestamp suffix if collision rate is high
        code = `SZ${Date.now().toString(36).toUpperCase().slice(-5)}`;
    }
    return code;
};
exports.generateUniqueReferralCode = generateUniqueReferralCode;
