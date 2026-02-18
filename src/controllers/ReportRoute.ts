import express from "express";
import { authenticate } from "../middlewares/authentication";
import { validateDateRange, validateDates } from "../middlewares/DataValidation";
import { dayilyData } from "./ReportController";

const report=express.Router();

report.get("/dayToReports",authenticate,validateDateRange,validateDates,dayilyData)

export default report