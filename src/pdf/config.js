import { promisify } from "util";

export const sleep = promisify(setTimeout);

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

export const retryDelays = [
  0, // Immediate
  3 * MINUTE, // 3 minutes
  7 * MINUTE, // 7 minutes
  30 * MINUTE, // 30 minutes
  8 * HOUR, // 8 hours
];

export const assistantInstructions = `
    Only respond with a JSON no words. Dont format the JSON. Read this pdf generate a json file with the information. Follow strictly this structure: 
        {
            "Filing_Information": {
            "Name": "...",
            "Status": "...",
            "State_District": "...",
            "Filing_ID": "..."
            },
            "Transactions": [
                {
                    "ID_Owner": "...",
                    "Asset": "...",
                    "Transaction_Type": "...",
                    "Date": "...",
                    "Notification_Date": "...",
                    "Amount": "...",
                    "Filing_Status": "...",
                    "Signatory_Owner": "..."
                },
            ]
        }
    `;
