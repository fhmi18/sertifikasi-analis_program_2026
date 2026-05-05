import { verifyToken } from "../utils/helpers.js";
import { AppError } from "./errorHandler.js";

// Auth middleware
export const authenticate = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.session?.token;

    if (!token) {
      throw new AppError("Token tidak ditemukan", 401);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      throw new AppError("Token tidak valid atau sudah expired", 401);
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(error.status || 401).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

// Role-based authorization middleware
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Tidak terautentikasi",
        timestamp: new Date().toISOString(),
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Anda tidak memiliki akses. Role yang dibutuhkan: ${allowedRoles.join(", ")}`,
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
};

// Check if user is authenticated
export const isAuthenticated = (req, res, next) => {
  if (!req.session?.userId && !req.user) {
    return res.status(401).json({
      success: false,
      message: "Silakan login terlebih dahulu",
      timestamp: new Date().toISOString(),
    });
  }
  next();
};

// Check role
export const checkRole = (...roles) => {
  return (req, res, next) => {
    const userRole = req.session?.userRole || req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki izin untuk mengakses resource ini",
        timestamp: new Date().toISOString(),
      });
    }
    next();
  };
};
