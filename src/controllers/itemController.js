import { ItemService } from "../services/itemService.js";
import {
  sendResponse,
  sendErrorResponse,
  getPaginationParams,
} from "../utils/helpers.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

// Get all items
export const getAllItems = asyncHandler(async (req, res) => {
  const { page, limit, category, status, condition, search } = req.query;
  const { skip, take } = getPaginationParams(page, limit);

  const filters = {};
  if (category) filters.category = category;
  if (status) filters.status = status;
  if (condition) filters.condition = condition;
  if (search) filters.search = search;

  const { items, total } = await ItemService.getAllItems(skip, take, filters);

  sendResponse(res, 200, "Barang berhasil diambil", {
    items,
    pagination: {
      total,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      pages: Math.ceil(total / (parseInt(limit) || 10)),
    },
  });
});

// Get item by ID
export const getItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await ItemService.getItemById(id);
  if (!item) {
    return sendErrorResponse(res, 404, "Barang tidak ditemukan");
  }

  sendResponse(res, 200, "Barang ditemukan", item);
});

// Create item
export const createItem = asyncHandler(async (req, res) => {
  const { itemCode, itemName, category, quantity, location } = req.body;

  if (!itemCode || !itemName || !category || !location) {
    return sendErrorResponse(
      res,
      400,
      "Field wajib: itemCode, itemName, category, location",
    );
  }

  // Check duplicate code
  const existing = await ItemService.getItemByCode(itemCode);
  if (existing) {
    return sendErrorResponse(res, 409, "Kode barang sudah digunakan");
  }

  const item = await ItemService.createItem(req.body);

  sendResponse(res, 201, "Barang berhasil ditambahkan", item);
});

// Update item
export const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await ItemService.getItemById(id);
  if (!item) {
    return sendErrorResponse(res, 404, "Barang tidak ditemukan");
  }

  const updated = await ItemService.updateItem(id, req.body);

  sendResponse(res, 200, "Barang berhasil diperbarui", updated);
});

// Delete item
export const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await ItemService.getItemById(id);
  if (!item) {
    return sendErrorResponse(res, 404, "Barang tidak ditemukan");
  }

  await ItemService.deleteItem(id);

  sendResponse(res, 200, "Barang berhasil dihapus");
});

// Get available items
export const getAvailableItems = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const { skip, take } = getPaginationParams(page, limit);

  const { items, total } = await ItemService.getAvailableItems(skip, take);

  sendResponse(res, 200, "Barang tersedia berhasil diambil", {
    items,
    pagination: {
      total,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      pages: Math.ceil(total / (parseInt(limit) || 10)),
    },
  });
});

// Get damaged items
export const getDamagedItems = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const { skip, take } = getPaginationParams(page, limit);

  const { items, total } = await ItemService.getDamagedItems(skip, take);

  sendResponse(res, 200, "Barang rusak berhasil diambil", {
    items,
    pagination: {
      total,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      pages: Math.ceil(total / (parseInt(limit) || 10)),
    },
  });
});

// Get item statistics
export const getItemStatistics = asyncHandler(async (req, res) => {
  const stats = await ItemService.getItemStatistics();

  sendResponse(res, 200, "Statistik barang berhasil diambil", stats);
});

// Search items
export const searchItems = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;

  if (!q) {
    return sendErrorResponse(res, 400, "Query pencarian harus diisi");
  }

  const { skip, take } = getPaginationParams(page, limit);
  const { items, total } = await ItemService.searchItems(q, skip, take);

  sendResponse(res, 200, "Pencarian berhasil", {
    query: q,
    items,
    pagination: {
      total,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      pages: Math.ceil(total / (parseInt(limit) || 10)),
    },
  });
});
