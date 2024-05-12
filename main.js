import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import checkAndUpdateLatestTransactionData from "./src/transaction/transactionChecker.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const SERVER_NAME = process.env.SERVER_NAME || "http://localhost";
const SCRAPPER_FREQUENCY = process.env.SCRAPPER_FREQUENCY_MINUTES || 60; // in minutes

const app = express();
app.use(bodyParser.json());

// SSE endpoint
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
      async function scheduleNextRun() {
        await checkAndUpdateLatestTransactionData(transactionUpdate);
        setTimeout(scheduleNextRun, SCRAPPER_FREQUENCY * 1000 * 60);
      }

      await checkAndUpdateLatestTransactionData(transactionUpdate);
      setTimeout(scheduleNextRun, SCRAPPER_FREQUENCY * 1000 * 60);
    }

    runCheckAndUpdate();
  } catch (error) {
    console.log(error);
  }
});

//

app.listen(PORT, () => {
  console.log(
    `SSE endpoint: ${SERVER_NAME}:${PORT}/polititians-transaction-data-sse`
  );
});
