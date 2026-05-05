# Inventory Management System (IMS)

Sistem Manajemen Inventaris Peralatan Kantor berbasis JavaScript dengan stack Node.js, Express.js, MySQL, dan Prisma ORM.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Spesifikasi Teknologi](#spesifikasi-teknologi)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Struktur Folder](#struktur-folder)
- [Role & Permission](#role--permission)

## ✨ Fitur Utama

### 1. Manajemen Barang

- ✅ CRUD Barang (Tambah, Baca, Ubah, Hapus)
- ✅ Pencarian dan Filter Barang
- ✅ Tracking Status Barang (Tersedia, Dipinjam, Rusak)
- ✅ Kategorisasi Barang
- ✅ Kelola Jumlah dan Kondisi Barang

### 2. Sistem Peminjaman

- ✅ Request Peminjaman Barang
- ✅ Approval/Rejection System
- ✅ Tracking Status Peminjaman
- ✅ Pengembalian Barang
- ✅ Tracking Keterlambatan (Overdue Items)

### 3. Status Barang

- ✅ Tersedia
- ✅ Dipinjam
- ✅ Rusak/Maintenance

### 4. Laporan & Analisis

- ✅ Dashboard dengan Statistik
- ✅ Laporan Inventaris (Tabel & Grafik)
- ✅ Laporan Peminjaman
- ✅ Laporan Log Aktivitas
- ✅ Chart.js Visualisasi
- ✅ Export Laporan ke CSV

### 5. Activity Logging

- ✅ Pencatatan Semua Aktivitas User
- ✅ Login/Logout Tracking
- ✅ CRUD Operations Logging
- ✅ Timestamp & IP Address Recording

## 🛠 Spesifikasi Teknologi

### Backend

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js v4.18
- **Database**: MySQL 8.0+
- **ORM**: Prisma v5.8
- **Authentication**: JWT + Express Session
- **Password Hashing**: bcryptjs

### Frontend

- **Template Engine**: EJS
- **CSS Framework**: Tailwind CSS v3
- **Charts**: Chart.js v4
- **HTTP Client**: Fetch API

### Testing & Tools

- **Testing Framework**: Jest v29
- **HTTP Testing**: Supertest v6
- **Logging**: Morgan
- **Environment Variables**: dotenv
- **CORS**: cors middleware

## 📦 Instalasi

### 1. Clone atau Download Project

```bash
cd Semester\ 6/Sertifikasi/inventory-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit file `.env`:

```env
DATABASE_URL="mysql://username:password@localhost:3306/inventory_db"
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
SESSION_SECRET=your_session_secret_key_here
```

### 4. Setup Database

```bash
# Buat database MySQL
mysql -u root -p
> CREATE DATABASE inventory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> EXIT;
```

### 5. Jalankan Prisma Migration

```bash
npx prisma migrate dev --name init
```

### 6. Seed Database dengan Dummy Data

```bash
npm run seed
```

## 🚀 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Server akan berjalan di: `http://localhost:3000`

### Production Mode

```bash
npm start
```

### Akses Aplikasi

- **URL**: http://localhost:3000
- **Login Page**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard

## 🔐 Test Credentials

Gunakan kredensial berikut untuk login:

| Role    | Username | Password    |
| ------- | -------- | ----------- |
| Admin   | admin    | password123 |
| Petugas | petugas1 | password123 |
| Staff   | staff1   | password123 |

## 🗄️ Database Setup

### Schema Database

Database terdiri dari 4 tabel utama:

#### 1. **users** - Tabel User

```
- id (INT, PK)
- username (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, hashed)
- fullName (VARCHAR)
- role (ENUM: STAFF, PETUGAS_INVENTARIS, ADMIN)
- isActive (BOOLEAN)
- createdAt, updatedAt (TIMESTAMP)
```

#### 2. **items** - Tabel Barang

```
- id (INT, PK)
- itemCode (VARCHAR, UNIQUE)
- itemName (VARCHAR)
- category (VARCHAR)
- quantity (INT)
- condition (ENUM: BAIK, RUSAK)
- status (ENUM: TERSEDIA, DIPINJAM, MAINTENANCE)
- location (VARCHAR)
- description (TEXT)
- purchaseDate (DATE)
- price (DECIMAL)
- createdAt, updatedAt (TIMESTAMP)
```

#### 3. **loans** - Tabel Peminjaman

```
- id (INT, PK)
- userId (INT, FK)
- itemId (INT, FK)
- loanDate (DATETIME)
- dueDate (DATETIME)
- returnDate (DATETIME, nullable)
- quantity (INT)
- status (ENUM: PENDING, APPROVED, REJECTED, RETURNED)
- notes (TEXT)
- approvedAt (DATETIME, nullable)
- approvedBy (INT, FK, nullable)
- rejectionReason (TEXT)
- createdAt, updatedAt (TIMESTAMP)
```

#### 4. **logs** - Tabel Activity Logs

```
- id (INT, PK)
- userId (INT, FK, nullable)
- activity (VARCHAR)
- details (TEXT)
- ipAddress (VARCHAR)
- userAgent (TEXT)
- createdAt (TIMESTAMP)
```

## 👥 Role & Permission

### 1. **Staff (User)**

**Permissions:**

- Melihat daftar barang
- Mencari barang
- Mengajukan peminjaman barang
- Melihat status peminjaman pribadi
- Mengembalikan barang yang dipinjam

**Accessible Routes:**

- `GET /api/items`
- `GET /api/items/search`
- `GET /api/items/available`
- `GET /api/items/:id`
- `POST /api/loans` (Create request)
- `GET /api/loans/user/:userId`
- `POST /api/loans/:id/return`

### 2. **Petugas Inventaris**

**Permissions:**

- CRUD Barang (Create, Read, Update, Delete)
- Approve/Reject Peminjaman
- Update Status Barang
- Lihat Laporan Inventaris
- Lihat Log Aktivitas

**Accessible Routes:**

- `POST /api/items` (Create)
- `PUT /api/items/:id` (Update)
- `DELETE /api/items/:id` (Delete)
- `GET /api/items` (All items)
- `POST /api/loans/:id/approve`
- `POST /api/loans/:id/reject`
- `GET /api/loans/pending`
- `GET /api/reports/inventory`
- `GET /api/reports/loans`

### 3. **Admin**

**Permissions:**

- Semua permission
- Kelola User (CRUD)
- Lihat Log Aktivitas Semua User
- Lihat Dashboard & Laporan Lengkap
- Export Laporan

**Accessible Routes:**

- All routes

## 📡 API Endpoints

### Authentication Routes

```
POST   /api/auth/register          - Register user baru
POST   /api/auth/login             - Login & dapatkan token
POST   /api/auth/logout            - Logout
GET    /api/auth/me                - Dapatkan data user saat ini
POST   /api/auth/refresh           - Refresh token
```

### Item Routes

```
GET    /api/items                  - Dapatkan semua barang (dengan pagination)
GET    /api/items/search           - Cari barang
GET    /api/items/available        - Dapatkan barang tersedia
GET    /api/items/damaged          - Dapatkan barang rusak
GET    /api/items/statistics       - Statistik barang
GET    /api/items/:id              - Dapatkan barang by ID
POST   /api/items                  - Buat barang baru (Petugas/Admin)
PUT    /api/items/:id              - Update barang (Petugas/Admin)
DELETE /api/items/:id              - Hapus barang (Petugas/Admin)
```

### Loan Routes

```
GET    /api/loans                  - Dapatkan semua peminjaman
GET    /api/loans/:id              - Dapatkan peminjaman by ID
GET    /api/loans/pending          - Dapatkan peminjaman pending (Petugas/Admin)
GET    /api/loans/overdue          - Dapatkan peminjaman terlewat
GET    /api/loans/user/:userId     - Dapatkan peminjaman user
GET    /api/loans/statistics       - Statistik peminjaman
POST   /api/loans                  - Buat request peminjaman
POST   /api/loans/:id/approve      - Approve peminjaman (Petugas/Admin)
POST   /api/loans/:id/reject       - Reject peminjaman (Petugas/Admin)
POST   /api/loans/:id/return       - Return barang
```

### User Routes

```
GET    /api/users                  - Dapatkan semua user (Admin/Petugas)
GET    /api/users/:id              - Dapatkan user by ID
GET    /api/users/search           - Cari user (Admin/Petugas)
GET    /api/users/statistics       - Statistik user (Admin)
POST   /api/users                  - Buat user baru (Admin)
PUT    /api/users/:id              - Update user (Admin)
DELETE /api/users/:id              - Hapus user (Admin)
```

### Report Routes

```
GET    /api/reports/dashboard/stats - Dashboard statistics
GET    /api/reports/inventory       - Laporan inventaris (Petugas/Admin)
GET    /api/reports/loans           - Laporan peminjaman (Petugas/Admin)
GET    /api/reports/activities      - Laporan aktivitas (Admin)
GET    /api/reports/user/:userId    - Laporan aktivitas user (Admin/Petugas)
GET    /api/reports/export          - Export laporan ke CSV (Admin/Petugas)
```

## 📊 Contoh Request/Response

### 1. Register User

**Request:**

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "fullName": "New User",
  "role": "STAFF"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "id": 11,
    "username": "newuser",
    "email": "newuser@example.com",
    "fullName": "New User"
  },
  "timestamp": "2024-02-12T10:30:00.000Z"
}
```

### 2. Login

**Request:**

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "fullName": "Admin User",
      "role": "ADMIN"
    }
  },
  "timestamp": "2024-02-12T10:30:00.000Z"
}
```

