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

    let resolvedShopId = decoded.id as string;

    if (decoded.role === "STAFF" && decoded.userType === "staff") {
      const byShopId = await prisma.shop_Owner.findUnique({
        where: { id: decoded.id as string }
      });

      if (!byShopId) {
        const staffRecord = await prisma.staff.findUnique({
          where: { id: decoded.id as string },
          select: { shopId: true }
        });

        if (staffRecord) {
          resolvedShopId = staffRecord.shopId;
        }
      }
    }

    const shop = await prisma.shop_Owner.findUnique({
      where: { id: resolvedShopId }
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

    const authDetails: Express.Request["auth_Details"] = {
      role: decoded.role === "STAFF" ? "STAFF" : "ADMIN",
      userType: typeof decoded.userType === "string" ? decoded.userType : "shop_owner",
      shop_id: shop.id
    };

    if (typeof decoded.staffId === "string") {
      authDetails.staff_id = decoded.staffId;
    }

    req.auth_Details = authDetails;

    next();

  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};