import express, { Request, Response } from "express";
import { authenticate } from "../middlewares/authentication";
import { productData, validateAdminData, validateProductData } from "../middlewares/DataValidation";
import { csvData, getAllTheProductDetails, saveProduct, updateProduct } from "./ProductControllerFunctions";
import multer from "multer";
import fs from "fs";
import { parse } from "fast-csv";
import { saveDataFromTheFile } from "../services/Product";
const upload = multer({
  dest: "uploads/",
});
const myProduct=express.Router();
myProduct.post("/addProduct",authenticate,productData,validateProductData,saveProduct)

myProduct.post("/uploadCsv",authenticate,upload.single("file"),csvData)

myProduct.get("/getProducts",authenticate,getAllTheProductDetails)
myProduct.put("/updateProduct",authenticate,productData,validateProductData,updateProduct)
export default myProduct;