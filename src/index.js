import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import checkAndUpdateLatestTransactionData from "./services/checkLastTransaction.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const SERVER_NAME = process.env.SERVER_NAME || "http://localhost";
const SCRAPPER_FREQUENCY = process.env.SCRAPPER_FREQUENCY_MINUTES || 60; // in minutes

const app = express();
app.use(bodyParser.json());

let clients = [];

const transactionUpdate = (event) => {
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(event)}\n\n`);
  });
  console.log(event.message);
};

(() => {
  async function runCheckAndUpdate() {
    async function scheduleNextRun() {
      await checkAndUpdateLatestTransactionData(transactionUpdate);
      setTimeout(scheduleNextRun, SCRAPPER_FREQUENCY * 1000 * 60);
    }

    await checkAndUpdateLatestTransactionData(transactionUpdate);
    setTimeout(scheduleNextRun, SCRAPPER_FREQUENCY * 1000 * 60);
  }

  runCheckAndUpdate();
})();

// SSE endpoint
app.get("/polititians-transaction-data-sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    clients.push(res);

    res.on("close", () => {
      clients = clients.filter((client) => client !== res);
    });
  } catch (error) {
    console.log(error);
  }
});

// REST endpoint
app.get("/latest-polititian-transaction-data", async (req, res) => {
  try {
    const transactionUpdate = (e) => {
      res.json(e);
    };

    await checkAndUpdateLatestTransactionData(transactionUpdate);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(
    `SSE endpoint: ${SERVER_NAME}:${PORT}/polititians-transaction-data-sse`
  );
});
