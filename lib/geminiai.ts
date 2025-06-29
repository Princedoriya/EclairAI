import { GoogleGenerativeAI } from "@google/generative-ai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";

// Initialize the Gemini API with your API key

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
export const generateSummaryFromGemini = async (pdfText: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const prompt = {
      contents: [
        {
          role: "user",
          parts: [
            { text: SUMMARY_SYSTEM_PROMPT },
            {
              text: `Transform this document into an engaging, easy-to-read
                    summary with contextually relevant emojis and proper markdown 
                    formatting:\n\n${pdfText}`,
            },
          ],
        },
      ],
    };

    const result = await model.generateContent(prompt);
    const response = result.response;

    if(!response.text()) {
        throw new Error('Empty response from Gemini API');
    }

    return response.text();
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    // Detect 429 Too Many Requests error and throw specific error message
    if (error?.status === 429 || (error?.message && error.message.includes("429"))) {
      const rateLimitError = new Error('RATE_LIMIT_EXCEEDED');
      rateLimitError.stack = error.stack;
      throw rateLimitError;
    }

    throw error;
  }
};
