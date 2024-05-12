import { url, year, selectors } from "./config.js";
import { setupBrowser, closeBrowser } from "./utils.js";
import { goToPage } from "./navigation.js";
import { performSearch } from "./actions.js";
import { scrapPDFUrl, scrapLatestNameAndOffice } from "./dataExtraction.js";

export default async function runScrapper(transactionUpdate = () => {}) {
  const { page, browser } = await setupBrowser();
  transactionUpdate({
    status: "checking",
    message: "Checking website for new transactions...",
  });
  try {
    await goToPage(page, url);
    await performSearch(page, selectors, year);
    const pdfUrl = await scrapPDFUrl(page, selectors);
    const websiteTransactionData = await scrapLatestNameAndOffice(
      page,
      selectors
    );

    return { pdfUrl, websiteTransactionData };
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    if (browser) {
      closeBrowser(browser);
    }
  }
}
