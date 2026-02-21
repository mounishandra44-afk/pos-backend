import { Request,Response } from "express";
import { getDailyReportData, getOverViewData } from "../services/ReportsService";
import { Dates } from "../types/FromDateToDate";

export const dayilyData = async (req: Request, res: Response) => {
  try {
    const dateReport = await getDailyReportData(req.query, req.shop_Details);

    return res.status(dateReport.statusCode).json({
      isError: dateReport.isErr,
      data: dateReport.messages,
    });

  } catch (error) {
    console.error("Daily report error:", error);

    return res.status(500).json({
      isError: true,
      message: "Unexpected server error",
    });
  }
};


export const overviewData=async(req:Request,res:Response)=>{
    try {
      const shopOverview=  await getOverViewData(req.shop_Details);
      return res.status(shopOverview.statusCode).send(shopOverview.messages)
      
    } catch (error) {
         return {statusCode:500,messages:error,isErr:true};
    }
}