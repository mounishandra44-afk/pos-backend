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
        const shop = await prisma_1.prisma.shop_Owner.findUnique({
            where: { id: decoded.id }
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
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=authentication.js.map