import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware untuk mencatat aktivitas user
export const logActivity = async (req, res, next) => {
  // Capture response untuk logging
  const originalSend = res.send;

  res.send = function (data) {
    // Log aktivitas
    const userId = req.session?.userId || req.user?.userId;
    const activity = getActivityName(req);

    if (userId && activity && shouldLogActivity(req)) {
      prisma.log
        .create({
          data: {
            userId,
            activity,
            details: `${req.method} ${req.path}`,
            ipAddress: req.ip,
            userAgent: req.get("user-agent"),
          },
        })
        .catch((err) => {
          console.error("Error logging activity:", err);
        });
    }

    return originalSend.call(this, data);
  };

  next();
};

// Menentukan nama aktivitas berdasarkan route
const getActivityName = (req) => {
  const { method, path } = req;

  if (path.includes("/auth/login")) return "LOGIN";
  if (path.includes("/auth/logout")) return "LOGOUT";
  if (path.includes("/auth/register")) return "REGISTER";

  if (path.includes("/items") && method === "POST") return "CREATE_ITEM";
  if (path.includes("/items") && method === "PUT") return "EDIT_ITEM";
  if (path.includes("/items") && method === "DELETE") return "DELETE_ITEM";
  if (path.includes("/items") && method === "GET") return "VIEW_ITEM";

  if (path.includes("/loans") && method === "POST") return "REQUEST_LOAN";
  if (path.includes("/loans/approve")) return "APPROVE_LOAN";
  if (path.includes("/loans/reject")) return "REJECT_LOAN";
  if (path.includes("/loans/return")) return "RETURN_ITEM";

  if (path.includes("/reports")) return "GENERATE_REPORT";

  return null;
};

// Tentukan aktivitas mana yang perlu dicatat
const shouldLogActivity = (req) => {
  const importantPaths = ["/auth", "/items", "/loans", "/reports"];

  return importantPaths.some((path) => req.path.includes(path));
};
