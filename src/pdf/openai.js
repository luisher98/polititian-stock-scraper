import fs from "fs";
import dotenv from "dotenv";
import OpenAI from "openai";

import { assistantInstructions } from "./config.js";
import { extractStringBetweenBackticks, isJSONString } from "./validation.js";

dotenv.config();

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};

const openai = new OpenAI(configuration);

export default async function convertPDFToJSON(filePath) {
  if (!configuration.apiKey) {
    throw new Error(
      "OpenAI API Key not found. Please add it to the .env file."
    );
  }

  const instructions = `${assistantInstructions}`;
  const assistant = process.env.OPENAI_ASSISTANT_ID;
  // Upload the PDF file to OpenAI
  const file = await openai.files.create({
    file: fs.createReadStream(filePath),
    purpose: "assistants",
  });

  // Create a thread with the PDF file
  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "user",
        content: instructions,
        attachments: [
          {
            file_id: file.id,
            tools: [{ type: "code_interpreter" }],
          },
        ],
      },
    ],
  });

  // Request the information from the assistant
  await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant,
  });

  // Get the messages from the thread
  let messages = await openai.beta.threads.messages.list(thread.id);
  
  // fs.writeFileSync("messages.json", JSON.stringify(messages));

  // Get the JSON data from the messages
  let data = await messages.data[0].content[0].text.value;


  // Delete the file from OpenAI. this should be done asynchronously to save time
  await openai.files.del(file.id);

  // Check if the data prompted by openai is in a JSON format
  if (!(data)) {
    try {
      // sometimes the data is wrapped in tripple backticks
      data = extractStringBetweenBackticks(data);
    } catch (error) {
      console.error("Error extracting JSON data from OpenAI: ", error);
    }
  }

  // Return the JSON data
  return JSON.parse(data);
}
