"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentQrImageSer = exports.updateAdminDataSer = exports.getAdminDataSer = void 0;
const prisma_1 = require("../types/prisma");
const getAdminDataSer = async (shopDetails) => {
    try {
        return await prisma_1.prisma.shop_Owner.findUnique({
            where: {
                id: shopDetails.shop_id
            },
            include: {
                staff: {
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
                }
            }
        });
    }
    catch (error) {
    }
};
exports.getAdminDataSer = getAdminDataSer;
const updateAdminDataSer = async (reqBody, shopDetails) => {
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
    const gstEnabled = parseBoolean(reqBody.gst_enabled);
    const gstPercentage = parseInteger(reqBody.gst_percentage);
    return prisma_1.prisma.shop_Owner.update({
        where: {
            id: shopDetails.shop_id
        },
        data: {
            ...(reqBody.email !== undefined ? { email: reqBody.email } : {}),
            ...(reqBody.phone !== undefined ? { phone: reqBody.phone } : {}),
            ...(reqBody.shop_name !== undefined ? { shop_name: reqBody.shop_name } : {}),
            ...(reqBody.shop_type !== undefined ? { shop_type: reqBody.shop_type } : {}),
            ...(reqBody.vist_message !== undefined ? { welcomeMessage: reqBody.vist_message } : {}),
            ...(gstEnabled !== undefined ? { gst_enabled: gstEnabled } : {}),
            ...(gstPercentage !== undefined ? { gst_percentage: gstPercentage } : {}),
            ...(reqBody.qrImageUrl === null
                ? { Qr_image: null }
                : reqBody.qrImageUrl
                    ? { Qr_image: reqBody.qrImageUrl }
                    : {})
        }
    });
};
exports.updateAdminDataSer = updateAdminDataSer;
const getCurrentQrImageSer = async (shopDetails) => {
    return prisma_1.prisma.shop_Owner.findUnique({
        where: {
            id: shopDetails.shop_id
        },
        select: {
            Qr_image: true
        }
    });
};
exports.getCurrentQrImageSer = getCurrentQrImageSer;
//# sourceMappingURL=SettingService.js.map