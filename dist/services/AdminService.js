"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAdmin = registerAdmin;
exports.checkAdminCredentials = checkAdminCredentials;
exports.checkStaffCredentials = checkStaffCredentials;
exports.handleForgotPassword = handleForgotPassword;
exports.saveThePassword = saveThePassword;
exports.updateAdminData = updateAdminData;
exports.addStaffService = addStaffService;
exports.getStaffByShopService = getStaffByShopService;
const prisma_1 = require("../types/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const ErrorMessages_1 = require("../constData/ErrorMessages");
const hasshingPassword_1 = require("../commonfunctionalities/hasshingPassword");
const sendEmail_1 = require("../utils/sendEmail");
dotenv_1.default.config();
async function registerAdmin(reqBody) {
    try {
        console.log(reqBody);
        const existingUser = await prisma_1.prisma.shop_Owner.findFirst({
            where: {
                OR: [
                    { email: reqBody.email },
                    { phone: reqBody.phone }
                ]
            }
        });
        if (existingUser) {
            return { success: false, reason: "EMAIL_EXISTS Or PHONE_EXISTS" };
        }
        const hashedPass = await (0, hasshingPassword_1.hashingPassword)(reqBody.password);
        const adminData = await prisma_1.prisma.shop_Owner.create({
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
    }
    catch (error) {
        return { success: false, reason: "SERVER_ERROR" };
    }
}
async function checkAdminCredentials(loginData) {
    try {
        const user = await prisma_1.prisma.shop_Owner.findFirst({
            where: { email: loginData.email },
        });
        if (!user)
            return null;
        const isMatched = await bcrypt_1.default.compare(loginData.password, user.password);
        if (!isMatched)
            return null;
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, role: "ADMIN", userType: "shop_owner" }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1d" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        await prisma_1.prisma.shop_Owner.update({
            where: { id: user.id },
            data: { refreshToken }
        });
        return {
            accessToken,
            refreshToken,
            role: "ADMIN",
            shop: {
                id: user.id,
                userName: user.userName,
                email: user.email,
                shop_type: user.shop_type
            }
        };
    }
    catch (error) {
        return null;
    }
}
async function checkStaffCredentials(loginData) {
    try {
        const staffUser = await prisma_1.prisma.staff.findUnique({
            where: { email: loginData.email },
            include: {
                shop: true
            }
        });
        if (!staffUser)
            return null;
        const isMatched = await bcrypt_1.default.compare(loginData.password, staffUser.password);
        if (!isMatched)
            return null;
        const accessToken = jsonwebtoken_1.default.sign({
            id: staffUser.shopId,
            role: "STAFF",
            userType: "staff",
            staffId: staffUser.id
        }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1d" });
        return {
            accessToken,
            role: "STAFF",
            staff: {
                id: staffUser.id,
                username: staffUser.username,
                email: staffUser.email
            },
            shop: {
                id: staffUser.shop.id,
                userName: staffUser.shop.userName,
                email: staffUser.shop.email,
                shop_type: staffUser.shop.shop_type
            }
        };
    }
    catch {
        return null;
    }
}
async function handleForgotPassword(email) {
    try {
        const user = await prisma_1.prisma.shop_Owner.findUnique({
            where: { email }
        });
        // Do NOT reveal whether user exists
        if (!user) {
            return { success: true };
        }
        const resetToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_RESET_SECRET, { expiresIn: "15m" });
        // console.log(resetToken)
        const resetLink = `http://34.93.113.174:9002/reset-password?token=${resetToken}`;
        await (0, sendEmail_1.sendResetEmail)(email, resetLink);
        return { success: true };
    }
    catch (error) {
        return {
            success: false,
            reason: "INTERNAL_ERROR"
        };
    }
}
async function saveThePassword(params) {
    try {
        // console.log(password)
        const decoded = jsonwebtoken_1.default.verify(params.token, process.env.JWT_RESET_SECRET);
        // console.log(params.password)
        // console.log(params.token)
        const hashedPassword = await (0, hasshingPassword_1.hashingPassword)(params.password);
        await prisma_1.prisma.shop_Owner.update({
            where: { id: decoded.id },
            data: { password: hashedPassword }
        });
        return { success: true };
    }
    catch (error) {
        return { success: false, reason: "INVALID_OR_EXPIRED_TOKEN" };
    }
}
async function updateAdminData(reqBody, shopDetails) {
    try {
        const parseBoolean = (value) => {
            if (typeof value === "boolean")
                return value;
            if (typeof value === "string") {
                const normalized = value.trim().toLowerCase();
                if (normalized === "true")
                    return true;
                if (normalized === "false")
                    return false;
            }
            return undefined;
        };
        const parseInteger = (value) => {
            if (typeof value === "number" && Number.isInteger(value))
                return value;
            if (typeof value === "string") {
                const parsed = Number(value);
                if (Number.isInteger(parsed))
                    return parsed;
            }
            return undefined;
        };
        const gstEnabled = parseBoolean(reqBody.gst_enabled ?? reqBody.enableGst);
        const gstPercentage = parseInteger(reqBody.gst_percentage ?? reqBody.gstRate);
        const email = reqBody.email;
        const phone = reqBody.phone ?? reqBody.mobileNumber;
        const shopName = reqBody.shop_name ?? reqBody.shopName;
        const shopType = reqBody.shop_type ?? reqBody.shopType;
        const welcomeMessage = reqBody.vist_message ?? reqBody.welcomeMessage;
        const data = await prisma_1.prisma.shop_Owner.update({
            where: { id: shopDetails.shop_id },
            data: {
                ...(email !== undefined ? { email } : {}),
                ...(phone !== undefined ? { phone } : {}),
                ...(shopName !== undefined ? { shop_name: shopName } : {}),
                ...(shopType !== undefined ? { shop_type: shopType } : {}),
                ...(welcomeMessage !== undefined ? { welcomeMessage } : {}),
                ...(gstEnabled !== undefined ? { gst_enabled: gstEnabled } : {}),
                ...(gstPercentage !== undefined ? { gst_percentage: gstPercentage } : {}),
                ...(reqBody.qrImageUrl === null
                    ? { Qr_image: null }
                    : reqBody.qrImageUrl
                        ? { Qr_image: reqBody.qrImageUrl }
                        : {})
            }
        });
        return data;
    }
    catch (error) {
        // console.error(error);
        throw new Error(ErrorMessages_1.INTERNAL_SERVER_ERROR);
    }
}
async function addStaffService(payload, shopDetails) {
    try {
        const existingStaff = await prisma_1.prisma.staff.findUnique({
            where: { email: payload.email }
        });
        if (existingStaff) {
            return { success: false, reason: "EMAIL_EXISTS" };
        }
        const hashedPassword = await (0, hasshingPassword_1.hashingPassword)(payload.password);
        const createdStaff = await prisma_1.prisma.staff.create({
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
    }
    catch {
        return { success: false, reason: "SERVER_ERROR" };
    }
}
async function getStaffByShopService(shopDetails) {
    return prisma_1.prisma.staff.findMany({
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
//# sourceMappingURL=AdminService.js.map