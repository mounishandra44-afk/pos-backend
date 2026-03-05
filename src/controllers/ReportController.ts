import { Request,Response } from "express";
import { getDailyReportData, getDashboardData, getLast30DaysData, getLastYearData, getOverViewData, saveCloseShopReport } from "../services/ReportsService";
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

export const dashboardData = async (req: Request, res: Response) => {
  try {
    const result = await getDashboardData(req.shop_Details);
    // console.log(result)
    return res.status(result.statusCode).json({
      isError: result.isErr,
      data: result.messages,
    });

  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      isError: true,
      message: "Unexpected server error",
    });
  }
};

export const last30DaysController = async (req: Request, res: Response) => {
  try {
    const result = await getLast30DaysData(req.shop_Details);

    return res.status(result.statusCode).json({
      isError: result.isErr,
      data: result.messages
    });

  } catch (error) {
    console.error("Last 30 Days Controller Error:", error);

    return res.status(500).json({
      isError: true,
      message: "Unexpected server error"
    });
  }
};

export const last1YearController = async (req: Request, res: Response) => {
  try {
    const result = await getLastYearData(req.shop_Details);

    return res.status(result.statusCode).json({
      isError: result.isErr,
      data: result.messages
    });

  } catch (error) {
    console.error("Last 1 Year Controller Error:", error);

    return res.status(500).json({
      isError: true,
      message: "Unexpected server error"
    });
  }
};

export const closeShopController = async (req: Request, res: Response) => {
  try {
    const result = await saveCloseShopReport(req.body, req.shop_Details);

    if (result.isErr) {
      return res.status(result.statusCode).json({
        isError: true,
        message: result.messages,
        data: {}
      });
    }

    const payload = result.messages as {
      message: string;
      data: unknown;
    };

    return res.status(result.statusCode).json({
      isError: false,
      message: payload.message,
      data: payload.data
    });
  } catch {
    return res.status(500).json({
      isError: true,
      message: "Unexpected server error",
      data: {}
    });
  }
};


