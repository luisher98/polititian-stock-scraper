import processPDFTransactionData from "./pdf/pdf.js";
import runScrapper from "./scrapper/scrapper.js";
import { storeTransactionDataInDatabase } from "./db/db.js";
import { fetchPolititianTransactions } from "./transactions/transaction.js";

// avoids the need to constantly retrieve data from the server or cache
let oldPDFUrl = null;

export default async function checkAndUpdateLatestTransactionData(
  transactionUpdate = () => {}
) {
  if (oldPDFUrl === null) {
    // first check if the data is in cache
    // if not, retrieve data from server
  }

  const { pdfUrl: newPDFUrl, websiteTransactionData } = await runScrapper(
    transactionUpdate
  );



  // [NOT IMPLEMENTED] we can check if the polititian is a member of a commitee
  /* const { isMember, commitees } = checkPolititianCommittees(
     nameDisplayedInTransactionSite,
     officeDisplayedInTransactionSite
   );
  */

  // if the data is the same as the old data, no need to update
  if (oldPDFUrl !== newPDFUrl) {
    console.log(`Found new PDF data: ${newPDFUrl}`);

    // process the PDF passing the URL and expect the transaction data to be returned in a final JSON format
    // here is where the magic happens
    const latestTransactionData = await processPDFTransactionData(
      newPDFUrl,
      websiteTransactionData
    );

    if (latestTransactionData === null) {
      transactionUpdate({
        status: "error",
        message:
          "Error processing transaction data correctly after multiple attempts.",
      });
      throw new Error(
        "After multiple attempts, could not process transaction data."
      );
    } else {
      console.log("The transaction data was correctly processed.");
    }


    // Store the information in the database
    await storeTransactionDataInDatabase(latestTransactionData);

    transactionUpdate({
      status: "alert",
      message: "New transaction data found!",
      time: new Date().toISOString(),
      pdfUrl: newPDFUrl,
      transaction: latestTransactionData,
    });

    // update the old data
    oldPDFUrl = newPDFUrl;
  } else {
    transactionUpdate({
      status: "finished checking",
      time: new Date().toISOString(),
      message: "new data not found.",
    });
  }
}