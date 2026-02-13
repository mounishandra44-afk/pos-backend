
import { prisma } from "../types/prisma";
import bcrypt from"bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();
export async function registerAdmin(reqBody: any): Promise<boolean> {

  const data = await prisma.shop_Owner.findFirst({
    where: { email: reqBody.email }
  });

  
  if (data) {
    return true;
  }
const hashedPass=await bcrypt.hash(reqBody.password,10);
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
