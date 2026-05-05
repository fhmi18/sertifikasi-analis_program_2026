import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Parse DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL || "mysql://root:@localhost:3306/inventory_db");
const dbConfig = {
  host: dbUrl.hostname,
  user: dbUrl.username || "root",
  password: dbUrl.password || "",
  database: dbUrl.pathname.replace("/", ""),
  port: parseInt(dbUrl.port) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection()
  .then((connection) => {
    console.log("✓ Database connected successfully");
    connection.release();
  })
  .catch((error) => {
    console.error("✗ Database connection failed:", error.message);
    process.exit(1);
  });

export default pool;
