import "express" ;

declare global {
  namespace Express {
    interface Request {
      shop_Details?: {
        shop_id: string;
        shop_owner: string;
        shop_email: string;
      };
    }
  }
}
export {};
