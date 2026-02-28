import express, { Request, Response } from "express";
import { authenticate } from "../middlewares/authentication";
import { getAdminData } from "./settingsController";
import { requireAdmin } from "../middlewares/authorization";

const settings=express.Router();

settings.get("/",authenticate,requireAdmin,getAdminData)
export default settings;
