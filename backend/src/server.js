require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { closeDB, connectDB, isDbConnected } = require('./config/db');
const registrationRoutes = require('./routes/registrationRoutes').default;
const referralRoutes = require('./routes/referralRoutes').default;
const adminRoutes = require('./routes/adminRoutes').default;
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(helmet());
app.use(cors({
  origin: CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ProjectZero Growth Engine API',
    database: isDbConnected() ? 'connected' : 'disconnected',
    databaseEngine: 'SQLite',
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

app.use('/api/registrations', registrationRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/admin', adminRoutes);

const requireAdmin = require('./middleware/adminAuth').requireAdmin;
const analyticsController = require('./controllers/analyticsController');
app.get('/api/analytics/overview', requireAdmin, analyticsController.overview);
app.get('/api/analytics/daily', requireAdmin, analyticsController.daily);
app.get('/api/analytics/sources', requireAdmin, analyticsController.sources);
app.get('/api/registrations/recent', requireAdmin, analyticsController.recent);
app.get('/api/leaderboard', require('./controllers/referralController').getReferralLeaderboard);

app.use((_req, res) => res.status(404).json({ success: false, message: 'Resource not found' }));
app.use(errorHandler);

async function startServer() {
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`[Server] ProjectZero backend running on port ${PORT}`);
    console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
    console.log(`[Server] Allowed CORS origin: ${CLIENT_ORIGIN}`);
  });

  const shutdown = () => server.close(() => {
    closeDB();
    process.exit(0);
  });
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

startServer().catch((error) => {
  console.error('[Server] Startup failed:', error);
  process.exitCode = 1;
});

module.exports = app;
