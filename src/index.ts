// import { sign } from './../node_modules/effect/src/BigDecimal';
// import express, { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import { Student } from './types/Student';
// import { AdminData } from "./types/Admin";
// import bcrypt from "bcrypt";
// import { Login } from "./types/LoginData";
// import jwt from 'jsonwebtoken';
// import router from "../src/controllers/LoginRoute"
// const app=express();
// const prismaClient=new PrismaClient();

// app.use(express.json())

// app.use("/user",router)

// const secret="my name is mounish";
// async function saveData(){
// await prismaClient.user.createMany({
//     data:[
//         {name:"Mounish",email:"andramounish@gmail.com"},
//          {name:"Manoj",email:"andramanoj@gmail.com"},
//     ]
// })
// }

// app.post("/register",async (
//   req: Request<{}, {}, AdminData>,
//   res: Response
// )=>{
//     console.log(req.body);
//     const {name,email,password}=req.body;
// const hasedPass=await bcrypt.hash(password,10);
// let obj={
//     name:name,
//     email:email,
//     password:hasedPass
// }
//   const createdUser= await prismaClient.admin.create({data:obj})
//   res.status(200).send(`admin registered successfully ${createdUser.name}`);

// } )


// app.get("/login",async (req:Request<{},{},{},Login>,res:Response)=>{
//   const{adminEmail,adminPassword}=  req.query
// const admin=  await prismaClient.admin.findFirst({
//    where:{
//     email:adminEmail
// }
// })

// if(!admin){
// return res.status(400).send("admin not found");
// }
// else{
// const isMatch= await bcrypt.compare(adminPassword,admin.password)
// if(isMatch){
//    const token= await jwt.sign(admin,secret,{expiresIn:3*24*60*60})
//     return res.status(200).json(
        
//         {
//             message:"login successful",
//             myToken:token

//         }
//     );
   
// }
// else{
//     return res.status(400).send("admin entered password is incorrect");
// }
// }

// })

// app.get("/",(req:Request,res:Response)=>{
//     saveData()
// res.status(200).send("data is saved successfully in the database")
// })

// app.get('/userDetailsById/:id',async (req:Request,res:Response)=>{
//     try {
//         const obj=Number(req.params.id);
//         if(isNaN(obj)){
//           return  res.status(400).send("the value you are passed in not  a number")
//         }
//         const user=await prismaClient.user.findUnique({
//     where :{id:obj}
// })

// if(!user){
//     return res.status(400).send("user not found");
// }
// res.status(200).send(user);
// //  res.json(user);
//     } catch (Error) {
//       return res.status(500).send("internall server error");
//     }


// })

// app.get('/getTheStudentDetails',async (req:Request<{},{},{},Student>,res:Response)=>{
//     try {
//     const{country,isMarried,age}=req.query;

//     if( typeof isMarried=="string" && typeof country=="string" ){
//        const student= await prismaClient.student.findMany({
//             where:{
//                 OR:[{isMarried:true},{country:"India"}]
//              }
//         })
//         if(!student){
//             return res.status(400).send("student not found")
//         }
//         return res.status(200).send(student);
//     }
//     return res.status(400).send("the query parameters are not valid")

//     } catch (error) {
//         return res.status(500).send("there is a inteernal error");
//     }
// })


// app.get("/getDetailsFromOneToOne",async (req:Request,res:Response)=>{

//     try {
//          const user= await prismaClient.user.findUnique({
//         where:{id:1},
//         select:{email:true,
//             aadhar:{
//                 select:{
//                     adhaarNumber:true
//                 }
//             }
//         }
//     })

//      const parsedData=JSON.stringify(user,(key,value)=>{
//     if(typeof value==="bigint"){
//         return value.toString();
//     }
//     return value;
//    })
//     return res.status(200).send(parsedData)
//     } catch (error) {
       
//         return res.status(500).send(error)
//     }
// })

// app.get("/allDataFromUSer",async(req:Request,res:Response)=>{
//    const user= await prismaClient.user.findMany({include:{aadhar:true}});

//    const parsedData=JSON.stringify(user,(key,value)=>{
//     if(typeof value=="bigint"){
//         return value.toString();
//     }
//     return value;
//    })
//    res.status(200).send(parsedData);
// } )
import express, { Request, Response } from "express";
import router from "../src/controllers/LoginRoute"

import myProduct from "./controllers/ProductRoute";
import transactionRouter from "./controllers/transationRoute";
const app=express();


app.use(express.json())

app.use("/user",router)
app.use("/product",myProduct)
app.use("/transaction",transactionRouter)
app.listen(8000,()=>console.log("the app is started 8000"))