import { prisma } from "../types/prisma";
import { Prisma } from "@prisma/client";

type CloseShopPayload = {
  date?: string;
  totalRevenue?: number;
  totalBills?: number;
  shopId?: string;
};

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
// console.log(response)
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


 export const getDashboardData = async (shopDetails: any) => {
  try {
    const shopId = shopDetails.shop_id;

    const [todaySummaryResult, busiestHourResult] = await Promise.all([
      prisma.$queryRaw<
        {
          total_revenue: unknown;
          total_transactions: unknown;
          average_transaction: unknown;
        }[]
      >`
        SELECT
          COALESCE(SUM("totalAmount"), 0) AS total_revenue,
          COUNT("id") AS total_transactions,
          COALESCE(AVG("totalAmount"), 0) AS average_transaction
        FROM "Transaction"
        WHERE "shopId" = ${shopId}::uuid
          AND DATE("createdAt") = CURRENT_DATE;
      `,

      prisma.$queryRaw<{ hour: number; total: bigint }[]>`
        SELECT 
          CAST(EXTRACT(HOUR FROM "createdAt") AS INTEGER) AS hour,
          COUNT(*) AS total
        FROM "Transaction"
        WHERE "shopId" = ${shopId}::uuid
          AND DATE("createdAt") = CURRENT_DATE
        GROUP BY hour
        ORDER BY total DESC
        LIMIT 1;
      `
    ]);

    const busiestHourData = busiestHourResult?.[0];
    const todaySummary = todaySummaryResult?.[0] ?? {
      total_revenue: 0,
      total_transactions: 0,
      average_transaction: 0
    };

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const totalRevenue = Number(todaySummary.total_revenue ?? 0);
    const totalTransactions = Number(todaySummary.total_transactions ?? 0);
    const averageTransaction = Number(todaySummary.average_transaction ?? 0);

    const response = {
      totalTransactions,
      totalRevenue,
      averageTransaction,

      busiestHour: busiestHourData
        ? {
            hour: Number(busiestHourData.hour),
            transactions: Number(busiestHourData.total)
          }
        : null,

      last7Days: [
        {
          date: todayDate,
          totalAmount: totalRevenue,
          totalTransactions
        }
      ]
    };

    return {
      isErr: false,
      statusCode: 200,
      messages: response
    };

  } catch (error) {
    console.error("Dashboard Service Error:", error);

    return {
      isErr: true,
      statusCode: 500,
      messages: "Dashboard data fetching failed"
    };
  }
};


export const getLast30DaysData = async (shopDetails: any) => {
  try {
    const shopId = shopDetails.shop_id;

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 29);
    last30Days.setHours(0, 0, 0, 0);

    const weeklyData = await prisma.$queryRaw<
      { week: number; total_amount: bigint; total_count: bigint }[]
    >`
      SELECT 
        EXTRACT(WEEK FROM "createdAt") as week,
        SUM("totalAmount") as total_amount,
        COUNT("id") as total_count
      FROM "Transaction"
      WHERE 
        "shopId" = ${shopId}::uuid
        AND "createdAt" >= ${last30Days}
      GROUP BY week
      ORDER BY week ASC;
    `;

    return {
      isErr: false,
      statusCode: 200,
      messages: weeklyData.map(w => ({
        week: Number(w.week),
        totalAmount: Number(w.total_amount ?? 0),
        totalTransactions: Number(w.total_count ?? 0)
      }))
    };

  } catch (error) {
    return {
      isErr: true,
      statusCode: 500,
      messages: "Last 30 days report failed"
    };
  }
};


export const getLastYearData = async (shopDetails: any) => {
  try {
    const shopId = shopDetails.shop_id;

    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    lastYear.setHours(0, 0, 0, 0);

    const monthlyData = await prisma.$queryRaw<
      { month: number; total_amount: bigint; total_count: bigint }[]
    >`
      SELECT 
        EXTRACT(MONTH FROM "createdAt") as month,
        SUM("totalAmount") as total_amount,
        COUNT("id") as total_count
      FROM "Transaction"
      WHERE 
        "shopId" = ${shopId}::uuid
        AND "createdAt" >= ${lastYear}
      GROUP BY month
      ORDER BY month ASC;
    `;

    return {
      isErr: false,
      statusCode: 200,
      messages: monthlyData.map(m => ({
        month: Number(m.month),
        totalAmount: Number(m.total_amount ?? 0),
        totalTransactions: Number(m.total_count ?? 0)
      }))
    };

  } catch (error) {
    return {
      isErr: true,
      statusCode: 500,
      messages: "Last 1 year report failed"
    };
  }
};

export const saveCloseShopReport = async (
  payload: CloseShopPayload,
  shopDetails: any
) => {
  try {
    const inputDate = String(payload?.date ?? "").trim();
    if (!inputDate) {
      return {
        isErr: true,
        statusCode: 400,
        messages: "Date is required"
      };
    }

    const parsedDate = new Date(inputDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return {
        isErr: true,
        statusCode: 400,
        messages: "Invalid date format"
      };
    }

    const totalRevenue = Number(payload?.totalRevenue ?? 0);
    const totalBills = Number(payload?.totalBills ?? 0);

    if (!Number.isFinite(totalRevenue) || totalRevenue < 0) {
      return {
        isErr: true,
        statusCode: 400,
        messages: "totalRevenue must be a non-negative number"
      };
    }

    if (!Number.isFinite(totalBills) || totalBills < 0) {
      return {
        isErr: true,
        statusCode: 400,
        messages: "totalBills must be a non-negative number"
      };
    }

    const dayStart = new Date(parsedDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(parsedDate);
    dayEnd.setHours(23, 59, 59, 999);

    const existingDailyBill = await prisma.bills.findFirst({
      where: {
        shopId: shopDetails.shop_id,
        createdAt: {
          gte: dayStart,
          lte: dayEnd
        }
      }
    });

    if (existingDailyBill) {
      const updated = await prisma.bills.update({
        where: { id: existingDailyBill.id },
        data: {
          salesamount: new Prisma.Decimal(totalRevenue),
          salesCount: Math.floor(totalBills)
        }
      });

      return {
        isErr: false,
        statusCode: 200,
        messages: {
          message: "Daily report updated successfully",
          data: updated
        }
      };
    }

    const created = await prisma.bills.create({
      data: {
        salesamount: new Prisma.Decimal(totalRevenue),
        salesCount: Math.floor(totalBills),
        shopId: shopDetails.shop_id,
        createdAt: dayStart
      }
    });

    return {
      isErr: false,
      statusCode: 201,
      messages: {
        message: "Daily report saved successfully",
        data: created
      }
    };
  } catch (error) {
    return {
      isErr: true,
      statusCode: 500,
      messages: "Failed to save close shop report"
    };
  }
};