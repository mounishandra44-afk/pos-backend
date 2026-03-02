import { Prisma } from "@prisma/client";
type CloseShopPayload = {
    date?: string;
    totalRevenue?: number;
    totalBills?: number;
    shopId?: string;
};
export declare const getDailyReportData: (queryDates: any, shopDetails: any) => Promise<{
    isErr: boolean;
    statusCode: number;
    messages: {
        total: number | Prisma.Decimal;
        count: number;
    };
} | {
    isErr: boolean;
    statusCode: number;
    messages: string;
}>;
export declare const getOverViewData: (shopDetails: any) => Promise<{
    isErr: boolean;
    statusCode: number;
    messages: {
        totalTransactions: number;
        totalRevenue: number;
        averageTransaction: number;
        busiestHour: {
            hour: number;
            transactions: number;
        } | null;
    };
} | {
    isErr: boolean;
    statusCode: number;
    messages: string;
}>;
export declare const getDashboardData: (shopDetails: any) => Promise<{
    isErr: boolean;
    statusCode: number;
    messages: {
        totalTransactions: number;
        totalRevenue: number;
        averageTransaction: number;
        busiestHour: {
            hour: number;
            transactions: number;
        } | null;
        last7Days: {
            date: Date;
            totalAmount: number;
            totalTransactions: number;
        }[];
    };
} | {
    isErr: boolean;
    statusCode: number;
    messages: string;
}>;
export declare const getLast30DaysData: (shopDetails: any) => Promise<{
    isErr: boolean;
    statusCode: number;
    messages: {
        week: number;
        totalAmount: number;
        totalTransactions: number;
    }[];
} | {
    isErr: boolean;
    statusCode: number;
    messages: string;
}>;
export declare const getLastYearData: (shopDetails: any) => Promise<{
    isErr: boolean;
    statusCode: number;
    messages: {
        month: number;
        totalAmount: number;
        totalTransactions: number;
    }[];
} | {
    isErr: boolean;
    statusCode: number;
    messages: string;
}>;
export declare const saveCloseShopReport: (payload: CloseShopPayload, shopDetails: any) => Promise<{
    isErr: boolean;
    statusCode: number;
    messages: string;
} | {
    isErr: boolean;
    statusCode: number;
    messages: {
        message: string;
        data: {
            id: string;
            createdAt: Date;
            shopId: string;
            salesamount: Prisma.Decimal;
            salesCount: number;
        };
    };
}>;
export {};
//# sourceMappingURL=ReportsService.d.ts.map