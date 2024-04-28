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
