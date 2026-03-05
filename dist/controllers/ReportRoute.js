"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middlewares/authentication");
const DataValidation_1 = require("../middlewares/DataValidation");
const ReportController_1 = require("./ReportController");
const authorization_1 = require("../middlewares/authorization");
const report = express_1.default.Router();
report.get("/dayToReports", authentication_1.authenticate, authorization_1.requireAdmin, DataValidation_1.validateDateRange, DataValidation_1.validateDates, ReportController_1.dayilyData);
report.get("/overview", authentication_1.authenticate, authorization_1.requireAdmin, ReportController_1.overviewData);
report.get("/dashboard", authentication_1.authenticate, authorization_1.requireAdmin, ReportController_1.dashboardData);
report.get("/last-30-days", authentication_1.authenticate, authorization_1.requireAdmin, ReportController_1.last30DaysController);
report.get("/last-1-year", authentication_1.authenticate, authorization_1.requireAdmin, ReportController_1.last1YearController);
report.post("/close-shop", authentication_1.authenticate, authorization_1.requireAdmin, ReportController_1.closeShopController);
report.post("/daily-report", authentication_1.authenticate, authorization_1.requireAdmin, ReportController_1.closeShopController);
report.post("/save-daily-report", authentication_1.authenticate, authorization_1.requireAdmin, ReportController_1.closeShopController);
report.post("/end-of-day", authentication_1.authenticate, authorization_1.requireAdmin, ReportController_1.closeShopController);
exports.default = report;
//# sourceMappingURL=ReportRoute.js.map