"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = require("../types/prisma");
node_cron_1.default.schedule("0 0 * * *", async () => {
    console.log("Running daily subscription check...");
    await prisma_1.prisma.subscriptionDetails.updateMany({
        where: {
            subscriptionStatus: true,
            subscriptionEndsAt: {
                lt: new Date()
            }
        },
        data: {
            subscriptionStatus: false
        }
    });
    console.log("Expired subscriptions updated.");
});
//# sourceMappingURL=checkingSubscriptionStatus.cron.js.map