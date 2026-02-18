import { Transaction } from './../types/TransactionData';
import express, { Request, Response } from "express";
import { authenticate } from "../middlewares/authentication";
import { saveTransactionCon } from './transationControllerFunction';
const transactionRouter=express.Router();
transactionRouter.post("/saveTransaction",authenticate,saveTransactionCon)
export default transactionRouter;

