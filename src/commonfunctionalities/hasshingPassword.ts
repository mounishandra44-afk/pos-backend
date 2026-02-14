import bcrypt from "bcrypt"

export async function hashingPassword(userPassword:string):Promise<string> {
    const data:string =await bcrypt.hash(userPassword,10);
    return data;
}