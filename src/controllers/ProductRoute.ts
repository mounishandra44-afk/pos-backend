import express, { Request, Response } from "express";
import { authenticate } from "../middlewares/authentication";
import { productData, validateAdminData, validateProductData } from "../middlewares/DataValidation";
import { saveProduct } from "./ProductControllerFunctions";

const myProduct=express.Router();
myProduct.post("/addProduct",authenticate,productData,validateProductData,saveProduct)

export default myProduct;