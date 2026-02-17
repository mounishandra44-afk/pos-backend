import { Request, Response } from "express";
import { Product } from "../types/ProductData";
import { saveProductToShop } from "../services/Product";
import { INTERNAL_SERVER_ERROR } from "../constData/ErrorMessages";

export const saveProduct= async (req:Request<{},{},Product>,res:Response) => {
    try {
         const data= await saveProductToShop(req.body,req.shop_Details)
         if(data){
             res.status(401).json({
                     isError:data,
                    message:"fail",
                    data:"product Data Didn't saved."
                })
         }
         res.status(200).json({
                     isError:data,
                    message:"success",
                    data:"product Data saved."
                })
    } catch (error) {
        res.status(500).json({
                     isError:true,
                    message:INTERNAL_SERVER_ERROR,
                    data:error
                })

       }
   
}