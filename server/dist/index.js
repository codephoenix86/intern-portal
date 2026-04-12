import app from "./app.js";
import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";
const startServer = async () => {
    try {
        const startedAt = new Date();
        console.log("========================================");
        console.log("Backend starting...");
        console.log(`Env: ${ENV.NODE_ENV}`);
        console.log(`Port: ${ENV.PORT}`);
        console.log(`Client URL: ${ENV.CLIENT_URL}`);
        console.log(`Health: http://localhost:${ENV.PORT}/health`);
        console.log("========================================");
        // Listen immediately so OAuth and health checks work even if MongoDB is slow/unreachable.
        // DB-dependent routes still need a successful connection (connect runs in background).
        app.listen(ENV.PORT, () => {
            const uptimeMs = Date.now() - startedAt.getTime();
            console.log("Server ready.");
            console.log(`Listening: http://localhost:${ENV.PORT}`);
            console.log(`Uptime (boot): ${uptimeMs}ms`);
        });
        void connectDB();
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});
process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    process.exit(1);
});
startServer();
//# sourceMappingURL=index.js.map