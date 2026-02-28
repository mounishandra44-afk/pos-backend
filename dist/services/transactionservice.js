"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTransactionSer = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../types/prisma");
const saveTransactionSer = async (transactions, shop_Details) => {
    try {
        if (!Array.isArray(transactions) || transactions.length === 0) {
            return {
                isErr: true,
                statusCode: 400,
                messages: "Invalid transaction array"
            };
        }
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            /* 1️⃣ Fetch GST from Shop */
            const shop = await tx.shop_Owner.findUnique({
                where: { id: shop_Details.shop_id },
                select: { gst_percentage: true }
            });
            if (!shop) {
                throw new Error("Shop not found");
            }
            const GST_PERCENT = new client_1.Prisma.Decimal(shop.gst_percentage);
            const createdTransactions = [];
            for (const transactionObject of transactions) {
                if (!transactionObject.transac_Item?.length) {
                    throw new Error("Transaction items missing");
                }
                if (!transactionObject.paymentMethod) {
                    throw new Error("Payment method required");
                }
                /* 2️⃣ Get Products */
                const productIds = transactionObject.transac_Item.map((item) => item.productId);
                const products = await tx.product.findMany({
                    where: {
                        id: { in: productIds },
                        shop_id: shop_Details.shop_id
                    }
                });
                if (products.length !== productIds.length) {
                    throw new Error("One or more products not found");
                }
                /* 3️⃣ Calculate Subtotal */
                let calculatedSubtotal = new client_1.Prisma.Decimal(0);
                const itemData = transactionObject.transac_Item.map((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    if (!product) {
                        throw new Error("Product validation failed");
                    }
                    if (!item.prod_quan || item.prod_quan <= 0) {
                        throw new Error("Invalid quantity");
                    }
                    const price = product.product_Price;
                    const itemTotal = price.mul(item.prod_quan);
                    calculatedSubtotal = calculatedSubtotal.add(itemTotal);
                    return {
                        productId: product.id,
                        product_price: price,
                        quantity: item.prod_quan
                    };
                });
                calculatedSubtotal = calculatedSubtotal.toDecimalPlaces(2);
                /* 4️⃣ Calculate GST from Admin Field */
                const gstAmount = calculatedSubtotal
                    .mul(GST_PERCENT)
                    .div(100)
                    .toDecimalPlaces(2);
                /* 5️⃣ Calculate Total */
                const calculatedTotal = calculatedSubtotal
                    .add(gstAmount)
                    .toDecimalPlaces(2);
                /* 6️⃣ Create Transaction */
                const createdTransaction = await tx.transaction.create({
                    data: {
                        shopId: shop_Details.shop_id,
                        customerName: transactionObject.customerName ?? null,
                        customerPhone: transactionObject.customerMobile ?? null,
                        warranty: transactionObject.warranty ?? null,
                        subtotal: calculatedSubtotal,
                        gstAmount,
                        discountAmount: new client_1.Prisma.Decimal(0),
                        totalAmount: calculatedTotal,
                        paymentMethod: transactionObject.paymentMethod
                    }
                });
                /* 7️⃣ Create Items */
                await tx.transactionItem.createMany({
                    data: itemData.map((item) => ({
                        transactionId: createdTransaction.id,
                        ...item
                    }))
                });
                createdTransactions.push(createdTransaction);
            }
            return createdTransactions;
        });
        return {
            isErr: false,
            statusCode: 201,
            messages: result
        };
    }
    catch (error) {
        if (error instanceof Error) {
            return {
                isErr: true,
                statusCode: 400,
                messages: error.message
            };
        }
        return {
            isErr: true,
            statusCode: 500,
            messages: "Transaction failed"
        };
    }
};
exports.saveTransactionSer = saveTransactionSer;
//# sourceMappingURL=transactionservice.js.map