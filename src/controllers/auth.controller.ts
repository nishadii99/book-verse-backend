import { Request, Response } from "express";
import { IUser, User, Role} from "../models/user.model";
import { signAccessToken, signRefreshToken } from "../utils/tokens";

// ----------------------------
// REGISTER CUSTOMER
// ----------------------------
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({
      firstname,
      lastname,
      email,
      password, // will be hashed by pre-save hook
      roles: [Role.CUSTOMER],
      // approved: Status.NONE
    });

    await user.save();

    res.status(201).json({
      message: "Customer registered successfully",
      data: { email: user.email, roles: user.roles }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------------------
// REGISTER ADMIN (protected route)
// ----------------------------
export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const admin = new User({
      firstname,
      lastname,
      email,
      password,
      roles: [Role.ADMIN],
      // approved: Status.APPROVED
    });

    await admin.save();

    res.status(201).json({
      message: "Admin registered successfully",
      data: { email: admin.email, roles: admin.roles }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------------------
// LOGIN
// ----------------------------
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }) as IUser | null;
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.status(200).json({
      message: "Login successful",
      data: {
        email: user.email,
        roles: user.roles,
        accessToken,
        refreshToken
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------------------
// GET PROFILE (Logged in user)
// ----------------------------
import { AuthRequest } from "../middleware/auth";

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.sub).select("-password") as IUser | null;
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Profile fetched",
      data: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        roles: user.roles,
        // status: user.approved
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------------------
// REFRESH TOKEN
// ----------------------------
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

    const payload: any = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const user = await User.findById(payload.sub) as IUser | null;
    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    const accessToken = signAccessToken(user);

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};
