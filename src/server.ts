import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { TravelPlanService } from "./app/modules/travel-plans/travel.service";
import nodeCron from "node-cron";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);

    console.log("Connected to DB!!");

    // Run initial status update on server start
    await TravelPlanService.updateTravelStatuses();

    // Schedule daily status updates at midnight (00:00)
    nodeCron.schedule("0 0 * * *", async () => {
      console.log("Running scheduled travel status update...");
      await TravelPlanService.updateTravelStatuses();
    });

    // Also run status updates every 6 hours for more frequent checks
    nodeCron.schedule("0 */6 * * *", async () => {
      console.log("Running periodic travel status update...");
      await TravelPlanService.updateTravelStatuses();
    });

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
})();

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received... Server shutting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down..", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
