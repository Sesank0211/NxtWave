"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const db_1 = require("./config/db");
const registrationRoutes_1 = __importDefault(require("./routes/registrationRoutes"));
const referralRoutes_1 = __importDefault(require("./routes/referralRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
// 1. Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
// 2. Security & Utilities Middleware
app.use((0, helmet_1.default)());
// 3. Configure CORS using environment variable
app.use((0, cors_1.default)({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// 4. JSON request parsing
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 5. Health Check Endpoint
app.get('/api/health', (_req, res) => {
    const dbStatus = (0, db_1.isDbConnected)() ? 'connected' : 'disconnected';
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'ProjectZero Growth Engine API',
        database: dbStatus,
        uptimeSeconds: Math.floor(process.uptime()),
    });
});
// 6. Application Routes
app.use('/api/registrations', registrationRoutes_1.default);
app.use('/api/referrals', referralRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
// Compatibility analytics endpoints, protected because they expose registration data.
const adminAuth = require('./middleware/adminAuth').requireAdmin;
const analyticsController = require('./controllers/analyticsController');
app.get('/api/analytics/overview', adminAuth, analyticsController.overview);
app.get('/api/analytics/daily', adminAuth, analyticsController.daily);
app.get('/api/analytics/sources', adminAuth, analyticsController.sources);
app.get('/api/registrations/recent', adminAuth, analyticsController.recent);
app.get('/api/leaderboard', require('./controllers/referralController').getReferralLeaderboard);
// 7. 404 Not Found Handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found',
    });
});
// 8. Global Error Handler
app.use(errorHandler_1.errorHandler);
// 9. Start Server and Connect Database
const startServer = async () => {
    // Connect to MongoDB
    await (0, db_1.connectDB)();
    app.listen(PORT, () => {
        console.log(`[Server] ProjectZero backend running on port ${PORT}`);
        console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
        console.log(`[Server] Allowed CORS origin: ${CLIENT_ORIGIN}`);
    });
};
// Start the server
startServer();
exports.default = app;
