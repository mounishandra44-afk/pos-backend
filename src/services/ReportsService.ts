import { prisma } from "../types/prisma";

 export const getDailyReportData= async (queryDates:any,shopDetails:any) => {
  try {
    const from = new Date(queryDates.fromDate);
from.setHours(0, 0, 0, 0);

const to = new Date(queryDates.toDate);
to.setHours(23, 59, 59, 999);

const transactions = await prisma.transaction.aggregate({
  where: {
    shopId:shopDetails.shop_id,
    createdAt: {
      gte: from,
      lte: to
    }
  },
  _sum:{
    totalAmount:true
  },
  _count:{
    id:true
  }
   
});

const total_amount=transactions._sum.totalAmount??0;
const total_count=transactions._count.id??0;
return {
      isErr: false,
      statusCode: 200,
      messages: {
        total:total_amount,
        count:total_count
      }
    };
  } catch (error) {
    return {
      isErr: true,
      statusCode: 500,
      messages: "Daily Reports fetching is Failed"
    };
  }  
 }