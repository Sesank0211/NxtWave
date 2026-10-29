"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registrationController_1 = require("../controllers/registrationController");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
// POST /api/registrations - Register a student for the workshop
router.post('/', validateRequest_1.validateRegistrationInput, registrationController_1.registerStudent);
// GET /api/registrations/count - Get total registered students
router.get('/count', registrationController_1.getRegistrationCount);
exports.default = router;
