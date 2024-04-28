import { downloadPDF, deletePDF } from "./utils.js";
import convertPDFToJSON from "./openai.js";

export default async function processPDFTransactionData(url) {
  // Download the PDF from the given URL, returning the path to the file
  const path = await downloadPDF(url);

  // Upload the PDF to OpenAI and store the JSON in data
  const data = await convertPDFToJSON(path);

  // Delete the PDF
  await deletePDF(path);

  return data;
}
