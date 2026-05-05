import express from "express";
import * as loanController from "../controllers/loanController.js";
import { authenticate, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected routes
router.use(authenticate);

// Get loans
router.get("/", loanController.getAllLoans);
router.get(
  "/pending",
  checkRole("PETUGAS_INVENTARIS", "ADMIN"),
  loanController.getPendingLoans,
);
router.get(
  "/overdue",
  checkRole("PETUGAS_INVENTARIS", "ADMIN"),
  loanController.getOverdueLoans,
);
router.get(
  "/statistics",
  checkRole("PETUGAS_INVENTARIS", "ADMIN"),
  loanController.getLoanStatistics,
);
router.get("/user/:userId", loanController.getUserLoans);
router.get("/:id", loanController.getLoanById);

// Create and manage loans
router.post("/", loanController.createLoan);
router.post(
  "/:id/approve",
  checkRole("PETUGAS_INVENTARIS", "ADMIN"),
  loanController.approveLoan,
);
router.post(
  "/:id/reject",
  checkRole("PETUGAS_INVENTARIS", "ADMIN"),
  loanController.rejectLoan,
);
router.post(
  "/:id/return",
  checkRole("PETUGAS_INVENTARIS", "ADMIN", "STAFF"),
  loanController.returnItem,
);
router.delete(
  "/:id",
  checkRole("STAFF", "PETUGAS_INVENTARIS", "ADMIN"),
  loanController.deleteLoan,
);

export default router;
