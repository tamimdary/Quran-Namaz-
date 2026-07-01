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
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// In-memory caches for Hadiths and Quran Surahs
const hadithCache: Record<string, any> = {};
const quranSurahCache: Record<string, any[]> = {};

// API proxy for Hadiths to resolve slow/failing jsdelivr load on mobile client
app.get("/api/hadiths", async (req, res) => {
  try {
    const { book } = req.query;
    if (!book || typeof book !== "string") {
      return res.status(400).json({ error: "Book ID is required" });
    }

    if (hadithCache[book]) {
      return res.json(hadithCache[book]);
    }

    console.log(`Fetching Hadith book: ${book} from CDN on backend...`);
    const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-${book}.json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch hadiths from CDN: ${response.statusText}`);
    }
    const data = await response.json();
    if (data && Array.isArray(data.hadiths)) {
      hadithCache[book] = data;
      return res.json(data);
    } else {
      throw new Error("Invalid hadiths format from CDN");
    }
  } catch (error: any) {
    console.error("Hadith proxy API error:", error);
    res.status(500).json({ error: error.message || "Failed to load Hadiths" });
  }
});

// API proxy for Quran Surah details, featuring automatic high-quality Bengali Pronunciation (উচ্চারণ) generation via Gemini 3.5 Flash
app.get("/api/quran/surah/:number", async (req, res) => {
  const surahNumber = req.params.number;
  try {
    if (quranSurahCache[surahNumber]) {
      return res.json(quranSurahCache[surahNumber]);
    }

    console.log(`Fetching details for Surah ${surahNumber} on backend...`);
    const arabicUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`;
    const bnMeaningUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/bn.bengali`;
    const enMeaningUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`;
    const enTransliterationUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/en.transliteration`;

    const [arRes, bnRes, enRes, transRes] = await Promise.all([
      fetch(arabicUrl).then((r) => r.json()),
      fetch(bnMeaningUrl).then((r) => r.json()),
      fetch(enMeaningUrl).then((r) => r.json()),
      fetch(enTransliterationUrl).then((r) => r.json())
    ]);

    if (!arRes?.data?.ayahs || !bnRes?.data?.ayahs || !enRes?.data?.ayahs || !transRes?.data?.ayahs) {
      throw new Error("Failed to load surah data from Al-Quran Cloud");
    }

    const arAyahs = arRes.data.ayahs;
    const bnAyahs = bnRes.data.ayahs;
    const enAyahs = enRes.data.ayahs;
    const transAyahs = transRes.data.ayahs;

    const combined: any[] = [];
    const chunkSize = 30; // Batch into sizes of 30 to stay within limits and ensure quick streaming

    for (let i = 0; i < arAyahs.length; i += chunkSize) {
      const arChunk = arAyahs.slice(i, i + chunkSize);
      const transChunk = transAyahs.slice(i, i + chunkSize);

      const prompt = `You are an expert Islamic scholar and Arabic-to-Bengali phonetician.
I have a list of Quranic verses for Surah ${surahNumber}.
For each verse, I provide the Arabic text and the English transliteration.
Please generate the exact, standard Bengali phonetic pronunciation (উচ্চারণ) for each verse.
Ensure it is written in standard, beautiful Bengali script that Bengali speakers traditionally use to read Quranic verses phonetically.
Ensure your response is valid JSON matching this schema:
{
  "pronunciations": [
    { "numberInSurah": 1, "pronunciation": "বাংলা উচ্চারণ এখানে লিখুন" }
  ]
}

Input Verses:
${arChunk.map((ar: any, idx: number) => `Verse ${ar.numberInSurah}:
Arabic: ${ar.text}
English Transliteration: ${transChunk[idx]?.text || ""}`).join("\n\n")}

ONLY return the JSON object, do not write any markdown code block formatting or explanations.`;

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text ? response.text.trim() : "";
      let jsonParsed: any = { pronunciations: [] };
      try {
        jsonParsed = JSON.parse(responseText);
      } catch (e) {
        console.warn("Retrying JSON cleanup for Gemini pronunciation response...");
        const cleanText = responseText.replace(/```json|```/g, "").trim();
        jsonParsed = JSON.parse(cleanText);
      }

      const pronunciationMap = new Map<number, string>();
      if (Array.isArray(jsonParsed.pronunciations)) {
        for (const p of jsonParsed.pronunciations) {
          pronunciationMap.set(p.numberInSurah, p.pronunciation);
        }
      }

      for (let j = 0; j < arChunk.length; j++) {
        const globalIdx = i + j;
        const arAyah = arAyahs[globalIdx];
        const bnAyah = bnAyahs[globalIdx];
        const enAyah = enAyahs[globalIdx];
        const transAyah = transAyahs[globalIdx];

        let pronunciation = pronunciationMap.get(arAyah.numberInSurah) || "";
        if (!pronunciation) {
          pronunciation = transAyah?.text || bnAyah?.text || "";
        }

        combined.push({
          number: arAyah.number,
          numberInSurah: arAyah.numberInSurah,
          text: arAyah.text,
          bengaliMeaning: bnAyah?.text || "",
          englishMeaning: enAyah?.text || "",
          pronunciation: pronunciation
        });
      }
    }

    quranSurahCache[surahNumber] = combined;
    res.json(combined);
  } catch (error: any) {
    console.error("Quran Surah detail proxy error, executing graceful fallback:", error);
    try {
      // Direct fast fallback returning English transliteration or Bengali translation as a safety net
      const arabicUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`;
      const bnMeaningUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/bn.bengali`;
      const enMeaningUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`;
      const enTransliterationUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/en.transliteration`;

      const [arRes, bnRes, enRes, transRes] = await Promise.all([
        fetch(arabicUrl).then((r) => r.json()),
        fetch(bnMeaningUrl).then((r) => r.json()),
        fetch(enMeaningUrl).then((r) => r.json()),
        fetch(enTransliterationUrl).then((r) => r.json())
      ]);

      const fallbackCombined = arRes.data.ayahs.map((arAyah: any, idx: number) => {
        const bnAyah = bnRes.data.ayahs[idx];
        const enAyah = enRes.data.ayahs[idx];
        const transAyah = transRes.data.ayahs[idx];
        return {
          number: arAyah.number,
          numberInSurah: arAyah.numberInSurah,
          text: arAyah.text,
          bengaliMeaning: bnAyah?.text || "",
          englishMeaning: enAyah?.text || "",
          pronunciation: transAyah?.text || bnAyah?.text || ""
        };
      });
      res.json(fallbackCombined);
    } catch (fallbackErr: any) {
      res.status(500).json({ error: "Failed to fetch surah data" });
    }
  }
});

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
      model: "gemini-3.5-flash",
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
