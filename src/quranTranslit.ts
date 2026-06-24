// Quranic English-to-Bengali Transliteration Converter
// This utility parses English/Roman script transliterations (Bismillahir Rahmanir Rahim)
// and converts them to accurate, classic Bengali pronunciation.

const QURANIC_WORDS_MAP: Record<string, string> = {
  "bismillāhir": "বিসমিল্লাহির",
  "bismillahir": "বিসমিল্লাহির",
  "raḥmānir": "রাহমানির",
  "rahmanir": "রাহমানির",
  "raḥīm": "রাহিম",
  "rahim": "রাহিম",
  "al-ḥamdu": "আল-হামদু",
  "al-hamdu": "আল-হামদু",
  "lillāhi": "লিল্লাহি",
  "lillahi": "লিল্লাহি",
  "rabbi": "রাব্বি",
  "rabbil": "রাব্বিল",
  "ālamīn": "আলামীন",
  "alamin": "আলামীন",
  "yawmid": "ইয়াওমিদ",
  "dīn": "দ্বীন",
  "din": "দ্বীন",
  "iyyāka": "ইয়্যাকা",
  "iyyaka": "ইয়্যাকা",
  "naʿbudu": "নাবুদু",
  "nabudu": "নাবুদু",
  "wa-iyyāka": "ওয়া-ইয়্যাকা",
  "waiyyaka": "ওয়া-ইয়্যাকা",
  "nastaʿīn": "নাস্তাতীন",
  "nastain": "নাস্তাতীন",
  "ṣirāṭal": "সিরাতাল",
  "siratal": "সিরাতাল",
  "mustaqīm": "মুস্তাকীম",
  "mustaqim": "মুস্তাকীম",
  "anʿamta": "আনআমতা",
  "anamta": "আনআমতা",
  "alayhim": "আলাইহিম",
  "ihdinā": "ইহদিনা",
  "ihdina": "ইহদিনা",
  "allāhu": "আল্লাহু",
  "allāh": "আল্লাহ",
  "allah": "আল্লাহ",
  "allahu": "আল্লাহু",
  "ilāha": "ইলাহা",
  "ilaha": "ইলাহা",
  "illā": "ইল্লা",
  "illa": "ইল্লা",
  "huwa": "হুয়া",
  "aḥad": "আহাদ",
  "ahad": "আহাদ",
  "ṣamad": "সামাদ",
  "samad": "সামাদ",
  "lam": "লাম",
  "yalid": "ইয়ালিদ",
  "yūlad": "ইউলাদ",
  "yulad": "ইউলাদ",
  "nasrullāhi": "নাসরুল্লাহি",
  "kāfirūn": "কাফিরুন",
  "kafirun": "কাফিরুন",
  "kawṯar": "কাওসার",
  "kowthar": "কাওসার",
  "māʿūn": "মাউন",
  "maun": "মাউন",
  "qurayš": "কুরাইশ",
  "quraysh": "কুরাইশ",
  "humazah": "হুমাজাহ",
  "fīl": "ফীল",
  "fil": "ফীল",
  "ʿaṣr": "আসর",
  "asr": "আসর",
  "takāṯur": "তাকাসুর",
  "takathur": "তাকাসুর",
  "qāriʿah": "কারিয়াহ",
  "qariah": "কারিয়াহ",
  "ʿādiyāt": "আদিয়াত",
  "adiyat": "আদিয়াত",
  "zalzalah": "যালযালাহ",
  "bayyinah": "বাইয়্যিনাহ",
  "qadr": "কদর",
  "ʿalaq": "আলাক",
  "alaq": "আলাক",
  "tīn": "তীন",
  "tin": "তীন",
  "inširāḥ": "ইনশিরাহ",
  "inshirah": "ইনশিরাহ",
  "ḍuḥā": "দুহা",
  "duha": "দুহা",
  "layl": "লাইল",
  "shams": "শামস",
  "šams": "শামস",
  "balad": "বালাদ",
  "fajr": "ফজর",
  "gāšiyah": "গাশিয়াহ",
  "gashiyah": "গাশিয়াহ",
  "aʿlā": "আলা",
  "ala": "আলা",
  "ṭāriq": "তারিক",
  "tariq": "তারিক",
  "burūj": "বুরুজ",
  "buruj": "বুরুজ",
  "inšiqāq": "ইনশিকাক",
  "inshiqaq": "ইনশিকাক",
  "infiṭār": "ইনফিতার",
  "infitar": "ইনফিতার",
  "nāziʿāt": "নাজিয়াত",
  "naziat": "নাজিয়াত",
  "nabaʿ": "নাবা",
  "naba": "নাবা",
  "qul": "কুল",
  "rabbi-gfir": "রাব্বি-গফির",
  "āmana": "আমানা",
  "wal-fatḥ": "ওয়াল-ফাতহ",
  "wal-fath": "ওয়াল-ফাতহ",
  "gayril-magḍūbi": "গাইরিল-মাগদুবি",
  "gayril-magdoubi": "গাইরিল-মাগদুবি",
  "walāḍ-ḍāllīn": "ওয়ালাদ-দাল্লীন",
  "walad-dallin": "ওয়ালাদ-দাল্লীন"
};

