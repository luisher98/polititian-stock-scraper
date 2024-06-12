import { JSDOM } from "jsdom";

export async function getLatestTransaction(year) {
  const transactions = await getTransactions(year);
  return transactions[0];
}

export async function getTransactions(year) {
  const htmlData = await fetchPolititianTransactions(year);

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

      const id = nameElement
        .getAttribute("href")
        .split("/")
        .pop()
        .replace(".pdf", "");
      const name = nameElement.textContent.trim();
      const office = officeElement.textContent.trim();
      const filingYear = filingYearElement.textContent.trim();
      const pdfUrl =
        "https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/" +
        year +
        "/" +
        nameElement.getAttribute("href").split("/").pop();
      results.push({
        id,
        name,
        office,
        filingYear,
        pdfUrl,
      });
    });

    sortByIdDescending(results);
    return results;
  } else {
    console.error("Failed to fetch HTML data");
  }
}

async function fetchPolititianTransactions(year) {
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

function sortByIdDescending(obj) {
  return obj.sort((a, b) => {
    if (a.id < b.id) return 1;
    if (a.id > b.id) return -1;
    return 0;
  });
}
