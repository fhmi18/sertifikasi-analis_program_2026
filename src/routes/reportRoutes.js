import express from "express";
import * as reportController from "../controllers/reportController.js";
import { authenticate, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected routes
router.use(authenticate);

// Dashboard & Statistics
router.get("/dashboard/stats", reportController.getDashboardStats);

// Reports
router.get(
  "/inventory",
  checkRole("PETUGAS_INVENTARIS", "ADMIN"),
  reportController.getInventoryReport,
);
router.get(
  "/loans",
  checkRole("PETUGAS_INVENTARIS", "ADMIN"),
  reportController.getLoanReport,
);
router.get(
  "/activities",
  checkRole("ADMIN"),
  reportController.getActivityLogReport,
);
router.get(
  "/user/:userId",
  checkRole("ADMIN", "PETUGAS_INVENTARIS"),
  reportController.getUserActivityReport,
);

// Export
router.get(
  "/export",
  checkRole("ADMIN", "PETUGAS_INVENTARIS"),
  reportController.exportReport,
);

export default router;
