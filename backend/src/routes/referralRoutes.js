"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const referralController_1 = require("../controllers/referralController");
const router = (0, express_1.Router)();
// GET /api/referrals/validate/:code - Validate referral code
router.get('/validate/:code', referralController_1.validateReferralCode);
// GET /api/referrals/stats/:code - Fetch real-time referral stats
router.get('/stats/:code', referralController_1.getReferralStats);
// GET /api/referrals/leaderboard - Top referrers leaderboard
router.get('/leaderboard', referralController_1.getReferralLeaderboard);
exports.default = router;
