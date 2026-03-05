import express, { Request, Response } from "express";
import router from "../src/controllers/LoginRoute"

import myProduct from "./controllers/ProductRoute";
import transactionRouter from "./controllers/transationRoute";
import report from "./controllers/ReportRoute";
import cors from "cors";
import "./cron/checkingSubscriptionStatus.cron";
import settings from "./controllers/SettingsRoute";
import path from "path";
// "http://localhost:9002"
const app=express();
app.use(
  cors({
    origin: ["http://localhost:9002","http://192.168.0.16:9002","https://fasttrackbill.netlify.app","https://quick-ledger.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json({ limit: "5mb" }))
app.use("/paymentqr", express.static(path.resolve(process.cwd(), "paymentqr")));


app.use("/user",router)
app.use("/product",myProduct)
app.use("/transaction",transactionRouter)
app.use("/report",report)
app.use("/settings",settings)
app.listen(8000,()=>console.log("the app is started 8000"))