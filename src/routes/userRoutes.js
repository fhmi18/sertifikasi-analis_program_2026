import express from "express";
import * as userController from "../controllers/userController.js";
import { authenticate, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected routes
router.use(authenticate);

// Get users
router.get(
  "/",
  checkRole("ADMIN", "PETUGAS_INVENTARIS"),
  userController.getAllUsers,
);
router.get(
  "/search",
  checkRole("ADMIN", "PETUGAS_INVENTARIS"),
  userController.searchUsers,
);
router.get("/statistics", checkRole("ADMIN"), userController.getUserStatistics);
router.get("/:id", userController.getUserById);

// Create, update, delete users
router.post("/", checkRole("ADMIN"), userController.createUser);
router.put("/:id", checkRole("ADMIN"), userController.updateUser);
router.delete("/:id", checkRole("ADMIN"), userController.deleteUser);

export default router;
