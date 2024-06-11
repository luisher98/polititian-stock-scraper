export async function goToPage(page, url) {
    await page.goto(url, { timeout: 0, waitUntil: ["domcontentloaded", "networkidle0"] });
}

export async function performSearch(page, selectors, year) {
    // Select search sidebar button and click it
    await page.waitForSelector(selectors.searchSidebarButton, { visible: true });
    await page.click(selectors.searchSidebarButton);

    // Select "#Year" dropdown and set it to the given year
    await page.waitForSelector(selectors.dropdownSelector, { visible: true });
    await page.select(selectors.dropdownSelector, year);

    // Select "#Search" button and click it
    await page.waitForSelector(selectors.searchButtonSelector, { visible: true });
    await page.click(selectors.searchButtonSelector);
}