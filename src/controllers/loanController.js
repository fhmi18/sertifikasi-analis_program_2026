import { LoanService } from "../services/loanService.js";
import {
  sendResponse,
  sendErrorResponse,
  getPaginationParams,
} from "../utils/helpers.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

// Get all loans
export const getAllLoans = asyncHandler(async (req, res) => {
  const { page, limit, status, userId, itemId } = req.query;
  const { skip, take } = getPaginationParams(page, limit);

  const filters = {};
  if (status) filters.status = status;
  if (userId) filters.userId = userId;
  if (itemId) filters.itemId = itemId;

  const { loans, total } = await LoanService.getAllLoans(skip, take, filters);

  sendResponse(res, 200, "Peminjaman berhasil diambil", {
    loans,
    pagination: {
      total,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      pages: Math.ceil(total / (parseInt(limit) || 10)),
    },
  });
});

// Get loan by ID
export const getLoanById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const loan = await LoanService.getLoanById(id);
  if (!loan) {
    return sendErrorResponse(res, 404, "Peminjaman tidak ditemukan");
  }

  sendResponse(res, 200, "Peminjaman ditemukan", loan);
});

// Create loan request
export const createLoan = asyncHandler(async (req, res) => {
  const { itemId, dueDate, quantity, notes } = req.body;
  const userId = req.session?.userId || req.user?.userId;

  if (!userId) {
    return sendErrorResponse(res, 401, "User tidak terautentikasi");
  }

  if (!itemId || !dueDate) {
    return sendErrorResponse(res, 400, "Field wajib: itemId, dueDate");
  }

  const loan = await LoanService.createLoan({
    userId,
    itemId,
    dueDate,
    quantity: quantity || 1,
    notes,
  });

  sendResponse(res, 201, "Permintaan peminjaman berhasil dibuat", loan);
});

// Approve loan
export const approveLoan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const approvedBy = req.session?.userId || req.user?.userId;

  if (!approvedBy) {
    return sendErrorResponse(res, 401, "User tidak terautentikasi");
  }

  const loan = await LoanService.approveLoan(id, approvedBy);

  sendResponse(res, 200, "Peminjaman berhasil disetujui", loan);
});

// Reject loan
export const rejectLoan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;

  if (!rejectionReason) {
    return sendErrorResponse(res, 400, "Alasan penolakan harus diisi");
  }

  const loan = await LoanService.rejectLoan(id, rejectionReason);

  sendResponse(res, 200, "Peminjaman berhasil ditolak", loan);
});

// Return item
export const returnItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { condition } = req.body;

  const loan = await LoanService.returnItem(id, condition || "BAIK");

  sendResponse(res, 200, "Barang berhasil dikembalikan", loan);
});

// Get user's loans
export const getUserLoans = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const userId = req.params.userId || req.session?.userId || req.user?.userId;

  if (!userId) {
    return sendErrorResponse(res, 401, "User tidak terautentikasi");
  }

  const { skip, take } = getPaginationParams(page, limit);

  const { loans, total } = await LoanService.getUserLoans(
    userId,
    skip,
    take,
    status,
  );

  sendResponse(res, 200, "Peminjaman user berhasil diambil", {
    loans,
    pagination: {
      total,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      pages: Math.ceil(total / (parseInt(limit) || 10)),
    },
  });
});

// Get pending loans
export const getPendingLoans = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const { skip, take } = getPaginationParams(page, limit);

  const { loans, total } = await LoanService.getPendingLoans(skip, take);

  sendResponse(res, 200, "Peminjaman pending berhasil diambil", {
    loans,
    pagination: {
      total,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      pages: Math.ceil(total / (parseInt(limit) || 10)),
    },
  });
});

// Get overdue loans
export const getOverdueLoans = asyncHandler(async (req, res) => {
  const loans = await LoanService.getOverdueLoans();

  sendResponse(res, 200, "Peminjaman overdue berhasil diambil", {
    loans,
    count: loans.length,
  });
});

// Get loan statistics
export const getLoanStatistics = asyncHandler(async (req, res) => {
  const stats = await LoanService.getLoanStatistics();

  sendResponse(res, 200, "Statistik peminjaman berhasil diambil", stats);
});

// Delete loan
export const deleteLoan = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const loan = await LoanService.getLoanById(id);
  if (!loan) {
    return sendErrorResponse(res, 404, "Peminjaman tidak ditemukan");
  }

  if (loan.status !== "PENDING") {
    return sendErrorResponse(
      res,
      400,
      "Hanya peminjaman dengan status PENDING yang dapat dihapus",
    );
  }

  await LoanService.deleteLoan(id);

  sendResponse(res, 200, "Peminjaman berhasil dihapus");
});
