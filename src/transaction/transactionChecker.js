import processPDFTransactionData from "../pdf/pdf.js";
import runScrapper from "../scrapper/scrapper.js";

// avoids the need to constantly retrieve data from the server or cache
let oldPDFUrl = null;

export default async function checkAndUpdateLatestTransactionData(
  transactionUpdate = () => {}
) {
  if (oldPDFUrl === null) {
    // first check if the data is in cache
    // if not, retrieve data from server
  }

  transactionUpdate({
    status: "checking",
    message: "Checking website for new transactions...",
  });

  const {
    pdfUrl: newPDFUrl,
    name: nameDisplayedInTransactionSite,
    office: officeDisplayedInTransactionSite,
  } = await runScrapper();

  // we can check if the polititian is a member of a commitee
  // const { isMember, commitees } = checkPolititianCommittees(
  //   nameDisplayedInTransactionSite,
  //   officeDisplayedInTransactionSite
  // );

  // if the data is the same as the old data, no need to update
  if (oldPDFUrl !== newPDFUrl) {
    console.log(`Found new PDF data: ${newPDFUrl}`);
    const latestTransactionData = await processPDFTransactionData(
      newPDFUrl,
      nameDisplayedInTransactionSite,
      officeDisplayedInTransactionSite
    );

    if (latestTransactionData !== null) {
      transactionUpdate({
        status: "error",
        message:
          "Fatal error. after multiple attempts, failed to retrieve correct transaction data.",
      });
      return null;
    }

    console.log("transaction data: ", latestTransactionData);

    // Store the information in the database
    // await storeTransactionDataInDatabase(latestTransactionData);

    transactionUpdate({
      status: "alert",
      message: "New transaction data found!",
      transaction: latestTransactionData,
      url: oldPDFUrl,
      // commitees,
    });

    // update the old data
    oldPDFUrl = newPDFUrl;
  } else {
    transactionUpdate({
      status: "finished checking",
      message: "new data not found.",
    });
  }
}
