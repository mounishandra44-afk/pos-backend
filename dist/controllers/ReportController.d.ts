import { Request, Response } from "express";
export declare const dayilyData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const overviewData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | {
    statusCode: number;
    messages: unknown;
    isErr: boolean;
}>;
export declare const dashboardData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const last30DaysController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const last1YearController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=ReportController.d.ts.map