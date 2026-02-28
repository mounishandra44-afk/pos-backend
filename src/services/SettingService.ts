import { prisma } from "../types/prisma"

export const getAdminDataSer=async (shopDetails:any) => {
    try {
      return  await prisma.shop_Owner.findUnique({
            where:{
                id:shopDetails.shop_id
            },
            include: {
                staff: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                        createdAt: true
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        })

    } catch (error) {
        
    }
}