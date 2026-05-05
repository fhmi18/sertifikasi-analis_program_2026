import request from "supertest";
import app from "../app.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Auth Endpoints", () => {
  const uniqueUsername = `testapi_${Date.now()}`;
  // Test register
  test("POST /api/auth/register - Should register new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: uniqueUsername,
        email: `${uniqueUsername}@example.com`,
        password: "password123",
        fullName: "Test User",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.username).toBe(uniqueUsername);
  });

  // Test register validation
  test("POST /api/auth/register - Should validate required fields", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "testuser2",
      email: "invalid-email",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  // Test register duplicate username
  test("POST /api/auth/register - Should reject duplicate username", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: uniqueUsername, // reuse username from first test
        email: `another_${uniqueUsername}@example.com`,
        password: "password123",
        fullName: "Test User",
      });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  // Test login with missing fields
  test("POST /api/auth/login - Should validate missing fields", async () => {
    const response = await request(app).post("/api/auth/login").send({});
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  // Test login
  let loginToken;
  test("POST /api/auth/login - Should login successfully", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "admin",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    loginToken = response.body.data.token;
    expect(response.body.data.token).toBeDefined();
  });

  // Test login with wrong password
  test("POST /api/auth/login - Should reject wrong credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      username: "admin",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("GET /api/auth/me - Should get current user", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${loginToken}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("POST /api/auth/refresh - Should refresh token", async () => {
    const response = await request(app)
      .post("/api/auth/refresh")
      .set("Authorization", `Bearer ${loginToken}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("POST /api/auth/logout - Should logout", async () => {
    const response = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${loginToken}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe("Item Endpoints", () => {
  let authToken;
  let staffToken;
  let createdItemCode;
  let createdItemId;

  beforeAll(async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      username: "petugas1",
      password: "password123",
    });
    authToken = loginResponse.body.data.token;

    const staffLoginResponse = await request(app).post("/api/auth/login").send({
      username: "staff1",
      password: "password123",
    });
    staffToken = staffLoginResponse.body.data.token;
  });

  // Test get all items
  test("GET /api/items - Should get all items", async () => {
    const response = await request(app)
      .get("/api/items")
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.items)).toBe(true);
  });

  // Test create item
  test("POST /api/items - Should create new item", async () => {
    const uniqueItemCode = `TEST-${Date.now()}`;
    createdItemCode = uniqueItemCode;
    const response = await request(app)
      .post("/api/items")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        itemCode: uniqueItemCode,
        itemName: "Test Item",
        category: "Test Category",
        quantity: 5,
        location: "Test Location",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    createdItemId = response.body.data.id;
    expect(response.body.data.itemName).toBe("Test Item");
  });

  // Test create duplicate item
  test("POST /api/items - Should reject duplicate item code", async () => {
    const response = await request(app)
      .post("/api/items")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        itemCode: createdItemCode,
        itemName: "Duplicate Item",
        category: "Test Category",
        quantity: 1,
        location: "Test Location",
      });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  // Test create item validation missing fields
  test("POST /api/items - Should validate missing fields", async () => {
    const response = await request(app)
      .post("/api/items")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ itemName: "Incomplete Item" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  // Test RBAC: Staff trying to create item
  test("POST /api/items - Should reject STAFF from creating item (Forbidden)", async () => {
    const response = await request(app)
      .post("/api/items")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        itemCode: `STAFF-${Date.now()}`,
        itemName: "Staff Item",
        category: "Test",
        quantity: 1,
        location: "Test Location",
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  // Test non-existent item actions (404)
  test("GET, PUT, DELETE /api/items/:id - Should return 404 for non-existent item", async () => {
    const getRes = await request(app).get("/api/items/99999");
    expect(getRes.status).toBe(404);

    const putRes = await request(app)
      .put("/api/items/99999")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ itemName: "Updated" });
    expect(putRes.status).toBe(404);

    const delRes = await request(app)
      .delete("/api/items/99999")
      .set("Authorization", `Bearer ${authToken}`);
    expect(delRes.status).toBe(404);
  });

  test("PUT /api/items/:id - Should update item", async () => {
    const response = await request(app)
      .put(`/api/items/${createdItemId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ itemName: "Updated Name" });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("DELETE /api/items/:id - Should delete item", async () => {
    const response = await request(app)
      .delete(`/api/items/${createdItemId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Test search items
  test("GET /api/items/search - Should search items", async () => {
    const response = await request(app)
      .get("/api/items/search")
      .query({ q: "Laptop", page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Test get available items
  test("GET /api/items/available - Should get available items", async () => {
    const response = await request(app)
      .get("/api/items/available")
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Test get item statistics
  test("GET /api/items/statistics - Should get item statistics", async () => {
    const response = await request(app).get("/api/items/statistics");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.total).toBeDefined();
  });
});

describe("Loan Endpoints", () => {
  let authToken;
  let itemId;
  let createdLoanId;
  let loggedInUserId;

  beforeAll(async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      username: "petugas1",
      password: "password123",
    });
    authToken = loginResponse.body.data.token;
    loggedInUserId = loginResponse.body.data.user.id;

    // Get first item
    const itemsResponse = await request(app)
      .get("/api/items")
      .query({ page: 1, limit: 1 });
    itemId = itemsResponse.body.data.items[0]?.id;
  });

  // Test create loan
  test("POST /api/loans - Should create loan request", async () => {
    const response = await request(app)
      .post("/api/loans")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        itemId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        quantity: 1,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    createdLoanId = response.body.data.id;
    expect(response.body.data.status).toBe("PENDING");
  });

  // Test create loan validation missing fields
  test("POST /api/loans - Should validate missing fields", async () => {
    const response = await request(app)
      .post("/api/loans")
      .set("Authorization", `Bearer ${authToken}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  // Test reject loan missing reason
  test("POST /api/loans/:id/reject - Should validate missing reason", async () => {
    const response = await request(app)
      .post("/api/loans/99999/reject")
      .set("Authorization", `Bearer ${authToken}`)
      .send({});
    expect(response.status).toBe(400);
  });

  // Test get non-existent loan
  test("GET /api/loans/:id - Should return 404 for non-existent loan", async () => {
    const response = await request(app)
      .get("/api/loans/99999")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(404);
  });

  // Test get loans
  test("GET /api/loans - Should get all loans", async () => {
    const response = await request(app)
      .get("/api/loans")
      .set("Authorization", `Bearer ${authToken}`)
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Test get pending loans
  test("GET /api/loans/pending - Should get pending loans", async () => {
    const response = await request(app)
      .get("/api/loans/pending")
      .set("Authorization", `Bearer ${authToken}`)
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Test get loan statistics
  test("GET /api/loans/statistics - Should get loan statistics", async () => {
    const response = await request(app)
      .get("/api/loans/statistics")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.total).toBeDefined();
  });

  test("POST /api/loans/:id/approve - Should approve loan", async () => {
    const response = await request(app)
      .post(`/api/loans/${createdLoanId}/approve`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  test("POST /api/loans/:id/reject - Should reject loan with reason", async () => {
    // Create another loan to reject
    const newLoanRes = await request(app)
      .post("/api/loans")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        itemId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        quantity: 1,
      });
    const rejectLoanId = newLoanRes.body.data.id;

    const response = await request(app)
      .post(`/api/loans/${rejectLoanId}/reject`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ rejectionReason: "Item sedang diperbaiki" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("REJECTED");
  });

  test("POST /api/loans/:id/return - Should return item", async () => {
    const response = await request(app)
      .post(`/api/loans/${createdLoanId}/return`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ condition: "BAIK" });
    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("RETURNED");
  });

  test("DELETE /api/loans/:id - Should delete pending loan", async () => {
    // Create a pending loan to delete
    const newLoanRes = await request(app)
      .post("/api/loans")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        itemId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        quantity: 1,
      });
    const deleteLoanId = newLoanRes.body.data.id;

    const response = await request(app)
      .delete(`/api/loans/${deleteLoanId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("DELETE /api/loans/:id - Should not delete approved loan", async () => {
    // Try to delete the approved loan
    const response = await request(app)
      .delete(`/api/loans/${createdLoanId}`)
      .set("Authorization", `Bearer ${authToken}`);

    // Should fail because loan is not PENDING
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("GET /api/loans/overdue - Should get overdue loans", async () => {
    const response = await request(app)
      .get("/api/loans/overdue")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  test("GET /api/loans/user/:userId - Should get user loans", async () => {
    const response = await request(app)
      .get(`/api/loans/user/${loggedInUserId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });
});

describe("Report Endpoints", () => {
  let adminToken;
  let adminId;

  beforeAll(async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      username: "admin",
      password: "password123",
    });
    adminToken = loginResponse.body.data.token;
    adminId = loginResponse.body.data.user.id;
  });

  // Test dashboard stats
  test("GET /api/reports/dashboard/stats - Should get dashboard statistics", async () => {
    const response = await request(app)
      .get("/api/reports/dashboard/stats")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.items).toBeDefined();
    expect(response.body.data.loans).toBeDefined();
  });

  // Test inventory report
  test("GET /api/reports/inventory - Should get inventory report", async () => {
    const response = await request(app)
      .get("/api/reports/inventory")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.items)).toBe(true);
  });

  // Test loan report
  test("GET /api/reports/loans - Should get loan report", async () => {
    const response = await request(app)
      .get("/api/reports/loans")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.loans)).toBe(true);
  });

  // Test export missing type
  test("GET /api/reports/export - Should validate missing type", async () => {
    const response = await request(app)
      .get("/api/reports/export")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(400);
  });

  test("GET /api/reports/activities - Should get activity logs", async () => {
    const response = await request(app)
      .get("/api/reports/activities")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
  });

  test("GET /api/reports/user/:userId - Should get user activities", async () => {
    const response = await request(app)
      .get(`/api/reports/user/${adminId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
  });

  test("GET /api/reports/export - Should export report", async () => {
    const response = await request(app)
      .get("/api/reports/export?type=inventory")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
  });

  // Test export invalid type
  test("GET /api/reports/export - Should validate invalid type", async () => {
    const response = await request(app)
      .get("/api/reports/export?type=invalid_type")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(400);
  });
});

describe("User Endpoints", () => {
  let adminToken;
  let createdUserId;

  beforeAll(async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      username: "admin",
      password: "password123",
    });
    adminToken = loginResponse.body.data.token;
  });

  // Test unauthorized request (no token)
  test("GET /api/users - Should reject unauthorized requests", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(401);
  });

  // Test get all users
  test("GET /api/users - Should get all users", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Test create user missing fields
  test("POST /api/users - Should validate missing fields", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ username: "incomplete" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("POST /api/users - Should create user", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        username: `apiuser_${Date.now()}`,
        email: `apiuser_${Date.now()}@test.com`,
        password: "password123",
        fullName: "API User",
      });
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    createdUserId = response.body.data.id;
  });

  // Test non-existent user actions (404)
  test("GET, PUT, DELETE /api/users/:id - Should return 404 for non-existent user", async () => {
    const getRes = await request(app)
      .get("/api/users/99999")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(getRes.status).toBe(404);

    const putRes = await request(app)
      .put("/api/users/99999")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ fullName: "Updated" });
    expect(putRes.status).toBe(404);

    const delRes = await request(app)
      .delete("/api/users/99999")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(delRes.status).toBe(404);
  });

  test("PUT /api/users/:id - Should update user", async () => {
    const response = await request(app)
      .put(`/api/users/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ fullName: "Updated API User" });
    expect(response.status).toBe(200);
  });

  test("GET /api/users/search - Should search users", async () => {
    const response = await request(app)
      .get("/api/users/search?q=API")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
  });

  test("DELETE /api/users/:id - Should delete user", async () => {
    const response = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
  });

  // Test get user statistics
  test("GET /api/users/statistics - Should get user statistics", async () => {
    const response = await request(app)
      .get("/api/users/statistics")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.total).toBeDefined();
  });
});

