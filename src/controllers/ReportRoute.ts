import express from "express";
import { authenticate } from "../middlewares/authentication";
import { validateDateRange, validateDates } from "../middlewares/DataValidation";
import { dashboardData, dayilyData, last1YearController, last30DaysController, overviewData } from "./ReportController";

const report=express.Router();

report.get("/dayToReports",authenticate,validateDateRange,validateDates,dayilyData)
report.get("/overview",authenticate,overviewData);


report.get("/dashboard", authenticate, dashboardData);
report.get("/last-30-days", authenticate, last30DaysController);
report.get("/last-1-year", authenticate, last1YearController);
export default report