import express from "express";
import * as itemController from "../controllers/itemController.js";
import {
  authenticate,
  authorize,
  checkRole,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes (read-only)
router.get("/", itemController.getAllItems);
router.get("/search", itemController.searchItems);
router.get("/available", itemController.getAvailableItems);
router.get("/damaged", itemController.getDamagedItems);
router.get("/statistics", itemController.getItemStatistics);
router.get("/:id", itemController.getItemById);

// Protected routes (CRUD)
router.post(
  "/",
  authenticate,
  checkRole("PETUGAS_INVENTARIS", "ADMIN"),
  itemController.createItem,
);
router.put(
  "/:id",
  authenticate,
  checkRole("PETUGAS_INVENTARIS", "ADMIN"),
  itemController.updateItem,
);
router.delete(
  "/:id",
  authenticate,
  checkRole("PETUGAS_INVENTARIS", "ADMIN"),
  itemController.deleteItem,
);

export default router;
