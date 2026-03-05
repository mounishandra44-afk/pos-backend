"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orderitem = exports.Product = void 0;
class Product {
    productId;
    productName;
    productPrice;
    constructor(productId, productName, productPrice) {
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
    }
}
exports.Product = Product;
class Orderitem extends Product {
    product_Quantity;
    constructor(product_Quantity, productId, productName, productPrice) {
        super(productId, productName, productPrice);
        this.product_Quantity = product_Quantity;
    }
}
exports.Orderitem = Orderitem;
//# sourceMappingURL=TransactionItem.js.map