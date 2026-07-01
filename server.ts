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

// Comprehensive dictionary of common Quranic words with precise, authentic Bengali phonetic pronunciations
const COMMON_WORD_MAP: Record<string, string> = {
  // Common terms & names
  "allah": "আল্লাহ্",
  "allaah": "আল্লাহ্",
  "lillah": "লিল্লাহ্",
  "lillaah": "লিল্লাহ্",
  "lillaahi": "লিল্লাহি",
  "bismillah": "বিসমিল্লাহ্",
  "bismillaah": "বিসমিল্লাহ্",
  "bismillaahir": "বিসমিল্লাহির",
  "rahmaan": "রহমান",
  "rahmaani": "রহমানি",
  "rahmaanir": "রহমানির",
  "raheem": "রহীম",
  "raheemi": "রহীমি",
  "al-hamdu": "আল-হামদু",
  "rabb": "রব্ব",
  "rabbi": "রব্বি",
  "rabbil": "রব্বিল",
  "al-ameen": "আল-আমীন",
  "aalameen": "আলামীন",
  "maaliki": "মালিকি",
  "yawm": "ইয়াওম",
  "yawmid": "ইয়াওমিদ",
  "deen": "দ্বীন",
  "deeni": "দ্বীনি",
  "iyyaaka": "ইয়্যাকা",
  "na'budu": "নাবুদু",
  "wa": "ওয়া",
  "nasta'een": "নাস্তায়ীন",
  "ihdinas": "ইহদিনাস",
  "siraat": "সিরাত",
  "siraatal": "সিরাতাল",
  "mustaqeem": "মুস্তাকীম",
  "lazeena": "লাযীনা",
  "an'amta": "আনামতা",
  "alayhim": "আলাইহিম",
  "ghayril": "গাইরিল",
  "maghdoobi": "মাগদুবী",
  "lad-daalleen": "লাদ-দাল্লীন",
  
  // Pronouns & Prepositions & Common particles
  "min": "মিন",
  "minal": "মিনাল",
  "fi": "ফি",
  "fee": "ফী",
  "feehim": "ফীহিম",
  "feehi": "ফীহি",
  "la": "লা",
  "laa": "লা",
  "ma": "মা",
  "maa": "মা",
  "inna": "ইন্না",
  "innallaha": "ইন্নাল্লাহ্",
  "innallaaha": "ইন্নাল্লাহ্",
  "anna": "আন্না",
  "ala": "আলা",
  "alaa": "আলা",
  "bi": "বি",
  "ilayhi": "ইলাইহি",
  "ilayhim": "ইলাইহিম",
  "ila": "ইলা",
  "ilaa": "ইলা",
  "an": "আন",
  "am": "আম",
  "aw": "আও",
  "as-samawaati": "আস-সামাওয়াত",
  "samawaati": "সামাওয়াত",
  "al-ard": "আল-আরদ্ব",
  "ard": "আরদ্ব",
  "irdi": "আরদ্বি",
  "ardi": "আরদ্বি",
  "al-ardi": "আল-আরদ্বি",
  "nas": "নাস",
  "an-nas": "আন-নাস",
  "an-naas": "আন-নাস",
  "naas": "নাস",
  "minal-jinnati": "মিনাল-জিন্নাতি",
  "wan-nas": "ওয়ান-নাস",
  "wan-naas": "ওয়ান-নাস",
  "qul": "কুল",
  "ahuuz": "আউযু",
  "a'oozu": "আউযু",
  "biraadin": "বিরাব্বিন",
  "birabbin": "বিরাব্বিন",
  "malikin": "মালিকিন",
  "ilaahin": "ইলাহিন",
  "ilaahi": "ইলাহি",
  "sharril": "শাররিল",
  "sharri": "শাররি",
  "waswaasil": "ওয়াসওয়াসিল",
  "khannaas": "খান্নাস",
  "khannas": "খান্নাস",
  "allazee": "আল্লাযী",
  "yuwaswisu": "ইউওয়াসউইসু",
  "fih": "ফী",
  "sudoorin": "সুদূরিন",
  "sudoorin-naas": "সুদূরিন-নাস",
  "jinnati": "জিন্নাতি",
  "falaj": "ফালাক",
  "falaq": "ফালাক",
  "al-falaq": "আল-ফালাক",
  "khalaq": "খালাক",
  "ghasiqin": "গাসিকিন",
  "waqab": "ওয়াক্বাব",
  "naffaasaati": "নাফফাসাত",
  "naffasaati": "নাফফাসাত",
  "uqad": "উক্বদ",
  "hasidin": "হাসিদিন",
  "hasad": "হাসাদ",
  "ahad": "আহাদ",
  "samad": "সামাদ",
  "as-samad": "আস-সামাদ",
  "yalid": "ইয়াদিল",
  "walam": "ওয়ালাম",
  "yoolad": "ইউলাদ",
  "yakun": "ইয়াকুন",
  "lahu": "লাহু",
  "kufuwan": "কুফুওয়ান",
  "ablah": "আবলাহ",
  "lahab": "লাহাব",
  "watab": "ওয়াতাব",
  "aghna": "আগনা",
  "anhu": "আনহু",
  "maaluhu": "মালুহু",
  "kasab": "คাসাব",
  "yasla": "ইয়াসলা",
  "naaran": "নারান",
  "zaata": "যাতা",
  "imra'atuhu": "ইমরাআতুহু",
  "hammaalatal": "হাম্মা লাতাল",
  "hatab": "হাতাব",
  "jeedihaa": "জীদিহা",
  "hablum": "হাবলুম",
  "masad": "মাসাদ",
  "iza": "ইযা",
  "izaa": "ইযা",
  "jaa'a": "জাআ",
  "nasrullahi": "নাসরুল্লাহি",
  "nasrullaahi": "নাসরুল্লাহি",
  "fath": "ফাতহ",
  "al-fath": "আল-ফাতহ",
  "ra'aytan": "রাআইতান",
  "yadkhuloona": "ইয়াদখুলুনা",
  "deenillahi": "দ্বীনিল্লাহি",
  "deenillaahi": "দ্বীনিল্লাহি",
  "afwaajaa": "আফওয়াজা",
  "afwajan": "আফওয়াজা",
  "fasabbih": "ফাসাব্বিহ",
  "bihamdi": "বিহামদি",
  "wastaghfirh": "ওয়াস্তাগফিরহু",
  "innahu": "ইন্নাহু",
  "kaana": "কানা",
  "tawwaaba": "তাওয়্যাবা",
  "tawwaabaa": "তাওয়্যাবা",
  "kawthar": "কাওসার",
  "al-kawthar": "আল-কাওসার",
  "a'taynaaka": "আতাইনা-কা",
  "fasalli": "ফাসাল্লি",
  "wanhar": "ওয়ানহার",
  "shaani'aka": "শানিআকা",
  "huwal": "হুওয়াল",
  "abtar": "আবতার",
  "ara'aytallas": "আরাআইতাল্লাযী",
  "ara'aytallazee": "আরাআইতাল্লাযী",
  "yukazzibu": "ইউকাযযিবু",
  "bideen": "বিদ্দীন",
  "bid-deen": "বিদ্দীন",
  "fazaalikallas": "ফাযালিকাল্লাযী",
  "fazaalikallazee": "ফাযালিকাল্লাযী",
  "yadu''ul-yateem": "ইয়াদুউল ইয়াতীম",
  "yadu'ul-yateem": "ইয়াদুউল ইয়াতীম",
  "yateem": "ইয়াতীম",
  "yahuddu": "ইয়াহuদ্দু",
  "ta'amil-miskeen": "তাআমিল মিসকীন",
  "ta'aamil-miskeen": "তাআমিল মিসকীন",
  "miskeen": "মিসকীন",
  "fawaylul-lilmussalleen": "ফাওয়াইলুল লিলমুসাল্লীন",
  "fawaylul-lilmusalleen": "ফাওয়াইলুল লিলমুসাল্লীন",
  "musalleen": "মুসাল্লীন",
  "hum": "হুম",
  "salaatihim": "সালাতিহিম",
  "sahoon": "সাহুন",
  "yuraa'oon": "ইউরাউন",
  "yura'oon": "ইউরাউন",
  "wayamna'oonal-ma'oon": "ওয়া ইয়ামনাউনাল মাউন",
  "ma'oon": "মাউন"
};

