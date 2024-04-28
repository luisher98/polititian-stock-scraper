import { assistantInstructions } from "./config.js";

import fs from "fs";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};

const openai = new OpenAI(configuration);

export default async function convertPDFToJSON(filePath) {
  const instructions = `${assistantInstructions}`;
  const assistant = process.env.OPENAI_ASSISTANT_ID;
  try {
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
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant,
    });

    // Get the messages from the thread
    let messages = await openai.beta.threads.messages.list(thread.id);

    // Get the JSON data from the messages
    const data = await messages.data[0].content[0].text.value;

    // Delete the file from OpenAI. this should be done asynchronously to save time
    await openai.files.del(file.id);

    return JSON.parse(data);
  } catch (error) {
    console.error(
      "Error processing the PDF to JSON with OpenAI: ",
      error.message
    );
  }
}