### 3. Buat Barang Baru

**Request:**

```bash
POST /api/items
Content-Type: application/json
Authorization: Bearer {token}

{
  "itemCode": "KMP-010",
  "itemName": "Monitor LG 27 inch",
  "category": "Elektronik",
  "quantity": 5,
  "location": "Ruang IT",
  "description": "Monitor untuk workstation",
  "price": 3500000
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Barang berhasil ditambahkan",
  "data": {
    "id": 21,
    "itemCode": "KMP-010",
    "itemName": "Monitor LG 27 inch",
    "category": "Elektronik",
    "quantity": 5,
    "condition": "BAIK",
    "status": "TERSEDIA",
    "location": "Ruang IT",
    "price": "3500000.00",
    "createdAt": "2024-02-12T10:35:00.000Z"
  },
  "timestamp": "2024-02-12T10:35:00.000Z"
}
```

### 4. Request Peminjaman

**Request:**

```bash
POST /api/loans
Content-Type: application/json
Authorization: Bearer {token}

{
  "itemId": 1,
  "dueDate": "2024-02-25",
  "quantity": 1,
  "notes": "Untuk meeting hari Sabtu"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Permintaan peminjaman berhasil dibuat",
  "data": {
    "id": 11,
    "userId": 4,
    "itemId": 1,
    "loanDate": "2024-02-12T10:40:00.000Z",
    "dueDate": "2024-02-25T00:00:00.000Z",
    "quantity": 1,
    "status": "PENDING",
    "notes": "Untuk meeting hari Sabtu",
    "createdAt": "2024-02-12T10:40:00.000Z"
  },
  "timestamp": "2024-02-12T10:40:00.000Z"
}
```