function scanWord(s: string): string {
  let result = "";
  let isStart = true;
  
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    
    if (char.charCodeAt(0) > 127) {
      result += char;
      isStart = false;
      continue;
    }
    
    if (["a", "i", "u", "o", "e"].includes(char)) {
      if (isStart) {
        if (char === "a") result += "আ";
        else if (char === "i") result += "ই";
        else if (char === "u") result += "উ";
        else if (char === "o") result += "ও";
        else if (char === "e") result += "এ";
      } else {
        if (char === "a") result += "া";
        else if (char === "i") result += "ি";
        else if (char === "u") result += "u"; // use standard ু sound
        else if (char === "o") result += "ো";
        else if (char === "e") result += "ে";
      }
      isStart = false;
    } else {
      isStart = false;
      if (char === "b") result += "ব";
      else if (char === "t") result += "ত";
      else if (char === "j") result += "জ";
      else if (char === "h") result += "হ";
      else if (char === "k") result += "ক";
      else if (char === "l") result += "ল";
      else if (char === "m") result += "ম";
      else if (char === "n") result += "ন";
      else if (char === "s") result += "স";
      else if (char === "r") result += "র";
      else if (char === "f") result += "ফ";
      else if (char === "q") result += "ক";
      else if (char === "z") result += "জ";
      else if (char === "d") result += "দ";
      else if (char === "g") result += "গ";
      else if (char === "p") result += "প";
      else if (char === "v") result += "ভ";
      else if (char === "w") result += "ওয়";
      else if (char === "y") result += "য়";
      else if (char === "'") {
        // apostrophe, skip
      } else {
        result += char;
        isStart = true;
      }
    }
  }
  // Standardize vowel markers representation
  return result.replace(/u/g, "ু");
}

