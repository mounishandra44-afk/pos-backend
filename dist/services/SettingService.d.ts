export declare const getAdminDataSer: (shopDetails: any) => Promise<({
    staff: {
        email: string;
        username: string;
        id: string;
        createdAt: Date;
        role: string;
    }[];
} & {
    userName: string;
    phone: string;
    email: string;
    password: string;
    gst_percentage: number;
    id: string;
    shop_name: string;
    shop_type: string;
    refreshToken: string | null;
    gst_enabled: boolean;
    welcomeMessage: string;
    createdAt: Date;
    updatedAt: Date;
    Qr_image: string | null;
}) | null | undefined>;
export declare const updateAdminDataSer: (reqBody: any, shopDetails: any) => Promise<{
    userName: string;
    phone: string;
    email: string;
    password: string;
    gst_percentage: number;
    id: string;
    shop_name: string;
    shop_type: string;
    refreshToken: string | null;
    gst_enabled: boolean;
    welcomeMessage: string;
    createdAt: Date;
    updatedAt: Date;
    Qr_image: string | null;
}>;
export declare const getCurrentQrImageSer: (shopDetails: any) => Promise<{
    [x: string]: {
        gst_percentage: number;
        category: string;
        quantity: number;
        id: string;
        gst_enabled: boolean;
        product_Name: string;
        product_Price: import("@prisma/client/runtime/library").Decimal;
        shortCut_key: string;
        shop_id: string;
    }[] | ({
        email: string;
        password: string;
        username: string;
        id: string;
        createdAt: Date;
        role: string;
        shopId: string;
    } | {
        email: string;
        password: string;
        username: string;
        id: string;
        createdAt: Date;
        role: string;
        shopId: string;
    })[] | ({
        gst_percentage: number;
        category: string;
        quantity: number;
        id: string;
        gst_enabled: boolean;
        product_Name: string;
        product_Price: import("@prisma/client/runtime/library").Decimal;
        shortCut_key: string;
        shop_id: string;
    } | {
        gst_percentage: number;
        category: string;
        quantity: number;
        id: string;
        gst_enabled: boolean;
        product_Name: string;
        product_Price: import("@prisma/client/runtime/library").Decimal;
        shortCut_key: string;
        shop_id: string;
    })[] | ({
        id: string;
        createdAt: Date;
        shopId: string;
        customerName: string | null;
        customerPhone: string | null;
        warranty: string | null;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        gstAmount: import("@prisma/client/runtime/library").Decimal | null;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string;
    } | {
        id: string;
        createdAt: Date;
        shopId: string;
        customerName: string | null;
        customerPhone: string | null;
        warranty: string | null;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        gstAmount: import("@prisma/client/runtime/library").Decimal | null;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string;
    })[] | ({
        id: string;
        createdAt: Date;
        shopId: string;
        subscriptionStatus: boolean;
        subscriptionStartsAt: Date;
        subscriptionEndsAt: Date;
    } | {
        id: string;
        createdAt: Date;
        shopId: string;
        subscriptionStatus: boolean;
        subscriptionStartsAt: Date;
        subscriptionEndsAt: Date;
    })[] | ({
        id: string;
        createdAt: Date;
        shopId: string;
        salesamount: import("@prisma/client/runtime/library").Decimal;
        salesCount: number;
    } | {
        id: string;
        createdAt: Date;
        shopId: string;
        salesamount: import("@prisma/client/runtime/library").Decimal;
        salesCount: number;
    })[] | ({
        date: Date;
        id: string;
        shopId: string;
        totalTransactionCount: number;
        totalTransactionAmount: import("@prisma/client/runtime/library").Decimal;
    } | {
        date: Date;
        id: string;
        shopId: string;
        totalTransactionCount: number;
        totalTransactionAmount: import("@prisma/client/runtime/library").Decimal;
    })[] | {
        email: string;
        password: string;
        username: string;
        id: string;
        createdAt: Date;
        role: string;
        shopId: string;
    }[] | {
        id: string;
        createdAt: Date;
        shopId: string;
        customerName: string | null;
        customerPhone: string | null;
        warranty: string | null;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        gstAmount: import("@prisma/client/runtime/library").Decimal | null;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: string;
    }[] | {
        id: string;
        createdAt: Date;
        shopId: string;
        subscriptionStatus: boolean;
        subscriptionStartsAt: Date;
        subscriptionEndsAt: Date;
    }[] | {
        id: string;
        createdAt: Date;
        shopId: string;
        salesamount: import("@prisma/client/runtime/library").Decimal;
        salesCount: number;
    }[] | {
        date: Date;
        id: string;
        shopId: string;
        totalTransactionCount: number;
        totalTransactionAmount: import("@prisma/client/runtime/library").Decimal;
    }[];
    [x: number]: never;
    [x: symbol]: never;
} | null>;
//# sourceMappingURL=SettingService.d.ts.map