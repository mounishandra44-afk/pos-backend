"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDates = exports.validateProductData = exports.validateAdminData = exports.validateDateRange = exports.productData = exports.staffDataVali = exports.updatedData = exports.validateemailAndPass = exports.forgetEmailVali = exports.loginDataVali = exports.allData = void 0;
const express_validator_1 = require("express-validator");
const ErrorMessages_1 = require("../constData/ErrorMessages");
const ResponseObject_1 = require("../types/ResponseObject");
const validEmail = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com"];
exports.allData = [
    (0, express_validator_1.body)("userName")
        .trim()
        .notEmpty().withMessage(ErrorMessages_1.DATAMISSING).bail()
        .isLength({ min: 3, max: 50 }).withMessage(ErrorMessages_1.USERNAME_MIN_MAX),
    (0, express_validator_1.body)("phone")
        .trim()
        .notEmpty().withMessage(ErrorMessages_1.DATAMISSING).bail()
        .matches(/^[0-9]{10}$/).withMessage(ErrorMessages_1.NOT_VALID_PHONE),
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty().withMessage(ErrorMessages_1.DATAMISSING).bail()
        .custom((val) => {
        if (!val.includes("@")) {
            throw new Error(ErrorMessages_1.EMAIL_MUST_CONTAIN);
        }
        if (!validEmail.includes(val.split("@")[1])) {
            throw new Error(ErrorMessages_1.NOT_VALID_EMAIL);
        }
        return true;
    }),
    (0, express_validator_1.body)("password")
        .trim()
        .notEmpty().withMessage(ErrorMessages_1.DATAMISSING).bail()
        .isLength({ min: 8, max: 50 }).withMessage(ErrorMessages_1.PASSWORD_MUST_BE_IN_RANGE).bail()
        .custom((val) => {
        if (!/[!@#$%^&*]/.test(val)) {
            throw new Error(ErrorMessages_1.PASSWORD_MUST_SPECAIL);
        }
        if (!/[0-9]/.test(val)) {
            throw new Error(ErrorMessages_1.PASSWORD_MUST_NUMBER);
        }
        if (!/[a-zA-Z]/.test(val)) {
            throw new Error(ErrorMessages_1.PASSWORD_MUST_ALPHABET);
        }
        return true;
    })
];
exports.loginDataVali = [
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty().withMessage(ErrorMessages_1.DATAMISSING).bail()
        .custom((val) => {
        if (!val.includes("@")) {
            throw new Error(ErrorMessages_1.EMAIL_MUST_CONTAIN);
        }
        if (!validEmail.includes(val.split("@")[1])) {
            throw new Error(ErrorMessages_1.NOT_VALID_EMAIL);
        }
        return true;
    }),
    (0, express_validator_1.body)("password")
        .trim()
        .notEmpty().withMessage(ErrorMessages_1.DATAMISSING).bail()
        .isLength({ min: 8, max: 50 }).withMessage(ErrorMessages_1.PASSWORD_MUST_BE_IN_RANGE).bail()
        .custom((val) => {
        if (!/[!@#$%^&*]/.test(val)) {
            throw new Error(ErrorMessages_1.PASSWORD_MUST_SPECAIL);
        }
        if (!/[0-9]/.test(val)) {
            throw new Error(ErrorMessages_1.PASSWORD_MUST_NUMBER);
        }
        if (!/[a-zA-Z]/.test(val)) {
            throw new Error(ErrorMessages_1.PASSWORD_MUST_ALPHABET);
        }
        return true;
    })
];
exports.forgetEmailVali = [
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty().withMessage(ErrorMessages_1.DATAMISSING).bail()
        .custom((val) => {
        if (!val.includes("@")) {
            throw new Error(ErrorMessages_1.EMAIL_MUST_CONTAIN);
        }
        if (!validEmail.includes(val.split("@")[1])) {
            throw new Error(ErrorMessages_1.NOT_VALID_EMAIL);
        }
        return true;
    })
];
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
exports.validateemailAndPass = [
    //      body("email")
    //     .trim()
    //     .notEmpty().withMessage(DATAMISSING).bail()
    //     .custom((val) => {
    //   if (!val.includes("@")) {
    //     throw new Error(EMAIL_MUST_CONTAIN);
    //   }
    //   if (!validEmail.includes(val.split("@")[1])) {
    //     throw new Error(NOT_VALID_EMAIL);
    //   }
    //   return true;
    // })
    // ,
    (0, express_validator_1.body)("password")
        .trim()
        .notEmpty().withMessage(ErrorMessages_1.DATAMISSING).bail()
        .isLength({ min: 8, max: 50 }).withMessage(ErrorMessages_1.PASSWORD_MUST_BE_IN_RANGE).bail()
        .custom((val) => {
        if (!/[!@#$%^&*]/.test(val)) {
            throw new Error(ErrorMessages_1.PASSWORD_MUST_SPECAIL);
        }
        if (!/[0-9]/.test(val)) {
            throw new Error(ErrorMessages_1.PASSWORD_MUST_NUMBER);
        }
        if (!/[a-zA-Z]/.test(val)) {
            throw new Error(ErrorMessages_1.PASSWORD_MUST_ALPHABET);
        }
        return true;
    })
];
exports.updatedData = [
    (0, express_validator_1.body)("phone")
        .trim()
        .notEmpty().withMessage(ErrorMessages_1.DATAMISSING).bail()
        .matches(/^[0-9]{10}$/).withMessage(ErrorMessages_1.NOT_VALID_PHONE),
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty().withMessage(ErrorMessages_1.DATAMISSING).bail()
        .custom((val) => {
        if (!val.includes("@")) {
            throw new Error(ErrorMessages_1.EMAIL_MUST_CONTAIN);
        }
        if (!validEmail.includes(val.split("@")[1])) {
            throw new Error(ErrorMessages_1.NOT_VALID_EMAIL);
        }
        return true;
    }),
    (0, express_validator_1.body)("gst_percentage")
        .notEmpty().withMessage("This can't be Empty").bail()
        .isInt({ min: 0, max: 50 }).withMessage("GST will be in the range of 0 to 50")
];
exports.staffDataVali = [
    (0, express_validator_1.body)("username")
        .trim()
        .notEmpty().withMessage(ErrorMessages_1.DATAMISSING).bail()
        .isLength({ min: 3, max: 50 }).withMessage(ErrorMessages_1.USERNAME_MIN_MAX),
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty().withMessage(ErrorMessages_1.DATAMISSING).bail()
        .isEmail().withMessage(ErrorMessages_1.NOT_VALID_EMAIL),
    (0, express_validator_1.body)("password")
        .trim()
        .notEmpty().withMessage(ErrorMessages_1.DATAMISSING).bail()
        .isLength({ min: 6, max: 50 }).withMessage("Password length must be in the range of 6 and 50")
];
exports.productData = [
    (0, express_validator_1.body)("name")
        .trim()
        .notEmpty().withMessage("Name can't be empty"),
    (0, express_validator_1.body)("category")
        .trim()
        .notEmpty().withMessage("Category can't be empty"),
    (0, express_validator_1.body)("price")
        .trim()
        .exists({ checkFalsy: true }).withMessage("Price can't be empty")
        .bail()
        .isFloat({ min: 1, max: 100000 }).withMessage("Product price must be between 1 and 100000")
];
exports.validateDateRange = [
    (0, express_validator_1.query)("fromDate")
        .notEmpty().withMessage("From date is required").bail()
        .isISO8601().withMessage("From date must be valid ISO format").bail()
        .toDate(),
    (0, express_validator_1.query)("toDate")
        .notEmpty().withMessage("To date is required").bail()
        .isISO8601().withMessage("To date must be valid ISO format").bail()
        .toDate(),
    (0, express_validator_1.query)("toDate").custom((value, { req }) => {
        const from = new Date(req.query?.fromDate);
        const to = new Date(value);
        if (from > to) {
            throw new Error("From date cannot be greater than To date");
        }
        return true;
    })
];
const validateAdminData = (req, res, next) => {
    try {
        const error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            const validationErrors = error.array().map(err => ({
                field: err.type,
                message: err.msg
            }));
            return res.status(400).json(new ResponseObject_1.ValidationResponseObject(true, "fail", validationErrors));
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            isError: true,
            message: ErrorMessages_1.INTERNAL_SERVER_ERROR
        });
    }
};
exports.validateAdminData = validateAdminData;
const validateProductData = (req, res, next) => {
    try {
        const error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            const validationErrors = error.array().map(err => ({
                field: err.type,
                message: err.msg
            }));
            return res.status(400).json(new ResponseObject_1.ValidationResponseObject(true, "fail", validationErrors));
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            isError: true,
            message: ErrorMessages_1.INTERNAL_SERVER_ERROR
        });
    }
};
exports.validateProductData = validateProductData;
const validateDates = (req, res, next) => {
    try {
        const error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            const validationErrors = error.array().map(err => ({
                field: err.type,
                message: err.msg
            }));
            return res.status(400).json(new ResponseObject_1.ValidationResponseObject(true, "fail", validationErrors));
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            isError: true,
            message: ErrorMessages_1.INTERNAL_SERVER_ERROR
        });
    }
};
exports.validateDates = validateDates;
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
//# sourceMappingURL=DataValidation.js.map