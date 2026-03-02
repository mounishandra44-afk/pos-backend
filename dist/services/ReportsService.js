"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCloseShopReport = exports.getLastYearData = exports.getLast30DaysData = exports.getDashboardData = exports.getOverViewData = exports.getDailyReportData = void 0;
const prisma_1 = require("../types/prisma");
const client_1 = require("@prisma/client");
const DAILY_ONLY_SHOP_TYPES = [
    "cafe",
    "retail",
    "hybrid",
    "garment",
    "salon",
    "hardware",
    "bakery",
    "stationery",
    "other"
];
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
        const normalizedShopType = String(shopDetails?.shop_type ?? "")
            .trim()
            .toLowerCase();
        const isDailyOnlyShop = DAILY_ONLY_SHOP_TYPES.includes(normalizedShopType);
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const frozenDailyBill = await prisma_1.prisma.bills.findFirst({
            where: {
                shopId,
                createdAt: {
                    gte: todayStart,
                    lte: todayEnd
                }
            }
        });
        if (frozenDailyBill) {
            const totalRevenue = Number(frozenDailyBill.salesamount ?? 0);
            const totalTransactions = Number(frozenDailyBill.salesCount ?? 0);
            const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
            return {
                isErr: false,
                statusCode: 200,
                messages: {
                    totalTransactions,
                    totalRevenue,
                    averageTransaction,
                    busiestHour: null,
                    last7Days: [
                        {
                            date: todayStart,
                            totalAmount: totalRevenue,
                            totalTransactions
                        }
                    ]
                }
            };
        }
        if (isDailyOnlyShop) {
            const todayDailyRecord = await prisma_1.prisma.dailyTransactions.findFirst({
                where: {
                    shopId,
                    date: {
                        gte: todayStart,
                        lte: todayEnd
                    }
                }
            });
            const totalRevenue = Number(todayDailyRecord?.totalTransactionAmount ?? 0);
            const totalTransactions = Number(todayDailyRecord?.totalTransactionCount ?? 0);
            const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
            return {
                isErr: false,
                statusCode: 200,
                messages: {
                    totalTransactions,
                    totalRevenue,
                    averageTransaction,
                    busiestHour: null,
                    last7Days: [
                        {
                            date: todayStart,
                            totalAmount: totalRevenue,
                            totalTransactions
                        }
                    ]
                }
            };
        }
        const [todaySummaryResult, busiestHourResult] = await Promise.all([
            prisma_1.prisma.$queryRaw `
        SELECT
          COALESCE(SUM("totalAmount"), 0) AS total_revenue,
          COUNT("id") AS total_transactions,
          COALESCE(AVG("totalAmount"), 0) AS average_transaction
        FROM "Transaction"
        WHERE "shopId" = ${shopId}::uuid
          AND "createdAt" >= ${todayStart}
          AND "createdAt" <= ${todayEnd};
      `,
            prisma_1.prisma.$queryRaw `
        SELECT 
          CAST(EXTRACT(HOUR FROM "createdAt") AS INTEGER) AS hour,
          COUNT(*) AS total
        FROM "Transaction"
        WHERE "shopId" = ${shopId}::uuid
          AND "createdAt" >= ${todayStart}
          AND "createdAt" <= ${todayEnd}
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
        const todayDate = new Date(todayStart);
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
const saveCloseShopReport = async (payload, shopDetails) => {
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
        const dayStart = new Date(parsedDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(parsedDate);
        dayEnd.setHours(23, 59, 59, 999);
        const normalizedShopType = String(shopDetails?.shop_type ?? "")
            .trim()
            .toLowerCase();
        const isDailyOnlyShop = DAILY_ONLY_SHOP_TYPES.includes(normalizedShopType);
        let totalRevenue = 0;
        let totalBills = 0;
        if (isDailyOnlyShop) {
            const dailyRecord = await prisma_1.prisma.dailyTransactions.findFirst({
                where: {
                    shopId: shopDetails.shop_id,
                    date: {
                        gte: dayStart,
                        lte: dayEnd
                    }
                }
            });
            totalRevenue = Number(dailyRecord?.totalTransactionAmount ?? 0);
            totalBills = Number(dailyRecord?.totalTransactionCount ?? 0);
        }
        else {
            const dailyAggregate = await prisma_1.prisma.transaction.aggregate({
                where: {
                    shopId: shopDetails.shop_id,
                    createdAt: {
                        gte: dayStart,
                        lte: dayEnd
                    }
                },
                _sum: {
                    totalAmount: true
                },
                _count: {
                    id: true
                }
            });
            totalRevenue = Number(dailyAggregate._sum.totalAmount ?? 0);
            totalBills = Number(dailyAggregate._count.id ?? 0);
        }
        const existingDailyBill = await prisma_1.prisma.bills.findFirst({
            where: {
                shopId: shopDetails.shop_id,
                createdAt: {
                    gte: dayStart,
                    lte: dayEnd
                }
            }
        });
        if (existingDailyBill) {
            return {
                isErr: false,
                statusCode: 200,
                messages: {
                    message: "Shop is already closed for this date",
                    data: existingDailyBill
                }
            };
        }
        const created = await prisma_1.prisma.bills.create({
            data: {
                salesamount: new client_1.Prisma.Decimal(totalRevenue),
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
    }
    catch (error) {
        return {
            isErr: true,
            statusCode: 500,
            messages: "Failed to save close shop report"
        };
    }
};
exports.saveCloseShopReport = saveCloseShopReport;
//# sourceMappingURL=ReportsService.js.map