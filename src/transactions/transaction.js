import fs from "fs";
import fetch from "node-fetch"; // Ensure you have node-fetch installed
import { JSDOM } from "jsdom";

const start = process.hrtime();

export async function fetchPolititianTransactions(year) {
  const requestOptions = {
    method: "POST",
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `https://disclosures-clerk.house.gov/FinancialDisclosure/ViewMemberSearchResult?filingYear=${year}`,
      requestOptions
    );
    const result = await response.text();
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchTransactionsByYear(year) {
  const fetchStart = process.hrtime();
  const htmlData = await fetchPolititianTransactions(year);
  const fetchEnd = process.hrtime(fetchStart);

  if (htmlData) {
    const dom = new JSDOM(htmlData);
    const document = dom.window.document;
    const rows = document.querySelectorAll("tbody tr");

    const results = [];

    rows.forEach((row) => {
      const nameElement = row.querySelector('td[data-label="Name"] a');
      const officeElement = row.querySelector('td[data-label="Office"]');
      const filingYearElement = row.querySelector(
        'td[data-label="Filing Year"]'
      );
      const filingElement = row.querySelector('td[data-label="Filing"]');

      const id = nameElement
        .getAttribute("href")
        .split("/")
        .pop()
        .replace(".pdf", "");
      const name = nameElement.textContent.trim();
      const office = officeElement.textContent.trim();
      const filingYear = filingYearElement.textContent.trim();
      const filing = filingElement.textContent.trim();
      results.push({
        id,
        name,
        office,
        filingYear,
        filing,
      });
    });

    const sortStart = process.hrtime();
    sortByIdDescending(results);
    const sortEnd = process.hrtime(sortStart);

    fs.writeFileSync("transactions.json", JSON.stringify(results, null, 2)); // Convert results to JSON string

    console.log(
      `Fetch time: ${(fetchEnd[0] + fetchEnd[1] / 1e9).toFixed(3)} seconds`
    );
    console.log(
      `Sort time: ${(sortEnd[0] + sortEnd[1] / 1e9).toFixed(3)} seconds`
    );
  } else {
    console.error("Failed to fetch HTML data");
  }
}

function sortByIdDescending(array) {
  return array.sort((a, b) => {
    if (a.id < b.id) return 1;
    if (a.id > b.id) return -1;
    return 0;
  });
}

fetchTransactionsByYear(2024).then(() => {
  const end = process.hrtime(start);
  console.log(
    `Total execution time: ${(end[0] + end[1] / 1e9).toFixed(3)} seconds`
  );
});
