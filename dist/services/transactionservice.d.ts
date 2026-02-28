import { Prisma } from "@prisma/client";
type TransactionItemDTO = {
    productId: string;
    prod_quan: number;
};
export type CreateTransactionDTO = {
    customerName?: string;
    customerMobile?: string;
    warranty?: string | null;
    subtotal: number;
    gst?: number;
    total: number;
    paymentMethod: string;
    transac_Item: TransactionItemDTO[];
};
export declare const saveTransactionSer: (transactions: CreateTransactionDTO[], shop_Details: {
    shop_id: string;
}) => Promise<{
    isErr: boolean;
    statusCode: number;
    messages: string;
} | {
    isErr: boolean;
    statusCode: number;
    messages: {
        id: string;
        createdAt: Date;
        shopId: string;
        customerName: string | null;
        customerPhone: string | null;
        warranty: string | null;
        subtotal: Prisma.Decimal;
        gstAmount: Prisma.Decimal | null;
        discountAmount: Prisma.Decimal;
        totalAmount: Prisma.Decimal;
        paymentMethod: string;
    }[];
}>;
export {};
//# sourceMappingURL=transactionservice.d.ts.map