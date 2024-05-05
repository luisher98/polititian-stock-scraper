export async function scrapPDFUrl(page, selectors) {
  await page.waitForSelector(selectors.urlDataTableSelector, { visible: true });
  try {

    const pdfUrl = await page.evaluate((selector) => {
      const rows = Array.from(document.querySelectorAll(selector));
      const url = rows.slice(0, 1).map((link) => link.href);
      return url[0];
    }, selectors.urlDataTableSelector);
    return pdfUrl;
  } catch (error) {
    console.error("An error occurred while scrapping for the PDF url: ", error);
  }
}

export async function scrapLatestNameAndOffice(page, selectors) {
  await page.waitForSelector(selectors.dataTableSelector, { visible: true }); // Use common selector for whole table

  const data = await page.evaluate(
    (nameSel, officeSel) => {
      const rows = Array.from(
        document.querySelectorAll("#DataTables_Table_0 tbody tr")
      );

      const fullName = rows[0].querySelector(nameSel).innerText;
      const office = rows[0].querySelector(officeSel).innerText;

      const name = fullName.split(",")[0];

      return { name, office };
    },
    selectors.nameDataTableSelector,
    selectors.officeDataTableSelector
  );
  return data;
}
