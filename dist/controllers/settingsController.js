"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminSettings = exports.getAdminData = exports.normalizeSettingsPayload = exports.uploadSettingsQr = void 0;
const SettingService_1 = require("../services/SettingService");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const paymentQrDir = path_1.default.resolve(process.cwd(), "paymentqr");
const resolvePaymentQrFilePath = (imageUrl) => {
    try {
        const normalizedUrl = String(imageUrl ?? "").trim();
        if (!normalizedUrl) {
            return null;
        }
        let pathname = normalizedUrl;
        if (normalizedUrl.startsWith("http://") || normalizedUrl.startsWith("https://")) {
            pathname = new URL(normalizedUrl).pathname;
        }
        if (!pathname.startsWith("/paymentqr/")) {
            return null;
        }
        const fileName = path_1.default.basename(pathname);
        if (!fileName) {
            return null;
        }
        const absolutePath = path_1.default.resolve(paymentQrDir, fileName);
        if (!absolutePath.startsWith(paymentQrDir)) {
            return null;
        }
        return absolutePath;
    }
    catch {
        return null;
    }
};
const deleteLocalQrFile = (imageUrl) => {
    if (!imageUrl) {
        return;
    }
    const targetPath = resolvePaymentQrFilePath(imageUrl);
    if (!targetPath) {
        return;
    }
    if (fs_1.default.existsSync(targetPath)) {
        fs_1.default.unlinkSync(targetPath);
    }
};
if (!fs_1.default.existsSync(paymentQrDir)) {
    fs_1.default.mkdirSync(paymentQrDir, { recursive: true });
}
const settingsQrStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, paymentQrDir);
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname).toLowerCase()}`;
        cb(null, uniqueName);
    }
});
const settingsQrUploader = (0, multer_1.default)({
    storage: settingsQrStorage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (![".png", ".jpg", ".jpeg", ".webp", ".svg"].includes(ext)) {
            return cb(new Error("Only PNG, JPG, JPEG, WEBP and SVG images are allowed"));
        }
        cb(null, true);
    }
});
const uploadSettingsQr = (req, res, next) => {
    settingsQrUploader.fields([
        { name: "qr_image", maxCount: 1 },
        { name: "upiQrImage", maxCount: 1 }
    ])(req, res, (err) => {
        if (!err) {
            return next();
        }
        if (err instanceof multer_1.default.MulterError && err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                isError: true,
                message: "File too large. Maximum size allowed is 2MB.",
                data: {}
            });
        }
        return res.status(400).json({
            isError: true,
            message: err.message || "File upload error",
            data: {}
        });
    });
};
exports.uploadSettingsQr = uploadSettingsQr;
const normalizeSettingsPayload = (req, _res, next) => {
    req.body = req.body ?? {};
    if (req.body.shopName !== undefined && req.body.shop_name === undefined) {
        req.body.shop_name = req.body.shopName;
    }
    if (req.body.shopType !== undefined && req.body.shop_type === undefined) {
        req.body.shop_type = req.body.shopType;
    }
    if (req.body.mobileNumber !== undefined && req.body.phone === undefined) {
        req.body.phone = req.body.mobileNumber;
    }
    if (req.body.enableGst !== undefined && req.body.gst_enabled === undefined) {
        req.body.gst_enabled = req.body.enableGst;
    }
    if (req.body.gstRate !== undefined && req.body.gst_percentage === undefined) {
        req.body.gst_percentage = req.body.gstRate;
    }
    if (req.body.welcomeMessage !== undefined && req.body.vist_message === undefined) {
        req.body.vist_message = req.body.welcomeMessage;
    }
    next();
};
exports.normalizeSettingsPayload = normalizeSettingsPayload;
const getAdminData = async (req, res) => {
    try {
        const adminData = await (0, SettingService_1.getAdminDataSer)(req.shop_Details);
        if (adminData) {
            return res.status(200).json({
                isError: false,
                message: "Admin Data fetched Successfully",
                data: adminData
            });
        }
        res.status(400).json({
            isError: true,
            message: "Admin Not Found",
            data: {}
        });
    }
    catch (error) {
        return res.status(500).json({
            isError: true,
            message: "Internal Server Error",
            data: {}
        });
    }
};
exports.getAdminData = getAdminData;
const updateAdminSettings = async (req, res) => {
    const files = (req.files ?? {});
    const qrFile = files.qr_image?.[0] ?? files.upiQrImage?.[0];
    try {
        const currentShopData = await (0, SettingService_1.getCurrentQrImageSer)(req.shop_Details);
        const previousQrImageUrl = currentShopData?.Qr_image ?? null;
        const normalizedBody = {
            ...req.body,
            shop_name: req.body.shop_name ?? req.body.shopName,
            shop_type: req.body.shop_type ?? req.body.shopType,
            phone: req.body.phone ?? req.body.mobileNumber,
            gst_enabled: req.body.gst_enabled ?? req.body.enableGst,
            gst_percentage: req.body.gst_percentage ?? req.body.gstRate,
            vist_message: req.body.vist_message ?? req.body.welcomeMessage
        };
        if (qrFile) {
            normalizedBody.qrImageUrl = `${req.protocol}://${req.get("host")}/paymentqr/${qrFile.filename}`;
        }
        const upiQrImageValue = String(normalizedBody.upiQrImage ?? "").trim().toLowerCase();
        const removeQrImageValue = String(normalizedBody.removeQrImage ?? normalizedBody.removeUpiQrImage ?? "").trim().toLowerCase();
        const shouldRemoveQrImage = !qrFile && (upiQrImageValue === "" ||
            upiQrImageValue === "null" ||
            upiQrImageValue === "undefined" ||
            removeQrImageValue === "true" ||
            removeQrImageValue === "1");
        if (shouldRemoveQrImage) {
            normalizedBody.qrImageUrl = null;
        }
        const adminData = await (0, SettingService_1.updateAdminDataSer)(normalizedBody, req.shop_Details);
        const isQrReplaced = Boolean(qrFile) && Boolean(previousQrImageUrl);
        const isQrRemoved = normalizedBody.qrImageUrl === null && Boolean(previousQrImageUrl);
        if (isQrReplaced || isQrRemoved) {
            deleteLocalQrFile(previousQrImageUrl);
        }
        return res.status(200).json({
            isError: false,
            message: "Admin settings updated successfully",
            data: adminData
        });
    }
    catch (error) {
        if (qrFile) {
            const uploadedQrPath = path_1.default.resolve(paymentQrDir, qrFile.filename);
            if (fs_1.default.existsSync(uploadedQrPath)) {
                fs_1.default.unlinkSync(uploadedQrPath);
            }
        }
        return res.status(500).json({
            isError: true,
            message: "Internal Server Error",
            data: {}
        });
    }
};
exports.updateAdminSettings = updateAdminSettings;
//# sourceMappingURL=settingsController.js.map