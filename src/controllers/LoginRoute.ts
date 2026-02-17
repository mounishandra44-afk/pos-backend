import express, { Request, Response } from "express";
import { allData, forgetEmailVali, loginDataVali, updatedData, validateAdminData, validateemailAndPass } from "../middlewares/DataValidation";
import { checkAdminCredentials, isEmailExsits, registerAdmin, saveThePassword, updateAdminData } from "../services/AdminService";
import { DATA_NOT_SAVED, DATA_UPDATED, EMAIL_ALREADY_EXSITS, EMAIL_FOUND, EMAIL_NOT_FOUND, INTERNAL_SERVER_ERROR, INVALID_CREDENTIALS, LOGIN_SUCCESSFULL, PASSWORD_SAVED, SHOP_ADMIN_CREATED } from "../constData/ErrorMessages";
import { Admin_shop, AdminLogin_Data, NewPasswordData } from "../types/AdminData";
import { authenticate } from "../middlewares/authentication";
import { AuthRequest } from "../types/customRequest";
const router=express.Router();
router.post("/adminRegister",allData,validateAdminData,async(req:Request<{},{},Admin_shop>,res:Response)=>{
try {
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
} catch (error) {
    return res.status(500).json({
             isError:true,
            message:INTERNAL_SERVER_ERROR,
            data:error
        })
}

    


})

router.get("/login",loginDataVali,validateAdminData,async (req:Request<{},{},AdminLogin_Data>,res:Response)=>{
   try {
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
   } catch (error) {
    return res.status(500).json({
             isError:true,
            message:INTERNAL_SERVER_ERROR,
            data:error
        })
   }
})

router.get("/forgetPassword",forgetEmailVali,validateAdminData,async(req:Request,res:Response)=>{
    try {
        const data=await isEmailExsits(req.query);
        if(data===EMAIL_FOUND){
           return res.status(200).json({
             isError:false,
            message:"success",
            data:EMAIL_FOUND
        })
        }
        else if(data===EMAIL_NOT_FOUND){
            return res.status(401).json({
             isError:true,
            message:"fail",
            data:EMAIL_NOT_FOUND
        })
        }
        else{
          return res.status(500).json({
             isError:true,
            message:"fail",
            data:data
        })  
        }
    } catch (error) {
        return res.status(500).json({
             isError:true,
            message:INTERNAL_SERVER_ERROR,
            data:error
        })
    }

})

router.put("/updateTheNewPassword",validateemailAndPass,validateAdminData,async(req:Request<{},{},NewPasswordData>,res:Response)=>{
    try {
     const data=await saveThePassword(req.body);
     
    if(data===PASSWORD_SAVED){
          return res.status(200).json({
             isError:false,
            message:"success",
            data:PASSWORD_SAVED
        })
    } 
    else if(data===EMAIL_NOT_FOUND){
          return res.status(401).json({
             isError:true,
            message:"fail",
            data:EMAIL_NOT_FOUND
        })
    }
    else{
          return res.status(500).json({
             isError:true,
            message:"fail",
            data:data
        })  
        }
    
    } catch (error) {
         return res.status(500).json({
             isError:true,
            message:INTERNAL_SERVER_ERROR,
            data:error
        })
    }
   
})

router.put("/updateUser",authenticate,updatedData,validateAdminData,async(req:Request,res:Response)=>{
    try {
         const message=await updateAdminData(req.body,req.shop_Details)
         if(message===DATA_NOT_SAVED){
            return res.status(401).json({
             isError:true,
            message:"fail",
            data:DATA_NOT_SAVED
        })
         }
         else if(message===DATA_UPDATED){
            return res.status(200).json({
             isError:false,
            message:"success",
            data:DATA_UPDATED
        })
         }
         else{
             return res.status(200).json({
             isError:false,
            message:"success",
            data:message
        })
         }
    } catch (error) {
        return res.status(500).json({
             isError:true,
            message:INTERNAL_SERVER_ERROR,
            data:error
        })
    }
   
})

export default router;