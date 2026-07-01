import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Google GenAI client to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// API proxy for Gemini Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { contents } = req.body;
    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ error: { message: "Invalid request body" } });
    }

    const ai = getAiClient();
    
    // Call the Gemini model safely
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    res.json({
      candidates: [
        {
          content: {
            parts: [
              {
                text: response.text
              }
            ]
          }
        }
      ]
    });
  } catch (error: any) {
    console.error("Gemini API proxy error:", error);
    res.status(500).json({ error: { message: error.message || "Failed to generate AI response" } });
  }
});

async function startServer() {
  // Vite dev server middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static asset serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
