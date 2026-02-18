import cron from "node-cron";
import { prisma } from "../types/prisma";

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily subscription check...");

  await prisma.subscriptionDetails.updateMany({
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
