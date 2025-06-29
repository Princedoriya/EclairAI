import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from "fs";
import path from "path";
import os from "os";
import fetch from "node-fetch";

export async function fetchAndExtractPdfText(fileUrl: string) {
  // Download the PDF file
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF file from URL: ${fileUrl}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Create a temporary file path
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `temp_pdf_${Date.now()}.pdf`);

  // Save the PDF buffer to the temporary file
  await fs.promises.writeFile(tempFilePath, buffer);

  try {
    // Use PDFLoader with the file path
    const loader = new PDFLoader(tempFilePath);
    const docs = await loader.load();

    // Extract text from loaded docs
    const text = docs.map((doc) => doc.pageContent).join("\n");
    return text;
  } finally {
    // Delete the temporary file
    await fs.promises.unlink(tempFilePath).catch(() => {
      // Ignore errors on delete
    });
  }
}
