import { INTERNAL_SERVER_ERROR } from '../constData/ErrorMessages';
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

export async function saveDataFromTheFile(fileData:{
            productName:string,
            productCategory:string,
            productShortCut:string,
            price :number
        }[],shop_data:any):Promise<any> {
    try {
        console.log("this is from the saveDataFromTheFile function")
        console.log("this file length",fileData.length)
      const count=  await prisma.product.createMany({
            data:fileData.map((item) => ({
        product_Name: item.productName,
        category: item.productCategory,
        shortCut_key: item.productShortCut,
        product_Price: item.price,
        shop_id: shop_data.shop_id
      })),
            skipDuplicates:true
           
        })
        console.log(count)
        if(!count){
            return {statusCode:400,messages:"file is empty or we didn't get any data",isErr:true};
        }
        
        return  {statusCode:200,messages:"Data from the file is saved to database",isErr:false};
    } catch (error) {
        return {statusCode:500,messages:error,isErr:true};
    }
}


export async function getAllTheProductDetailsForParticularShop(shopDetails:any) {
    try {
       const allProducts= await prisma.product.findMany({
        where:{shop_id:shopDetails.shop_id}
    })
    return  {statusCode:200,messages:allProducts,isErr:false};
    } catch (error) {
         return {statusCode:500,messages:error,isErr:true};
    }
    
}