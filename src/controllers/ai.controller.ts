// src/controllers/ai.controller.ts
import { Request, Response } from "express";
import axios from "axios";
import { Book } from "../models/book.model";
import { Order } from "../models/order.model";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
//user ask the about book and reply with suggest books from db use gemini api
export const generateContent = async (req: Request, res: Response) => {
  try {
    const { text, maxToken } = req.body

    if (!text) {
      return res.status(400).json({ error: "text is required" })
    }
    const allBooks = await Book.find({});
    let booksList = "";
    allBooks.forEach((book) => {
      booksList += `Title: ${book.title}, Author: ${book.author}, Description: ${book.description}\n`;
    })
    const systemPrompt = `
You are an AI assistant for a book store.

IMPORTANT OUTPUT RULES (must be followed exactly):
- Do NOT greet the user
- Do NOT add any extra sentences
- Do NOT explain anything
- Do NOT ask questions

You may ONLY respond in ONE of the following two formats:

FORMAT A (when books are found):
Yes, we have that book.
Title - Author
Title - Author

FORMAT B (when no books are found):
No books found

Book matching rules:
- Only use books from the list below
- Match based on title or author only

User search:
"${text}"

Available books:
${booksList}
`

    const aiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent",
      {
        contents: [
          {
            parts: [
            {
              text: systemPrompt
            }
        ]
          }
        ],
        generationConfig: {
          maxOutputTokens: maxToken || 150
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY
        }
      }
    )

    const generatedContent =
      aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No data"

    res.status(200).json({
      data: generatedContent
    })
  } catch (error: any) {
    console.error(error.response?.data || error.message)

    res.status(500).json({
      error: "Failed to generate content"
    })
  }
}
