export async function validateGeneratedOpenAiData(
  data,
  websiteTransactionData
) {
  // get the name and office of the polititian from the website
  const {
    nameDisplayedInTransactionWebsite,
    officeDisplayedInTransactionWebsite,
  } = websiteTransactionData;

  // get the first name and office of the polititian from the transaction data of pdf
  const {
    firstName: filingPolititianFirstName,
    office: filingPolititianOffice,
  } = await getTransactionFirstNameAndOffice(data);

  // compare the data from the  website and the data from the transaction,
  // if they are different openai made a mistake
  if (
    filingPolititianFirstName !== nameDisplayedInTransactionWebsite ||
    filingPolititianOffice !== officeDisplayedInTransactionWebsite
  ) {
    console.error(
      `There's a discrepancy between the data from the website and the transaction:\n
         The name from the website is "${nameDisplayedInTransactionWebsite}" and the name from the transaction is "${filingPolititianFirstName}"\n
         The office from the website is "${officeDisplayedInTransactionWebsite}" and the office from the transaction is "${filingPolititianOffice}"\n
         Retrying to process PDF data...\n`
    );

    return false;

  } else if (data.Transactions.length === 0) {
    console.error("No transactions found in the processed openai data.");
    return false;
  } else {
    return true;
  }
}

async function getTransactionFirstNameAndOffice(transactionData) {
  if (!transactionData) {
    throw new Error("No transaction name and office data found");
  }
  const fullName = transactionData.Filing_Information.Name.split(" ");
  console.log("fullName: ", fullName);
  const firstName = fullName[fullName.length - 1];
  console.log("firstName: ", firstName);
  const office = transactionData.Filing_Information.State_District;
  return { firstName, office };
}

export function isJSONString(obj) {
  try {
    JSON.parse(obj);
  } catch (e) {
    return false;
  }
}

export function extractStringBetweenBackticks(text) {
  const regex = /```(.*?)```/gs;
  let matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return matches.length ? matches[0] : false;
}
