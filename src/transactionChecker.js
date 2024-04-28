import processPDFTransactionData from "../pdf/pdf.js";

// avoids the need to constantly retrieve data from the server or cache
let oldUrlData = null;

export default async function checkAndUpdateLatestTransactionData() {
  if (oldUrlData === null) {
    // first check if the data is in cache
    // if not, retrieve data from server
  }

  // if no server data, retrieve data from scrapper
  const newUrlData = await runScrapper();

  if (newUrlData !== oldUrlData) {
    console.log("New data found:", newUrlData);
    oldUrlData = newUrlData;

    // proceed to extract data from pdf
    const latestTransactionData = await processPDFTransactionData(newUrlData);

    // // Store the information in the database
    // await storeDataInDatabase(data);

    return latestTransactionData;
  } else {
    console.log("No new data found.");
  }
}
