import checkAndUpdateLatestTransactionData from "./src/transactionChecker.js";

checkAndUpdateLatestTransactionData();
setInterval(checkAndUpdateLatestTransactionData, 1000 * 30); 