import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from "./src/routes/authRoutes.js";
import itemRoutes from "./src/routes/itemRoutes.js";
import loanRoutes from "./src/routes/loanRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";

// Import middlewares
import {
  errorHandler,
  notFoundHandler,
} from "./src/middlewares/errorHandler.js";
import { logActivity } from "./src/middlewares/activityLogger.js";

// Setup
const app = express();
const __dirname = process.cwd();

// Middleware
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Activity logger middleware
app.use(logActivity);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);

// Auth view routes
app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

app.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

// Dashboard routes
app.get("/", (req, res) => {
  res.render("index", { title: "Dashboard" });
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard/index", { title: "Dashboard" });
});

// Items view routes
app.get("/items", (req, res) => {
  res.render("items/index", { title: "Manajemen Item" });
});

app.get("/items/new", (req, res) => {
  res.render("items/new", { title: "Tambah Item" });
});

app.get("/items/:id/edit", (req, res) => {
  res.render("items/edit", { title: "Edit Item" });
});

// Loans view routes
app.get("/loans/new", (req, res) => {
  res.render("loans/new", { title: "Request Peminjaman" });
});

app.get("/loans/:id", (req, res) => {
  res.render("loans/detail", { title: "Detail Peminjaman" });
});

app.get("/loans", (req, res) => {
  res.render("loans/index", { title: "Manajemen Peminjaman" });
});

// Users view routes - ADMIN only
app.get("/users", (req, res) => {
  res.render("users/index", { title: "Manajemen User" });
});

// Reports view routes
app.get("/reports", (req, res) => {
  res.render("reports/index", { title: "Laporan & Analytics" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV}`);
  });
}

export default app;
