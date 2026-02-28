"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductData = exports.findProductInShop = void 0;
exports.saveProductToShop = saveProductToShop;
exports.saveDataFromTheFile = saveDataFromTheFile;
exports.getAllTheProductDetailsForParticularShop = getAllTheProductDetailsForParticularShop;
const prisma_1 = require("../types/prisma");
const findProductInShop = async (shopDetails, name, category) => {
    return await prisma_1.prisma.product.findFirst({
        where: {
            shop_id: shopDetails.shop_id,
            product_Name: name.trim().toLowerCase(),
            category: category.trim().toLowerCase(),
        },
    });
};
exports.findProductInShop = findProductInShop;
async function saveProductToShop(productDetails, shopDetails) {
    const { name, category, shortcutKey, price } = productDetails;
    return await prisma_1.prisma.product.create({
        data: {
            product_Name: name.trim().toLowerCase(),
            product_Price: price,
            category: category.trim().toLowerCase(),
            shortCut_key: shortcutKey || "",
            shop_id: shopDetails.shop_id,
        },
    });
}
async function saveDataFromTheFile(fileData, shop_data) {
    try {
        const createdProducts = [];
        for (const item of fileData) {
            const product = await prisma_1.prisma.product.create({
                data: {
                    product_Name: item.productName.trim().toLowerCase(),
                    category: item.productCategory.trim().toLowerCase(),
                    shortCut_key: item.productShortCut || "",
                    product_Price: item.price,
                    shop_id: shop_data.shop_id,
                },
            });
            createdProducts.push(product);
        }
        if (createdProducts.length === 0) {
            return {
                statusCode: 400,
                messages: "File is empty or no data saved",
                isErr: true,
            };
        }
        return {
            statusCode: 200,
            messages: "Data saved successfully",
            isErr: false,
            data: createdProducts,
        };
    }
    catch (error) {
        return { statusCode: 500, messages: error, isErr: true };
    }
}
async function getAllTheProductDetailsForParticularShop(shopDetails) {
    try {
        const allProducts = await prisma_1.prisma.product.findMany({
            where: { shop_id: shopDetails.shop_id }
        });
        return { statusCode: 200, messages: allProducts, isErr: false };
    }
    catch (error) {
        return { statusCode: 500, messages: error, isErr: true };
    }
}
const updateProductData = async (reqBody, shop_Details) => {
    try {
        const { id, name, category, productShortCut, price } = reqBody;
        // console.log(reqBody)
        if (!id) {
            return {
                statusCode: 400,
                isError: true,
                message: "Product ID is required",
                data: null,
            };
        }
        const updateResult = await prisma_1.prisma.product.updateMany({
            where: {
                id: id,
                shop_id: shop_Details.shop_id,
            },
            data: {
                product_Name: name?.trim().toLowerCase(),
                category: category?.trim().toLowerCase(),
                shortCut_key: productShortCut !== undefined
                    ? productShortCut.trim()
                    : undefined,
                product_Price: price,
            },
        });
        if (updateResult.count === 0) {
            return {
                statusCode: 403,
                isError: true,
                message: "Product not found or does not belong to this shop",
                data: null,
            };
        }
        const updatedProduct = await prisma_1.prisma.product.findUnique({
            where: { id },
        });
        return {
            statusCode: 200,
            isError: false,
            message: "Product updated successfully",
            data: updatedProduct,
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            isError: true,
            message: error.message || "Internal server error",
            data: null,
        };
    }
};
exports.updateProductData = updateProductData;
//# sourceMappingURL=Product.js.map