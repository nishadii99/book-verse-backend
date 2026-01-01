import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Routes
import authRouter from "./routes/auth";
import orderRouter from "./routes/order";
import cartRouter from "./routes/cart";
import aiRouter from "./routes/ai.router";

// Middlewares
import { authenticate } from "./middleware/auth";
import { requireRole } from "./middleware/role";
import bookRouter from "./routes/book";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

const app = express();

// Global Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/cart", cartRouter);


app.use("/api/v1/recommend", aiRouter);




// Sample Routes
// Public
app.get("/", (req, res) => {
  res.send("📚 BookVerse Backend Running...");
});

// Protected (any authenticated user)
// app.get("/test-user", authenticate, (req, res) => {
//   res.status(200).json({ message: "Authenticated User Access" });
// });

// Admin-only
// app.get("/test-admin", authenticate, requireRole([Role.ADMIN]), (req, res) => {
//   res.status(200).json({ message: "Admin Access Granted" });
// });


// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });


// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
