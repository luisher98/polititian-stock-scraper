import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import checkAndUpdateLatestTransactionData from "./src/transactionChecker.js";

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
  };

  try {
    checkAndUpdateLatestTransactionData(transactionUpdate);
    setInterval(() => {
      checkAndUpdateLatestTransactionData(transactionUpdate);
    }, 1000 * 60);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${SERVER_NAME}:${PORT}`);
});