// Character-by-character mapping rules
const PHONETIC_MAPS: Array<[string | RegExp, string]> = [
  // 1. Common combinations & suffixes
  [/sh/gi, "শ"],
  [/th/gi, "ছ"],
  [/kh/gi, "খ"],
  [/dh/gi, "য"],
  [/gh/gi, "গ"],
  [/ch/gi, "চ"],
  [/ay/gi, "আই"],
  [/ai/gi, "আই"],
  [/aw/gi, "আও"],
  [/au/gi, "আও"],
  [/ee/gi, "ী"],
  [/oo/gi, "ূ"],
  
  // 2. Special Arabic/Uthmani translit characters
  [/ā/g, "া"],
  [/ī/g, "ী"],
  [/ū/g, "ূ"],
  [/ṣ/g, "স"],
  [/ḍ/g, "দ"],
  [/ṭ/g, "ত"],
  [/ẓ/g, "য"],
  [/ḥ/g, "হ"],
  [/ḫ/g, "খ"],
  [/ḏ/g, "য"],
  [/š/g, "শ"],
  [/ṯ/g, "ছ"],
  [/ʿ/g, ""], 
  [/ʾ/g, ""],
  [/’/g, ""],
  [/`/g, ""],

  // 3. Singular consonants
  [/b/gi, "ব"],
  [/p/gi, "প"],
  [/t/gi, "ত"],
  [/j/gi, "জ"],
  [/h/gi, "হ"],
  [/d/gi, "দ"],
  [/r/gi, "র"],
  [/z/gi, "য"],
  [/s/gi, "স"],
  [/f/gi, "ফ"],
  [/q/gi, "ক"],
  [/k/gi, "ক"],
  [/l/gi, "ল"],
  [/m/gi, "ম"],
  [/n/gi, "ন"],
  [/w/gi, "ওয়া"],
  [/y/gi, "ই"],
  [/g/gi, "গ"],
  [/v/gi, "ভ"],
  [/x/gi, "ক্স"],
  [/c/gi, "ক"],

  // 4. Clean up vowels at start or standalone
  [/a/gi, "আ"],
  [/i/gi, "ই"],
  [/u/gi, "উ"],
  [/o/gi, "ও"],
  [/e/gi, "এ"]
];

/**
 * Normalizes and converts Romanized Arabic/English Quran transliteration
 * into authentic, natural-sounding Bengali script pronunciation.
 */
export function convertToBengaliPronunciation(text: string): string {
  if (!text) return "";
  
  // Trim and break into words so we can apply precise dictionary replacements first
  const words = text.toLowerCase().replace(/[\(\)\[\]]/g, "").split(/(\s+|-)/);
  
  const convertedWords = words.map((chunk) => {
    // If it's space or hyphen separator, return as is
    if (/^\s+$/.test(chunk) || chunk === "-") {
      return chunk;
    }
    
    const cleanWord = chunk.trim();
    if (!cleanWord) return chunk;
    
    // Check direct dictionary matches
    if (QURANIC_WORDS_MAP[cleanWord]) {
      return QURANIC_WORDS_MAP[cleanWord];
    }
    
    // Fallback: rule-based phonetic replacement
    let phoneticWord = cleanWord;
    
    // Apply each rule in order
    for (const [regex, replacement] of PHONETIC_MAPS) {
      phoneticWord = phoneticWord.replace(regex, replacement);
    }
    
    // Clean up double vowels/overlapping symbols for standard Bengali phonology
    phoneticWord = phoneticWord
      .replace(/াা/g, "া")
      .replace(/ীী/g, "ী")
      .replace(/ূূ/g, "ূ")
      .replace(/িি/g, "ি")
      .replace(/ুু/g, "ু")
      .replace(/াে/g, "ে")
      .replace(/াি/g, "াই")
      .replace(/াউ/g, "াও")
      .replace(/ইইউ/g, "ইউ")
      .replace(/ইযা/g, "িয়া")
      .replace(/ওয়াআ/g, "ওয়া")
      .replace(/াহ/g, "াহ্")
      .replace(/রর/g, "র")
      .replace(/লল/g, "ল")
      .replace(/ম্ম/g, "ম")
      .replace(/ন্ন/g, "ন")
      .replace(/বব/g, "ব")
      .replace(/ইই/g, "ই")
      .replace(/উউ/g, "উ");
      
    // Enforce initial Bengali letter rules
    if (phoneticWord.startsWith("া")) {
      phoneticWord = "আ" + phoneticWord.slice(1);
    } else if (phoneticWord.startsWith("ী")) {
      phoneticWord = "ঈ" + phoneticWord.slice(1);
    } else if (phoneticWord.startsWith("ূ")) {
      phoneticWord = "ঊ" + phoneticWord.slice(1);
    } else if (phoneticWord.startsWith("ি")) {
      phoneticWord = "ই" + phoneticWord.slice(1);
    } else if (phoneticWord.startsWith("ু")) {
      phoneticWord = "উ" + phoneticWord.slice(1);
    } else if (phoneticWord.startsWith("ে")) {
      phoneticWord = "এ" + phoneticWord.slice(1);
    } else if (phoneticWord.startsWith("ো")) {
      phoneticWord = "ও" + phoneticWord.slice(1);
    }
    
    return phoneticWord;
  });
  
  // Re-join words
  let result = convertedWords.join("");
  
  // Final string overrides for common formatting
  result = result
    .replace(/বিসমিল্লাহির-রাহমানির-রাহিম/g, "বিসমিল্লাহির রাহমানির রাহিম")
    .replace(/বিসমিল্লাহির রহমানির রহিম/g, "বিসমিল্লাহির রাহমানির রাহিম")
    .replace(/লা ইলাহা ইল্লাল্লাহ/g, "লা ইলাহা ইল্লাল্লাহ")
    .replace(/আল্লাহু আকবার/g, "আল্লাহু আকবার")
    .replace(/আলহামদুলিল্লাহ/g, "আলহামদুলিল্লাহ");
    
  return result;
}
