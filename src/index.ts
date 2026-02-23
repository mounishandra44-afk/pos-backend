import express, { Request, Response } from "express";
import router from "../src/controllers/LoginRoute"

import myProduct from "./controllers/ProductRoute";
import transactionRouter from "./controllers/transationRoute";
import report from "./controllers/ReportRoute";
import cors from "cors";
import "./cron/checkingSubscriptionStatus.cron";
import settings from "./controllers/SettingsRoute";
// "http://localhost:9002"
const app=express();
app.use(
  cors({
    origin: ["http://localhost:9002","http://192.168.0.12:9002","https://quickledger-bill.netlify.app","https://quick-ledger.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json())


app.use("/user",router)
app.use("/product",myProduct)
app.use("/transaction",transactionRouter)
app.use("/report",report)
app.use("/settings",settings)
app.listen(8000,"0.0.0.0",()=>console.log("the app is started 8000"))