export interface product_Data{
            id:string
            name: string,
            price:number,
            category: string
}

export interface TransactionItem{
    product_Data:product_Data,
    prod_quan:number,
    prod_price:number
}

export interface Transaction{
    transac_Item:TransactionItem[],
    subtotal:number,
    gst:number,
    total:number,
    paymentMethod:string,
    customerName?:string,
    customerMobile?:string,
    warranty?:string
}