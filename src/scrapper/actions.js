export async function performSearch(page, selectors, year) {
    await page.waitForSelector(selectors.searchSidebarButton, { visible: true });
    console.log("Search sidebar button is visible.");
    await page.click(selectors.searchSidebarButton);
    console.log("Navigation after clicking search sidebar button complete.");

    await page.waitForSelector(selectors.dropdownSelector, { visible: true });
    console.log("Dropdown selector is visible.");
    await page.select(selectors.dropdownSelector, year);
    console.log(`Year set to ${year}.`);

    await page.waitForSelector(selectors.searchButtonSelector, { visible: true });
    console.log("Search button is visible.");
    await page.click(selectors.searchButtonSelector);
    console.log("Search button click complete.");
}
