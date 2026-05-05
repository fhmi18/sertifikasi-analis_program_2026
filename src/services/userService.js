import { PrismaClient } from "@prisma/client";
import { comparePassword, hashPassword } from "../utils/helpers.js";

const prisma = new PrismaClient();

export class UserService {
  // Get all users
  static async getAllUsers(skip, take) {
    const timer = console.time("UserService.getAllUsers");
    try {
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take,
          select: {
            id: true,
            username: true,
            email: true,
            fullName: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        }),
        prisma.user.count(),
      ]);

      console.timeEnd("UserService.getAllUsers");
      return { users, total };
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  // Get user by ID
  static async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        loans: true,
      },
    });
  }

  // Get user by username
  static async getUserByUsername(username) {
    return await prisma.user.findUnique({
      where: { username },
    });
  }

  // Create user
  static async createUser(data) {
    const hashedPassword = await hashPassword(data.password);

    return await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName,
        role: data.role || "STAFF",
      },
    });
  }

  // Update user
  static async updateUser(id, data) {
    const updateData = { ...data };

    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
  }

  // Delete user
  static async deleteUser(id) {
    return await prisma.user.delete({
      where: { id: parseInt(id) },
    });
  }

  // Verify user login
  static async verifyLogin(username, password) {
    const user = await this.getUserByUsername(username);
    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  // Search users
  static async searchUsers(query, skip, take) {
    return await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query } },
          { email: { contains: query } },
          { fullName: { contains: query } },
        ],
      },
      skip,
      take,
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // Get user statistics
  static async getUserStatistics() {
    const [total, byRole] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({
        by: ["role"],
        _count: true,
      }),
    ]);

    return {
      total,
      byRole: byRole.reduce((acc, item) => {
        acc[item.role] = item._count;
        return acc;
      }, {}),
    };
  }
}
