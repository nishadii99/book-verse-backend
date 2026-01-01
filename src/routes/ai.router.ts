// src/routes/ai.router.ts
import { Router } from "express";
import { generateContent } from "../controllers/ai.controller";

const router = Router();

// GET /api/v1/:userId
// router.get("/:userId", recommendBooks);
router.post("/search", generateContent);
export default router;
