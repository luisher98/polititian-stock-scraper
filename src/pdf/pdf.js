import { downloadPDF, deletePDF } from "./utils.js";
import convertPDFToJSON from "./openai.js";
import { sleep, retryDelays } from "./config.js";
import { getTransactionFirstNameAndOffice } from "../transaction/utils.js";

// so that can be accessed in the finally block
let path = null;

export default async function processPDFTransactionData(
  url,
  nameDisplayedInTransactionWebsite,
  officeDisplayedInTransactionWebsite
) {
  try {
    console.log("Downloading and processing PDF data to JSON...");
    // Download the PDF from the given URL, returning the path to the file
    path = await downloadPDF(url);

    // Upload the PDF to OpenAI and store the JSON in data
    const data = await convertPDFToJSON(path);

    console.log("Data in format extracted from PDF:", data);
    console.log("\nChecking for possible hallucinations...");

    // get the first name and office of the polititian from the transaction data of pdf
    const {
      firstName: filingPolititianFirstName,
      office: filingPolititianOffice,
    } = getTransactionFirstNameAndOffice(data);

    // compare the data from the  website and the data from the transaction,
    // if they are different openai made a mistake
    if (
      filingPolititianFirstName !== nameDisplayedInTransactionWebsite ||
      filingPolititianOffice !== officeDisplayedInTransactionWebsite ||
      data == null
    ) {
      console.log(
        "The data from the website and the transaction do not match. Openai made a mistake."
      );
      console.log(
        `The name from the website is "${nameDisplayedInTransactionWebsite}" and the name from the transaction is "${filingPolititianFirstName}"`
      );
      console.log(
        `The office from the website is "${officeDisplayedInTransactionWebsite}" and the office from the transaction is "${filingPolititianOffice}"`
      );

      data = await retryProcessPDFData(path);
    } else {
      console.log(
        "The data from the website and the transaction match. No hallutinations from Openai."
      );
    }

    return data;
  } catch (error) {
    console.error(`Failed to process PDF data: ${error}`);
    return null;
  } finally {
    if (path !== null) {
      await deletePDF(path);
    }
  }
}

async function retryProcessPDFData(path) {
  let attempt = 0;
  while (attempt < retryDelays.length) {
    try {
      console.log(`Attempt ${attempt + 1} to process PDF data...`);
      return await convertPDFToJSON(path);
    } catch (error) {
      console.log(`Failed to process data on attempt ${attempt + 1}: ${error}`);
      if (attempt === retryDelays.length - 1) break; // Last attempt failed
      await sleep(retryDelays[attempt]);
      attempt++;
    }
  }
  return null; // Indicate failure after all retries
}
