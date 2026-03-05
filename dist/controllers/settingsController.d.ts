import express, { Request, Response } from "express";
export declare const uploadSettingsQr: express.RequestHandler;
export declare const normalizeSettingsPayload: express.RequestHandler;
export declare const getAdminData: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const updateAdminSettings: (req: Request, res: Response) => Promise<express.Response<any, Record<string, any>>>;
//# sourceMappingURL=settingsController.d.ts.map