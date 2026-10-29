"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDbConnected = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Connect to MongoDB database using Mongoose.
 * Reads connection URI from environment variables without hardcoded credentials.
 */
const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('[Database Error] MONGODB_URI environment variable is not defined.');
        return;
    }
    try {
        const conn = await mongoose_1.default.connect(uri);
        console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
        // Backfill any existing students missing a referralCode
        try {
            const StudentModel = mongoose_1.default.models.Student || mongoose_1.default.model('Student');
            const unassigned = await StudentModel.find({
                $or: [{ referralCode: { $exists: false } }, { referralCode: null }, { referralCode: '' }]
            });
            for (const s of unassigned) {
                s.referralCode = `SZ${Math.floor(1000 + Math.random() * 9000)}`;
                await s.save();
            }
        }
        catch {
            // Model might not yet be registered or empty, safe to proceed
        }
    }
    catch (error) {
        console.error('[Database Error] Failed to connect to MongoDB:', error);
        // Log error cleanly without exiting the process to allow server health checks to report status
    }
};
exports.connectDB = connectDB;
/**
 * Helper to check whether database is currently connected (readyState === 1).
 */
const isDbConnected = () => {
    return mongoose_1.default.connection.readyState === 1;
};
exports.isDbConnected = isDbConnected;
// Monitor ongoing connection events
mongoose_1.default.connection.on('disconnected', () => {
    console.warn('[Database] MongoDB connection disconnected.');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('[Database Error] MongoDB connection error:', err);
});
