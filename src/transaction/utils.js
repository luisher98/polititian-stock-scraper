export function getTransactionFirstNameAndOffice(transactionData) {
  try {
    if (!transactionData) {
      throw new Error("No transaction data found");
    }
    const fullName = transactionData.Filing_Information.Name.split(" ");
    console.log("fullName: ", fullName);
    const firstName = fullName[fullName.length - 1];
    console.log("firstName: ", firstName);
    const office = transactionData.Filing_Information.State_District;
    return { firstName, office };
  } catch (error) {
    console.error(
      "Error getting first name and office from transaction data: ",
      error
    );
    return { firstName: null, office: null };
  }
}
