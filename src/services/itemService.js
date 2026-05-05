import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ItemService {
  // Get all items
  static async getAllItems(skip, take, filters = {}) {
    const where = {};

    if (filters.category) {
      where.category = filters.category;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.condition) {
      where.condition = filters.condition;
    }
    if (filters.search) {
      where.OR = [
        { itemName: { contains: filters.search } },
        { itemCode: { contains: filters.search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.item.count({ where }),
    ]);

    return { items, total };
  }

  // Get item by ID
  static async getItemById(id) {
    return await prisma.item.findUnique({
      where: { id: parseInt(id) },
      include: {
        loans: {
          where: { status: { in: ["APPROVED", "PENDING"] } },
        },
      },
    });
  }

  // Get item by code
  static async getItemByCode(itemCode) {
    return await prisma.item.findUnique({
      where: { itemCode },
    });
  }

  // Create item
  static async createItem(data) {
    return await prisma.item.create({
      data: {
        itemCode: data.itemCode,
        itemName: data.itemName,
        category: data.category,
        quantity: parseInt(data.quantity) || 0,
        condition: data.condition || "BAIK",
        status: data.status || "TERSEDIA",
        location: data.location,
        description: data.description,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        price: data.price ? parseFloat(data.price) : 0,
      },
    });
  }

  // Update item
  static async updateItem(id, data) {
    const updateData = {};

    if (data.itemName) updateData.itemName = data.itemName;
    if (data.category) updateData.category = data.category;
    if (data.quantity !== undefined)
      updateData.quantity = parseInt(data.quantity);
    if (data.condition) updateData.condition = data.condition;
    if (data.status) updateData.status = data.status;
    if (data.location) updateData.location = data.location;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.price !== undefined) updateData.price = parseFloat(data.price);

    return await prisma.item.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
  }

  // Delete item
  static async deleteItem(id) {
    return await prisma.item.delete({
      where: { id: parseInt(id) },
    });
  }

  // Get items by category
  static async getItemsByCategory(category, skip, take) {
    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where: { category },
        skip,
        take,
      }),
      prisma.item.count({ where: { category } }),
    ]);

    return { items, total };
  }

  // Get available items (quantity > 0 and status = TERSEDIA)
  static async getAvailableItems(skip, take) {
    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where: {
          quantity: { gt: 0 },
          status: "TERSEDIA",
        },
        skip,
        take,
      }),
      prisma.item.count({
        where: {
          quantity: { gt: 0 },
          status: "TERSEDIA",
        },
      }),
    ]);

    return { items, total };
  }

  // Get damaged items
  static async getDamagedItems(skip, take) {
    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where: { condition: "RUSAK" },
        skip,
        take,
      }),
      prisma.item.count({ where: { condition: "RUSAK" } }),
    ]);

    return { items, total };
  }

  // Get item statistics
  static async getItemStatistics() {
    const [total, available, borrowed, damaged, byCategory] = await Promise.all(
      [
        prisma.item.count(),
        prisma.item.count({ where: { status: "TERSEDIA" } }),
        prisma.item.count({ where: { status: "DIPINJAM" } }),
        prisma.item.count({ where: { condition: "RUSAK" } }),
        prisma.item.groupBy({
          by: ["category"],
          _count: true,
        }),
      ],
    );

    return {
      total,
      available,
      borrowed,
      damaged,
      byCategory: byCategory.reduce((acc, item) => {
        acc[item.category] = item._count;
        return acc;
      }, {}),
    };
  }

  // Search items
  static async searchItems(query, skip, take) {
    const where = {
      OR: [
        { itemName: { contains: query } },
        { itemCode: { contains: query } },
        { description: { contains: query } },
      ],
    };

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        skip,
        take,
      }),
      prisma.item.count({ where }),
    ]);

    return { items, total };
  }

  // Update item quantity
  static async updateQuantity(id, quantity) {
    return await prisma.item.update({
      where: { id: parseInt(id) },
      data: { quantity },
    });
  }
}
