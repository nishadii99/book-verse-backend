import { Router } from "express";
import {
  getMyProfile,
  login,
  refreshToken,
  registerAdmin,
  registerUser,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { Role } from "../models/user.model";

const router = Router();



// Register normal BookVerse user
router.post("/register", registerUser);

// Login
router.post("/login", login);

// Refresh token
router.post("/refresh", refreshToken);


// Create admin (Only admin can create new admins)
router.post(
  "/admin/register",
  authenticate,
  requireRole([Role.ADMIN]),
  registerAdmin
);



// Get logged user profile (User or Admin)
router.get("/me", authenticate, getMyProfile);

export default router;
