import fs from "fs";
import path from "path";
import multer from "multer";
const uploadDir = path.join(process.cwd(), "uploads", "resumes");
fs.mkdirSync(uploadDir, { recursive: true });
const avatarDir = path.join(process.cwd(), "uploads", "avatars");
fs.mkdirSync(avatarDir, { recursive: true });
const courseContentDir = path.join(process.cwd(), "uploads", "course-content");
fs.mkdirSync(courseContentDir, { recursive: true });
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const userId = req.user?.userId ?? "anon";
        const ext = path.extname(file.originalname) || ".pdf";
        cb(null, `${userId}-${Date.now()}${ext}`);
    },
});
export const resumeUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
            return;
        }
        cb(new Error("Only PDF or Word documents are allowed"));
    },
});
const avatarStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, avatarDir);
    },
    filename: (req, file, cb) => {
        const userId = req.user?.userId ?? "anon";
        const extFromMime = file.mimetype === "image/png"
            ? ".png"
            : file.mimetype === "image/webp"
                ? ".webp"
                : ".jpg";
        cb(null, `${userId}-${Date.now()}${extFromMime}`);
    },
});
export const avatarUpload = multer({
    storage: avatarStorage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
            return;
        }
        cb(new Error("Only JPG, PNG, or WEBP images are allowed"));
    },
});
const courseContentStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, courseContentDir);
    },
    filename: (req, file, cb) => {
        const userId = req.user?.userId ?? "anon";
        const ext = path.extname(file.originalname) || ".bin";
        cb(null, `${userId}-${Date.now()}${ext}`);
    },
});
export const courseContentUpload = multer({
    storage: courseContentStorage,
    limits: { fileSize: 80 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = [
            "application/pdf",
            "video/mp4",
            "video/webm",
            "application/octet-stream",
        ];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
            return;
        }
        cb(new Error("Only PDF, MP4, or WEBM video files are allowed"));
    },
});
//# sourceMappingURL=upload.config.js.map