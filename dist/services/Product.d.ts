export declare const findProductInShop: (shopDetails: any, name: string, category: string) => Promise<{
    gst_percentage: number;
    category: string;
    quantity: number;
    id: string;
    gst_enabled: boolean;
    product_Name: string;
    product_Price: import("@prisma/client/runtime/library").Decimal;
    shortCut_key: string;
    shop_id: string;
} | null>;
export declare function saveProductToShop(productDetails: any, shopDetails: any): Promise<{
    gst_percentage: number;
    category: string;
    quantity: number;
    id: string;
    gst_enabled: boolean;
    product_Name: string;
    product_Price: import("@prisma/client/runtime/library").Decimal;
    shortCut_key: string;
    shop_id: string;
}>;
export declare function saveDataFromTheFile(fileData: {
    productName: string;
    productCategory: string;
    productShortCut?: string;
    price: number;
    quantity?: number;
    gstApplicable?: boolean;
    gstRate?: number;
}[], shop_data: any): Promise<any>;
export declare function getAllTheProductDetailsForParticularShop(shopDetails: any): Promise<{
    statusCode: number;
    messages: unknown;
    isErr: boolean;
}>;
export declare const updateProductData: (reqBody: any, shop_Details: any) => Promise<{
    statusCode: number;
    isError: boolean;
    message: string;
    data: {
        gst_percentage: number;
        category: string;
        quantity: number;
        id: string;
        gst_enabled: boolean;
        product_Name: string;
        product_Price: import("@prisma/client/runtime/library").Decimal;
        shortCut_key: string;
        shop_id: string;
    } | null;
} | {
    statusCode: number;
    isError: boolean;
    message: any;
    data: null;
}>;
//# sourceMappingURL=Product.d.ts.map