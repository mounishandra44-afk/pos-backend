export declare class Product {
    productId: number;
    productName: string;
    productPrice: number;
    constructor(productId: number, productName: string, productPrice: number);
}
export declare class Orderitem extends Product {
    product_Quantity: number;
    constructor(product_Quantity: number, productId: number, productName: string, productPrice: number);
}
//# sourceMappingURL=TransactionItem.d.ts.map