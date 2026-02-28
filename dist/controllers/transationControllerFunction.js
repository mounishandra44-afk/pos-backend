"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTransactionCon = void 0;
const transactionservice_1 = require("../services/transactionservice");
const DB_STORE_SHOP_TYPES = [
    "furniture",
    "electronics",
    "automobiles",
    "supermarket",
    "hardware"
];
const saveTransactionCon = async (req, res) => {
    try {
        console.log(req.shop_Details);
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
        const transaction = await (0, transactionservice_1.saveTransactionSer)(req.body, req.shop_Details);
        return res.status(transaction.statusCode).json({
            isError: transaction.isErr,
            data: transaction.messages
        });
    }
    catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({
            isError: true,
            data: "Internal server error"
        });
    }
};
exports.saveTransactionCon = saveTransactionCon;
//# sourceMappingURL=transationControllerFunction.js.map