import express, { type Application } from "express";

// App configs
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

// API checkpoints
app.get("/", (req, res) => {
  res.json({ message: "Server is running! " });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
