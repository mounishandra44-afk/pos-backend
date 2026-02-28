"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminData = void 0;
const SettingService_1 = require("../services/SettingService");
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
//# sourceMappingURL=settingsController.js.map