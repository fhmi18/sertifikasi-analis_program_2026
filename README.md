# Inventory Management System (IMS)

Sistem Manajemen Inventaris Peralatan Kantor berbasis JavaScript dengan stack Node.js, Express.js, MySQL, dan Prisma ORM. Dilengkapi dengan fitur manajemen barang, peminjaman, approval workflow, dan dashboard analytics.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Bug Fixes & Improvements](#bug-fixes--improvements)
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
- ✅ Pencarian dan Filter Barang berdasarkan kategori dan kondisi
- ✅ Tracking Status Barang (Tersedia, Dipinjam, Rusak/Maintenance)
- ✅ Kategorisasi Barang (Elektronik, Furniture, Presentasi, dll)
- ✅ Kelola Jumlah dan Kondisi Barang
- ✅ Role-based access control (PETUGAS_INVENTARIS dan ADMIN hanya)

### 2. Sistem Peminjaman

- ✅ Request Peminjaman Barang oleh Staff
- ✅ Approval/Rejection System dengan workflow
- ✅ Approval modal dengan reason input untuk rejection
- ✅ Tracking Status Peminjaman (PENDING, APPROVED, REJECTED, RETURNED)
- ✅ Pengembalian Barang dengan kondisi tracking (BAIK/RUSAK)
- ✅ Return modal untuk condition selection
- ✅ Tracking Keterlambatan (Overdue Items)
- ✅ Delete pending loan functionality
- ✅ Rejection reason tracking dan display

### 3. Status Barang

- ✅ Tersedia - Item dalam kondisi baik dan siap dipinjam
- ✅ Dipinjam - Item sedang dipinjam oleh user
- ✅ Rusak/Maintenance - Item tidak dapat dipinjam
- ✅ Automatic quantity adjustment saat approval/return

### 4. Laporan & Analisis

- ✅ Dashboard dengan Statistik real-time (Total barang, Tersedia, Dipinjam, Rusak)
- ✅ Laporan Inventaris (Tabel & Grafik distribusi)
- ✅ Laporan Peminjaman dengan status breakdown
- ✅ Laporan Log Aktivitas untuk audit trail
- ✅ Chart.js Visualisasi (Pie chart, Bar chart)
- ✅ Export Laporan ke CSV format
- ✅ User statistics dan activity tracking

### 5. Activity Logging

- ✅ Pencatatan Semua Aktivitas User (Login, CRUD, Approval)
- ✅ Login/Logout Tracking dengan timestamp
- ✅ CRUD Operations Logging untuk items dan users
- ✅ Timestamp & IP Address Recording
- ✅ Activity filtering dan search capabilities

### 6. User & Authentication

- ✅ User Registration dengan form validation
- ✅ Login/Logout dengan JWT token
- ✅ Password hashing dengan bcryptjs
- ✅ JWT token refresh mechanism
- ✅ Session management
- ✅ Role-based user management (Admin only)

### 7. User Interface Improvements

- ✅ Responsive design dengan Tailwind CSS
- ✅ Modal dialogs untuk approve/reject/return actions
- ✅ Toast notifications untuk success/error messages
- ✅ Loading states dan spinners
- ✅ Authorization checks pada client-side dengan auth.js utility
- ✅ Proper error handling dengan user-friendly messages
- ✅ Disabled black overlay fix setelah login/register

## 🔧 Bug Fixes & Improvements

### Fixed Issues (Sertifikasi Bugs)

| #   | Bug                                  | Status      | Solution                                                            |
| --- | ------------------------------------ | ----------- | ------------------------------------------------------------------- |
| 1   | Missing register page                | ✅ Fixed    | Created complete registration form dengan validation                |
| 2   | Staff sees admin features            | ✅ Fixed    | Added client-side RBAC checks dengan auth.js                        |
| 3   | No error messages for access denied  | ✅ Fixed    | Implemented proper error modals dengan auto-redirect                |
| 4   | Delete loan not implemented          | ✅ Fixed    | Added DELETE endpoint dengan PENDING status validation              |
| 5   | Return item broken, no notifications | ✅ Fixed    | Added return modal dengan condition selection & toast notifications |
| 6   | Rejection workflow incomplete        | ✅ Fixed    | Added reject modal dengan reason textarea                           |
| 7   | Black overlay after login/register   | ✅ Fixed    | Improved showAuthError() dengan proper cleanup                      |
| 8   | Basic confirm() popups               | ✅ Improved | Replaced dengan professional modals untuk approve/reject/return     |

### Implementation Details

- **Registration Page**: Form validation, password confirmation, role assignment
- **Delete Loan**: Service layer validation, only PENDING loans can be deleted
- **Return Item**: Condition dropdown (BAIK/RUSAK), quantity restoration
- **Authorization Checks**: JWT decoding, role validation, UI element hiding
- **Modal System**: Event listeners, auto-redirect, backdrop click dismiss
- **Error Handling**: API response parsing, user-friendly error messages, toast notifications

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
PORT=5000
NODE_ENV=development
JWT_SECRET=Sertifikasi_Fahmi_2026_2310511079
SESSION_SECRET=Sertifikasi_Fahmi_2026_2310511079
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

Server akan berjalan di: `http://localhost:5000`

### Production Mode

```bash
npm start
```

### Akses Aplikasi

- **URL**: http://localhost:5000
- **Login Page**: http://localhost:5000/login
- **Dashboard**: http://localhost:5000/dashboard

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
POST   /api/loans/:id/reject       - Reject peminjaman dengan reason (Petugas/Admin)
POST   /api/loans/:id/return       - Return barang dengan condition tracking
DELETE /api/loans/:id              - Delete peminjaman PENDING (STAFF/Petugas/Admin)
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

### 6. Approve Peminjaman

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

### 7. Reject Peminjaman dengan Reason

**Request:**

```bash
POST /api/loans/11/reject
Content-Type: application/json
Authorization: Bearer {adminToken}

{
  "rejectionReason": "Barang sedang dalam perbaikan"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Peminjaman ditolak",
  "data": {
    "id": 11,
    "status": "REJECTED",
    "rejectionReason": "Barang sedang dalam perbaikan",
    "updatedAt": "2024-02-12T10:47:00.000Z"
  },
  "timestamp": "2024-02-12T10:47:00.000Z"
}
```

### 8. Return Barang dengan Condition

**Request:**

```bash
POST /api/loans/11/return
Content-Type: application/json
Authorization: Bearer {userToken}

{
  "condition": "BAIK"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Barang berhasil dikembalikan",
  "data": {
    "id": 11,
    "status": "RETURNED",
    "returnCondition": "BAIK",
    "returnDate": "2024-02-12T14:00:00.000Z",
    "quantity": 1
  },
  "timestamp": "2024-02-12T14:00:00.000Z"
}
```

### 9. Delete Peminjaman PENDING

**Request:**

```bash
DELETE /api/loans/11
Authorization: Bearer {userToken}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Peminjaman berhasil dihapus",
  "timestamp": "2024-02-12T10:50:00.000Z"
}
```

**Error Response (400) - Non-PENDING Loan:**

```json
{
  "success": false,
  "message": "Hanya peminjaman dengan status PENDING yang dapat dihapus",
  "timestamp": "2024-02-12T10:50:00.000Z"
}
```

### 10. Get Dashboard Statistics

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

Sistem dilengkapi dengan comprehensive test suite mencakup unit tests dan integration tests.

### Run Unit Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Test Results Summary

- **Total Test Suites**: 5 passed
- **Total Tests**: 116 passed, 0 failed
- **Code Coverage**: 80.1% statements, 85.35% lines
- **Execution Time**: ~16s

### Test Files

- `tests/api.test.js` - API endpoint testing dengan RBAC authorization
  - Authentication tests (register, login, refresh, logout)
  - Item CRUD tests dengan role-based access
  - Loan workflow tests (create, approve, reject, return, delete)
  - Authorization tests (403 Forbidden scenarios)
  - Error handling tests (404, 400 responses)

- `tests/userService.test.js` - User service business logic
  - User creation dan retrieval
  - User filtering dan pagination

- `tests/itemService.test.js` - Item service operations
  - Item CRUD operations
  - Status and condition tracking

- `tests/loanService.test.js` - Loan service dengan delete functionality
  - Loan creation dan approval
  - Delete PENDING loans functionality
  - Non-PENDING loan deletion validation
  - Return dengan quantity restoration

- `tests/integration.test.js` - End-to-end workflow testing (NEW - 410 lines)
  - User registration dan login workflow
  - Complete loan lifecycle (PENDING → APPROVED → RETURNED)
  - Authorization & access control enforcement
  - Delete pending loan workflow
  - Reject loan dengan reason workflow
  - Item visibility based on role
  - Data consistency & quantity tracking
  - Error handling scenarios (401, 403, 404)
  - Transaction validation

### Run Specific Test File

```bash
npm test -- tests/api.test.js
npm test -- tests/integration.test.js
```

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
├── views/                    # EJS templates dengan modal UI
│   ├── index.ejs            # Home page redirect
│   ├── login.ejs            # Login page dengan demo credentials
│   ├── register.ejs         # Registration page (NEW)
│   ├── layout.ejs           # Main layout dengan sidebar
│   ├── dashboard/
│   │   └── index.ejs        # Dashboard dengan statistics & charts
│   ├── items/
│   │   ├── index.ejs        # Items list dengan RBAC checks
│   │   ├── detail.ejs       # Item detail page
│   │   ├── new.ejs          # Create item form
│   │   └── edit.ejs         # Edit item form
│   ├── loans/
│   │   ├── index.ejs        # Loans list dengan approve/reject/return modals (IMPROVED)
│   │   ├── detail.ejs       # Loan detail dengan timeline & modals (IMPROVED)
│   │   └── new.ejs          # Request loan form
│   ├── reports/
│   │   └── index.ejs        # Reports dengan charts & export
│   └── users/
│       └── index.ejs        # User management (admin only)
│
├── public/                   # Static files
│   ├── css/
│   ├── js/
│   │   └── auth.js          # Client-side JWT & RBAC utility (NEW)
│   └── images/
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

## 🎯 Fitur Bonus & Improvements

### Client-side Utilities

- ✅ **auth.js** - JWT decoding dan RBAC utility
  - `decodeToken()` - Extract user data dari JWT
  - `getUserRole()` - Get current user role
  - `canManageItems()` - Check PETUGAS/ADMIN
  - `canManageUsers()` - Check ADMIN only
  - `canApproveLoans()` - Check PETUGAS/ADMIN
  - `showAuthError()` - Error modal dengan auto-redirect
  - `handleForbiddenError()` - 403 error handler

### UI/UX Enhancements

- ✅ Modal dialogs untuk approve/reject/return (professional UX)
- ✅ Toast notifications untuk feedback
- ✅ Auto-redirect setelah authorization error
- ✅ Backdrop click dismiss untuk modals
- ✅ Proper error message extraction dari API responses
- ✅ Client-side element hiding untuk unauthorized users
- ✅ Form validation dengan user-friendly messages

### Performance & Code Quality

- ✅ Clean separation of concerns (Controllers → Services → ORM)
- ✅ Comprehensive error handling dengan proper HTTP status codes
- ✅ Database indexing pada frequently queried columns
- ✅ Query optimization dengan Prisma eager loading
- ✅ Code reusability melalui service layer
- ✅ Consistent API response format
- ✅ Detailed code comments dan documentation

## 🎯 Fitur Bonus (Previously Listed)

- ✅ JWT Authentication dengan role-based authorization
- ✅ Activity Logging System untuk audit trail
- ✅ Real-time Statistics Dashboard dengan Chart.js
- ✅ CSV Export Functionality untuk reports
- ✅ Performance Monitoring dengan console.time
- ✅ Comprehensive Error Handling dengan custom messages
- ✅ API Documentation dengan request/response examples
- ✅ Unit Testing Suite dengan 116 passing tests

## 📋 Checklist Fitur & Status

### Core Features

- [✅] Manajemen Barang (CRUD)
- [✅] Sistem Peminjaman dengan Workflow
- [✅] Status Tracking (Item & Loan)
- [✅] Role-based System (3 roles)
- [✅] Dashboard dengan Analytics
- [✅] Laporan dengan Chart.js
- [✅] Activity Logging & Audit Trail
- [✅] CSV Export Functionality

### Authentication & Security

- [✅] User Registration dengan validation
- [✅] JWT Authentication
- [✅] Password hashing dengan bcryptjs
- [✅] Role-based Authorization (Server-side)
- [✅] Client-side RBAC checks (auth.js utility)
- [✅] Session management
- [✅] Token refresh mechanism

### User Interface

- [✅] Responsive design (Tailwind CSS)
- [✅] Modal dialogs untuk actions
- [✅] Toast notifications (success/error)
- [✅] Loading states & spinners
- [✅] Form validation (client & server)
- [✅] Error handling modals
- [✅] Authorization checks & UI element hiding

### Loan Management (Enhanced)

- [✅] Request peminjaman
- [✅] Approve dengan modal confirmation
- [✅] Reject dengan reason input
- [✅] Return dengan condition selection
- [✅] Delete PENDING loans
- [✅] Rejection reason tracking
- [✅] Automatic quantity adjustment

### Testing

- [✅] Unit tests (4 files)
- [✅] API endpoint tests (50+ tests)
- [✅] Integration tests (30+ tests)
- [✅] RBAC authorization tests
- [✅] Error handling tests
- [✅] Data consistency tests
- [✅] Test coverage: 80.1%

### Bug Fixes

- [✅] Missing register page
- [✅] Admin features visibility control
- [✅] Error message display
- [✅] Delete loan functionality
- [✅] Return item with notifications
- [✅] Rejection workflow
- [✅] Black overlay issue post-login

## 🚀 Development Status

### Phase 1 (✅ Completed - Sertifikasi Requirements)

**Core Features:**

- [✅] Database setup & Prisma schema
- [✅] Authentication & Authorization system
- [✅] CRUD Barang dengan RBAC
- [✅] CRUD Peminjaman dengan workflow
- [✅] Approval system dengan reason tracking
- [✅] Activity Logging untuk audit trail
- [✅] Dashboard dengan analytics
- [✅] Reports dengan Chart.js
- [✅] CSV Export functionality

**Bug Fixes & Improvements:**

- [✅] Register page implementation
- [✅] Admin features visibility control
- [✅] Error message modals dengan proper handling
- [✅] Delete PENDING loan endpoint
- [✅] Return item dengan condition tracking
- [✅] Rejection workflow dengan reason input
- [✅] Black overlay fix post-login/register
- [✅] Modal dialogs untuk approve/reject/return actions

**Testing:**

- [✅] Unit tests (userService, itemService, loanService)
- [✅] API endpoint tests (116 tests passing)
- [✅] Integration tests (30+ end-to-end workflows)
- [✅] RBAC authorization tests
- [✅] Error handling validation
- [✅] Data consistency checks

### Phase 2 (Optional Enhancements)

- [ ] Email notifications untuk approval/rejection
- [ ] SMS reminders untuk overdue items
- [ ] Barcode/QR code scanning untuk items
- [ ] Mobile app (React Native / Flutter)
- [ ] Real-time notifications (Socket.io)
- [ ] Multi-language support (i18n)
- [ ] Advanced filtering & analytics
- [ ] Batch operations support
- [ ] Payment integration (jika ada biaya rental)
- [ ] Item reservation system

## �️ Application Navigation

### Admin Role

```
Dashboard (Analytics & Reports)
├── Manajemen Barang (CRUD dengan stock control)
├── Manajemen Peminjaman (Approve/Reject/Return)
├── Manajemen User (CRUD user accounts)
├── Laporan (Inventaris, Peminjaman, Aktivitas)
└── Activity Log (Audit trail semua operasi)
```

### Petugas Inventaris Role

```
Dashboard (Statistics)
├── Manajemen Barang (CRUD dengan stock control)
├── Manajemen Peminjaman (Approve/Reject/Return)
├── Laporan (Inventaris, Peminjaman)
└── Activity Log (Own activities)
```

### Staff Role

```
Dashboard (View only)
├── Browse Barang (Lihat daftar dan detail)
├── Request Peminjaman (Create & delete PENDING)
├── My Loans (View status & return items)
└── Search (Cari barang)
```

## 🔐 Security Features

### Authentication

- Password hashing dengan bcryptjs (10 rounds)
- JWT token dengan expiry (7 days)
- Session management dengan express-session
- Token refresh mechanism
- CORS protection

### Authorization

- Server-side role validation pada setiap endpoint
- Middleware `checkRole()` untuk route protection
- Client-side RBAC checks dengan auth.js utility
- Activity logging untuk compliance & audit trail
- HTTP 403 Forbidden untuk unauthorized access

### Data Protection

- Input validation di controller level
- SQL injection prevention via Prisma ORM
- CSRF protection via session tokens
- IP address & user agent logging
- Timestamp validation (dueDate > loanDate checks)

## �🛠 Troubleshooting

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
