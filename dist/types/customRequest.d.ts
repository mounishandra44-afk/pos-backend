import { Request } from "express";
export interface AuthRequest extends Request {
    shop_Details: {
        shop_id: string;
        shop_owner: string;
        shop_email: string;
        shop_type: string;
    };
}
//# sourceMappingURL=customRequest.d.ts.map