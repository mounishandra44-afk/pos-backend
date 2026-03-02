"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = void 0;
const requireAdmin = (req, res, next) => {
    if (!req.auth_Details || req.auth_Details.role !== "ADMIN") {
        return res.status(403).json({
            isError: true,
            message: "Access denied. Admin only endpoint.",
            data: {}
        });
    }
    next();
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=authorization.js.map