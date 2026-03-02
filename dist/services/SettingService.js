"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDataSer = void 0;
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
//# sourceMappingURL=SettingService.js.map