function transliteratePhoneticWord(word: string): string {
  if (!word) return "";
  
  let res = word;
  
  res = res.replace(/iyya/g, "িয়্যা");
  res = res.replace(/iy/g, "িয়");
  res = res.replace(/ya/g, "িয়া");
  res = res.replace(/yu/g, "ইউ");
  res = res.replace(/yi/g, "িয়ি");
  res = res.replace(/yo/g, "ইয়ো");
  res = res.replace(/wa/g, "ওয়া");
  res = res.replace(/wu/g, "উ");
  res = res.replace(/wi/g, "উই");
  
  res = res.replace(/kh/g, "খ");
  res = res.replace(/sh/g, "শ");
  res = res.replace(/gh/g, "গ");
  res = res.replace(/th/g, "ছ");
  res = res.replace(/dh/g, "য");
  res = res.replace(/zh/g, "য");
  res = res.replace(/ph/g, "ফ");
  res = res.replace(/ch/g, "চ");
  
  res = res.replace(/bb/g, "ব্ব");
  res = res.replace(/tt/g, "ত্ত");
  res = res.replace(/dd/g, "দ্দ");
  res = res.replace(/ff/g, "ফফ");
  res = res.replace(/kk/g, "ক্ক");
  res = res.replace(/ll/g, "ল্ল");
  res = res.replace(/mm/g, "ম্ম");
  res = res.replace(/nn/g, "ন্ন");
  res = res.replace(/ss/g, "স্স");
  res = res.replace(/rr/g, "র্র");
  res = res.replace(/zz/g, "জ্জ");
  
  res = res.replace(/ee/g, "ী");
  res = res.replace(/oo/g, "ূ");
  res = res.replace(/aa/g, "া");
  
  res = res.replace(/ay/g, "ায়");
  res = res.replace(/aw/g, "াও");
  res = res.replace(/ai/g, "াই");
  res = res.replace(/au/g, "াউ");
  
  return scanWord(res);
}

function convertToBengaliPronunciation(englishTransliteration: string): string {
  if (!englishTransliteration) return "";
  
  const text = englishTransliteration.trim();
  const words = text.split(/\s+/);
  
  const convertedWords = words.map(word => {
    const match = word.match(/^([^\w'-]*)([\w'-]+)([^\w'-]*)$/);
    if (!match) return word;
    
    const prefix = match[1];
    let core = match[2].toLowerCase();
    const suffix = match[3];
    
    if (COMMON_WORD_MAP[core]) {
      return prefix + COMMON_WORD_MAP[core] + suffix;
    }
    
    if (core.includes("-")) {
      const parts = core.split("-");
      const convertedParts = parts.map(part => {
        if (COMMON_WORD_MAP[part]) return COMMON_WORD_MAP[part];
        return transliteratePhoneticWord(part);
      });
      return prefix + convertedParts.join("-") + suffix;
    }
    
    return prefix + transliteratePhoneticWord(core) + suffix;
  });
  
  return convertedWords.join(" ");
}

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

// API proxy for Quran Surah details, featuring automatic high-quality Bengali Pronunciation (উচ্চারণ) generation via local phonetic engine
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

    const combined: any[] = arAyahs.map((arAyah: any, idx: number) => {
      const bnAyah = bnAyahs[idx];
      const enAyah = enAyahs[idx];
      const transAyah = transAyahs[idx];

      const englishTrans = transAyah?.text || "";
      const pronunciation = convertToBengaliPronunciation(englishTrans);

      return {
        number: arAyah.number,
        numberInSurah: arAyah.numberInSurah,
        text: arAyah.text,
        bengaliMeaning: bnAyah?.text || "",
        englishMeaning: enAyah?.text || "",
        pronunciation: pronunciation
      };
    });

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
        const transAyah = transAyahs[idx];
        
        const englishTrans = transAyah?.text || "";
        const pronunciation = convertToBengaliPronunciation(englishTrans) || englishTrans;

        return {
          number: arAyah.number,
          numberInSurah: arAyah.numberInSurah,
          text: arAyah.text,
          bengaliMeaning: bnAyah?.text || "",
          englishMeaning: enAyah?.text || "",
          pronunciation: pronunciation
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
