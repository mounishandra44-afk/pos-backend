"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTransactionCon = void 0;
const transactionservice_1 = require("../services/transactionservice");
const saveTransactionCon = async (req, res) => {
    try {
        console.log(req.shop_Details);
        if (!req.shop_Details) {
            return res.status(401).json({
                isError: true,
                data: "Unauthorized"
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