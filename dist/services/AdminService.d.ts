import { AdminLogin_Data } from "../types/AdminData";
type StaffPayload = {
    username: string;
    email: string;
    password: string;
};
type ShopContext = {
    shop_id: string;
};
type RegisterAdminResult = {
    success: true;
    data: any;
} | {
    success: false;
    reason: "EMAIL_EXISTS Or PHONE_EXISTS" | "SERVER_ERROR";
};
export declare function registerAdmin(reqBody: any): Promise<RegisterAdminResult>;
export declare function checkAdminCredentials(loginData: AdminLogin_Data): Promise<{
    accessToken: string;
    refreshToken: string;
    shop: {
        id: string;
        userName: string;
        email: string;
        shop_type: string;
    };
} | null>;
export declare function handleForgotPassword(email: string): Promise<{
    success: boolean;
    reason?: string;
}>;
export declare function saveThePassword(params: {
    token: string;
    password: string;
}): Promise<{
    success: boolean;
    reason?: string;
}>;
export declare function updateAdminData(reqBody: any, shopDetails: any): Promise<any>;
type AddStaffResult = {
    success: true;
    data: {
        id: string;
        username: string;
        email: string;
        role: string;
        createdAt: Date;
    };
} | {
    success: false;
    reason: "EMAIL_EXISTS" | "SERVER_ERROR";
};
export declare function addStaffService(payload: StaffPayload, shopDetails: ShopContext): Promise<AddStaffResult>;
export declare function getStaffByShopService(shopDetails: ShopContext): Promise<{
    email: string;
    username: string;
    id: string;
    createdAt: Date;
    role: string;
}[]>;
export {};
//# sourceMappingURL=AdminService.d.ts.map