import mongoose from "mongoose";
import { ENV } from "./env.js";
const connectDB = async () => {
    if (!ENV.MONGODB_URI) {
        console.log("[db] MONGODB_URI missing. Starting server without database.");
        return;
    }
    try {
        const conn = await mongoose.connect(ENV.MONGODB_URI, {
            dbName: "internportal",
        });
        console.log(`[db] connected host=${conn.connection.host} db=${conn.connection.name}`);
    }
    catch (error) {
        console.error("[db] connection error:", error);
        process.exit(1);
    }
};
// Connection event listeners
mongoose.connection.on("disconnected", () => {
    console.log("[db] disconnected");
});
mongoose.connection.on("error", (err) => {
    console.error("[db] error:", err);
});
export default connectDB;
//# sourceMappingURL=db.js.map