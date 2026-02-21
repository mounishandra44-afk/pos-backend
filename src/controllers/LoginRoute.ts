import express, { Request, Response } from "express";
import { allData, forgetEmailVali, loginDataVali, updatedData, validateAdminData, validateemailAndPass } from "../middlewares/DataValidation";
import { checkAdminCredentials, handleForgotPassword, registerAdmin, saveThePassword, updateAdminData } from "../services/AdminService";
import { DATA_NOT_SAVED, DATA_UPDATED, EMAIL_ALREADY_EXSITS, EMAIL_FOUND, EMAIL_NOT_FOUND, INTERNAL_SERVER_ERROR, INVALID_CREDENTIALS, LOGIN_SUCCESSFULL, PASSWORD_SAVED, SHOP_ADMIN_CREATED } from "../constData/ErrorMessages";
import { Admin_shop, AdminLogin_Data, NewPasswordData } from "../types/AdminData";
import { authenticate } from "../middlewares/authentication";
import { AuthRequest } from "../types/customRequest";
import { loginLimiter } from "../middlewares/RateLimiting";
import { prisma } from "../types/prisma";
import jwt, { JwtPayload } from "jsonwebtoken"
const router=express.Router();
router.post("/adminRegister", allData, validateAdminData,
  async (req: Request<{}, {}, Admin_shop>, res: Response) => {

    try {
      const result = await registerAdmin(req.body);

      if (!result.success) {
        if (result.reason === "EMAIL_EXISTS Or PHONE_EXISTS") {
          return res.status(409).json({
            isError: true,
            message:EMAIL_ALREADY_EXSITS,
            data: {}
          });
        }

        return res.status(500).json({
          isError: true,
           message:INTERNAL_SERVER_ERROR,
          data: {}
        });
      }

      return res.status(201).json({
        isError: false,
        message: SHOP_ADMIN_CREATED,
        data: {
          id: result.data.id,
          email: result.data.email,
          shop_name: result.data.shop_name
        }
      });

    } catch (error) {
      return res.status(500).json({
        isError: true,
        message: INTERNAL_SERVER_ERROR,
        data:{}
      });
    }
});

router.post(
  "/login",
  loginLimiter,
  loginDataVali,
  validateAdminData,
  async (req: Request<{}, {}, AdminLogin_Data>, res: Response) => {
    try {
      const result = await checkAdminCredentials(req.body);

      if (!result) {
        return res.status(401).json({
          isError: true,
          message: INVALID_CREDENTIALS
        });
      }

      return res.status(200).json({
        isError: false,
        message: LOGIN_SUCCESSFULL,
        data: result
      });

    } catch (error) {
      return res.status(500).json({
        isError: true,
        message: INTERNAL_SERVER_ERROR
      });
    }
  }
);



router.post("/refresh-token", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as jwt.JwtPayload;

    const user = await prisma.shop_Owner.findUnique({
      where: { id: decoded.id }
    });
    console.log(user)

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      {
        id: user.id,
        userName: user.userName,
        email: user.email,
        shop_type: user.shop_type
      },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "15m" }
    );

    return res.status(200).json({ accessToken: newAccessToken });

  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Refresh token expired" });
    }
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});


router.post(
  "/forget-password",
  forgetEmailVali,
  validateAdminData,
  async (req: Request, res: Response) => {
    try {
     const result = await handleForgotPassword(req.body.email);

if (!result.success) {
  return res.status(500).json({
    isError: true,
    message: INTERNAL_SERVER_ERROR
  });
}

      return res.status(200).json({
        isError: false,
        message:
          "If this email is registered, you will receive reset instructions."
      });

    } catch (error) {
      return res.status(500).json({
        isError: true,
        message: INTERNAL_SERVER_ERROR
      });
    }
  }
);


router.put(
  "/updateTheNewPassword",
  validateemailAndPass,
  validateAdminData,
  async (req: Request, res: Response) => {
    try {
      const result = await saveThePassword(req.body);
      console.log(req.body)
      if (!result.success) {
        return res.status(400).json({
          isError: true,
          message: "Invalid or expired reset token"
        });
      }

      return res.status(200).json({
        isError: false,
        message: "Password updated successfully"
      });

    } catch (error) {
      return res.status(500).json({
        isError: true,
        message: INTERNAL_SERVER_ERROR
      });
    }
  }
);


router.put(
  "/updateUser",
  authenticate,
  updatedData,
  validateAdminData,
  async (req: Request, res: Response) => {
    try {
      const updatedAdmin = await updateAdminData(
        req.body,
        req.shop_Details
      );

      if (!updatedAdmin) {
        return res.status(400).json({
          isError: true,
          message: DATA_NOT_SAVED,
          data: {}
        });
      }

      return res.status(200).json({
        isError: false,
        message: "Admin updated successfully",
        data: updatedAdmin  
      });

    } catch (error) {
      return res.status(500).json({
        isError: true,
        message: INTERNAL_SERVER_ERROR,
        data: {}
      });
    }
  }
);


router.post("/logout", authenticate, async (req: Request, res: Response) => {
  try {
    await prisma.shop_Owner.update({
      where: { id: req.shop_Details.shop_id },
      data: { refreshToken: null }
    });

    return res.status(200).json({
      isError: false,
      message: "Logged out successfully"
    });

  } catch {
    return res.status(500).json({
      isError: true,
      message: INTERNAL_SERVER_ERROR
    });
  }
});



export default router;