
import { prisma } from "../types/prisma";
import bcrypt from"bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { DATA_NOT_SAVED, DATA_UPDATED, EMAIL_FOUND, EMAIL_NOT_FOUND, INTERNAL_SERVER_ERROR, PASSWORD_SAVED } from "../constData/ErrorMessages";
import { hashingPassword } from "../commonfunctionalities/hasshingPassword";
dotenv.config();
export async function registerAdmin(reqBody: any): Promise<boolean> {

  const data = await prisma.shop_Owner.findFirst({
    where: { email: reqBody.email }
  });

  
  if (data) {
    return true;
  }
const hashedPass=await hashingPassword(reqBody.password)
  await prisma.shop_Owner.create({
    data: {
      userName: reqBody.userName,
      phone: reqBody.phone,
      email: reqBody.email,
      password: hashedPass,
      shop_name: reqBody.shop_name,
      shop_type: reqBody.shop_type
    }
  });

  return false;
}

export  async function checkAdminCredentials(reqQuires:any){
const data = await prisma.shop_Owner.findFirst({
    where: { email: reqQuires.email }
  });

  if(data){
    const isMatched=await bcrypt.compare(reqQuires.password,data.password)
    if(isMatched){
const token=await jwt.sign(data,process.env.JWT_SECRET_KEY as string,{expiresIn:3*24*60*60})
        return token;
    }
    else{
        return "";
    }
  }
  return "";
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
    console.log(shopDetails);
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