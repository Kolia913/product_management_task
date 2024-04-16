const express = require("express");
const bodyParser = require("body-parser");
const cron = require("node-cron");

const { router } = require("./routes");
const { calculatePrimeCosts } = require("./services/prime_cost.service");
const app = express();

app.use(bodyParser.json());

app.use(router);

const job = cron.schedule("* * * * *", () => {
  calculatePrimeCosts();
});

const server = app.listen(3000, async () => {
  console.log("app is running on localhost:3000");
  job.start();
});

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);
process.on("exit", shutDown);

function shutDown() {
  console.log("Received kill signal, shutting down gracefully");
  job.stop();
  server.close(() => {
    console.log("Closed out remaining connections");
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
}
