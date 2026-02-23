import express, { Request, Response } from "express";
import { getAdminDataSer } from "../services/SettingService";
export const getAdminData=async (req:Request,res:Response) => {
    try {
        const adminData=await getAdminDataSer(req.shop_Details);
        if(adminData){
           return res.status(200).json({
            isError:false,
            message:"Admin Data fetched Successfully",
            data:adminData
        }) 
    }
    res.status(400).json({
            isError:true,
            message:"Admin Not Found",
            data:{}
        }) 
       
    } catch (error) {
        return res.status(500).json({
            isError:true,
            message:"Internal Server Error",
            data:{}
        })
    }
}