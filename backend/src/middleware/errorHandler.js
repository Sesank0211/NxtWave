"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
/**
 * Global Express error handling middleware.
 * Ensures consistent JSON error responses and appropriate HTTP status codes.
 */
const errorHandler = (err, _req, res, _next) => {
    console.error('[Server Error]:', err);
    // Mongoose duplicate key error (code 11000)
    if (err.code === 11000) {
        res.status(409).json({
            success: false,
            message: 'A student with this email address has already registered for the workshop.',
        });
        return;
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            message: 'Database validation failed',
            errors: err.errors,
        });
        return;
    }
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};
exports.errorHandler = errorHandler;
