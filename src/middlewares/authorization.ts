import { NextFunction, Request, Response } from "express";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.auth_Details || req.auth_Details.role !== "ADMIN") {
    return res.status(403).json({
      isError: true,
      message: "Access denied. Admin only endpoint.",
      data: {}
    });
  }

  next();
};
