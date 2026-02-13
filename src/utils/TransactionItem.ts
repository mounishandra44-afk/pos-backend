
export class Product{
productId :number
productName:string
productPrice:number

constructor(productId:number,productName:string,productPrice:number){
this.productId=productId
this.productName=productName
this.productPrice=productPrice
}

}

export class Orderitem extends Product{
    product_Quantity:number
    constructor(product_Quantity:number,productId:number,productName:string,productPrice:number){
super(productId,productName,productPrice)
this.product_Quantity=product_Quantity
    }
}