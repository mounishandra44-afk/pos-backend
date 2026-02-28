
import { prisma } from "../types/prisma";
import bcrypt from"bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { DATA_NOT_SAVED, DATA_UPDATED, EMAIL_FOUND, EMAIL_NOT_FOUND, INTERNAL_SERVER_ERROR, PASSWORD_SAVED } from "../constData/ErrorMessages";
import { hashingPassword } from "../commonfunctionalities/hasshingPassword";
import { AdminLogin_Data } from "../types/AdminData";
import { sendResetEmail } from "../utils/sendEmail";
dotenv.config();

type StaffPayload = {
  username: string;
  email: string;
  password: string;
};

type ShopContext = {
  shop_id: string;
};

type RegisterAdminResult =
  | { success: true; data: any }
  | { success: false; reason: "EMAIL_EXISTS Or PHONE_EXISTS" | "SERVER_ERROR" };

export async function registerAdmin(
  reqBody: any
): Promise<RegisterAdminResult> {
  try {
    console.log(reqBody);
    const existingUser = await prisma.shop_Owner.findFirst({
       where:{
        OR:[
          { email: reqBody.email },
            { phone: reqBody.phone }
        ]
       }
    });

    if (existingUser) {
      return { success: false, reason: "EMAIL_EXISTS Or PHONE_EXISTS" };
    }

    const hashedPass = await hashingPassword(reqBody.password);

    const adminData = await prisma.shop_Owner.create({
      data: {
        userName: reqBody.userName,
        phone: reqBody.phone,
        email: reqBody.email,
        password: hashedPass,
        shop_name: reqBody.shop_name,
        shop_type: reqBody.shop_type
      }
    });

    // console.log(adminData);
    return { success: true, data: adminData };

  } catch (error) {
    return { success: false, reason: "SERVER_ERROR" };
  }
}


export async function checkAdminCredentials(loginData: AdminLogin_Data) {
  try {
    const user = await prisma.shop_Owner.findFirst({
      where: { email: loginData.email },
    });

    if (!user) return null;

    const isMatched = await bcrypt.compare(
      loginData.password,
      user.password
    );

    if (!isMatched) return null;

   
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

  
    await prisma.shop_Owner.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    return {
      accessToken,
      refreshToken,
      shop: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        shop_type: user.shop_type
      }
    };

  } catch (error) {
    return null;
  }
}


export async function handleForgotPassword(email: string): Promise<{
  success: boolean;
  reason?: string;
}> {
  try {
    const user = await prisma.shop_Owner.findUnique({
      where: { email }
    });

    // Do NOT reveal whether user exists
    if (!user) {
      return { success: true }; 
    }

    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_RESET_SECRET as string,
      { expiresIn: "15m" }
    );
// console.log(resetToken)
    const resetLink = `http://34.93.113.174:9002/reset-password?token=${resetToken}`;


    await sendResetEmail(email, resetLink);

    return { success: true };

  } catch (error) {
    return {
      success: false,
      reason: "INTERNAL_ERROR"
    };
  }
}


export async function saveThePassword(params: {
  token: string;
  password: string;
}): Promise<{ success: boolean; reason?: string }> {
  try {
    // console.log(password)
    const decoded = jwt.verify(
      params.token,
      process.env.JWT_RESET_SECRET as string
    ) as { id: string };
    // console.log(params.password)
    // console.log(params.token)
    const hashedPassword = await hashingPassword(params.password);

    await prisma.shop_Owner.update({
      where: { id: decoded.id },
      data: { password: hashedPassword }
    });

    return { success: true };

  } catch (error) {
    return { success: false, reason: "INVALID_OR_EXPIRED_TOKEN" };
  }
}

export async function updateAdminData(
  reqBody: any,
  shopDetails: any
): Promise<any> {
  try {
    const data = await prisma.shop_Owner.update({
      where: { id: shopDetails.shop_id },
      data: {
        email: reqBody.email,
        phone: reqBody.phone,
        shop_name: reqBody.shop_name,
        shop_type: reqBody.shop_type,
        welcomeMessage: reqBody.vist_message,
        gst_enabled: reqBody.gst_enabled,
        gst_percentage: reqBody.gst_percentage
      }
    });

    return data; 

  } catch (error) {
    // console.error(error);
    throw new Error(INTERNAL_SERVER_ERROR); 
  }
}

type AddStaffResult =
  | {
      success: true;
      data: {
        id: string;
        username: string;
        email: string;
        role: string;
        createdAt: Date;
      };
    }
  | { success: false; reason: "EMAIL_EXISTS" | "SERVER_ERROR" };

export async function addStaffService(
  payload: StaffPayload,
  shopDetails: ShopContext
): Promise<AddStaffResult> {
  try {
    const existingStaff = await prisma.staff.findUnique({
      where: { email: payload.email }
    });

    if (existingStaff) {
      return { success: false, reason: "EMAIL_EXISTS" };
    }

    const hashedPassword = await hashingPassword(payload.password);

    const createdStaff = await prisma.staff.create({
      data: {
        username: payload.username,
        email: payload.email,
        password: hashedPassword,
        shopId: shopDetails.shop_id
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    return { success: true, data: createdStaff };
  } catch {
    return { success: false, reason: "SERVER_ERROR" };
  }
}

export async function getStaffByShopService(shopDetails: ShopContext) {
  return prisma.staff.findMany({
    where: { shopId: shopDetails.shop_id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}
