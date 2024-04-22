import puppeteer from "puppeteer";

export async function setupBrowser() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  return { page, browser };
}

export async function closeBrowser(browser) {
  await browser.close();
  console.log("Browser closed.");
}
