import jwt from "jsonwebtoken";

// Generate JWT token
export const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || "secret-key", {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "secret-key");
  } catch (error) {
    return null;
  }
};

// Hash password
export const hashPassword = async (password) => {
  const bcrypt = (await import("bcryptjs")).default;
  return bcrypt.hash(password, 10);
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
  const bcrypt = (await import("bcryptjs")).default;
  return bcrypt.compare(password, hashedPassword);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format date with time
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// Pagination helper
export const getPaginationParams = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  return { skip, take: limitNum, page: pageNum };
};

// Response formatter
export const sendResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

// Error response formatter
export const sendErrorResponse = (res, statusCode, message, errors = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  });
};

// Console timer for performance monitoring
export const startTimer = (label) => {
  console.time(`⏱️  ${label}`);
  return () => console.timeEnd(`⏱️  ${label}`);
};

// Validation helper
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize string
export const sanitizeString = (str) => {
  return str.trim().replace(/[<>]/g, "");
};
