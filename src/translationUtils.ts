// Multilingual Translation Dictionary for "نور الصراط / নূরের পথ / NPath"
// Supports Bengali (bn), English (en), and Arabic (ar)

export type Language = "bn" | "en" | "ar";

export interface TranslationDictionary {
  appName: string;
  tabs: {
    home: string;
    quran: string;
    hadith: string;
    prayer: string;
    dua: string;
    more: string;
  };
  moreSections: {
    worship: string; // ইবাদত
    education: string; // শিক্ষা
    tools: string; // টুলস
    other: string; // অন্যান্য
    akhirahDash: string;
    namazTracker: string;
    ramadanMode: string;
    history: string;
    kidsCorner: string;
    aiAssistant: string;
    tasbih: string;
    qibla: string;
    zakatCalc: string;
    certificate: string;
    settings: string;
    contactUs: string;
    changeLang: string;
  };
  general: {
    back: string;
    backToMenu: string;
    search: string;
    clear: string;
    loadMore: string;
    offlineMsg: string;
    copy: string;
    copied: string;
    share: string;
    save: string;
    cancel: string;
  };
  quran: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    bookmarksBtn: string;
    bookmarksTitle: string;
    inspirationTitle: string;
    noBookmarks: string;
    bookmarksInstruction: string;
    normalMode: string;
    mushafMode: string;
    modeToggle: string;
    totalSurahs: string;
    resultsCount: string;
    versesCount: string;
    typeMeccan: string;
    typeMedinan: string;
    meaningLabel: string;
    pronunciationLabel: string;
    translationLabel: string;
    tilawatLabel: string;
    tilawatPause: string;
    bookmarkAdded: string;
    lastReadSaved: string;
    bismillah: string;
  };
  hadith: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    dailyHadithTitle: string;
    noHadithFound: string;
    noHadithDetails: string;
    hadithSource: string;
    booksGridTitle: string;
    resultsLabel: string;
    topicFilterLabel: string;
    bukhariName: string;
    muslimName: string;
    abudawudName: string;
    tirmidhiName: string;
  };
  prayer: {
    title: string;
    subtitle: string;
    todayPrayerTimes: string;
    trackerTitle: string;
    timeLabel: string;
    remainingLabel: string;
    trackerSuccess: string;
    daysLabels: string[];
    waqts: {
      Fajr: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
    };
  };
  dua: {
    title: string;
    subtitle: string;
    dailyDuaTitle: string;
    categoriesTitle: string;
    referenceLabel: string;
  };
}

