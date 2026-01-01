// Minimal IUSER interface used by the tokens utilities
interface IUSER {
  _id: { toString(): string } | string;
  roles?: string[];
}

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// -----------------------
// ACCESS TOKEN
// -----------------------
const JWT_SECRET = process.env.JWT_SECRET as string;

export const signAccessToken = (user: IUSER): string => {
  return jwt.sign(
    {
      sub: user._id.toString(),     // subject = user id
      roles: user.roles             // roles added for RBAC
    },
    JWT_SECRET,
    {
      expiresIn: "30m"              // 30 minutes
    }
  );
};

// -----------------------
// REFRESH TOKEN
// -----------------------
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const signRefreshToken = (user: IUSER): string => {
  return jwt.sign(
    {
      sub: user._id.toString()
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: "7d"               // 7 days refresh validity
    }
  );
};
