import { UserService } from "../services/userService.js";
import {
  generateToken,
  validateEmail,
  sendResponse,
  sendErrorResponse,
} from "../utils/helpers.js";
import { asyncHandler, AppError } from "../middlewares/errorHandler.js";

// Register
export const register = asyncHandler(async (req, res) => {
  const { username, email, password, fullName, role } = req.body;

  // Validation
  if (!username || !email || !password || !fullName) {
    return sendErrorResponse(res, 400, "Semua field harus diisi");
  }

  if (!validateEmail(email)) {
    return sendErrorResponse(res, 400, "Email tidak valid");
  }

  if (password.length < 6) {
    return sendErrorResponse(res, 400, "Password minimal 6 karakter");
  }

  // Check existing user
  const existingUser = await UserService.getUserByUsername(username);
  if (existingUser) {
    return sendErrorResponse(res, 409, "Username sudah digunakan");
  }

  // Create user
  const user = await UserService.createUser({
    username,
    email,
    password,
    fullName,
    role: role || "STAFF",
  });

  sendResponse(res, 201, "Registrasi berhasil", {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
  });
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return sendErrorResponse(res, 400, "Username dan password harus diisi");
  }

  const user = await UserService.verifyLogin(username, password);
  if (!user) {
    return sendErrorResponse(res, 401, "Username atau password salah");
  }

  const token = generateToken(user.id, user.role);

  // Set session
  req.session.userId = user.id;
  req.session.username = user.username;
  req.session.userRole = user.role;
  req.session.token = token;

  sendResponse(res, 200, "Login berhasil", {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  });
});

// Logout
export const logout = asyncHandler(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return sendErrorResponse(res, 500, "Gagal logout");
    }
    sendResponse(res, 200, "Logout berhasil");
  });
});

// Get current user
export const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.session?.userId || req.user?.userId;

  if (!userId) {
    return sendErrorResponse(res, 401, "User tidak terautentikasi");
  }

  const user = await UserService.getUserById(userId);
  if (!user) {
    return sendErrorResponse(res, 404, "User tidak ditemukan");
  }

  sendResponse(res, 200, "User ditemukan", {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  });
});

// Refresh token
export const refreshToken = asyncHandler(async (req, res) => {
  const userId = req.session?.userId || req.user?.userId;

  if (!userId) {
    return sendErrorResponse(res, 401, "User tidak terautentikasi");
  }

  const user = await UserService.getUserById(userId);
  if (!user) {
    return sendErrorResponse(res, 404, "User tidak ditemukan");
  }

  const newToken = generateToken(user.id, user.role);
  req.session.token = newToken;

  sendResponse(res, 200, "Token diperbarui", { token: newToken });
});
