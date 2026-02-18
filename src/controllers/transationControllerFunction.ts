import express, { Request, Response } from "express";
import { Transaction } from "../types/TransactionData";
import { saveTransactionSer } from "../services/transactionservice";

export const saveTransactionCon=async (req:Request<{},{},Transaction>,res:Response) => {
    try {
        const transaction= await saveTransactionSer(req.body,req.shop_Details);
        let obj={
            isError:transaction.isErr,
            data:transaction.messages
        }
        return res.status(transaction.statusCode).json(obj)
    } catch (error) {
         return {statusCode:500,messages:error,isErr:true};
    }
   
}