import processPDFTransactionData from "./pdf/pdf.js";
import runScrapper from "./scrapper/scrapper.js";

// avoids the need to constantly retrieve data from the server or cache
let oldUrlData = null;

export default async function checkAndUpdateLatestTransactionData(
  transactionUpdate = () => {}
) {
  if (oldUrlData === null) {
    // first check if the data is in cache
    // if not, retrieve data from server
  }

  transactionUpdate({
    status: "checking",
    message: "Checking website for new data...",
  });

  // if no server data, retrieve data from scrapper
  const newUrlData = await runScrapper();

  if (newUrlData !== oldUrlData) {
    // proceed to extract data from pdf
    const latestTransactionData = await processPDFTransactionData(newUrlData);

    console.log("transaction data: ", latestTransactionData);

    // // Store the information in the database
    // await storeDataInDatabase(data);

    transactionUpdate({
      status: "alert",
      message: "New transaction data found!",
      transaction: latestTransactionData,
      url: newUrlData,
    });

    // update the old data
    oldUrlData = newUrlData;
  } else {
    transactionUpdate({
      status: "finished checking",
      message: "new data not found.",
    });
  }
}
