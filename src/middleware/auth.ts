import  { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Interfaces -----------------------------------

export interface AuthRequest extends Request {
  user?: {
    sub: string;
    roles?: string[];
    iat?: number;
    exp?: number;
  };
}

// Secrets -------------------------------------

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

// ----------------------------------------------------------
// 🔐 1. Authenticate Access Token
// ----------------------------------------------------------
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  // Expect: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthRequest["user"];

    req.user = payload; // attach decoded payload
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};

// ----------------------------------------------------------
// 🔐 2. Role-based Authorization (ADMIN / USER / etc.)
// ----------------------------------------------------------
export const authorize =
  (...requiredRoles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userRoles = req.user.roles || [];

    const isAllowed = requiredRoles.some((role) =>
      userRoles.includes(role)
    );

    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        message: "Forbidden – You do not have permission",
      });
    }

    next();
  };

// ----------------------------------------------------------
// 🔁 3. Refresh Token Validator (Optional)
// ----------------------------------------------------------
export const validateRefreshToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh token missing",
    });
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET
    ) as AuthRequest["user"];

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};
