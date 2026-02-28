import express, { Request, Response } from "express";
import { allData, forgetEmailVali, loginDataVali, updatedData, validateAdminData, validateemailAndPass } from "../middlewares/DataValidation";
import { addStaffService, checkAdminCredentials, checkStaffCredentials, getStaffByShopService, handleForgotPassword, registerAdmin, saveThePassword, updateAdminData } from "../services/AdminService";
import { DATA_NOT_SAVED, DATA_UPDATED, EMAIL_ALREADY_EXSITS, EMAIL_FOUND, EMAIL_NOT_FOUND, INTERNAL_SERVER_ERROR, INVALID_CREDENTIALS, LOGIN_SUCCESSFULL, PASSWORD_SAVED, SHOP_ADMIN_CREATED } from "../constData/ErrorMessages";
import { Admin_shop, AdminLogin_Data, NewPasswordData } from "../types/AdminData";
import { authenticate } from "../middlewares/authentication";
import { AuthRequest } from "../types/customRequest";
import { loginLimiter } from "../middlewares/RateLimiting";
import { prisma } from "../types/prisma";
import jwt, { JwtPayload } from "jsonwebtoken"
import { requireAdmin } from "../middlewares/authorization";
const router=express.Router();

router.get('/health',(req:Request,res:Response)=>{
  res.status(200).json({message:"Backend is responding"})
})
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
      let result = await checkAdminCredentials(req.body);

      if (!result) {
        result = await checkStaffCredentials(req.body) as any;
      }

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
console.log("refresh-token-api-is called")
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as jwt.JwtPayload;

    const user = await prisma.shop_Owner.findUnique({
      where: { id: decoded.id }
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    
    const newAccessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "1d" }
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
      // console.log(req.body)
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
  requireAdmin,
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

router.post(
  "/addStaff",
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const username = String(req.body?.username ?? req.body?.userName ?? "").trim();
      const email = String(req.body?.email ?? "").trim().toLowerCase();
      const password = String(req.body?.password ?? "");

      if (!username || username.length < 3 || username.length > 50) {
        return res.status(400).json({
          isError: true,
          message: "Username must be between 3 and 50 characters",
          data: {}
        });
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        return res.status(400).json({
          isError: true,
          message: "Email is not valid",
          data: {}
        });
      }

      if (!password || password.length < 6 || password.length > 50) {
        return res.status(400).json({
          isError: true,
          message: "Password length must be in the range of 6 and 50",
          data: {}
        });
      }

      const result = await addStaffService({ username, email, password }, req.shop_Details);

      if (!result.success) {
        if (result.reason === "EMAIL_EXISTS") {
          return res.status(409).json({
            isError: true,
            message: EMAIL_ALREADY_EXSITS,
            data: {}
          });
        }

        return res.status(500).json({
          isError: true,
          message: INTERNAL_SERVER_ERROR,
          data: {}
        });
      }

      return res.status(201).json({
        isError: false,
        message: "Staff created successfully",
        data: result.data
      });
    } catch {
      return res.status(500).json({
        isError: true,
        message: INTERNAL_SERVER_ERROR,
        data: {}
      });
    }
  }
);

router.get("/staff", authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const staffs = await getStaffByShopService(req.shop_Details);

    return res.status(200).json({
      isError: false,
      message: "Staff fetched successfully",
      data: staffs
    });
  } catch {
    return res.status(500).json({
      isError: true,
      message: INTERNAL_SERVER_ERROR,
      data: []
    });
  }
});

router.get("/getStaff", authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const staffs = await getStaffByShopService(req.shop_Details);

    return res.status(200).json({
      isError: false,
      message: "Staff fetched successfully",
      data: staffs
    });
  } catch {
    return res.status(500).json({
      isError: true,
      message: INTERNAL_SERVER_ERROR,
      data: []
    });
  }
});



export default router;