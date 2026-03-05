import { NextFunction, Request, Response } from 'express';
import { Admin_shop } from "../types/AdminData";
import { Product } from "../types/ProductData";
export declare let allData: import("express-validator").ValidationChain[];
export declare let loginDataVali: import("express-validator").ValidationChain[];
export declare let forgetEmailVali: import("express-validator").ValidationChain[];
export declare let validateemailAndPass: import("express-validator").ValidationChain[];
export declare let updatedData: import("express-validator").ValidationChain[];
export declare const staffDataVali: import("express-validator").ValidationChain[];
export declare let productData: import("express-validator").ValidationChain[];
export declare const validateDateRange: import("express-validator").ValidationChain[];
export declare const validateAdminData: (req: Request<{}, {}, Admin_shop>, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateProductData: (req: Request<{}, {}, Product>, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateDates: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=DataValidation.d.ts.map