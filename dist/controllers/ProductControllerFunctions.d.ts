import { Request, Response } from "express";
import { Product } from "../types/ProductData";
export declare const saveProduct: (req: Request<{}, {}, Product>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const csvData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllTheProductDetails: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=ProductControllerFunctions.d.ts.map