export const translationDict: Record<Language, TranslationDictionary> = {
  bn: {
    appName: "নূরের পথ",
    tabs: {
      home: "হোম",
      quran: "কুরআন",
      hadith: "হাদিস",
      prayer: "নামাজ",
      dua: "দোয়া",
      more: "আরও",
    },
    moreSections: {
      worship: "ইবাদত",
      education: "শিক্ষা",
      tools: "টুলস",
      other: "অন্যান্য",
      akhirahDash: "My Akhirah Dashboard",
      namazTracker: "নামাজ ট্র্যাকার",
      ramadanMode: "রমজান মোড",
      history: "ইসলামিক ইতিহাস",
      kidsCorner: "শিশু কর্নার",
      aiAssistant: "AI সহকারী",
      tasbih: "তাসবিহ কাউন্টার",
      qibla: "কিবলা কম্পাস",
      zakatCalc: "যাকাত ক্যালকুলেটর",
      certificate: "সার্টিফিকেট",
      settings: "সেটিংস",
      contactUs: "যোগাযোগ করুন",
      changeLang: "ভাষা পরিবর্তন",
    },
    general: {
      back: "ফিরে যান",
      backToMenu: "মেনুতে ফিরে যান",
      search: "অনুসন্ধান",
      clear: "মুছুন",
      loadMore: "আরো দেখুন",
      offlineMsg: "আপনি অফলাইনে আছেন, সংরক্ষিত তথ্য দেখাচ্ছে",
      copy: "কপি",
      copied: "কপি হয়েছে!",
      share: "শেয়ার",
      save: "সংরক্ষণ",
      cancel: "বাতিল",
    },
    quran: {
      title: "পবিত্র আল কুরআন",
      subtitle: "মহাগ্রন্থ আল-কুরআনের নূর ছড়িয়ে পড়ুক সবার হৃদয়ে। সার্চ করুন বা বেছে নিন সূরা।",
      searchPlaceholder: "সূরা বা নম্বর অনুসন্ধান করুন...",
      bookmarksBtn: "প্রিয় বুকমার্ক সমূহ",
      bookmarksTitle: "বুকমার্ককৃত আয়াতসমূহ",
      inspirationTitle: "আজকের অনুপ্রেরণামূলক আয়াত",
      noBookmarks: "আপনার কোনো আয়াত বুকমার্ক করা নেই।",
      bookmarksInstruction: "সূরা পাঠের সময় বুকমার্ক আইকনটিতে ট্যাপ করে পছন্দ তালিকায় আয়াত সংরক্ষণ করুন।",
      normalMode: "সাধারণ মোড",
      mushafMode: "মুসহাফ মোড",
      modeToggle: "সাধারণ মোড / মুসহাফ মোড",
      totalSurahs: "মোট ১১৪ সূরা",
      resultsCount: "অনুসন্ধানের ফলাফল",
      versesCount: "আয়াত",
      typeMeccan: "মাক্কী",
      typeMedinan: "মাদানী",
      meaningLabel: "অর্থ",
      pronunciationLabel: "উচ্চারণ",
      translationLabel: "অনুবাদ",
      tilawatLabel: "তেলাওয়াত",
      tilawatPause: "বিরতি",
      bookmarkAdded: "বুকমার্ক আপডেট হয়েছে",
      lastReadSaved: "পড়ার সেশন সংরক্ষিত হয়েছে",
      bismillah: "বিসমিল্লাহির রাহমানির রাহিম",
    },
    hadith: {
      title: "রাসূলের বাণী ও হাদিস",
      subtitle: "হযরত মুহাম্মদ (সাঃ) এর বিশুদ্ধ হাদিস ভাণ্ডার। আত্মশুদ্ধি ও দিকনির্দেশনা।",
      searchPlaceholder: "হাদিস নম্বর বা কীওয়ার্ড লিখে অনুসন্ধান করুন...",
      dailyHadithTitle: "আজকের অনুপ্রেরণামূলক হাদিস শরীফ",
      noHadithFound: "কোনো হাদিস খুঁজে পাওয়া যায়নি।",
      noHadithDetails: "অনুগ্রহ করে অন্য শব্দ বা সঠিক নম্বর দিয়ে চেষ্টা করুন।",
      hadithSource: "সূত্র",
      booksGridTitle: "হাদিস গ্রন্থসমূহ নির্বাচন করুন",
      resultsLabel: "বাণী তালিকা",
      topicFilterLabel: "বিষয়ভিত্তিক হাদিস ফিল্টার",
      bukhariName: "সহিহ বুখারি",
      muslimName: "সহিহ মুসলিম",
      abudawudName: "আবু দাউদ",
      tirmidhiName: "তিরমিজি",
    },
    prayer: {
      title: "নামাজের সময়সূচী",
      subtitle: "সঠিক সময়ে নামাজ পড়া মুমিনের প্রধান দায়িত্ব ও প্রশান্তির কাজ।",
      todayPrayerTimes: "আজকের নামাজের সময়সূচী",
      trackerTitle: "নামাজ ট্র্যাকার ও অগ্রগতি",
      timeLabel: "সময়",
      remainingLabel: "বাকি সময়",
      trackerSuccess: "মাশাআল্লাহ! আপনি আজকে আপনার ইবাদত সফলভাবে সম্পন্ন করছেন।",
      daysLabels: ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "আজ"],
      waqts: {
        Fajr: "ফজর",
        Dhuhr: "যোহর",
        Asr: "আসর",
        Maghrib: "মাগরিব",
        Isha: "এশা",
      },
    },
    dua: {
      title: "দোয়া ও মোনাজাত",
      subtitle: "দোয়া হলো মুমিনের অস্ত্র এবং যাবতীয় ইবাদতের মূল ভিত্তি।",
      dailyDuaTitle: "আজকের নির্বাচিত দোয়া",
      categoriesTitle: "কমিউনিটি দোয়া ক্যাটাগরি",
      referenceLabel: "সূত্র",
    },
  },
  en: {
    appName: "Noor Path",
    tabs: {
      home: "Home",
      quran: "Quran",
      hadith: "Hadith",
      prayer: "Prayer",
      dua: "Dua",
      more: "More",
    },
    moreSections: {
      worship: "Worship",
      education: "Education",
      tools: "Tools",
      other: "Others",
      akhirahDash: "My Akhirah Dashboard",
      namazTracker: "Prayer Tracker",
      ramadanMode: "Ramadan Mode",
      history: "Islamic History",
      kidsCorner: "Kids Corner",
      aiAssistant: "AI Assistant",
      tasbih: "Tasbih Counter",
      qibla: "Qibla Compass",
      zakatCalc: "Zakat Calculator",
      certificate: "Certificate",
      settings: "Settings",
      contactUs: "Contact Us",
      changeLang: "Change Language",
    },
    general: {
      back: "Back",
      backToMenu: "Back to Menu",
      search: "Search",
      clear: "Clear",
      loadMore: "See More",
      offlineMsg: "You are offline, showing cached data",
      copy: "Copy",
      copied: "Copied!",
      share: "Share",
      save: "Save",
      cancel: "Cancel",
    },
    quran: {
      title: "Noble Al-Quran",
      subtitle: "May the light of the Holy Quran illuminate every heart. Search or choose a Surah.",
      searchPlaceholder: "Search Surah or Number...",
      bookmarksBtn: "Favorite Bookmarks",
      bookmarksTitle: "Bookmarked Verses",
      inspirationTitle: "Inspirational Verse of the Day",
      noBookmarks: "You don't have any bookmarks yet.",
      bookmarksInstruction: "Tap the bookmark icon while reading to save verses here.",
      normalMode: "Normal Mode",
      mushafMode: "Mushaf Mode",
      modeToggle: "Normal / Mushaf Mode",
      totalSurahs: "Total 114 Surahs",
      resultsCount: "Search Results",
      versesCount: "Verses",
      typeMeccan: "Meccan",
      typeMedinan: "Medinan",
      meaningLabel: "Meaning",
      pronunciationLabel: "Pronunciation",
      translationLabel: "Translation",
      tilawatLabel: "Recitation",
      tilawatPause: "Pause",
      bookmarkAdded: "Bookmark updated",
      lastReadSaved: "Reading session saved",
      bismillah: "Bismillahir Rahmanir Rahim",
    },
    hadith: {
      title: "Hadith & Prophetic Sayings",
      subtitle: "Authentic Hadith collection from Sahih sources for spiritual guidance.",
      searchPlaceholder: "Search by number or keyword...",
      dailyHadithTitle: "Inspirational Hadith of the Day",
      noHadithFound: "No Hadith found.",
      noHadithDetails: "Please try another keyword or number.",
      hadithSource: "Source",
      booksGridTitle: "Select Hadith Collection",
      resultsLabel: "List of Hadiths",
      topicFilterLabel: "Topic-based Hadith Filter",
      bukhariName: "Sahih Bukhari",
      muslimName: "Sahih Muslim",
      abudawudName: "Abu Dawud",
      tirmidhiName: "Al-Tirmidhi",
    },
    prayer: {
      title: "Prayer Timetable",
      subtitle: "Performing prayers on time is the primary duty of every believer.",
      todayPrayerTimes: "Today's Prayer Times",
      trackerTitle: "Prayer Tracker & Progress",
      timeLabel: "Time",
      remainingLabel: "Remaining Time",
      trackerSuccess: "MashaAllah! You have completed your ibadah successfully today.",
      daysLabels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Today"],
      waqts: {
        Fajr: "Fajr",
        Dhuhr: "Dhuhr",
        Asr: "Asr",
        Maghrib: "Maghrib",
        Isha: "Isha",
      },
    },
    dua: {
      title: "Duas & Supplications",
      subtitle: "Dua is the weapon of the believer and the essence of all worship.",
      dailyDuaTitle: "Selected Daily Dua",
      categoriesTitle: "Dua Categories",
      referenceLabel: "Reference",
    },
  },
  ar: {
    appName: "طريق النور",
    tabs: {
      home: "الرئيسية",
      quran: "القرآن",
      hadith: "الحديث",
      prayer: "الصلاة",
      dua: "الأدعية",
      more: "المزيد",
    },
    moreSections: {
      worship: "العبادات",
      education: "التعليم والوعظ",
      tools: "الأدوات والإعجاز",
      other: "آخرى",
      akhirahDash: "لوحة الآخرة الرقمية",
      namazTracker: "تعقب الصلوات الخمس",
      ramadanMode: "رمضان المبارك",
      history: "التاريخ الإسلامي العريق",
      kidsCorner: "ركن الأطفال الطيبين",
      aiAssistant: "المستشار الإسلامي الذكي",
      tasbih: "وحدة التسبيح الرقمية",
      qibla: "بوصلة القبلة المشرفة",
      zakatCalc: "حساب الزكاة الشرعية",
      certificate: "شهادة تقدير وإجازة",
      settings: "الإعدادات العامة",
      contactUs: "اتصل بنا للدعم",
      changeLang: "تغيير لغة التطبيق",
    },
    general: {
      back: "الرجوع",
      backToMenu: "الرجوع للقائمة",
      search: "البحث",
      clear: "مسح",
      loadMore: "مشاهدة المزيد",
      offlineMsg: "أنت لست متصلاً بالإنترنت، يعرض البيانات المحلية",
      copy: "نسخ",
      copied: "تم النسخ بنجاح!",
      share: "مشاركة",
      save: "حفظ الكلمات",
      cancel: "إلغاء الآن",
    },
    quran: {
      title: "القرآن الكريم الشريف",
      subtitle: "نور وحكمة من الذكر الحكيم ينير القلوب المطمئنة. ابحث أو اختر سورة.",
      searchPlaceholder: "ابحث عن سورة أو رقمها الشريف...",
      bookmarksBtn: "الآيات المحفوظة المفضلة",
      bookmarksTitle: "العلامات والآيات المحفوظة",
      inspirationTitle: "الآية الملهمة لهذا اليوم",
      noBookmarks: "المفضلة فارغة حتى الآن.",
      bookmarksInstruction: "اضغط على علامة الحفظ لحفظ الآية الكريمة هنا للرجوع إليها سريعاً.",
      normalMode: "الوضع العادي",
      mushafMode: "وضع المصحف",
      modeToggle: "وضع المصحف الشريف",
      totalSurahs: "١١٤ سورة مباركة",
      resultsCount: "نتائج البحث الشريف",
      versesCount: "آياتها",
      typeMeccan: "مكية",
      typeMedinan: "مدنية",
      meaningLabel: "التفسير",
      pronunciationLabel: "النطق البنغالي",
      translationLabel: "الترجمة والمعاني",
      tilawatLabel: "تلاوة صوتية",
      tilawatPause: "إيقاف مؤقت",
      bookmarkAdded: "تم تحديث الآيات الحبيبة ههنا",
      lastReadSaved: "تم حفظ آخر موضع قراءة بنجاح",
      bismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    },
    hadith: {
      title: "الحديث النبوي الشريف",
      subtitle: "أحاديث شريفة صحيحة من السيرة السنية تعبق بالإرشاد والموعظة והדרכה.",
      searchPlaceholder: "ابحث برقم الحديث أو الكلمات الدليلة...",
      dailyHadithTitle: "الحديث الشريف الملهم اليوم",
      noHadithFound: "لم يتم العثور على أي حديث مبارك.",
      noHadithDetails: "الرجاء المراجعة والبحث برمز آخرถูกต้อง.",
      hadithSource: "المصدر الشريف",
      booksGridTitle: "اختر كتاب الحديث الشريف",
      resultsLabel: "الأحاديث النبوية",
      topicFilterLabel: "تصفية الأحاديث بموضوعات الإيمان",
      bukhariName: "صحيح البخاري",
      muslimName: "صحيح مسلم",
      abudawudName: "سنن أبي داود",
      tirmidhiName: "سنن الترمذي",
    },
    prayer: {
      title: "مواقيت الصلاة الشرعية",
      subtitle: "إقامة الصلوات المباركة في وقتها نور للوجه وتيسير للرزق وطاعة للرحمن.",
      todayPrayerTimes: "مواقيت صلوات اليوم الشريف",
      trackerTitle: "متابعة الصلوات اليومية والتقدم",
      timeLabel: "الوقت",
      remainingLabel: "المتبقي للصلاة قادمة",
      trackerSuccess: "ما شاء الله! قمت بإتمام طاعات الصلوات الخمس بنجاح لليوم الميمون.",
      daysLabels: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "اليوم"],
      waqts: {
        Fajr: "الفجر",
        Dhuhr: "الظهر",
        Asr: "العصر",
        Maghrib: "المغرب",
        Isha: "العشاء",
      },
    },
    dua: {
      title: "الأدعية والأذكار المأثورة",
      subtitle: "الدعاء السليم مخ العبادة وسلاح المؤمن الخالص لقضاء الحوائج.",
      dailyDuaTitle: "الدعاء المأثور المحبب لليوم",
      categoriesTitle: "أبواب الأدعية الشريفة",
      referenceLabel: "المصدر الروحاني",
    },
  },
};