describe("Authorization/RBAC Tests", () => {
  let staffToken;
  let itemId;
  let loanId;

  beforeAll(async () => {
    // Login as staff
    const staffLoginRes = await request(app).post("/api/auth/login").send({
      username: "staff1",
      password: "password123",
    });
    staffToken = staffLoginRes.body.data.token;

    // Get first item
    const itemsResponse = await request(app)
      .get("/api/items")
      .query({ page: 1, limit: 1 });
    itemId = itemsResponse.body.data.items[0]?.id;

    // Create a pending loan for staff
    const loanRes = await request(app)
      .post("/api/loans")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        itemId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        quantity: 1,
      });
    loanId = loanRes.body.data.id;
  });

  // Staff should NOT be able to create items
  test("POST /api/items - STAFF should be forbidden from creating items", async () => {
    const response = await request(app)
      .post("/api/items")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        itemCode: `STAFF-${Date.now()}`,
        itemName: "Staff Trying to Create",
        category: "Test",
        quantity: 1,
        location: "Test",
      });

    expect(response.status).toBe(403);
  });

  // Staff should NOT be able to delete items
  test("DELETE /api/items/:id - STAFF should be forbidden from deleting items", async () => {
    const response = await request(app)
      .delete(`/api/items/${itemId}`)
      .set("Authorization", `Bearer ${staffToken}`);

    expect(response.status).toBe(403);
  });

  // Staff should NOT be able to approve loans
  test("POST /api/loans/:id/approve - STAFF should be forbidden from approving loans", async () => {
    const response = await request(app)
      .post(`/api/loans/${loanId}/approve`)
      .set("Authorization", `Bearer ${staffToken}`);

    expect(response.status).toBe(403);
  });

  // Staff should be able to VIEW user list but not CREATE/EDIT/DELETE
  test("GET /api/users - STAFF should be able to view user list", async () => {
    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Staff should NOT be able to create users
  test("POST /api/users - STAFF should be forbidden from creating users", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        username: `staff_created_${Date.now()}`,
        email: `staff${Date.now()}@test.com`,
        password: "password123",
        fullName: "Staff Created",
      });

    expect(response.status).toBe(403);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
