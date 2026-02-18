import express from "express";
import { authenticate } from "../middlewares/authentication";
import { validateDateRange, validateDates } from "../middlewares/DataValidation";
import { dayilyData, overviewData } from "./ReportController";

const report=express.Router();

report.get("/dayToReports",authenticate,validateDateRange,validateDates,dayilyData)
report.get("/overview",authenticate,overviewData)
export default report