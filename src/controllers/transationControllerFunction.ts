import { Request, Response } from "express";
import { CreateTransactionDTO, saveTransactionSer } from "../services/transactionservice";

export const saveTransactionCon = async (
  req: Request<{}, {}, CreateTransactionDTO[] | CreateTransactionDTO>,
  res: Response
) => {
  try {
console.log(req.shop_Details)
    if (!req.shop_Details) {
      return res.status(401).json({
        isError: true,
        data: "Unauthorized"
      });
    }

    const transaction = await saveTransactionSer(
      req.body,
      req.shop_Details
    );

    return res.status(transaction.statusCode).json({
      isError: transaction.isErr,
      data: transaction.messages
    });

  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({
      isError: true,
      data: "Internal server error"
    });
  }
};
