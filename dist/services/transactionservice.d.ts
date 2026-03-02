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
export declare const saveTransactionSer: (transactions: CreateTransactionDTO[] | CreateTransactionDTO, shop_Details: {
    shop_id: string;
}) => Promise<{
    isErr: boolean;
    statusCode: number;
    messages: string;
} | {
    isErr: boolean;
    statusCode: number;
    messages: any[];
}>;
export {};
//# sourceMappingURL=transactionservice.d.ts.map