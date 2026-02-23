import { prisma } from "../types/prisma"

export const getAdminDataSer=async (shopDetails:any) => {
    try {
      return  await prisma.shop_Owner.findUnique({
            where:{
                id:shopDetails.shop_id
            }
        })

    } catch (error) {
        
    }
}