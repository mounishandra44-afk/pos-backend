import { Request,Response } from "express";
import { getDailyReportData } from "../services/ReportsService";
import { Dates } from "../types/FromDateToDate";

export const dayilyData=async(req:Request,res:Response)=>{
    try {
      const dateReport=  await getDailyReportData(req.query,req.shop_Details);
      return res.status(dateReport.statusCode).send(dateReport.messages)
    } catch (error) {
         return {statusCode:500,messages:error,isErr:true};
    }
}