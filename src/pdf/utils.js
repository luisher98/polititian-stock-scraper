import { writeFile, unlink } from "node:fs/promises";
import { get } from "node:https";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Async function defined to download a PDF
export async function downloadPDF(url) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const id = url.split("/").pop().split(".")[0];
  const outputPath = join(__dirname, "./temp", `${id}.pdf`);

  try {
    const response = await new Promise((resolve, reject) => {
      get(url, (res) => {
        if (res.statusCode === 200) {
          resolve(res);
        } else {
          reject(new Error(`Request Failed. Status Code: ${res.statusCode}`));
        }
      }).on("error", (err) => {
        reject(err);
      });
    });

    let chunks = [];
    for await (const chunk of response) {
      chunks.push(chunk);
    }
    let buffer = Buffer.concat(chunks);
    await writeFile(outputPath, buffer);
    return outputPath;
  } catch (err) {
    deletePDF(outputPath);
    throw err; // Re-throw the error to be caught by the outer try-catch
  }
}

// Delete the PDF file
export async function deletePDF(path) {
  try {
    await unlink(path);
  } catch (err) {
    console.error(`Could not remove file: ${err.message}`);
  }
}
