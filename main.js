import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import checkAndUpdateLatestTransactionData from "./src/transaction/transactionChecker.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const SERVER_NAME = process.env.SERVER_NAME || "http://localhost";

const app = express();
app.use(bodyParser.json());

app.get("/polititians-transaction-data-sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const transactionUpdate = (e) => {
    res.write(`data: ${JSON.stringify(e)}\n\n`);
    console.log(e.message);
  };

  try {
    async function runCheckAndUpdate() {
      // update transaction data and recursively schedule the next update
      async function scheduleNextRun() {
        await checkAndUpdateLatestTransactionData(transactionUpdate);
        setTimeout(scheduleNextRun, 1000 * 60); // Schedule the next run in 60 seconds
      }

      // Run the first update, then start the interval
      await checkAndUpdateLatestTransactionData(transactionUpdate);
      setTimeout(scheduleNextRun, 1000 * 60); // Start the loop with a 60-second delay after the initial call
    }

    // Start the periodic check
    runCheckAndUpdate();
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(
    `SSE endpoint: ${SERVER_NAME}:${PORT}/polititians-transaction-data-sse`
  );
});
