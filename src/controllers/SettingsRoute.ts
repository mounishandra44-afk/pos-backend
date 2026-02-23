import express, { Request, Response } from "express";
import { authenticate } from "../middlewares/authentication";
import { getAdminData } from "./settingsController";

const settings=express.Router();

settings.get("/",authenticate,getAdminData)
export default settings;
