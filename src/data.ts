// Islamic data for "নূরের পথ" application

export interface Verse {
  arabic: string;
  bengali: string;
  reference: string;
}

export interface Hadith {
  bengali: string;
  reference: string;
  category: string;
}

export interface DuaItem {
  id: string;
  title: string;
  arabic: string;
  bengali: string;
  transliteration?: string;
  reference: string;
}

export interface PrayerTime {
  name: string;
  englishName: string;
  time: string;
}

export interface ContactInfo {
  developer: {
    name: string;
    whatsapp: string;
    email: string;
    whatsappLink: string;
  };
  presentedBy: {
    name: string;
    email: string;
    channels: {
      platform: string;
      handle: string;
    }[];
  };
}

export const dailyVerse: Verse = {
  arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
  bengali: "নিশ্চয়ই কষ্টের সাথেই স্বস্তি রয়েছে।",
  reference: "আল-কুরআন, সূরা আশ-শারহ (৯৪): ৬"
};

export const surahsList = [
  { id: "001", name: "সূরা আল-ফাতিহা", meaning: "সূচনা", versesCount: 7, type: "মাক্কী" },
  { id: "036", name: "সূরা ইয়া-সীন", meaning: "ইয়া-সীন", versesCount: 83, type: "মাক্কী" },
  { id: "055", name: "সূরা আর-রহমান", meaning: "পরম করুণাময়", versesCount: 78, type: "মাদানী" },
  { id: "067", name: "সূরা আল-মূলক", meaning: "সার্বভৌমত্ব", versesCount: 30, type: "মাক্কী" },
  { id: "018", name: "সূরা আল-কাহফ", meaning: "গুহা", versesCount: 110, type: "মাক্কী" },
  { id: "112", name: "সূরা আল-ইখলাস", meaning: "একত্ববাদ", versesCount: 4, type: "মাক্কী" }
];

export const dailyHadith: Hadith = {
  bengali: "“তোমাদের মধ্যে সর্বোত্তম ব্যক্তি সে, যে কুরআন শেখে এবং অন্যকে শেখায়।”",
  reference: "সহীহ বুখারী, হাদিস নং: ৫০২৭",
  category: "জ্ঞান"
};

export const hadithsList: Hadith[] = [
  {
    bengali: "“নিশ্চয়ই আল্লাহ সুন্দর এবং তিনি সৌন্দর্য পছন্দ করেন।”",
    reference: "সহীহ মুসলিম, হাদিস নং: ৯১",
    category: "চরিত্র"
  },
  {
    bengali: "“প্রকৃত মুসলিম সেই ব্যক্তি, যার জিহ্বা এবং হাত থেকে অন্য মুসলিম নিরাপদ থাকে।”",
    reference: "সহীহ বুখারী, হাদিস নং: ১০",
    category: "ঈমান"
  },
  {
    bengali: "“কাজের প্রতিদান নিয়তের ওপর নির্ভরশীল।”",
    reference: "সহীহ বুখারী, হাদিস নং: ১",
    category: "ঈমান"
  },
  {
    bengali: "“যে ব্যক্তি সালাত ছেড়ে দিল, সে যেন কুফরী করল।”",
    reference: "সুনানে ইবনে মাজাহ, হাদিস নং: ১০৭৯",
    category: "সালাত"
  }
];

export const staticPrayerTimes: PrayerTime[] = [
  { name: "ফজর", englishName: "Fajr", time: "০৪:১২ AM" },
  { name: "যোহর", englishName: "Dhuhr", time: "১২:০৬ PM" },
  { name: "আসর", englishName: "Asr", time: "০৪:৩০ PM" },
  { name: "মাগরিব", englishName: "Maghrib", time: "০৬:৫০ PM" },
  { name: "এশা", englishName: "Isha", time: "০৮:১৫ PM" }
];

export const dailyDua: DuaItem = {
  id: "daily_dua_1",
  title: "ইহকাল ও পরকালের কল্যাণের দোয়া",
  arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
  bengali: "হে আমাদের পালনকর্তা! আমাদের ইহকালে কল্যাণ দান করুন এবং পরকালেও কল্যাণ দান করুন আর আমাদেরকে দোজখের আগুন থেকে রক্ষা করুন।",
  transliteration: "রাব্বানা আতিনা ফিদ দুনিয়া হাসানা তাও ওয়া ফিল আখিরাতি হাসানা তাও ওয়া কিনা আজাবান নার।",
  reference: "আল-কুরআন, সূরা আল-বাকারাহ (২): ২০১"
};

export const duaCategories = [
  { id: "morning_evening", name: "সকাল-সন্ধ্যা", icon: "🌅", count: 12 },
  { id: "protection", name: "বিপদ-আপদ", icon: "🛡️", count: 8 },
  { id: "health", name: "রোগমুক্তি", icon: "🏥", count: 6 },
  { id: "sleep", name: "ঘুমের আমল", icon: "🌙", count: 5 },
  { id: "forgiveness", name: "ক্ষমা প্রার্থনা", icon: "📿", count: 14 }
];

export const contactData: ContactInfo = {
  developer: {
    name: "Tamim Dary",
    whatsapp: "+8801885141751",
    email: "tdary999@gmail.com",
    whatsappLink: "https://wa.me/8801885141751"
  },
  presentedBy: {
    name: "RS Digital Hub",
    email: "digitalhubrs@gmail.com",
    channels: [
      { platform: "Instagram", handle: "@rsdigitalhub" },
      { platform: "TikTok", handle: "@rsdigitalhub" },
      { platform: "Facebook", handle: "@rsdigitalhub" }
    ]
  }
};
