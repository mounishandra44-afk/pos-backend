
import { prisma } from "../types/prisma";
import bcrypt from"bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { DATA_NOT_SAVED, DATA_UPDATED, EMAIL_FOUND, EMAIL_NOT_FOUND, INTERNAL_SERVER_ERROR, PASSWORD_SAVED } from "../constData/ErrorMessages";
import { hashingPassword } from "../commonfunctionalities/hasshingPassword";
dotenv.config();
export async function registerAdmin(reqBody: any): Promise<boolean> {

 try {
   const data = await prisma.shop_Owner.findFirst({
    where: { email: reqBody.email }
  });

  
  if (data) {
    return true;
  }
const hashedPass=await hashingPassword(reqBody.password)
 const adminData= await prisma.shop_Owner.create({
    data: {
      userName: reqBody.userName,
      phone: reqBody.phone,
      email: reqBody.email,
      password: hashedPass,
      shop_name: reqBody.shop_name,
      shop_type: reqBody.shop_type
    }
  });
const startDate = new Date(adminData.createdAt);
const expiryDate = new Date(startDate);
expiryDate.setMonth(expiryDate.getMonth() + 3);
 await prisma.subscriptionDetails.create({
    data: {
      shopId:adminData.id,
      subscriptionStartsAt:startDate,
      subscriptionEndsAt:expiryDate,
      subscriptionStatus:true

    }
  })

  return false;
 } catch (error) {
  return true
 }
}

export  async function checkAdminCredentials(reqQuires:any){
try {
  const data = await prisma.shop_Owner.findFirst({
    where: { 
      email: reqQuires.email 

    },
    include:{
      subscriptionDetails:true
    }
  });
// console.log(data)
  if(data){
    const isMatched=await bcrypt.compare(reqQuires.password,data.password)
    if(isMatched){
      // console.log("data matched");
const token=await jwt.sign(data,process.env.JWT_SECRET_KEY as string,{expiresIn:3*24*60*60})

        return token;
    }
    else{
        return "";
    }
  }
  return "";
} catch (error) {
  
}
}

export async function isEmailExsits(reqQuery:any):Promise<string> {
  try {
    const data=await prisma.shop_Owner.findFirst({
    where:{
      email:reqQuery.email
    }
  })
  if(!data){
    return EMAIL_NOT_FOUND
  }
  return EMAIL_FOUND
  } catch (error) {
    return INTERNAL_SERVER_ERROR;
  }
 
}

export async function saveThePassword(params:any) {
  try {
    const data=await prisma.shop_Owner.findFirst({
    where:{
      email:params.email
    }
  })
  if(!data){
    return EMAIL_NOT_FOUND
  }
  const pass=await hashingPassword(params.password)
  await prisma.shop_Owner.update({
    where:{
      email:params.email
    },
    data:{
      password:pass
    }
  })
  return PASSWORD_SAVED
  } catch (error) {
    return INTERNAL_SERVER_ERROR;
  }
}

export async function updateAdminData(reqBody:any,shopDetails:any):Promise<String> {
  try {
    // console.log(shopDetails);
  const data=  await prisma.shop_Owner.update({
      where:{id:shopDetails.shop_id},
      data:{
        email:reqBody.email,
        phone:reqBody.phone,
        shop_name:reqBody.shop_name,
        shop_type:reqBody.shop_type,
        welcomeMessage:reqBody.vist_message,
        gst_enabled:reqBody.gst_enabled,
        gst_percentage:reqBody.gst_percentage
      }
    })
    if(!data){
      return DATA_NOT_SAVED;
    }
    return DATA_UPDATED;
  } catch (error) {
    return INTERNAL_SERVER_ERROR;
  }
  
}