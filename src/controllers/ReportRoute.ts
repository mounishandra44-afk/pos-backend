import express from "express";
import { authenticate } from "../middlewares/authentication";
import { validateDateRange, validateDates } from "../middlewares/DataValidation";
import { closeShopController, dashboardData, dayilyData, last1YearController, last30DaysController, overviewData } from "./ReportController";
import { requireAdmin } from "../middlewares/authorization";

const report=express.Router();

report.get("/dayToReports",authenticate,requireAdmin,validateDateRange,validateDates,dayilyData)
report.get("/overview",authenticate,requireAdmin,overviewData);


report.get("/dashboard", authenticate, requireAdmin, dashboardData);
report.get("/last-30-days", authenticate, requireAdmin, last30DaysController);
report.get("/last-1-year", authenticate, requireAdmin, last1YearController);
report.post("/close-shop", authenticate, requireAdmin, closeShopController);
report.post("/daily-report", authenticate, requireAdmin, closeShopController);
report.post("/save-daily-report", authenticate, requireAdmin, closeShopController);
report.post("/end-of-day", authenticate, requireAdmin, closeShopController);
export default report