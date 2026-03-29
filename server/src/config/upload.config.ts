import fs from "fs";
import path from "path";
import multer from "multer";
import type { Request } from "express";

const uploadDir = path.join(process.cwd(), "uploads", "resumes");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req: Request, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: Request, file, cb) => {
    const userId = req.user?.userId ?? "anon";
    const ext = path.extname(file.originalname) || ".pdf";
    cb(null, `${userId}-${Date.now()}${ext}`);
  },
});

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function resumeExtensionOk(originalname: string): boolean {
  const ext = path.extname(originalname).toLowerCase();
  return ext === ".pdf" || ext === ".doc" || ext === ".docx";
}

export const resumeUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    // Exact MIME match (most browsers)
    if (ALLOWED_MIME.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    // Windows / some browsers send PDF as octet-stream, or omit MIME — trust extension
    const looseMime =
      file.mimetype === "application/octet-stream" || !file.mimetype;
    if (looseMime && resumeExtensionOk(file.originalname)) {
      cb(null, true);
      return;
    }
    cb(new Error("Only PDF or Word documents are allowed"));
  },
});
