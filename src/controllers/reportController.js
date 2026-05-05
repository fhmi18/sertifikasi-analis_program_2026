import { ReportService } from "../services/reportService.js";
import { sendResponse, sendErrorResponse } from "../utils/helpers.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

// Get dashboard statistics
export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await ReportService.getDashboardStats();

  sendResponse(res, 200, "Statistik dashboard berhasil diambil", stats);
});

// Get inventory report
export const getInventoryReport = asyncHandler(async (req, res) => {
  const { category, status, condition } = req.query;

  const filters = {};
  if (category) filters.category = category;
  if (status) filters.status = status;
  if (condition) filters.condition = condition;

  const report = await ReportService.getInventoryReport(filters);

  sendResponse(res, 200, "Laporan inventaris berhasil diambil", report);
});

// Get loan report
export const getLoanReport = asyncHandler(async (req, res) => {
  const { status, startDate, endDate } = req.query;

  const filters = {};
  if (status) filters.status = status;
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  const report = await ReportService.getLoanReport(filters);

  sendResponse(res, 200, "Laporan peminjaman berhasil diambil", report);
});

// Get activity log report
export const getActivityLogReport = asyncHandler(async (req, res) => {
  const { userId, activity, startDate, limit } = req.query;

  const filters = {};
  if (userId) filters.userId = userId;
  if (activity) filters.activity = activity;
  if (startDate) filters.startDate = startDate;
  if (limit) filters.limit = parseInt(limit);

  const report = await ReportService.getActivityLogReport(filters);

  sendResponse(res, 200, "Laporan aktivitas berhasil diambil", report);
});

// Get user activity report
export const getUserActivityReport = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return sendErrorResponse(res, 400, "User ID harus diisi");
  }

  const report = await ReportService.getUserActivityReport(userId);

  sendResponse(res, 200, "Laporan aktivitas user berhasil diambil", report);
});

// Export report data
export const exportReport = asyncHandler(async (req, res) => {
  const { type } = req.query;

  if (!type) {
    return sendErrorResponse(res, 400, "Tipe laporan harus diisi");
  }

  let report;

  switch (type) {
    case "inventory":
      report = await ReportService.getInventoryReport();
      break;
    case "loan":
      report = await ReportService.getLoanReport();
      break;
    case "activity":
      report = await ReportService.getActivityLogReport();
      break;
    default:
      return sendErrorResponse(res, 400, "Tipe laporan tidak valid");
  }

  // Format CSV
  const csv = convertToCSV(report);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="report-${type}-${Date.now()}.csv"`,
  );
  res.send(csv);
});

// Helper function to convert data to CSV
function convertToCSV(data) {
  let csv = "";

  if (data.items) {
    // Inventory report
    csv = "ID,Kode Barang,Nama Barang,Kategori,Jumlah,Kondisi,Status,Lokasi\n";
    data.items.forEach((item) => {
      csv += `${item.id},"${item.itemCode}","${item.itemName}","${item.category}",${item.quantity},"${item.condition}","${item.status}","${item.location}"\n`;
    });
  } else if (data.loans) {
    // Loan report
    csv = "ID,User,Barang,Tanggal Pinjam,Tanggal Jatuh Tempo,Status\n";
    data.loans.forEach((loan) => {
      csv += `${loan.id},"${loan.user.fullName}","${loan.item.itemName}","${loan.loanDate}","${loan.dueDate}","${loan.status}"\n`;
    });
  } else if (data.logs) {
    // Activity report
    csv = "ID,User,Aktivitas,Timestamp\n";
    data.logs.forEach((log) => {
      csv += `${log.id},"${log.user?.fullName || "Unknown"}","${log.activity}","${log.createdAt}"\n`;
    });
  }

  return csv;
}
