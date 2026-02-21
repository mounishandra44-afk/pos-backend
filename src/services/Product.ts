import { INTERNAL_SERVER_ERROR } from '../constData/ErrorMessages';
import { prisma } from '../types/prisma';

export const findProductInShop = async (
  shopDetails: any,
  name: string,
  category: string
) => {
  return await prisma.product.findFirst({
    where: {
      shop_id: shopDetails.shop_id,
      product_Name: name.trim().toLowerCase(),
      category: category.trim().toLowerCase(),
    },
  });
};




export async function saveProductToShop(
  productDetails: any,
  shopDetails: any
) {
  const { name, category, shortcutKey, price } = productDetails;

  return await prisma.product.create({
    data: {
      product_Name: name.trim().toLowerCase(),
      product_Price: price,
      category: category.trim().toLowerCase(),
      shortCut_key: shortcutKey || "",
      shop_id: shopDetails.shop_id,
    },
  });
}


export async function saveDataFromTheFile(fileData:{
            productName:string,
            productCategory:string,
            productShortCut?:string,
            price :number
        }[],shop_data:any):Promise<any> {
    try {
        console.log("this is from the saveDataFromTheFile function")
        console.log("this file length",fileData.length)
      const count=  await prisma.product.createMany({
          data: fileData.map((item) => ({
  product_Name: item.productName.trim().toLowerCase(),
  category: item.productCategory.trim().toLowerCase(),
  shortCut_key: item.productShortCut || "",
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