import { NextFunction, Response } from "express";
import { Role } from "../models/user.model";
import { AuthRequest } from "./auth";

/**
 * Middleware to check if the user has at least one required role.
 *
 * Example usage:
 *  requireRole([Role.ADMIN])
 *  requireRole([Role.ADMIN, Role.CUSTOMER])
 */
export const requireRole = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {

    // No user from auth middleware → Unauthorized
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user has any of the allowed roles
    const hasRole = roles.some((role) => req.user!.roles?.includes(role) ?? false);

    if (!hasRole) {
      return res.status(403).json({
        message: `Access denied. Required roles: ${roles.join(", ")}`
      });
    }

    // Role is valid → continue
    next();
  };
};
