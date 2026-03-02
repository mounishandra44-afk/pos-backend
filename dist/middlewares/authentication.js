"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../types/prisma");
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token missing or malformed" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        let resolvedShopId = decoded.id;
        if (decoded.role === "STAFF" && decoded.userType === "staff") {
            const byShopId = await prisma_1.prisma.shop_Owner.findUnique({
                where: { id: decoded.id }
            });
            if (!byShopId) {
                const staffRecord = await prisma_1.prisma.staff.findUnique({
                    where: { id: decoded.id },
                    select: { shopId: true }
                });
                if (staffRecord) {
                    resolvedShopId = staffRecord.shopId;
                }
            }
        }
        const shop = await prisma_1.prisma.shop_Owner.findUnique({
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
        const authDetails = {
            role: decoded.role === "STAFF" ? "STAFF" : "ADMIN",
            userType: typeof decoded.userType === "string" ? decoded.userType : "shop_owner",
            shop_id: shop.id
        };
        if (typeof decoded.staffId === "string") {
            authDetails.staff_id = decoded.staffId;
        }
        req.auth_Details = authDetails;
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=authentication.js.map