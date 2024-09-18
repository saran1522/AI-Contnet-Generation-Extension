import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

let conversationHistory = [];

export async function runConversation(query) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Adding user input to conversation history
  conversationHistory.push({ role: "user", parts: [{ text: query }] });

  // Preparing the conversation for the API request
  const result = await model.generateContent({
    contents: conversationHistory,
  });

  const response = result.response;
  const text = response.text();

  // Adding AI response to conversation history
  conversationHistory.push({
    role: "model",
    parts: [{ text: response.text() }],
  });
  return conversationHistory;
}
