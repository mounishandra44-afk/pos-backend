import { prisma } from '../types/prisma';

export async function saveProductToShop(params:any,shopDetails:any):Promise<boolean> {
    const{name,category,shortcutKey,price}=params;
  const data=  await prisma.product.create({
        data:{
            product_Name:name,
            product_Price:price,
            category:category,
            shortCut_key:shortcutKey,
            shop_id:shopDetails.shop_id
        }
    })
    if(!data){
        return true;
    }
    return false;
}