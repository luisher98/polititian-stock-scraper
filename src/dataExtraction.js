export async function extractData(page, selectors) {
    await page.waitForSelector(selectors.dataTableSelector, { visible: true });
    console.log("Data table is visible.");
    const data = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll("#DataTables_Table_0 tbody tr a"));
        return rows.slice(0, 2).map(link => link.href);
    });
    console.log("Data is extracted:", data);
    return data;
}
