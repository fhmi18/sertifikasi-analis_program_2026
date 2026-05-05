import { LoanService } from "../src/services/loanService.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("LoanService", () => {
  let createdLoanId;
  let userId;
  let itemId;

  beforeAll(async () => {
    // Get an existing user and item from the database dynamically
    const user = await prisma.user.findFirst();
    const item = await prisma.item.findFirst();

    if (user) userId = user.id;
    if (item) itemId = item.id;
  });

  // Test create loan
  test("createLoan - Should create a new loan", async () => {
    const loanData = {
      userId,
      itemId,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      quantity: 1,
    };

    const loan = await LoanService.createLoan(loanData);

    expect(loan).toBeDefined();
    expect(loan.userId).toBe(userId);
    expect(loan.itemId).toBe(itemId);
    expect(loan.status).toBe("PENDING");
    expect(loan.quantity).toBe(1);

    createdLoanId = loan.id;
  });

  // Test get loan by ID
  test("getLoanById - Should find loan by ID", async () => {
    const loan = await LoanService.getLoanById(createdLoanId);

    expect(loan).toBeDefined();
    expect(loan.id).toBe(createdLoanId);
  });

  // Test get all loans
  test("getAllLoans - Should return paginated loans", async () => {
    const { loans, total } = await LoanService.getAllLoans(0, 10);

    expect(Array.isArray(loans)).toBe(true);
    expect(total).toBeGreaterThan(0);
  });

  // Test get user's loans
  test("getUserLoans - Should get loans for a specific user", async () => {
    const { loans, total } = await LoanService.getUserLoans(userId, 0, 10);

    expect(Array.isArray(loans)).toBe(true);
    loans.forEach((loan) => {
      expect(loan.userId).toBe(userId);
    });
  });

  // Test approve loan
  test("approveLoan - Should approve a loan", async () => {
    const approvedLoan = await LoanService.approveLoan(createdLoanId, userId); // Uses dynamic user

    expect(approvedLoan).toBeDefined();
    expect(approvedLoan.status).toBe("APPROVED");
    expect(approvedLoan.approvedAt).toBeDefined();
  });

  // Test get pending loans
  test("getPendingLoans - Should return pending loans", async () => {
    const { loans, total } = await LoanService.getPendingLoans(0, 10);

    expect(Array.isArray(loans)).toBe(true);
    // Approved loan should not be in pending
    loans.forEach((loan) => {
      expect(loan.status).toBe("PENDING");
    });
  });

  // Test return item
  test("returnItem - Should mark item as returned", async () => {
    const returnedLoan = await LoanService.returnItem(createdLoanId, "BAIK");

    expect(returnedLoan).toBeDefined();
    expect(returnedLoan.status).toBe("RETURNED");
    expect(returnedLoan.returnDate).toBeDefined();
  });

  // Test loan statistics
  test("getLoanStatistics - Should return loan statistics", async () => {
    const stats = await LoanService.getLoanStatistics();

    expect(stats).toBeDefined();
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.pending).toBeDefined();
    expect(stats.approved).toBeDefined();
    expect(stats.rejected).toBeDefined();
    expect(stats.returned).toBeDefined();
  });

  // Test get overdue loans
  test("getOverdueLoans - Should return overdue loans", async () => {
    const loans = await LoanService.getOverdueLoans();

    expect(Array.isArray(loans)).toBe(true);
  });

  // Test reject loan
  test("rejectLoan - Should reject a loan", async () => {
    // Create new loan to reject
    const loanData = {
      userId,
      itemId,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      quantity: 1,
    };

    const loan = await LoanService.createLoan(loanData);
    const rejectedLoan = await LoanService.rejectLoan(
      loan.id,
      "Item sedang dalam perawatan",
    );

    expect(rejectedLoan).toBeDefined();
    expect(rejectedLoan.status).toBe("REJECTED");
    expect(rejectedLoan.rejectionReason).toBe("Item sedang dalam perawatan");
  });
});
