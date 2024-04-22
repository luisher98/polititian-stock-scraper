import { url, year, selectors } from "./config.js";
import { setupBrowser, closeBrowser } from "./src/utils.js";
import { goToPage } from "./src/navigation.js";
import { performSearch } from "./src/actions.js";
import { extractData } from "./src/dataExtraction.js";

async function run() {
  const { page, browser } = await setupBrowser();
  try {
    await goToPage(page, url);
    await performSearch(page, selectors, year);
    const data = await extractData(page, selectors);
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed.");
    }
  }
}

run();
