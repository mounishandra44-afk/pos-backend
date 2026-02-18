import express, { Request, Response } from "express";
import router from "../src/controllers/LoginRoute"

import myProduct from "./controllers/ProductRoute";
import transactionRouter from "./controllers/transationRoute";
import report from "./controllers/ReportRoute";
import cors from "cors";
import "./cron/checkingSubscriptionStatus.cron";

const app=express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json())


app.use("/user",router)
app.use("/product",myProduct)
app.use("/transaction",transactionRouter)
app.use("/report",report)
app.listen(8000,()=>console.log("the app is started 8000"))