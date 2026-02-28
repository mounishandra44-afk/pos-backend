import "express" ;

declare global {
  namespace Express {
    interface Request {
      shop_Details: {
        shop_id: string;
        shop_owner: string;
        shop_email: string;
        shop_type:string
      };
      auth_Details: {
        role: "ADMIN" | "STAFF";
        userType: string;
        shop_id: string;
        staff_id?: string;
      };
    }
  }
}
export {};
