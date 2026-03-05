import express, { Request, Response } from "express";
import { authenticate } from "../middlewares/authentication";
import { getAdminData, normalizeSettingsPayload, updateAdminSettings, uploadSettingsQr } from "./settingsController";
import { requireAdmin } from "../middlewares/authorization";
import { updatedData, validateAdminData } from "../middlewares/DataValidation";

const settings=express.Router();

settings.get("/",authenticate,requireAdmin,getAdminData)
settings.put("/",authenticate,requireAdmin,uploadSettingsQr,normalizeSettingsPayload,updatedData,validateAdminData,updateAdminSettings)
export default settings;
