import dotenv from "dotenv";
dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET || "SECRET";
export const SALT = process.env.SALT || 3;