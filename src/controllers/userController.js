import { UserService } from "../services/userService.js";
import {
  sendResponse,
  sendErrorResponse,
  getPaginationParams,
} from "../utils/helpers.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const { skip, take } = getPaginationParams(page, limit);

  const { users, total } = await UserService.getAllUsers(skip, take);

  sendResponse(res, 200, "User berhasil diambil", {
    users,
    pagination: {
      total,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      pages: Math.ceil(total / (parseInt(limit) || 10)),
    },
  });
});

// Get user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await UserService.getUserById(id);
  if (!user) {
    return sendErrorResponse(res, 404, "User tidak ditemukan");
  }

  const { password, ...userWithoutPassword } = user;

  sendResponse(res, 200, "User ditemukan", userWithoutPassword);
});

// Create user
export const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullName, role } = req.body;

  if (!username || !email || !password || !fullName) {
    return sendErrorResponse(res, 400, "Semua field harus diisi");
  }

  const existingUser = await UserService.getUserByUsername(username);
  if (existingUser) {
    return sendErrorResponse(res, 409, "Username sudah digunakan");
  }

  const user = await UserService.createUser({
    username,
    email,
    password,
    fullName,
    role: role || "STAFF",
  });

  const { password: _, ...userWithoutPassword } = user;

  sendResponse(res, 201, "User berhasil ditambahkan", userWithoutPassword);
});

// Update user
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await UserService.getUserById(id);
  if (!user) {
    return sendErrorResponse(res, 404, "User tidak ditemukan");
  }

  const updated = await UserService.updateUser(id, req.body);

  const { password: _, ...userWithoutPassword } = updated;

  sendResponse(res, 200, "User berhasil diperbarui", userWithoutPassword);
});

// Delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await UserService.getUserById(id);
  if (!user) {
    return sendErrorResponse(res, 404, "User tidak ditemukan");
  }

  await UserService.deleteUser(id);

  sendResponse(res, 200, "User berhasil dihapus");
});

// Search users
export const searchUsers = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;

  if (!q) {
    return sendErrorResponse(res, 400, "Query pencarian harus diisi");
  }

  const { skip, take } = getPaginationParams(page, limit);

  const users = await UserService.searchUsers(q, skip, take);

  sendResponse(res, 200, "Pencarian user berhasil", {
    query: q,
    users,
    count: users.length,
  });
});

// Get user statistics
export const getUserStatistics = asyncHandler(async (req, res) => {
  const stats = await UserService.getUserStatistics();

  sendResponse(res, 200, "Statistik user berhasil diambil", stats);
});
