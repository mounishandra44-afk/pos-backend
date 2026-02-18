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

 export const getOverViewData=async (shopDetails:any) => {
    try {
        // console.log("hi this from the getOverViewData")
     const overAllData= await prisma.transaction.aggregate({
             where: {
             shopId:shopDetails.shop_id
             },
             _avg:{
                totalAmount:true
             },
             _count:{
                id:true
             },
             _sum:{
                totalAmount:true
             }
        })

        // console.log(overAllData)

     const result = await prisma.$queryRaw<{ hour: number; total: bigint }[]>`
  SELECT 
    CAST(EXTRACT(HOUR FROM "createdAt") AS INTEGER) AS hour,
    COUNT(*) AS total
  FROM "Transaction"
  WHERE "shopId" = ${shopDetails.shop_id}::uuid
  GROUP BY hour
  ORDER BY total DESC
  LIMIT 1;
`;
// console.log(result)

const busiestHourData = result?.[0];

const response = {
  totalTransactions: overAllData._count?.id ?? 0,

  totalRevenue: Number(overAllData._sum?.totalAmount ?? 0),

  averageTransaction: Number(overAllData._avg?.totalAmount ?? 0),

  busiestHour: busiestHourData
    ? {
        hour: Number(busiestHourData.hour),
        transactions: Number(busiestHourData.total)
      }
    : null
};
console.log(response)
 return {
      isErr: false,
      statusCode: 200,
      messages: response
    };

    } catch (error) {
        return {
      isErr: true,
      statusCode: 500,
      messages: " Shop Details fetching is Failed"
    };
    }
 }