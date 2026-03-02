"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeShopController = exports.last1YearController = exports.last30DaysController = exports.dashboardData = exports.overviewData = exports.dayilyData = void 0;
const ReportsService_1 = require("../services/ReportsService");
const dayilyData = async (req, res) => {
    try {
        const dateReport = await (0, ReportsService_1.getDailyReportData)(req.query, req.shop_Details);
        return res.status(dateReport.statusCode).json({
            isError: dateReport.isErr,
            data: dateReport.messages,
        });
    }
    catch (error) {
        console.error("Daily report error:", error);
        return res.status(500).json({
            isError: true,
            message: "Unexpected server error",
        });
    }
};
exports.dayilyData = dayilyData;
const overviewData = async (req, res) => {
    try {
        const shopOverview = await (0, ReportsService_1.getOverViewData)(req.shop_Details);
        return res.status(shopOverview.statusCode).send(shopOverview.messages);
    }
    catch (error) {
        return { statusCode: 500, messages: error, isErr: true };
    }
};
exports.overviewData = overviewData;
const dashboardData = async (req, res) => {
    try {
        const result = await (0, ReportsService_1.getDashboardData)(req.shop_Details);
        // console.log(result)
        return res.status(result.statusCode).json({
            isError: result.isErr,
            data: result.messages,
        });
    }
    catch (error) {
        console.error("Dashboard error:", error);
        return res.status(500).json({
            isError: true,
            message: "Unexpected server error",
        });
    }
};
exports.dashboardData = dashboardData;
const last30DaysController = async (req, res) => {
    try {
        const result = await (0, ReportsService_1.getLast30DaysData)(req.shop_Details);
        return res.status(result.statusCode).json({
            isError: result.isErr,
            data: result.messages
        });
    }
    catch (error) {
        console.error("Last 30 Days Controller Error:", error);
        return res.status(500).json({
            isError: true,
            message: "Unexpected server error"
        });
    }
};
exports.last30DaysController = last30DaysController;
const last1YearController = async (req, res) => {
    try {
        const result = await (0, ReportsService_1.getLastYearData)(req.shop_Details);
        return res.status(result.statusCode).json({
            isError: result.isErr,
            data: result.messages
        });
    }
    catch (error) {
        console.error("Last 1 Year Controller Error:", error);
        return res.status(500).json({
            isError: true,
            message: "Unexpected server error"
        });
    }
};
exports.last1YearController = last1YearController;
const closeShopController = async (req, res) => {
    try {
        const result = await (0, ReportsService_1.saveCloseShopReport)(req.body, req.shop_Details);
        if (result.isErr) {
            return res.status(result.statusCode).json({
                isError: true,
                message: result.messages,
                data: {}
            });
        }
        const payload = result.messages;
        return res.status(result.statusCode).json({
            isError: false,
            message: payload.message,
            data: payload.data
        });
    }
    catch {
        return res.status(500).json({
            isError: true,
            message: "Unexpected server error",
            data: {}
        });
    }
};
exports.closeShopController = closeShopController;
//# sourceMappingURL=ReportController.js.map