// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`❌ Error [${status}]:`, err);

  res.status(status).json({
    success: false,
    message,
    errors: process.env.NODE_ENV === "development" ? err : null,
    timestamp: new Date().toISOString(),
  });
};

// 404 Not Found handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' tidak ditemukan`,
    timestamp: new Date().toISOString(),
  });
};

// Async handler wrapper (untuk menangani error di async functions)
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Custom error class
export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}
