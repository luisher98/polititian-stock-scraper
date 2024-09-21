import DocumentIntelligence, {
  getLongRunningPoller,
  isUnexpected,
} from "@azure-rest/ai-document-intelligence";
import { AzureKeyCredential } from "@azure/core-auth";
import dotenv from "dotenv";

dotenv.config();

const key = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY;
const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT;

// sample document
const formUrl =
  "https://file.io/1WbD0d5I0Lu7";

async function main() {
  const client = DocumentIntelligence(endpoint, new AzureKeyCredential(key));

  const initialResponse = await client
    .path("/documentModels/{modelId}:analyze", "prebuilt-layout")
    .post({
      contentType: "application/json",
      body: {
        urlSource: formUrl,
      },
    });

  if (isUnexpected(initialResponse)) {
    throw initialResponse.body.error;
  }

  const poller = await getLongRunningPoller(client, initialResponse);
  const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;

  if (!analyzeResult) {
    throw new Error("No analyzeResult returned from the API");
  }

  // Log the entire analyze result to debug
  console.log("Full analyze result:", analyzeResult);

  const documents = analyzeResult?.documents;

  const document = documents && documents[0];

  console.log(
    "Extracted document:",
    document?.docType,
    `(confidence: ${document.confidence || "<undefined>"})`
  );
  console.log("Fields:", document.fields);
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
