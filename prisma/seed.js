import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeder...");

  // Clean existing data
  console.log("🗑️  Cleaning existing data...");
  await prisma.log.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();

  // Create Users (10 users)
  console.log("👥 Creating users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = await Promise.all([
    // Admin
    prisma.user.create({
      data: {
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        fullName: "Admin User",
        role: "ADMIN",
      },
    }),
    // Petugas Inventaris
    prisma.user.create({
      data: {
        username: "petugas1",
        email: "petugas1@example.com",
        password: hashedPassword,
        fullName: "Petugas Inventaris 1",
        role: "PETUGAS_INVENTARIS",
      },
    }),
    prisma.user.create({
      data: {
        username: "petugas2",
        email: "petugas2@example.com",
        password: hashedPassword,
        fullName: "Petugas Inventaris 2",
        role: "PETUGAS_INVENTARIS",
      },
    }),
    // Staff
    prisma.user.create({
      data: {
        username: "staff1",
        email: "staff1@example.com",
        password: hashedPassword,
        fullName: "Budi Santoso",
        role: "STAFF",
      },
    }),
    prisma.user.create({
      data: {
        username: "staff2",
        email: "staff2@example.com",
        password: hashedPassword,
        fullName: "Siti Nurhaliza",
        role: "STAFF",
      },
    }),
    prisma.user.create({
      data: {
        username: "staff3",
        email: "staff3@example.com",
        password: hashedPassword,
        fullName: "Ahmad Wijaya",
        role: "STAFF",
      },
    }),
    prisma.user.create({
      data: {
        username: "staff4",
        email: "staff4@example.com",
        password: hashedPassword,
        fullName: "Dewi Lestari",
        role: "STAFF",
      },
    }),
    prisma.user.create({
      data: {
        username: "staff5",
        email: "staff5@example.com",
        password: hashedPassword,
        fullName: "Rinto Harahap",
        role: "STAFF",
      },
    }),
    prisma.user.create({
      data: {
        username: "staff6",
        email: "staff6@example.com",
        password: hashedPassword,
        fullName: "Nurul Fitri",
        role: "STAFF",
      },
    }),
    prisma.user.create({
      data: {
        username: "staff7",
        email: "staff7@example.com",
        password: hashedPassword,
        fullName: "Yusuf Rahman",
        role: "STAFF",
      },
    }),
  ]);

  console.log(`✓ Created ${users.length} users`);

  // Create Items (20 items)
  console.log("📦 Creating items...");
  const items = await Promise.all([
    // Elektronik
    prisma.item.create({
      data: {
        itemCode: "ELK-001",
        itemName: "Laptop Dell Inspiron 15",
        category: "Elektronik",
        quantity: 3,
        condition: "BAIK",
        status: "TERSEDIA",
        location: "Ruang IT",
        description: "Laptop untuk penggunaan office umum",
        price: 12000000,
      },
    }),
    prisma.item.create({
      data: {
        itemCode: "ELK-002",
        itemName: "Desktop PC Lenovo",
        category: "Elektronik",
        quantity: 5,
        condition: "BAIK",
        status: "TERSEDIA",
        location: "Lab Komputer",
        description: "Desktop untuk workstation",
        price: 8000000,
      },
    }),
    prisma.item.create({
      data: {
        itemCode: "ELK-003",
        itemName: "Monitor Samsung 24 inch",
        category: "Elektronik",
        quantity: 8,
        condition: "BAIK",
        status: "TERSEDIA",
        location: "Lab Komputer",
        description: "Monitor untuk workstation",
        price: 2500000,
      },
    }),
    prisma.item.create({
      data: {
        itemCode: "ELK-004",
        itemName: "Printer HP LaserJet",
        category: "Elektronik",
        quantity: 2,
        condition: "RUSAK",
        status: "MAINTENANCE",
        location: "Ruang Kantor",
        description: "Printer untuk dokumen bisnis",
        price: 5000000,
      },
    }),
    prisma.item.create({
      data: {
        itemCode: "ELK-005",
        itemName: "Router Wifi TP-Link",
        category: "Elektronik",
        quantity: 4,
        condition: "BAIK",
        status: "TERSEDIA",
        location: "Ruang IT",
        description: "Router untuk koneksi network",
        price: 800000,
      },
    }),
    // Furniture
    prisma.item.create({
      data: {
        itemCode: "FRN-001",
        itemName: "Meja Kerja Kayu",
        category: "Furniture",
        quantity: 10,
        condition: "BAIK",
        status: "TERSEDIA",
        location: "Ruang Kantor",
        description: "Meja kerja standar",
        price: 1500000,
      },
    }),
    prisma.item.create({
      data: {
        itemCode: "FRN-002",
        itemName: "Kursi Kantor Ergonomis",
        category: "Furniture",
        quantity: 15,
        condition: "BAIK",
        status: "DIPINJAM",
        location: "Ruang Kantor",
        description: "Kursi dengan sokongan punggung",
        price: 2000000,
      },
    }),
    prisma.item.create({
      data: {
        itemCode: "FRN-003",
        itemName: "Lemari Arsip Besi",
        category: "Furniture",
        quantity: 6,
        condition: "BAIK",
        status: "TERSEDIA",
        location: "Ruang Arsip",
        description: "Lemari untuk menyimpan dokumen",
        price: 3000000,
      },
    }),
    prisma.item.create({
      data: {
        itemCode: "FRN-004",
        itemName: "Rak Buku Kayu",
        category: "Furniture",
        quantity: 8,
        condition: "BAIK",
        status: "TERSEDIA",
        location: "Perpustakaan",
        description: "Rak untuk menyimpan buku",
        price: 800000,
      },
    }),
    prisma.item.create({
      data: {
        itemCode: "FRN-005",
        itemName: "Meja Meeting Besar",
        category: "Furniture",
        quantity: 2,
        condition: "BAIK",
        status: "TERSEDIA",
        location: "Ruang Meeting",
        description: "Meja untuk rapat",
        price: 5000000,
      },
    }),
    // Presentasi
    prisma.item.create({
      data: {
        itemCode: "PRE-001",
        itemName: "Proyektor Epson",
        category: "Presentasi",
        quantity: 3,
        condition: "BAIK",
        status: "TERSEDIA",
        location: "Ruang Meeting",
        description: "Proyektor untuk presentasi",
        price: 4000000,
      },
    }),
    prisma.item.create({
      data: {
        itemCode: "PRE-002",
        itemName: "Whiteboard Magnetic",
        category: "Presentasi",
        quantity: 12,
        condition: "BAIK",
        status: "TERSEDIA",
        location: "Ruang Kelas",
        description: "Papan tulis untuk presentasi",
        price: 500000,
      },
    }),
    prisma.item.create({
      data: {
        itemCode: "PRE-003",
        itemName: "Pointer Laser",
        category: "Presentasi",
        quantity: 5,
        condition: "BAIK",
        status: "TERSEDIA",
        location: "Ruang Meeting",
        description: "Pointer untuk presentasi",
        price: 300000,
      },
    }),
    prisma.item.create({
      data: {
        itemCode: "PRE-004",
        itemName: "Screen Projector Manual",
        category: "Presentasi",
        quantity: 2,
        condition: "BAIK",
        status: "TERSEDIA",
        location: "Ruang Meeting",
        description: "Layar untuk proyektor",
        price: 2000000,
      },
    }),
    prisma.item.create({
      data: {
        itemCode: "PRE-005",
        itemName: "Speaker Bluetooth",
        category: "Presentasi",
        quantity: 6,
        condition: "BAIK",
        status: "TERSEDIA",
        location: "Ruang Meeting",
        description: "Speaker untuk audio presentation",
        price: 1500000,
      },
    }),
  ]);

  console.log(`✓ Created ${items.length} items`);

  // Create Loans
  console.log("🔄 Creating loans...");
  const loans = await Promise.all([
    prisma.loan.create({
      data: {
        userId: users[3].id,
        itemId: items[6].id,
        quantity: 1,
        loanDate: new Date("2025-05-01"),
        dueDate: new Date("2025-05-15"),
        status: "APPROVED",
        approvedAt: new Date("2025-05-02"),
        approvedBy: users[1].id,
      },
    }),
    prisma.loan.create({
      data: {
        userId: users[4].id,
        itemId: items[0].id,
        quantity: 1,
        loanDate: new Date("2025-05-03"),
        dueDate: new Date("2025-05-20"),
        status: "APPROVED",
        approvedAt: new Date("2025-05-04"),
        approvedBy: users[2].id,
      },
    }),
    prisma.loan.create({
      data: {
        userId: users[5].id,
        itemId: items[10].id,
        quantity: 2,
        loanDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "PENDING",
      },
    }),
    prisma.loan.create({
      data: {
        userId: users[6].id,
        itemId: items[1].id,
        quantity: 1,
        loanDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: "PENDING",
      },
    }),
    prisma.loan.create({
      data: {
        userId: users[3].id,
        itemId: items[5].id,
        quantity: 1,
        loanDate: new Date("2025-04-20"),
        dueDate: new Date("2025-05-10"),
        returnDate: new Date("2025-05-10"),
        status: "RETURNED",
        approvedAt: new Date("2025-04-21"),
        approvedBy: users[1].id,
      },
    }),
  ]);

  console.log(`✓ Created ${loans.length} loans`);

  // Create Activity Logs
  console.log("📝 Creating activity logs...");
  await Promise.all([
    prisma.log.create({
      data: {
        userId: users[0].id,
        activity: "CREATE_ITEM",
        details: `Created item ${items[0].itemName}`,
      },
    }),
    prisma.log.create({
      data: {
        userId: users[1].id,
        activity: "APPROVE_LOAN",
        details: `Approved loan from ${users[3].fullName}`,
      },
    }),
    prisma.log.create({
      data: {
        userId: users[3].id,
        activity: "REQUEST_LOAN",
        details: `Requested loan for ${items[0].itemName}`,
      },
    }),
  ]);

  console.log("✓ Created activity logs");
  console.log("✅ Seeding completed successfully!");
  console.log("\n📝 Test Credentials:");
  console.log("  Admin: admin / password123");
  console.log("  Petugas: petugas1 / password123");
  console.log("  Staff: staff1 / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
