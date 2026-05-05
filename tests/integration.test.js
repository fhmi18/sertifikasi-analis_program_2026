import request from "supertest";
import app from "../app.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Integration Tests - Complete Workflows", () => {
  const testUsername = `integration_${Date.now()}`;
  let registeredUserId;
  let userToken;
  let itemId;
  let loanId;
  let adminToken;

  // Setup - Get admin token for setup operations
  beforeAll(async () => {
    const adminLoginRes = await request(app).post("/api/auth/login").send({
      username: "admin",
      password: "password123",
    });
    adminToken = adminLoginRes.body.data.token;

    // Get first item for testing
    const itemsRes = await request(app)
      .get("/api/items")
      .query({ page: 1, limit: 1 });
    itemId = itemsRes.body.data.items[0]?.id;
  });

  describe("User Registration and Login Flow", () => {
    test("Should register new user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          username: testUsername,
          email: `${testUsername}@test.com`,
          password: "password123",
          fullName: "Integration Test User",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe(testUsername);
      registeredUserId = response.body.data.id;
    });

    test("Should login with registered user", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: testUsername,
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.role).toBe("STAFF");
      userToken = response.body.data.token;
    });

    test("Should get current user info", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe(testUsername);
      expect(response.body.data.id).toBe(registeredUserId);
    });
  });

  describe("Loan Request and Approval Workflow", () => {
    test("STAFF should create loan request", async () => {
      const response = await request(app)
        .post("/api/loans")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          itemId,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          quantity: 1,
          notes: "Testing loan workflow",
        });

      expect(response.status).toBe(201);
      expect(response.body.data.status).toBe("PENDING");
      expect(response.body.data.userId).toBe(registeredUserId);
      loanId = response.body.data.id;
    });

    test("ADMIN should approve loan", async () => {
      const response = await request(app)
        .post(`/api/loans/${loanId}/approve`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe("APPROVED");
      expect(response.body.data.approvedAt).toBeDefined();
    });

    test("STAFF should return item after approval", async () => {
      const response = await request(app)
        .post(`/api/loans/${loanId}/return`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ condition: "BAIK" });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe("RETURNED");
      expect(response.body.data.returnDate).toBeDefined();
    });

    test("Should retrieve returned loan details", async () => {
      const response = await request(app)
        .get(`/api/loans/${loanId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe("RETURNED");
      expect(response.body.data.returnDate).toBeDefined();
    });
  });

  describe("Authorization and Access Control", () => {
    test("STAFF should NOT be able to create items", async () => {
      const response = await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          itemCode: `STAFF_ITEM_${Date.now()}`,
          itemName: "Staff Created Item",
          category: "Test",
          quantity: 1,
          location: "Test Location",
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test("STAFF should be able to VIEW user list but not CREATE/EDIT/DELETE", async () => {
      // STAFF can view user list
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${userToken}`)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // But STAFF cannot create users
      const createResponse = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          username: `test_user_${Date.now()}`,
          email: `test${Date.now()}@example.com`,
          password: "password123",
          fullName: "Test User",
        });

      expect(createResponse.status).toBe(403);
    });

    test("ADMIN should be able to access user management", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("Delete Loan Workflow", () => {
    let deleteLoanId;

    test("Should create a pending loan", async () => {
      const response = await request(app)
        .post("/api/loans")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          itemId,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          quantity: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body.data.status).toBe("PENDING");
      deleteLoanId = response.body.data.id;
    });

    test("Should delete pending loan", async () => {
      const response = await request(app)
        .delete(`/api/loans/${deleteLoanId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test("Deleted loan should no longer exist", async () => {
      const response = await request(app)
        .get(`/api/loans/${deleteLoanId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("Reject Loan with Reason Workflow", () => {
    let rejectLoanId;

    test("Should create another loan to reject", async () => {
      const response = await request(app)
        .post("/api/loans")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          itemId,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          quantity: 1,
        });

      expect(response.status).toBe(201);
      rejectLoanId = response.body.data.id;
    });

    test("ADMIN should reject loan with reason", async () => {
      const response = await request(app)
        .post(`/api/loans/${rejectLoanId}/reject`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ rejectionReason: "Item sedang dalam perawatan" });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe("REJECTED");
      expect(response.body.data.rejectionReason).toBe(
        "Item sedang dalam perawatan",
      );
    });

    test("STAFF should see rejection reason", async () => {
      const response = await request(app)
        .get(`/api/loans/${rejectLoanId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe("REJECTED");
      expect(response.body.data.rejectionReason).toBeDefined();
    });
  });

  describe("Item Visibility Based on Role", () => {
    test("STAFF should see items", async () => {
      const response = await request(app)
        .get("/api/items")
        .set("Authorization", `Bearer ${userToken}`)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.items)).toBe(true);
    });

    test("STAFF should see item details", async () => {
      const response = await request(app)
        .get(`/api/items/${itemId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(itemId);
    });

    test("ADMIN should see and manage items", async () => {
      const response = await request(app)
        .get("/api/items")
        .set("Authorization", `Bearer ${adminToken}`)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.items)).toBe(true);
    });
  });

  describe("Loan Lifecycle", () => {
    let lifecycleLoanId;

    test("Should create loan", async () => {
      const response = await request(app)
        .post("/api/loans")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          itemId,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          quantity: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body.data.status).toBe("PENDING");
      lifecycleLoanId = response.body.data.id;
    });

    test("Should transition from PENDING to APPROVED", async () => {
      const response = await request(app)
        .post(`/api/loans/${lifecycleLoanId}/approve`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe("APPROVED");
    });

    test("Should transition from APPROVED to RETURNED", async () => {
      const response = await request(app)
        .post(`/api/loans/${lifecycleLoanId}/return`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ condition: "BAIK" });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe("RETURNED");
    });

    test("Final loan state should show complete lifecycle", async () => {
      const response = await request(app)
        .get(`/api/loans/${lifecycleLoanId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      const loan = response.body.data;
      expect(loan.status).toBe("RETURNED");
      expect(loan.loanDate).toBeDefined();
      expect(loan.dueDate).toBeDefined();
      expect(loan.approvalDate || loan.approvedAt).toBeDefined();
      expect(loan.returnDate).toBeDefined();
    });
  });

  describe("Error Handling", () => {
    test("Should handle invalid token", async () => {
      const response = await request(app)
        .post(`/api/loans/99999/approve`)
        .set("Authorization", "Bearer invalid_token");

      expect(response.status).toBe(401);
    });

    test("Should handle missing authorization", async () => {
      const response = await request(app).get("/api/users");

      expect(response.status).toBe(401);
    });

    test("Should handle invalid loan ID", async () => {
      const response = await request(app)
        .get("/api/loans/99999")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(404);
    });

    test("Should handle invalid item ID", async () => {
      const response = await request(app)
        .get("/api/items/99999")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("Transaction and Data Consistency", () => {
    test("Loan quantity should be deducted from item", async () => {
      // Get initial item quantity
      const beforeResponse = await request(app)
        .get(`/api/items/${itemId}`)
        .set("Authorization", `Bearer ${userToken}`);
      const beforeQuantity = beforeResponse.body.data.quantity;

      // Create and approve a loan
      const loanRes = await request(app)
        .post("/api/loans")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          itemId,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          quantity: 1,
        });
      const newLoanId = loanRes.body.data.id;

      // Approve loan
      await request(app)
        .post(`/api/loans/${newLoanId}/approve`)
        .set("Authorization", `Bearer ${adminToken}`);

      // Check item quantity after approval
      const afterResponse = await request(app)
        .get(`/api/items/${itemId}`)
        .set("Authorization", `Bearer ${userToken}`);
      const afterQuantity = afterResponse.body.data.quantity;

      expect(afterQuantity).toBe(beforeQuantity - 1);

      // Return item
      await request(app)
        .post(`/api/loans/${newLoanId}/return`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ condition: "BAIK" });

      // Check quantity is restored
      const finalResponse = await request(app)
        .get(`/api/items/${itemId}`)
        .set("Authorization", `Bearer ${userToken}`);
      const finalQuantity = finalResponse.body.data.quantity;

      expect(finalQuantity).toBe(beforeQuantity);
    });
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
