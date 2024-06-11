import { downloadPDF, deletePDF } from "./utils.js";
import convertPDFToJSON from "./openai.js";
import { sleep, retryDelays } from "./config.js";
import { validateGeneratedOpenAiData } from "./validation.js";

// so that can be accessed in the finally block
let path = null;

export default async function processPDFTransactionData(
  url,
  websitePolititianData
) {
  try {
    console.log("Downloading and processing PDF data to JSON...");
    // Download the PDF from the given URL, returning the path to the file
    path = await downloadPDF(url);

    // Upload the PDF to OpenAI and store the JSON in data
    let data = await convertPDFToJSON(path);

    // validate that the data from OpenAI is correct by comparing it to the website data
    await validateGeneratedOpenAiData(data, websitePolititianData);

    return data;
  } catch (error) {
    console.error(
      `Error processing PDF transaction data: ${error.message}\nRetrying to process PDF data.`
    );
    const data = await retryProcessPDFData(path);
    return data;
  } finally {
    if (path !== null) {
      console.log("Deleting PDF file.");
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
      console.log(`
      Failed to process data on attempt ${attempt + 1}: ${error}\n
      Retrying in ${Math.floor((retryDelays[attempt] / 1000 / 60) << 0)} ${
        retryDelays[attempt] > 60000 ? "minutes" : "seconds"
      }...
      `);
      if (attempt === retryDelays.length - 1) break; // Last attempt failed
      await sleep(retryDelays[attempt]);
      attempt++;
    }
  }
  console.error("Failed to process PDF data after multiple attempts.");
  return null; // Indicate failure after all retries
}
