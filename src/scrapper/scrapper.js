import { url, year, selectors } from "./config.js";
import { setupBrowser, closeBrowser } from "./utils.js";
import { goToPage } from "./navigation.js";
import { performSearch } from "./actions.js";
import { extractData } from "./dataExtraction.js";


export default async function runScrapper() {
  const { page, browser } = await setupBrowser();
  try {
    await goToPage(page, url);
    await performSearch(page, selectors, year);
    const data = await extractData(page, selectors);
    return data;
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    if (browser) {
      closeBrowser(browser);
      console.log("Browser closed.");
    }
  }
}