import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { UserData } from "../types/AdminData";
import { AuthRequest } from "../types/customRequest";
import { prisma } from "../types/prisma";
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as jwt.JwtPayload;

    const shop = await prisma.shop_Owner.findUnique({
      where: { id: decoded.id }
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    req.shop_Details = {
      shop_id: shop.id,
      shop_owner: shop.userName,
      shop_email: shop.email,
      shop_type: shop.shop_type
    };

    next();

  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};