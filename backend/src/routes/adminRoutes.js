"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
router.post('/login', require('../controllers/adminAuthController').loginAdmin);
router.use(require('../middleware/adminAuth').requireAdmin);
// GET /api/admin/metrics - Top-level growth KPIs
router.get('/metrics', adminController_1.getAdminMetrics);
// GET /api/admin/chart-data - Visual analytics (timeline, batch, colleges)
router.get('/chart-data', adminController_1.getChartData);
// GET /api/admin/students - Searchable, filterable student list
router.get('/students', adminController_1.getStudentsList);
// GET /api/admin/export - CSV export of all registrations
router.get('/export', adminController_1.exportStudentsCsv);
exports.default = router;
