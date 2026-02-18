import { Prisma } from "@prisma/client";
import { prisma } from "../types/prisma";


export const saveTransactionSer = async (
  transactionObject: any,
  shop_Details: any
) => {
  try {

    const result = await prisma.$transaction(async (tx) => {

     
      const createdTransaction = await tx.transaction.create({
        data: {
          shopId: shop_Details.shop_id,

          customerName: transactionObject.customerName || null,
          customerPhone: transactionObject.customerMobile || null,
          warranty: transactionObject.warranty || null,

          subtotal: new Prisma.Decimal(transactionObject.subtotal),
          gstAmount: new Prisma.Decimal(transactionObject.gst || 0),
          discountAmount: new Prisma.Decimal(0),
          totalAmount: new Prisma.Decimal(transactionObject.total),

          paymentMethod: transactionObject.paymentMethod
        }
      });

   
      const transactionItems = await tx.transactionItem.createMany({
        data: transactionObject.transac_Item.map((item: any) => ({
          transactionId: createdTransaction.id,  
          productId: item.product_Data.id,       
          product_price: new Prisma.Decimal(item.prod_price),
          quantity: item.prod_quan
        }))
      });

      return createdTransaction;
    });

    return {
      isErr: false,
      statusCode: 201,
      messages: result
    };

  } catch (error) {
    console.error("Transaction Error:", error);

    return {
      isErr: true,
      statusCode: 500,
      messages: "Transaction failed"
    };
  }
};
