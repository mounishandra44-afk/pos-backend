"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.getAllTheProductDetails = exports.csvData = exports.saveProduct = void 0;
const Product_1 = require("../services/Product");
const ErrorMessages_1 = require("../constData/ErrorMessages");
const fs_1 = __importDefault(require("fs"));
const fast_csv_1 = require("fast-csv");
const saveProduct = async (req, res) => {
    try {
        const { name, category } = req.body;
        const existingProduct = await (0, Product_1.findProductInShop)(req.shop_Details, name, category);
        if (existingProduct) {
            return res.status(409).json({
                isError: true,
                message: "Product already exists",
                data: `Product with name "${name}" in category "${category}" already exists.`
            });
        }
        const data = await (0, Product_1.saveProductToShop)(req.body, req.shop_Details);
        if (!data) {
            return res.status(500).json({
                isError: true,
                message: "Failed to save product",
            });
        }
        return res.status(201).json({
            isError: false,
            message: "Product saved successfully",
            data,
        });
    }
    catch (error) {
        res.status(500).json({
            isError: true,
            message: ErrorMessages_1.INTERNAL_SERVER_ERROR,
            data: error
        });
    }
};
exports.saveProduct = saveProduct;
const csvData = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ isError: true, message: "No file uploaded" });
    }
    const filePath = req.file.path;
    const productData = [];
    const errors = [];
    let responseSent = false;
    const stream = fs_1.default
        .createReadStream(filePath, { encoding: "utf8" })
        .pipe((0, fast_csv_1.parse)({ headers: true, trim: true }));
    stream.on("error", async (error) => {
        console.error("CSV Error:", error.message);
        if (!responseSent) {
            responseSent = true;
            await fs_1.default.promises.unlink(filePath).catch(() => { });
            return res.status(400).json({
                isError: true,
                message: "Invalid CSV file. Please ensure file is UTF-8 encoded and properly formatted.",
            });
        }
    });
    stream.on("data", (row) => {
        const name = row.product_Name?.trim();
        const category = row.category?.trim();
        const shortCut = row.shortCut_key?.trim();
        const price = Number(row.product_Price);
        let rowHasError = false;
        if (!name) {
            errors.push(`product_Name is required`);
            rowHasError = true;
        }
        if (!category) {
            errors.push(`category is required`);
            rowHasError = true;
        }
        if (!row.product_Price || isNaN(price) || price <= 0) {
            errors.push(`product_Price must be a number greater than 0`);
            rowHasError = true;
        }
        if (!rowHasError) {
            productData.push({
                productName: name,
                productCategory: category,
                productShortCut: shortCut || "",
                price,
            });
        }
    });
    stream.on("end", async () => {
        if (responseSent)
            return;
        await fs_1.default.promises.unlink(filePath).catch(() => { });
        if (errors.length > 0) {
            responseSent = true;
            return res.status(400).json({
                isError: true,
                message: "CSV validation errors",
                data: errors,
            });
        }
        if (productData.length === 0) {
            responseSent = true;
            return res.status(400).json({
                isError: true,
                message: "CSV file is empty or all rows invalid",
            });
        }
        const uniqueProducts = [];
        for (const product of productData) {
            const exists = await (0, Product_1.findProductInShop)(req.shop_Details, product.productName, product.productCategory);
            if (!exists)
                uniqueProducts.push(product);
        }
        if (uniqueProducts.length === 0) {
            responseSent = true;
            return res.status(409).json({
                isError: true,
                message: "All products already exist in system",
            });
        }
        const result = await (0, Product_1.saveDataFromTheFile)(uniqueProducts, req.shop_Details);
        responseSent = true;
        return res.status(result.statusCode).json({
            isError: result.isErr,
            message: result.messages,
            data: result.data || null,
        });
    });
};
exports.csvData = csvData;
const getAllTheProductDetails = async (req, res) => {
    try {
        // console.log(req.shop_Details)
        const products = await (0, Product_1.getAllTheProductDetailsForParticularShop)(req.shop_Details);
        //  console.log(products.messages)
        return res.status(products.statusCode).json({
            isError: false,
            message: products.messages
        });
    }
    catch (error) {
        return res.status(500).json({
            isError: true,
            message: "Server error"
        });
    }
};
exports.getAllTheProductDetails = getAllTheProductDetails;
const updateProduct = async (req, res) => {
    try {
        console.log(req.body);
        const result = await (0, Product_1.updateProductData)(req.body, req.shop_Details);
        return res.status(result.statusCode).json({
            isError: result.isError,
            message: result.message,
            data: result.data,
        });
    }
    catch (error) {
        return res.status(500).json({
            isError: true,
            message: "Internal Server Error",
            data: null,
        });
    }
};
exports.updateProduct = updateProduct;
//# sourceMappingURL=ProductControllerFunctions.js.map