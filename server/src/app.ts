import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import requestIp from "request-ip";

// Routes
import authRoutes from "./routes/auth.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import studentRoutes from "./routes/student.routes.js";
import recruiterRoutes from "./routes/recruiter.routes.js";

const app = express();

// ── Core Middleware ───────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestIp.mw());

// ── CORS ─────────────────────────────────────────────
app.use((_req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env["CLIENT_URL"] ?? "http://localhost:5173",
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

// ── Static uploads (resume files) ───────────────────
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads")),
);

// ── API Routes ───────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/recruiter", recruiterRoutes);

// ── Health Check ─────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ success: true, message: "InternPortal API is running 🚀" });
});

// ── 404 + Error Handlers ─────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  },
);

export default app;