### 5. Approve Peminjaman

**Request:**

```bash
POST /api/loans/11/approve
Authorization: Bearer {adminToken}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Peminjaman berhasil disetujui",
  "data": {
    "id": 11,
    "status": "APPROVED",
    "approvedAt": "2024-02-12T10:45:00.000Z",
    "approvedBy": 1
  },
  "timestamp": "2024-02-12T10:45:00.000Z"
}
```

### 6. Get Dashboard Statistics

**Request:**

```bash
GET /api/reports/dashboard/stats
Authorization: Bearer {token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Statistik dashboard berhasil diambil",
  "data": {
    "items": {
      "total": 20,
      "available": 15,
      "borrowed": 3,
      "damaged": 2,
      "byCategory": {
        "Elektronik": 8,
        "Furniture": 7,
        "Presentasi": 5
      }
    },
    "loans": {
      "total": 10,
      "pending": 2,
      "approved": 5,
      "rejected": 1,
      "returned": 2
    },
    "users": {
      "total": 10,
      "byRole": {
        "STAFF": 7,
        "PETUGAS_INVENTARIS": 2,
        "ADMIN": 1
      }
    },
    "recentLoans": [...],
    "overdueLoans": 0
  },
  "timestamp": "2024-02-12T10:50:00.000Z"
}
```

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Specific Test File

```bash
npm test -- tests/userService.test.js
```

### Test Files

- `tests/api.test.js` - API endpoint testing
- `tests/userService.test.js` - User service testing
- `tests/itemService.test.js` - Item service testing
- `tests/loanService.test.js` - Loan service testing

## 📁 Struktur Folder

