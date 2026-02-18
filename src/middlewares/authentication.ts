import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { UserData } from "../types/AdminData";
import { AuthRequest } from "../types/customRequest";
export const authenticate = (req: Request,res: Response,next: NextFunction) => {
  const authHeader = req.headers.authorization;
// console.log("this is from the authentication middelware")
  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET_KEY as string 
    ) as jwt.JwtPayload
req.shop_Details={
shop_id:decoded.id as string,
shop_owner:decoded.userName as string,
shop_email:decoded.email as string
}
  
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};