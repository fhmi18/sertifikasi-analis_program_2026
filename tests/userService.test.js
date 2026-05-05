import { UserService } from "../src/services/userService.js";
import { comparePassword } from "../src/utils/helpers.js";

describe("UserService", () => {
  let createdUserId;

  // Test user creation
  test("createUser - Should create a new user", async () => {
    const uniqueName = `testuser_${Date.now()}`;
    const userData = {
      username: uniqueName,
      email: `${uniqueName}@example.com`,
      password: "password123",
      fullName: "Test User 1",
      role: "STAFF",
    };

    const user = await UserService.createUser(userData);

    expect(user).toBeDefined();
    expect(user.username).toBe(userData.username);
    expect(user.email).toBe(userData.email);
    expect(user.fullName).toBe(userData.fullName);

    // Password should be hashed
    expect(user.password).not.toBe(userData.password);

    createdUserId = user.id;
  });

  // Test getting user by username
  test("getUserByUsername - Should find user by username", async () => {
    const user = await UserService.getUserByUsername("admin");

    expect(user).toBeDefined();
    expect(user.username).toBe("admin");
  });

  // Test getting user by ID
  test("getUserById - Should find user by ID", async () => {
    const user = await UserService.getUserById(createdUserId);

    expect(user).toBeDefined();
    expect(user.id).toBe(createdUserId);
  });

  // Test login verification
  test("verifyLogin - Should verify correct credentials", async () => {
    const user = await UserService.verifyLogin("admin", "password123");

    expect(user).toBeDefined();
    expect(user.username).toBe("admin");
  });

  // Test login with wrong password
  test("verifyLogin - Should reject wrong password", async () => {
    const user = await UserService.verifyLogin("admin", "wrongpassword");

    expect(user).toBeNull();
  });

  // Test get all users
  test("getAllUsers - Should return paginated users", async () => {
    const { users, total } = await UserService.getAllUsers(0, 10);

    expect(Array.isArray(users)).toBe(true);
    expect(total).toBeGreaterThan(0);
  });

  // Test search users
  test("searchUsers - Should search users by username", async () => {
    const users = await UserService.searchUsers("staff", 0, 10);

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  // Test user statistics
  test("getUserStatistics - Should return user statistics", async () => {
    const stats = await UserService.getUserStatistics();

    expect(stats).toBeDefined();
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.byRole).toBeDefined();
  });

  // Test update user
  test("updateUser - Should update user data", async () => {
    const updatedUser = await UserService.updateUser(createdUserId, {
      fullName: "Admin Updated",
    });

    expect(updatedUser).toBeDefined();
    expect(updatedUser.fullName).toBe("Admin Updated");
  });
});
