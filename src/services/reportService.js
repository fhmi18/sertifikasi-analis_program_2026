import { PrismaClient } from "@prisma/client";
import { ItemService } from "./itemService.js";
import { LoanService } from "./loanService.js";
import { UserService } from "./userService.js";

const prisma = new PrismaClient();

export class ReportService {
  // Get dashboard statistics
  static async getDashboardStats() {
    const timer = console.time("ReportService.getDashboardStats");

    const [itemStats, loanStats, userStats, recentLoans, overdueLoans] =
      await Promise.all([
        ItemService.getItemStatistics(),
        LoanService.getLoanStatistics(),
        UserService.getUserStatistics(),
        prisma.loan.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { fullName: true } },
            item: { select: { itemName: true } },
          },
        }),
        LoanService.getOverdueLoans(),
      ]);

    console.timeEnd("ReportService.getDashboardStats");

    return {
      items: itemStats,
      loans: loanStats,
      users: userStats,
      recentLoans,
      overdueLoans: overdueLoans.length,
    };
  }

  // Get inventory report
  static async getInventoryReport(filters = {}) {
    const items = await prisma.item.findMany({
      where: {
        ...(filters.category && { category: filters.category }),
        ...(filters.status && { status: filters.status }),
        ...(filters.condition && { condition: filters.condition }),
      },
      orderBy: { category: "asc" },
    });

    return {
      generatedAt: new Date(),
      totalItems: items.length,
      totalValue: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
      items,
      summary: {
        byCategory: this.groupByCategory(items),
        byCondition: this.groupByCondition(items),
        byStatus: this.groupByStatus(items),
      },
    };
  }

  // Get loan report
  static async getLoanReport(filters = {}) {
    const loans = await prisma.loan.findMany({
      where: {
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && {
          loanDate: {
            gte: new Date(filters.startDate),
          },
        }),
        ...(filters.endDate && {
          loanDate: {
            lte: new Date(filters.endDate),
          },
        }),
      },
      include: {
        user: { select: { fullName: true, email: true } },
        item: { select: { itemName: true, itemCode: true } },
      },
      orderBy: { loanDate: "desc" },
    });

    return {
      generatedAt: new Date(),
      totalLoans: loans.length,
      loans,
      summary: {
        byStatus: this.groupByStatus(loans),
        byUser: this.groupByUser(loans),
        byItem: this.groupByItem(loans),
      },
    };
  }

  // Get activity log report
  static async getActivityLogReport(filters = {}) {
    const logs = await prisma.log.findMany({
      where: {
        ...(filters.userId && { userId: parseInt(filters.userId) }),
        ...(filters.activity && { activity: filters.activity }),
        ...(filters.startDate && {
          createdAt: {
            gte: new Date(filters.startDate),
          },
        }),
      },
      include: {
        user: { select: { username: true, fullName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: filters.limit || 500,
    });

    return {
      generatedAt: new Date(),
      totalActivities: logs.length,
      logs,
      summary: {
        byActivity: this.groupByActivity(logs),
        byUser: this.groupByActivityUser(logs),
      },
    };
  }

  // Get user activity report
  static async getUserActivityReport(userId) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        loans: {
          include: {
            item: { select: { itemName: true } },
          },
        },
        logs: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!user) throw new Error("User tidak ditemukan");

    return {
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      loans: user.loans,
      recentActivities: user.logs,
    };
  }

  // Private helper functions
  static groupByCategory(items) {
    return items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
  }

  static groupByCondition(items) {
    return items.reduce((acc, item) => {
      acc[item.condition] = (acc[item.condition] || 0) + 1;
      return acc;
    }, {});
  }

  static groupByStatus(data) {
    return data.reduce((acc, item) => {
      const status = item.status || item.condition;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }

  static groupByUser(loans) {
    return loans.reduce((acc, loan) => {
      const userName = loan.user.fullName;
      acc[userName] = (acc[userName] || 0) + 1;
      return acc;
    }, {});
  }

  static groupByItem(loans) {
    return loans.reduce((acc, loan) => {
      const itemName = loan.item.itemName;
      acc[itemName] = (acc[itemName] || 0) + 1;
      return acc;
    }, {});
  }

  static groupByActivity(logs) {
    return logs.reduce((acc, log) => {
      acc[log.activity] = (acc[log.activity] || 0) + 1;
      return acc;
    }, {});
  }

  static groupByActivityUser(logs) {
    return logs.reduce((acc, log) => {
      const userName = log.user?.fullName || "Unknown";
      acc[userName] = (acc[userName] || 0) + 1;
      return acc;
    }, {});
  }
}