```
inventory-management-system/
│
├── src/
│   ├── controllers/          # Controllers untuk business logic
│   │   ├── authController.js
│   │   ├── itemController.js
│   │   ├── loanController.js
│   │   ├── userController.js
│   │   └── reportController.js
│   │
│   ├── services/             # Business logic layer
│   │   ├── userService.js
│   │   ├── itemService.js
│   │   ├── loanService.js
│   │   └── reportService.js
│   │
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── loanRoutes.js
│   │   ├── userRoutes.js
│   │   └── reportRoutes.js
│   │
│   ├── middlewares/          # Express middlewares
│   │   ├── authMiddleware.js    # JWT & role-based auth
│   │   ├── errorHandler.js      # Global error handling
│   │   └── activityLogger.js    # Activity logging
│   │
│   ├── utils/                # Utility functions
│   │   └── helpers.js        # JWT, crypto, formatters, validators
│   │
│   └── models/               # Database models (if needed)
│
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.js               # Seeder dengan dummy data
│
├── views/                    # EJS templates
│   ├── index.ejs            # Home page
│   ├── login.ejs            # Login page
│   ├── layout.ejs           # Main layout
│   └── dashboard/
│       └── index.ejs        # Dashboard
│
├── public/                   # Static files
│   ├── css/
│   └── js/
│
├── tests/                    # Unit & integration tests
│   ├── api.test.js
│   ├── userService.test.js
│   ├── itemService.test.js
│   └── loanService.test.js
│
├── app.js                    # Express app setup
├── package.json              # Dependencies
├── .env.example             # Environment template
├── .gitignore               # Git ignore
├── jest.config.js           # Jest configuration
└── README.md                # This file
```

## 🔑 Key Features Implementation

### 1. **Clean Architecture**

- Separation of concerns (Controllers → Services → Database)
- Repository pattern untuk data access
- Dependency injection

### 2. **Security**

- JWT authentication
- Password hashing dengan bcryptjs
- Role-based authorization
- CORS protection
- Input validation

### 3. **Performance**

- Database indexing pada frequently queried columns
- Pagination untuk large datasets
- Eager loading untuk relations
- Query optimization

### 4. **Error Handling**

- Global error handler middleware
- Custom error classes
- Consistent error response format
- Detailed logging

### 5. **Logging & Monitoring**

- Activity logging untuk semua operasi
- Morgan HTTP logger
- Console.time untuk performance profiling
- Error stack traces

## 📝 Database Relationships

```
users (1) ──── (N) loans ──── (1) items
users (1) ──── (N) logs
loans (1) ──── (1) users (approver)
```

## 🎯 Fitur Bonus

- ✅ JWT Authentication
- ✅ Role-based Authorization Middleware
- ✅ Activity Logging System
- ✅ Real-time Statistics Dashboard
- ✅ CSV Export Functionality
- ✅ Performance Monitoring
- ✅ Comprehensive Error Handling
- ✅ API Documentation
- ✅ Unit Testing Suite

## 📋 Checklist Fitur

- [x] Manajemen Barang (CRUD)
- [x] Sistem Peminjaman
- [x] Status Tracking
- [x] Role-based System
- [x] Laporan dengan Chart.js
- [x] Activity Logging
- [x] Dashboard
- [x] API Endpoints
- [x] Unit Tests
- [x] JWT Authentication
- [x] Export CSV
- [x] Pagination & Search
- [x] Dokumentasi

## 🚀 Development Roadmap

### Phase 1 (Completed)

- [x] Database setup & schema
- [x] Authentication & Authorization
- [x] CRUD Barang
- [x] CRUD Peminjaman
- [x] Activity Logging
- [x] API Documentation

### Phase 2 (Optional Enhancements)

- [ ] Email notifications untuk approval
- [ ] SMS reminders untuk overdue items
- [ ] Barcode scanning untuk barang
- [ ] QR code generation
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (Socket.io)

## 🛠 Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution**: Pastikan MySQL server running dan DATABASE_URL di .env benar

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**: Ubah PORT di .env atau kill process yang menggunakan port 3000

### Prisma Migration Error

```
npx prisma migrate dev --name init
```

### Clear Database & Reseed

```bash
npx prisma db push --skip-generate
npm run seed
```

## 📚 References

- [Node.js Documentation](https://nodejs.org/)
- [Express.js Guide](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT.io](https://jwt.io/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 📞 Support

Untuk pertanyaan atau issue, silakan hubungi developer atau buat issue di repository.

## 📄 License

MIT License - Free to use for educational purposes

---

**Last Updated**: February 2024
**Version**: 1.0.0
