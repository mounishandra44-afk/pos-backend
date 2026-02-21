import { Request, Response } from "express";
import { CreateTransactionDTO, saveTransactionSer } from "../services/transactionservice";

const DB_STORE_SHOP_TYPES = [
  "furniture",
  "electronics",
  "automobiles",
  "supermarket"
];

export const saveTransactionCon = async (
  req: Request<{}, {}, CreateTransactionDTO[]>,
  res: Response
) => {
  try {

    if (!req.shop_Details) {
      return res.status(401).json({
        isError: true,
        data: "Unauthorized"
      });
    }

    const shopType = req.shop_Details.shop_type.toLowerCase();

    if (!DB_STORE_SHOP_TYPES.includes(shopType)) {
      return res.status(200).json({
        isError: false,
        data: "IndexedDB mode enabled"
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
