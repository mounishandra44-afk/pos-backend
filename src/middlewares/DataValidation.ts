
import { query,body,param,validationResult } from "express-validator";
import { DATAMISSING, EMAIL_MUST_CONTAIN, INTERNAL_SERVER_ERROR, NOT_VALID_EMAIL, NOT_VALID_PHONE, PASSWORD_MUST_ALPHABET, PASSWORD_MUST_BE_IN_RANGE, PASSWORD_MUST_NUMBER, PASSWORD_MUST_SPECAIL, USERNAME_MIN_MAX } from "../constData/ErrorMessages";
import { NextFunction, Request, Response } from 'express';
import { ValidationResponseObject } from "../types/ResponseObject";
import { Admin_shop, AdminLogin_Data, NewPasswordData } from "../types/AdminData";

const validEmail=["gmail.com","outlook.com","yahoo.com","hotmail.com"]
export let allData=[
    body("userName")
    .trim()
    .notEmpty().withMessage(DATAMISSING).bail()
    .isLength({ min: 3, max: 50 }).withMessage(USERNAME_MIN_MAX)
    ,
    body("phone")
    .trim()
    .notEmpty().withMessage(DATAMISSING).bail()
    .matches(/^[0-9]{10}$/).withMessage(NOT_VALID_PHONE)
    ,
    body("email")
    .trim()
    .notEmpty().withMessage(DATAMISSING).bail()
    .custom((val) => {

  if (!val.includes("@")) {
    throw new Error(EMAIL_MUST_CONTAIN);
  }
  if (!validEmail.includes(val.split("@")[1])) {
    throw new Error(NOT_VALID_EMAIL);
  }
  return true;
})
,
body("password")
.trim()
.notEmpty().withMessage(DATAMISSING).bail()
.isLength({ min: 8, max: 50 }).withMessage(PASSWORD_MUST_BE_IN_RANGE).bail()
.custom((val)=>{
  if (!/[!@#$%^&*]/.test(val)) {
    throw new Error(PASSWORD_MUST_SPECAIL);
  }

  if (!/[0-9]/.test(val)) {
    throw new Error(PASSWORD_MUST_NUMBER);
  }

  if (!/[a-zA-Z]/.test(val)) {
    throw new Error(PASSWORD_MUST_ALPHABET);
  }
    return true;
})   
]


export let loginDataVali=[
     query("email")
    .trim()
    .notEmpty().withMessage(DATAMISSING).bail()
    .custom((val) => {

  if (!val.includes("@")) {
    throw new Error(EMAIL_MUST_CONTAIN);
  }
  if (!validEmail.includes(val.split("@")[1])) {
    throw new Error(NOT_VALID_EMAIL);
  }
  return true;
})
,
query("password")
.trim()
.notEmpty().withMessage(DATAMISSING).bail()
.isLength({ min: 8, max: 50 }).withMessage(PASSWORD_MUST_BE_IN_RANGE).bail()
.custom((val)=>{
  if (!/[!@#$%^&*]/.test(val)) {
    throw new Error(PASSWORD_MUST_SPECAIL);
  }

  if (!/[0-9]/.test(val)) {
    throw new Error(PASSWORD_MUST_NUMBER);
  }

  if (!/[a-zA-Z]/.test(val)) {
    throw new Error(PASSWORD_MUST_ALPHABET);
  }
    return true;
})   
]

export let forgetEmailVali=[
     query("email")
    .trim()
    .notEmpty().withMessage(DATAMISSING).bail()
    .custom((val) => {

  if (!val.includes("@")) {
    throw new Error(EMAIL_MUST_CONTAIN);
  }
  if (!validEmail.includes(val.split("@")[1])) {
    throw new Error(NOT_VALID_EMAIL);
  }
  return true;
})
]

// export let validatePass=[
//   query("password")
// .trim()
// .notEmpty().withMessage(DATAMISSING).bail()
// .isLength({ min: 8, max: 50 }).withMessage(PASSWORD_MUST_BE_IN_RANGE).bail()
// .custom((val)=>{
//   if (!/[!@#$%^&*]/.test(val)) {
//     throw new Error(PASSWORD_MUST_SPECAIL);
//   }

//   if (!/[0-9]/.test(val)) {
//     throw new Error(PASSWORD_MUST_NUMBER);
//   }

//   if (!/[a-zA-Z]/.test(val)) {
//     throw new Error(PASSWORD_MUST_ALPHABET);
//   }
//     return true;
// }) 
// ]

export let validateemailAndPass=[
     body("email")
    .trim()
    .notEmpty().withMessage(DATAMISSING).bail()
    .custom((val) => {

  if (!val.includes("@")) {
    throw new Error(EMAIL_MUST_CONTAIN);
  }
  if (!validEmail.includes(val.split("@")[1])) {
    throw new Error(NOT_VALID_EMAIL);
  }
  return true;
})
,
body("password")
.trim()
.notEmpty().withMessage(DATAMISSING).bail()
.isLength({ min: 8, max: 50 }).withMessage(PASSWORD_MUST_BE_IN_RANGE).bail()
.custom((val)=>{
  if (!/[!@#$%^&*]/.test(val)) {
    throw new Error(PASSWORD_MUST_SPECAIL);
  }

  if (!/[0-9]/.test(val)) {
    throw new Error(PASSWORD_MUST_NUMBER);
  }

  if (!/[a-zA-Z]/.test(val)) {
    throw new Error(PASSWORD_MUST_ALPHABET);
  }
    return true;
})   
]


export let updatedData=[
  
    body("phone")
    .trim()
    .notEmpty().withMessage(DATAMISSING).bail()
    .matches(/^[0-9]{10}$/).withMessage(NOT_VALID_PHONE)
    ,
    body("email")
    .trim()
    .notEmpty().withMessage(DATAMISSING).bail()
    .custom((val) => {

  if (!val.includes("@")) {
    throw new Error(EMAIL_MUST_CONTAIN);
  }
  if (!validEmail.includes(val.split("@")[1])) {
    throw new Error(NOT_VALID_EMAIL);
  }
  return true;
})
,
body("gst_percentage")
.notEmpty().withMessage("This can't be Empty").bail()
.isInt({min:0,max:50}).withMessage("GST will be in the range of 0 to 50")   
]


export const validateAdminData=  (req:Request<{},{},Admin_shop>,res:Response,next:NextFunction)=>{

  try {
     const error= validationResult(req );
    if(!error.isEmpty()){
       const validationErrors= error.array().map(err=>({
            field:err.type,
            message:err.msg
        }))
 return  res.status(400).json( new ValidationResponseObject(true,"fail",validationErrors))

    }
    next();

  } catch (error) {
    return  res.status(500).json( {
      isError:true,
      message:INTERNAL_SERVER_ERROR
    })
  }
    
   
}


// export const validateTheUserNewPassword=  (req:Request<{},{},NewPasswordData>,res:Response,next:NextFunction)=>{

//   try {
//      const error= validationResult(req );
//     if(!error.isEmpty()){
//        const validationErrors= error.array().map(err=>({
//             field:err.type,
//             message:err.msg
//         }))
//  return  res.status(400).json( new ValidationResponseObject(true,"fail",validationErrors))

//     }
//     next();

//   } catch (error) {
//     return  res.status(500).json( {
//       isError:true,
//       message:INTERNAL_SERVER_ERROR
//     })
//   }
    
   
// }


// export const validateAdminLoginData=  (req:Request<{},{},{},AdminLogin_Data>,res:Response,next:NextFunction)=>{

//   try {
//      const error= validationResult(req );
//     if(!error.isEmpty()){
//        const validationErrors= error.array().map(err=>({
//             field:err.type,
//             message:err.msg
//         }))
//  return  res.status(400).json( new ValidationResponseObject(true,"fail",validationErrors))

//     }
//     next();
//   } catch (error) {
//     return  res.status(500).json( {
//       isError:true,
//       message:INTERNAL_SERVER_ERROR
//     })
//   }
   
   
// }

// export const forgetPassword=  (req:Request<{},{},Admin_shop>,res:Response,next:NextFunction)=>{
//   try {
//      const error= validationResult(req );
//     if(!error.isEmpty()){
//        const validationErrors= error.array().map(err=>({
//             field:err.type,
//             message:err.msg
//         }))
//  return  res.status(400).json( new ValidationResponseObject(true,"fail",validationErrors))

//     }
//     next();
//   } catch (error) {
//     return  res.status(500).json( {
//       isError:true,
//       message:INTERNAL_SERVER_ERROR
//     })
//   }
   
// }



