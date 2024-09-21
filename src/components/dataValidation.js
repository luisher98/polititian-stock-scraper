export async function validateGeneratedOpenAiData(
  data,
  nameInWebsite,
  officeInWebsite
) {
  try {
    const websiteData = {
      nameInWebsite,
      officeInWebsite,
    };

    const transactionData = await getTransactionFirstNameAndOffice(data);

    if (!isValidPoliticianData(transactionData, websiteData)) {
      logDiscrepancyError(websiteData, transactionData);
    }

    if (!hasTransactions(data)) {
      throw new Error(
        "no transactions were found in the processed OpenAI data."
      );
    }

    console.log("Data validated successfully");
  } catch (error) {
    throw new Error(
      `Data from OpenAI don't match website data because ${error.message}`
    );
  }
}

function isValidPoliticianData(transactionData, websiteData) {
  return (
    transactionData.firstName === websiteData.name &&
    transactionData.office === websiteData.office
  );
}

function logDiscrepancyError(websiteData, transactionData) {
  throw new Error(
    `there's a discrepancy between the data from the website and the transaction:
     The name from the website is "${websiteData.name}" and the name from the transaction is "${transactionData.firstName}"
     The office from the website is "${websiteData.office}" and the office from the transaction is "${transactionData.office}"`
  );
}

function hasTransactions(data) {
  return data.Transactions && data.Transactions.length > 0;
}

async function getTransactionFirstNameAndOffice(transactionData) {
  if (!transactionData) {
    throw new Error("no transaction name and office data was found.");
  }
  const fullName = transactionData.Filing_Information.Name.split(" ");
  console.log("fullName: ", fullName);
  const firstName = fullName[fullName.length - 1];
  console.log("firstName: ", firstName);
  const office = transactionData.Filing_Information.State_District;
  return { firstName, office };
}

export function extractStringBetweenBackticks(text) {
  try {
    const regex = /```(.*?)```/gs;
    let matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1]);
    }
    return matches.length ? matches[0] : false;
  } catch (error) {
    console.error(
      "The JSON text could not be extracted from the OpenAI response (string). The response is the following" +
        text
    );
  }
}

export function isJSON(obj) {
  if (typeof text !== "string") {
    return false;
  }
  try {
    JSON.parse(obj);
    return true;
  } catch (error) {
    return false;
  }
}
