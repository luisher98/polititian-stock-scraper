import runScrapper from "./src/scrapper/scrapper.js";

// avoids the need to constantly retrieve data from the server or cache
let oldLinkData = null; 

async function checkAndUpdateLatestData() {
  if (oldLinkData === null) {
    // first check if the data is in cache

    // if not, retrieve data from server

  }

  // if no server data, retrieve data from scrapper
  const newLinkData = await runScrapper();

  if (newLinkData !== oldLinkData) {
    console.log("New data found:", newLinkData);
    oldLinkData = newLinkData;
    // proceed to extract data from pdf
    // processedPDFData = await processPDFData(linkData);
  } 
  else {
    console.log("No new data found.");
  }
}


checkAndUpdateLatestData();
setInterval(checkAndUpdateLatestData, 30000);
