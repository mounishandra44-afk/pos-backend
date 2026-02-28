"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DataValidation_1 = require("../middlewares/DataValidation");
const AdminService_1 = require("../services/AdminService");
const ErrorMessages_1 = require("../constData/ErrorMessages");
const authentication_1 = require("../middlewares/authentication");
const RateLimiting_1 = require("../middlewares/RateLimiting");
const prisma_1 = require("../types/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
router.get('/health', (req, res) => {
    res.status(200).json({ message: "Backend is responding" });
});
router.post("/adminRegister", DataValidation_1.allData, DataValidation_1.validateAdminData, async (req, res) => {
    try {
        const result = await (0, AdminService_1.registerAdmin)(req.body);
        if (!result.success) {
            if (result.reason === "EMAIL_EXISTS Or PHONE_EXISTS") {
                return res.status(409).json({
                    isError: true,
                    message: ErrorMessages_1.EMAIL_ALREADY_EXSITS,
                    data: {}
                });
            }
            return res.status(500).json({
                isError: true,
                message: ErrorMessages_1.INTERNAL_SERVER_ERROR,
                data: {}
            });
        }
        return res.status(201).json({
            isError: false,
            message: ErrorMessages_1.SHOP_ADMIN_CREATED,
            data: {
                id: result.data.id,
                email: result.data.email,
                shop_name: result.data.shop_name
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            isError: true,
            message: ErrorMessages_1.INTERNAL_SERVER_ERROR,
            data: {}
        });
    }
});
router.post("/login", RateLimiting_1.loginLimiter, DataValidation_1.loginDataVali, DataValidation_1.validateAdminData, async (req, res) => {
    try {
        const result = await (0, AdminService_1.checkAdminCredentials)(req.body);
        if (!result) {
            return res.status(401).json({
                isError: true,
                message: ErrorMessages_1.INVALID_CREDENTIALS
            });
        }
        return res.status(200).json({
            isError: false,
            message: ErrorMessages_1.LOGIN_SUCCESSFULL,
            data: result
        });
    }
    catch (error) {
        return res.status(500).json({
            isError: true,
            message: ErrorMessages_1.INTERNAL_SERVER_ERROR
        });
    }
});
router.post("/refresh-token", async (req, res) => {
    const { refreshToken } = req.body;
    console.log("refresh-token-api-is called");
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await prisma_1.prisma.shop_Owner.findUnique({
            where: { id: decoded.id }
        });
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        const newAccessToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1d" });
        return res.status(200).json({ accessToken: newAccessToken });
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(403).json({ message: "Refresh token expired" });
        }
        return res.status(403).json({ message: "Invalid refresh token" });
    }
});
router.post("/forget-password", DataValidation_1.forgetEmailVali, DataValidation_1.validateAdminData, async (req, res) => {
    try {
        const result = await (0, AdminService_1.handleForgotPassword)(req.body.email);
        if (!result.success) {
            return res.status(500).json({
                isError: true,
                message: ErrorMessages_1.INTERNAL_SERVER_ERROR
            });
        }
        return res.status(200).json({
            isError: false,
            message: "If this email is registered, you will receive reset instructions."
        });
    }
    catch (error) {
        return res.status(500).json({
            isError: true,
            message: ErrorMessages_1.INTERNAL_SERVER_ERROR
        });
    }
});
router.put("/updateTheNewPassword", DataValidation_1.validateemailAndPass, DataValidation_1.validateAdminData, async (req, res) => {
    try {
        const result = await (0, AdminService_1.saveThePassword)(req.body);
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
    }
    catch (error) {
        return res.status(500).json({
            isError: true,
            message: ErrorMessages_1.INTERNAL_SERVER_ERROR
        });
    }
});
router.put("/updateUser", authentication_1.authenticate, DataValidation_1.updatedData, DataValidation_1.validateAdminData, async (req, res) => {
    try {
        const updatedAdmin = await (0, AdminService_1.updateAdminData)(req.body, req.shop_Details);
        if (!updatedAdmin) {
            return res.status(400).json({
                isError: true,
                message: ErrorMessages_1.DATA_NOT_SAVED,
                data: {}
            });
        }
        return res.status(200).json({
            isError: false,
            message: "Admin updated successfully",
            data: updatedAdmin
        });
    }
    catch (error) {
        return res.status(500).json({
            isError: true,
            message: ErrorMessages_1.INTERNAL_SERVER_ERROR,
            data: {}
        });
    }
});
router.post("/logout", authentication_1.authenticate, async (req, res) => {
    try {
        await prisma_1.prisma.shop_Owner.update({
            where: { id: req.shop_Details.shop_id },
            data: { refreshToken: null }
        });
        return res.status(200).json({
            isError: false,
            message: "Logged out successfully"
        });
    }
    catch {
        return res.status(500).json({
            isError: true,
            message: ErrorMessages_1.INTERNAL_SERVER_ERROR
        });
    }
});
router.post("/addStaff", authentication_1.authenticate, DataValidation_1.staffDataVali, DataValidation_1.validateAdminData, async (req, res) => {
    try {
        const result = await (0, AdminService_1.addStaffService)(req.body, req.shop_Details);
        if (!result.success) {
            if (result.reason === "EMAIL_EXISTS") {
                return res.status(409).json({
                    isError: true,
                    message: ErrorMessages_1.EMAIL_ALREADY_EXSITS,
                    data: {}
                });
            }
            return res.status(500).json({
                isError: true,
                message: ErrorMessages_1.INTERNAL_SERVER_ERROR,
                data: {}
            });
        }
        return res.status(201).json({
            isError: false,
            message: "Staff created successfully",
            data: result.data
        });
    }
    catch {
        return res.status(500).json({
            isError: true,
            message: ErrorMessages_1.INTERNAL_SERVER_ERROR,
            data: {}
        });
    }
});
router.get("/staff", authentication_1.authenticate, async (req, res) => {
    try {
        const staffs = await (0, AdminService_1.getStaffByShopService)(req.shop_Details);
        return res.status(200).json({
            isError: false,
            message: "Staff fetched successfully",
            data: staffs
        });
    }
    catch {
        return res.status(500).json({
            isError: true,
            message: ErrorMessages_1.INTERNAL_SERVER_ERROR,
            data: []
        });
    }
});
router.get("/getStaff", authentication_1.authenticate, async (req, res) => {
    try {
        const staffs = await (0, AdminService_1.getStaffByShopService)(req.shop_Details);
        return res.status(200).json({
            isError: false,
            message: "Staff fetched successfully",
            data: staffs
        });
    }
    catch {
        return res.status(500).json({
            isError: true,
            message: ErrorMessages_1.INTERNAL_SERVER_ERROR,
            data: []
        });
    }
});
exports.default = router;
//# sourceMappingURL=LoginRoute.js.map