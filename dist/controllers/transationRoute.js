"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middlewares/authentication");
const transationControllerFunction_1 = require("./transationControllerFunction");
const transactionRouter = express_1.default.Router();
transactionRouter.post("/saveTransaction", authentication_1.authenticate, transationControllerFunction_1.saveTransactionCon);
exports.default = transactionRouter;
//# sourceMappingURL=transationRoute.js.map