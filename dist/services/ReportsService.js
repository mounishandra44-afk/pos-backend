"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastYearData = exports.getLast30DaysData = exports.getDashboardData = exports.getOverViewData = exports.getDailyReportData = void 0;
const prisma_1 = require("../types/prisma");
const getDailyReportData = async (queryDates, shopDetails) => {
    try {
        const from = new Date(queryDates.fromDate);
        from.setHours(0, 0, 0, 0);
        const to = new Date(queryDates.toDate);
        to.setHours(23, 59, 59, 999);
        const transactions = await prisma_1.prisma.transaction.aggregate({
            where: {
                shopId: shopDetails.shop_id,
                createdAt: {
                    gte: from,
                    lte: to
                }
            },
            _sum: {
                totalAmount: true
            },
            _count: {
                id: true
            }
        });
        const total_amount = transactions._sum.totalAmount ?? 0;
        const total_count = transactions._count.id ?? 0;
        return {
            isErr: false,
            statusCode: 200,
            messages: {
                total: total_amount,
                count: total_count
            }
        };
    }
    catch (error) {
        return {
            isErr: true,
            statusCode: 500,
            messages: "Daily Reports fetching is Failed"
        };
    }
};
exports.getDailyReportData = getDailyReportData;
const getOverViewData = async (shopDetails) => {
    try {
        // console.log("hi this from the getOverViewData")
        const overAllData = await prisma_1.prisma.transaction.aggregate({
            where: {
                shopId: shopDetails.shop_id
            },
            _avg: {
                totalAmount: true
            },
            _count: {
                id: true
            },
            _sum: {
                totalAmount: true
            }
        });
        // console.log(overAllData)
        const result = await prisma_1.prisma.$queryRaw `
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
    }
    catch (error) {
        return {
            isErr: true,
            statusCode: 500,
            messages: " Shop Details fetching is Failed"
        };
    }
};
exports.getOverViewData = getOverViewData;
const getDashboardData = async (shopDetails) => {
    try {
        const shopId = shopDetails.shop_id;
        const today = new Date();
        const last7Days = new Date();
        last7Days.setDate(today.getDate() - 6);
        last7Days.setHours(0, 0, 0, 0);
        const [overallData, busiestHourResult, last7DaysData] = await Promise.all([
            prisma_1.prisma.transaction.aggregate({
                where: { shopId },
                _avg: { totalAmount: true },
                _count: { id: true },
                _sum: { totalAmount: true }
            }),
            prisma_1.prisma.$queryRaw `
        SELECT 
          CAST(EXTRACT(HOUR FROM "createdAt") AS INTEGER) AS hour,
          COUNT(*) AS total
        FROM "Transaction"
        WHERE "shopId" = ${shopId}::uuid
        GROUP BY hour
        ORDER BY total DESC
        LIMIT 1;
      `,
            prisma_1.prisma.$queryRaw `
        SELECT 
          DATE("createdAt") as date,
          SUM("totalAmount") as total_amount,
          COUNT("id") as total_count
        FROM "Transaction"
        WHERE 
          "shopId" = ${shopId}::uuid
          AND "createdAt" >= ${last7Days}
        GROUP BY DATE("createdAt")
        ORDER BY DATE("createdAt") ASC;
      `
        ]);
        const busiestHourData = busiestHourResult?.[0];
        const last7DaysFormatted = last7DaysData.map(item => ({
            date: item.date,
            totalAmount: Number(item.total_amount ?? 0),
            totalTransactions: Number(item.total_count ?? 0)
        }));
        const response = {
            totalTransactions: overallData._count?.id ?? 0,
            totalRevenue: Number(overallData._sum?.totalAmount ?? 0),
            averageTransaction: Number(overallData._avg?.totalAmount ?? 0),
            busiestHour: busiestHourData
                ? {
                    hour: Number(busiestHourData.hour),
                    transactions: Number(busiestHourData.total)
                }
                : null,
            last7Days: last7DaysFormatted
        };
        return {
            isErr: false,
            statusCode: 200,
            messages: response
        };
    }
    catch (error) {
        console.error("Dashboard Service Error:", error);
        return {
            isErr: true,
            statusCode: 500,
            messages: "Dashboard data fetching failed"
        };
    }
};
exports.getDashboardData = getDashboardData;
const getLast30DaysData = async (shopDetails) => {
    try {
        const shopId = shopDetails.shop_id;
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 29);
        last30Days.setHours(0, 0, 0, 0);
        const weeklyData = await prisma_1.prisma.$queryRaw `
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
    }
    catch (error) {
        return {
            isErr: true,
            statusCode: 500,
            messages: "Last 30 days report failed"
        };
    }
};
exports.getLast30DaysData = getLast30DaysData;
const getLastYearData = async (shopDetails) => {
    try {
        const shopId = shopDetails.shop_id;
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        lastYear.setHours(0, 0, 0, 0);
        const monthlyData = await prisma_1.prisma.$queryRaw `
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
    }
    catch (error) {
        return {
            isErr: true,
            statusCode: 500,
            messages: "Last 1 year report failed"
        };
    }
};
exports.getLastYearData = getLastYearData;
//# sourceMappingURL=ReportsService.js.map