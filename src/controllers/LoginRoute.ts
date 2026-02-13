import express, { Request, Response } from "express";
import { allData, loginDataVali, validateAdminData } from "../middlewares/DataValidation";
import { checkAdminCredentials, registerAdmin } from "../services/AdminService";
import { EMAIL_ALREADY_EXSITS, INVALID_CREDENTIALS, LOGIN_SUCCESSFULL, SHOP_ADMIN_CREATED } from "../constData/ErrorMessages";
import { Admin_shop, AdminLogin_Data } from "../types/AdminData";
import jwt from"jsonwebtoken";
const router=express.Router();
router.post("/adminRegister",allData,validateAdminData,async(req:Request<{},{},Admin_shop>,res:Response)=>{
console.log("BODY:", req.body);

    const isSaved:boolean= await registerAdmin(req.body);
    if(isSaved){
        return res.status(409).json({
            isError:true,
            message:EMAIL_ALREADY_EXSITS,
            data:{...req.body}
        })
    }
    res.status(200).json({
         isError:false,
            message:SHOP_ADMIN_CREATED,
            data:{...req.body}
    })


})

router.get("/login",loginDataVali,validateAdminData,async (req:Request<{},{},AdminLogin_Data>,res:Response)=>{
    const validCredentials= await checkAdminCredentials(req.query);
    if(!validCredentials){
        return res.status(401).json({
             isError:true,
            message:INVALID_CREDENTIALS,
            data:{...req.query}
        })
    }
    return res.status(200).json({
             isError:false,
            message:LOGIN_SUCCESSFULL,
            data:validCredentials
        })



})

export default router;