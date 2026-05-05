import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class LoanService {
  // Get all loans
  static async getAllLoans(skip, take, filters = {}) {
    const where = {};

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.userId) {
      where.userId = parseInt(filters.userId);
    }
    if (filters.itemId) {
      where.itemId = parseInt(filters.itemId);
    }

    const [loans, total] = await Promise.all([
      prisma.loan.findMany({
        where,
        skip,
        take,
        include: {
          user: { select: { id: true, username: true, fullName: true } },
          item: { select: { id: true, itemCode: true, itemName: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.loan.count({ where }),
    ]);

    return { loans, total };
  }

  // Get loan by ID
  static async getLoanById(id) {
    return await prisma.loan.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: { id: true, username: true, fullName: true, email: true },
        },
        item: {
          select: { id: true, itemCode: true, itemName: true, quantity: true },
        },
      },
    });
  }

  // Create loan request
  static async createLoan(data) {
    // Check item availability
    const item = await prisma.item.findUnique({
      where: { id: parseInt(data.itemId) },
    });

    if (!item || item.quantity < data.quantity) {
      throw new Error("Item tidak tersedia dengan jumlah yang diminta");
    }

    // Create loan
    const loan = await prisma.loan.create({
      data: {
        userId: parseInt(data.userId),
        itemId: parseInt(data.itemId),
        loanDate: new Date(),
        dueDate: new Date(data.dueDate),
        quantity: parseInt(data.quantity) || 1,
        status: "PENDING",
        notes: data.notes,
      },
      include: {
        user: true,
        item: true,
      },
    });

    return loan;
  }

  // Approve loan
  static async approveLoan(id, approvedBy) {
    const loan = await this.getLoanById(id);

    if (!loan) {
      throw new Error("Peminjaman tidak ditemukan");
    }

    // Update item quantity
    await prisma.item.update({
      where: { id: loan.itemId },
      data: {
        quantity: { decrement: loan.quantity },
        status: "DIPINJAM",
      },
    });

    // Update loan status
    return await prisma.loan.update({
      where: { id: parseInt(id) },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        approvedBy: parseInt(approvedBy),
      },
      include: {
        user: true,
        item: true,
      },
    });
  }

  // Reject loan
  static async rejectLoan(id, rejectionReason) {
    return await prisma.loan.update({
      where: { id: parseInt(id) },
      data: {
        status: "REJECTED",
        rejectionReason,
      },
      include: {
        user: true,
        item: true,
      },
    });
  }

  // Return item
  static async returnItem(id, condition = "BAIK") {
    const loan = await this.getLoanById(id);

    if (!loan) {
      throw new Error("Peminjaman tidak ditemukan");
    }

    // Update item
    const item = await prisma.item.findUnique({
      where: { id: loan.itemId },
    });

    let newQuantity = item.quantity + loan.quantity;
    let newStatus = condition === "RUSAK" ? "MAINTENANCE" : "TERSEDIA";

    await prisma.item.update({
      where: { id: loan.itemId },
      data: {
        quantity: newQuantity,
        condition: condition === "RUSAK" ? "RUSAK" : item.condition,
        status: newStatus,
      },
    });

    // Update loan
    return await prisma.loan.update({
      where: { id: parseInt(id) },
      data: {
        status: "RETURNED",
        returnDate: new Date(),
      },
      include: {
        user: true,
        item: true,
      },
    });
  }

  // Get user's loans
  static async getUserLoans(userId, skip, take, status = null) {
    const where = { userId: parseInt(userId) };

    if (status) {
      where.status = status;
    }

    const [loans, total] = await Promise.all([
      prisma.loan.findMany({
        where,
        skip,
        take,
        include: {
          item: { select: { id: true, itemCode: true, itemName: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.loan.count({ where }),
    ]);

    return { loans, total };
  }

  // Get pending loans
  static async getPendingLoans(skip, take) {
    const [loans, total] = await Promise.all([
      prisma.loan.findMany({
        where: { status: "PENDING" },
        skip,
        take,
        include: {
          user: { select: { id: true, username: true, fullName: true } },
          item: { select: { id: true, itemCode: true, itemName: true } },
        },
        orderBy: { loanDate: "asc" },
      }),
      prisma.loan.count({ where: { status: "PENDING" } }),
    ]);

    return { loans, total };
  }

  // Get overdue loans
  static async getOverdueLoans() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await prisma.loan.findMany({
      where: {
        status: "APPROVED",
        dueDate: {
          lt: today,
        },
      },
      include: {
        user: { select: { id: true, username: true, fullName: true } },
        item: { select: { id: true, itemCode: true, itemName: true } },
      },
    });
  }

  // Get loan statistics
  static async getLoanStatistics() {
    const [total, pending, approved, rejected, returned] = await Promise.all([
      prisma.loan.count(),
      prisma.loan.count({ where: { status: "PENDING" } }),
      prisma.loan.count({ where: { status: "APPROVED" } }),
      prisma.loan.count({ where: { status: "REJECTED" } }),
      prisma.loan.count({ where: { status: "RETURNED" } }),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
      returned,
    };
  }

  // Delete loan (only PENDING status can be deleted)
  static async deleteLoan(id) {
    const loan = await this.getLoanById(id);

    if (!loan) {
      throw new Error("Peminjaman tidak ditemukan");
    }

    if (loan.status !== "PENDING") {
      throw new Error(
        "Hanya peminjaman dengan status PENDING yang dapat dihapus",
      );
    }

    return await prisma.loan.delete({
      where: { id: parseInt(id) },
    });
  }
}
