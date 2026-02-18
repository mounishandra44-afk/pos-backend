import { Request, Response } from "express";
import { Product } from "../types/ProductData";
import { getAllTheProductDetailsForParticularShop, saveDataFromTheFile, saveProductToShop } from "../services/Product";
import { INTERNAL_SERVER_ERROR } from "../constData/ErrorMessages";
import multer from "multer";
import fs from "fs";
import { parse } from "fast-csv";
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

export const csvData=async (req:Request,res:Response)=>{
   try {
  if (!req.file) {
    return res.status(400).send({
      isError: true,
      message: "No file uploaded"
    });
  }

  const productData: {
    productName: string,
    productCategory: string,
    productShortCut: string,
    price: number
  }[] = [];

  fs.createReadStream(req.file.path)
    .pipe(parse({
      headers: true,
      trim: true
    }))
    .on("error", async (error) => {
      console.error("CSV Error:", error);
      await fs.promises.unlink(req.file!.path);
      return res.status(500).json({ message: "CSV parsing error" });
    })
    .on("data", (row: any) => {
      productData.push({
        productName: row.product_Name,
        productCategory: row.category,
        productShortCut: row.shortCut_key,
        price: Number(row.product_Price)
      });
    })
    .on("end", async () => {
      console.log("Final productData:", productData);
      if (productData.length === 0) {
        await fs.promises.unlink(req.file!.path);
        return res.status(400).json({
          message: "CSV file is empty"
        });
      }
      const isSaved: any = await saveDataFromTheFile(
        productData,
        req.shop_Details
      );

      await fs.promises.unlink(req.file!.path);

      return res.status(isSaved.statusCode).json({
        isError: isSaved.isErr,
        data: isSaved.messages
      });
    });

} catch (error) {
  console.error(error);
  return res.status(500).json({
    isError: true,
    message: "Server error"
  });
}

}


export const getAllTheProductDetails=async (req:Request,res:Response) => {
    try {
       const products= await getAllTheProductDetailsForParticularShop(req.shop_Details);
        return  res.status(products.statusCode).json({
    isError: false,
    message: products.messages
  })
    } catch (error) {
        return res.status(500).json({
    isError: true,
    message: "Server error"
  });
    }
}