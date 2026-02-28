"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middlewares/authentication");
const DataValidation_1 = require("../middlewares/DataValidation");
const ProductControllerFunctions_1 = require("./ProductControllerFunctions");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({
    dest: "uploads/",
});
const myProduct = express_1.default.Router();
myProduct.post("/addProduct", authentication_1.authenticate, DataValidation_1.productData, DataValidation_1.validateProductData, ProductControllerFunctions_1.saveProduct);
myProduct.post("/uploadCsv", authentication_1.authenticate, upload.single("file"), ProductControllerFunctions_1.csvData);
myProduct.get("/getProducts", authentication_1.authenticate, ProductControllerFunctions_1.getAllTheProductDetails);
myProduct.put("/updateProduct", authentication_1.authenticate, DataValidation_1.productData, DataValidation_1.validateProductData, ProductControllerFunctions_1.updateProduct);
exports.default = myProduct;
//# sourceMappingURL=ProductRoute.js.map