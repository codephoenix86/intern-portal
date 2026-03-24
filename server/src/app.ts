import express from "express";
import cookieParser from "cookie-parser";
import requestIp from "request-ip";

// Routes
import authRoutes from "./routes/auth.routes.js";

const app = express();

// ── Core Middleware ───────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestIp.mw()); // Adds req.clientIp

// ── CORS (for frontend) ─────────────────────────────
// TODO: Replace with your production origin
app.use((_req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env["CLIENT_URL"] ?? "http://localhost:8080",
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (_req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

// ── API Routes ───────────────────────────────────────
app.use("/api/auth", authRoutes);

// ── Health Check ─────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "InternPortal API is running ",
    timestamp: new Date().toISOString(),
  });
});

// ── 404 Handler ──────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ── Global Error Handler ─────────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  },
);

export default app;
