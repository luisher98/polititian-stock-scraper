export async function extractData(page, selectors) {
    await page.waitForSelector(selectors.dataTableSelector, { visible: true });
    console.log("Data table is visible.");
    const data = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll("#DataTables_Table_0 tbody tr a"));
        const link = rows.slice(0, 1).map(link => link.href);
        return link[0];
    });
    console.log("Data is extracted:", data);
    return data;
}
