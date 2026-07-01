import { useState, useEffect } from "react";
import { 
  Bell, 
  Heart, 
  MapPin, 
  ChevronDown, 
  Calendar, 
  Clock, 
  Compass, 
  Check, 
  ArrowRight, 
  BookOpen, 
  Activity, 
  Smile, 
  Award,
  Volume2, 
  VolumeX, 
  X, 
  Info,
  CalendarDays,
  AlarmClock,
  BookOpenCheck,
  Map,
  FlameKindling,
  Sunrise,
  Sunset,
  Sun,
  CloudSun,
  Moon,
  SunDim
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Premium vector prayer icon renderer
const renderPrayerIcon = (name: string, className: string = "w-5 h-5") => {
  switch (name) {
    case "Fajr":
      return <Sunrise className={`${className} text-teal-600 dark:text-teal-400`} />;
    case "Sunrise":
      return <SunDim className={`${className} text-orange-500 dark:text-orange-400`} />;
    case "Dhuhr":
      return <Sun className={`${className} text-amber-500 dark:text-amber-400`} />;
    case "Asr":
      return <CloudSun className={`${className} text-yellow-600 dark:text-yellow-400`} />;
    case "Maghrib":
      return <Sunset className={`${className} text-rose-500 dark:text-rose-400`} />;
    case "Isha":
      return <Moon className={`${className} text-indigo-500 dark:text-indigo-400`} />;
    default:
      return <Clock className={`${className} text-gold-brand`} />;
  }
};

interface HomeDashboardViewProps {
  onNavigateToTab: (index: number) => void;
  lang?: "bn" | "en" | "ar";
  key?: string;
}

const HOME_TRANSLATIONS = {
  bn: {
    remainingTime: "শেষ হতে বাকি",
    sunrise: "সূর্যোদয়",
    sunset: "সূর্যাস্ত",
    forbiddenTime: "সালাতের নিষিদ্ধ সময়",
    limitTime: "ওয়াক্তের সময়সীমা",
    gpsLocation: "আমার অবস্থান (জিপিএস)",
    defaultLocation: "ঢাকা",
    accurateSchedule: "নামাজের সঠিক সময়সূচী",
    realtimeGps: "রিয়েল-টাইম জিপিএস",
    sahriEnd: "সাহরি শেষ ও ফজরের শুরু",
    setAlarm: "আলার্ম সেট করুন",
    calendar: "ক্যালেন্ডার",
    allahNames: "আল্লাহর ৯৯টি পবিত্র নাম",
    readEveryday: "প্রতিদিন পাঠ করুন এবং বরকত লাভ করুন",
    close: "বন্ধ করুন",
    notificationTitle: "আজকের নোটিফিকেশন",
    notificationDesc: "আপনার এলাকার নামাজের সময় পরিবর্তন হলে রিয়েল-টাইম পুশ নোটিফিকেশন পাঠানো হবে। অনুগ্রহ করে লোকেশন অনুমতি সচল রাখুন।",
    favoritesTitle: "পছন্দের আমলসমূহ",
    favoritesDesc: "আপনার প্রিয় সূরা, হাদিস বা দুয়াসমূহ এখানে সংরক্ষিত থাকবে। যেকোনো আয়াতের পাশে থাকা হৃদস্পন্দন চিহ্নে ক্লিক করে বুকমার্ক করুন।",
    alarmTitle: "আজান অ্যালার্ম",
    alarmDesc: "আজানের সময় স্বয়ংক্রিয়ভাবে অ্যালার্ম বাজার সুবিধা যুক্ত করা হয়েছে। এটি ডিভাইস সাউন্ড সচল রাখলে স্বয়ংক্রিয়ভাবে বেজে উঠবে।",
    calendarTitle: "ইসলামিক ক্যালেন্ডার",
    calendarDesc: "চলতি হিজরি সনের গুরুত্বপূর্ণ উৎসব (শবে বরাত, রমজান, ঈদুল ফিতর, ঈদুল আজহা) সমূহ চিহ্নিত ক্যালেন্ডার ভিউ শীঘ্রই চালু হচ্ছে!",
    ok: "ঠিক আছে",
    fajr: "ফজর",
    sunriseWaqt: "সূর্যোদয় (নিষিদ্ধ সময়)",
    dhuhr: "যোহর",
    asr: "আসর",
    maghrib: "মাগরিব",
    isha: "এশা",
    gpsBtn: "আমার জিপিএস অবস্থান",
    topFeatures: "টপ ফিচার",
    seeMore: "আরও দেখুন",
    tracker: "ট্র্যাকার",
    quran: "কুরআন",
    qibla: "কিবলা",
    tasbih: "তাসবিহ",
    recitation: "তিলাওয়াত",
    tafsir: "তাফসির",
    names: "৯৯ নাম",
    dua: "দোয়া",
    quranNure: "নিশ্চয়ই নির্ধারিত সময়ে সালাত কায়েম করা মুমিনদের উপর ফরয করা হয়েছে।",
    quranNureSource: "— সূরা আন-নিসা, আয়াত ১০৩",
    hijriSuffix: " হিজরি"
  },
  en: {
    remainingTime: "Remaining",
    sunrise: "Sunrise",
    sunset: "Sunset",
    forbiddenTime: "Prayer Forbidden",
    limitTime: "Time Limit",
    gpsLocation: "My Location (GPS)",
    defaultLocation: "Dhaka",
    accurateSchedule: "Accurate Prayer Schedule",
    realtimeGps: "Real-time GPS",
    sahriEnd: "Sahri Ends & Fajr Starts",
    setAlarm: "Set Alarm",
    calendar: "Calendar",
    allahNames: "99 Beautiful Names of Allah",
    readEveryday: "Read daily to receive blessings",
    close: "Close",
    notificationTitle: "Today's Notification",
    notificationDesc: "Real-time push notifications will be sent if prayer times change. Please keep location enabled.",
    favoritesTitle: "Favorite Good Deeds",
    favoritesDesc: "Your favorite Surahs, Hadiths, or Duas will be saved here. Bookmarks are updated by clicking the heart icon.",
    alarmTitle: "Athan Alarm",
    alarmDesc: "Automatic alarm sound is configured at prayer times. It will sound if your device volume is active.",
    calendarTitle: "Islamic Calendar",
    calendarDesc: "Calendar marking major events (Shab-e-Barat, Ramadan, Eid-ul-Fitr, Eid-ul-Adha) is coming soon!",
    ok: "OK",
    fajr: "Fajr",
    sunriseWaqt: "Sunrise (Forbidden Time)",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    gpsBtn: "My GPS Location",
    topFeatures: "Top Features",
    seeMore: "See More",
    tracker: "Tracker",
    quran: "Quran",
    qibla: "Qibla",
    tasbih: "Tasbih",
    recitation: "Recitation",
    tafsir: "Tafsir",
    names: "99 Names",
    dua: "Dua",
    quranNure: "Indeed, prayer has been decreed upon the believers a decree of specified times.",
    quranNureSource: "— Surah An-Nisa, Ayah 103",
    hijriSuffix: " AH"
  },
  ar: {
    remainingTime: "المتبقي للصلاة",
    sunrise: "الشروق",
    sunset: "الغروب",
    forbiddenTime: "وقت ممنوع للصلاة",
    limitTime: "وقت نهاية الصلاة",
    gpsLocation: "موقعي الجغرافي (GPS)",
    defaultLocation: "دكا",
    accurateSchedule: "مواقيت الصلاة الدقيقة",
    realtimeGps: "تحديد الموقع الحي",
    sahriEnd: "نهاية السحور وبداية الفجر",
    setAlarm: "ضبط المنبه",
    calendar: "التقويم",
    allahNames: "أسماء الله الحسنى ٩٩",
    readEveryday: "اقرأها يومياً لنيل البركات والخيرات",
    close: "إغلاق",
    notificationTitle: "إشعارات اليوم",
    notificationDesc: "سيتم إرسال تنبيهات بمواقيت الصلاة فور تغيرها. يرجى تفعيل إذن الموقع الجغرافي.",
    favoritesTitle: "الأعمال المفضلة",
    favoritesDesc: "سورك وأحاديثك وأدعيتك المفضلة ستحفظ هنا. اضغط على رمز القلب لحفظها.",
    alarmTitle: "منبه الأذان",
    alarmDesc: "تم تفعيل منبه تلقائي عند وقت الصلاة. سيعمل التنبيه إذا كان صوت الجهاز مفعلاً.",
    calendarTitle: "التقويم الهجري الإسلامي",
    calendarDesc: "ميزة التقويم الشامل للمناسبات الكبرى (رمضان، الأعياد وغيرها) ستتوفر قريباً جداً!",
    ok: "حسناً",
    fajr: "الفجر",
    sunriseWaqt: "شروق الشمس (وقت الكراهة)",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    isha: "العشاء",
    gpsBtn: "موقعي عبر الـ GPS",
    topFeatures: "الميزات الكبرى",
    seeMore: "المزيد",
    tracker: "التعقب",
    quran: "القرآن",
    qibla: "القبلة",
    tasbih: "التسبيح",
    recitation: "تلاوة",
    tafsir: "التفسير",
    names: "أسماء الله",
    dua: "الدعاء",
    quranNure: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا.",
    quranNureSource: "— سورة النساء، الآية ١٠٣",
    hijriSuffix: " هـ"
  }
};

interface TimingDetails {
  name: string;
  bnName: string;
  time: string;
  endTime: string;
  isMakruh: boolean;
  icon: string;
}

const DIVISION_COORDINATES: Record<string, { lat: number; lon: number; bn: string }> = {
  Dhaka: { lat: 23.8103, lon: 90.4125, bn: "ঢাকা" },
  Chittagong: { lat: 22.3569, lon: 91.7832, bn: "চট্টগ্রাম" },
  Sylhet: { lat: 24.8949, lon: 91.8687, bn: "সিলেট" },
  Khulna: { lat: 22.8456, lon: 89.5403, bn: "খুলনা" },
  Rajshahi: { lat: 24.3636, lon: 88.6241, bn: "রাজশাহী" },
  Barisal: { lat: 22.7010, lon: 90.3535, bn: "বরিশাল" },
  Rangpur: { lat: 25.7508, lon: 89.2467, bn: "রংপুর" },
  Mymensingh: { lat: 24.7471, lon: 90.4031, bn: "ময়মনসিংহ" }
};

const ALLAH_NAMES = [
  { ar: "الرَّحْمَنُ", bn: "আর-রহমান", en: "The Beneficent", meaning: "সবচেয়ে দয়ালু" },
  { ar: "الرَّحِيمُ", bn: "আর-রহিম", en: "The Merciful", meaning: "পরম করুণাময়" },
  { ar: "الْمَلِكُ", bn: "আল-মালিক", en: "The King", meaning: "সার্বভৌম ক্ষমতার অধিকারী" },
  { ar: "الْقُدُّوسُ", bn: "আল-কুদ্দুস", en: "The Pure", meaning: "অতি পবিত্র" },
  { ar: "السَّلَامُ", bn: "আস-সালাম", en: "The Source of Peace", meaning: "শান্তি দানকারী" },
  { ar: "الْمُؤْمِنُ", bn: "আল-মু'মিন", en: "The Inspirer of Faith", meaning: "নিরাপত্তা ও ঈমান দানকারী" },
  { ar: "الْمُهَيْمِنُ", bn: "আল-মুহাইমিন", en: "The Guardian", meaning: "মহাপরাক্রমশালী রক্ষক" },
  { ar: "الْعَزِيزُ", bn: "আল-আজিজ", en: "The Victorious", meaning: "মহাপরাক্রমশালী" },
  { ar: "الْجَبَّارُ", bn: "আল-জাব্বার", en: "The Compeller", meaning: "দুর্দান্ত প্রভাবের অধিকারী" },
  { ar: "الْمُتَكَبِّرُ", bn: "আল-মুতাকাব্বির", en: "The Dominant", meaning: "অহংকারের অধিকারী" },
  { ar: "الْخَالِقُ", bn: "আল-খালিক", en: "The Creator", meaning: "সৃষ্টিকর্তা" },
  { ar: "الْبَارِئُ", bn: "আল-বারি", en: "The Maker", meaning: "সঠিক অবয়ব দানকারী" }
];

export default function HomeDashboardView({ onNavigateToTab }: HomeDashboardViewProps) {
  const [latitude, setLatitude] = useState<number>(23.8103);
  const [longitude, setLongitude] = useState<number>(90.4125);
  const [selectedDivision, setSelectedDivision] = useState<string>("Dhaka");
  const [locationLabel, setLocationLabel] = useState<string>("ঢাকা");
  const [showLocationDropdown, setShowLocationDropdown] = useState<boolean>(false);
  
  // Dates state
  const [bengaliDateStr, setBengaliDateStr] = useState<string>("");
  const [hijriDateStr, setHijriDateStr] = useState<string>("লোড হচ্ছে...");
  
  // API timing state
  const [apiTimings, setApiTimings] = useState<Record<string, string>>({
    Fajr: "04:15",
    Sunrise: "05:32",
    Dhuhr: "12:12",
    Asr: "15:35",
    Sunset: "18:48",
    Maghrib: "18:48",
    Isha: "20:05"
  });

  // Circle checkboxes tracker sync state
  const [completedPrayers, setCompletedPrayers] = useState<Record<string, boolean>>({
    "ফজর": false,
    "যোহর": false,
    "আসর": false,
    "মাগরিব": false,
    "এশা": false
  });

  // Interactive popup modals
  const [showNamesModal, setShowNamesModal] = useState<boolean>(false);
  const [showNotificationAlert, setShowNotificationAlert] = useState<boolean>(false);
  const [showFavoritesAlert, setShowFavoritesAlert] = useState<boolean>(false);
  const [showAlarmAlert, setShowAlarmAlert] = useState<boolean>(false);
  const [showCalendarAlert, setShowCalendarAlert] = useState<boolean>(false);

  // Live countdown state
  const [currentWaqt, setCurrentWaqt] = useState<string>("ফজর");
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(3600);
  const [progressFraction, setProgressFraction] = useState<number>(0.5);

  // Translate numbers to Bengali
  const toBengaliNumerals = (num: string | number): string => {
    const dict: Record<string, string> = {
      "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
      "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
    };
    return String(num).split("").map(c => dict[c] || c).join("");
  };

  const translateHijriMonth = (mName: string): string => {
    const map: Record<string, string> = {
      "Muharram": "মহররম",
      "Safar": "সফর",
      "Rabīʿ al-awwal": "রবিউল আউয়াল",
      "Rabīʿ ath-thānī": "রবিউস সানি",
      "Jumādā al-ūlā": "জমাদিউল আউয়াল",
      "Jumādā al-ākhirah": "জমাদিউস সানি",
      "Rajab": "রজব",
      "Shaʿbān": "শাবান",
      "Ramaḍān": "রমজান",
      "Shawwāl": "শাওয়াল",
      "Dhū al-Qaʿdah": "জিলকদ",
      "Dhū al-Ḥijjah": "জিলহজ্জ"
    };
    return map[mName] || mName;
  };

  // Setup ticking local dates
  useEffect(() => {
    const updateLocalDates = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setBengaliDateStr(now.toLocaleDateString("bn-BD", options));
    };
    updateLocalDates();
    const timer = setInterval(updateLocalDates, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Hijri date from Aladhan conversion API
  useEffect(() => {
    const fetchHijri = async () => {
      try {
        const now = new Date();
        const d = String(now.getDate()).padStart(2, '0');
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const y = now.getFullYear();
        const res = await fetch(`https://api.aladhan.com/v1/gToH/${d}-${m}-${y}`);
        if (res.ok) {
          const payload = await res.json();
          const hj = payload?.data?.hijri;
          if (hj) {
            const bnDay = toBengaliNumerals(hj.day);
            const bnMonth = translateHijriMonth(hj.month.en);
            const bnYear = toBengaliNumerals(hj.year);
            setHijriDateStr(`${bnDay} ${bnMonth}, ${bnYear} হিজরি`);
          }
        }
      } catch (err) {
        setHijriDateStr("১০ জিলহজ্জ, ১৪৪৭ হিজরি"); // Fallback
      }
    };
    fetchHijri();
  }, []);

  // Sync completion states with local storage (linked with Namaz Tracker)
  useEffect(() => {
    const loadNamazTracker = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("np_namaz_tracker_data");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setCompletedPrayers({
              "ফজর": parsed["ফজর"] || false,
              "যোহর": parsed["যোহর"] || false,
              "আসর": parsed["আসর"] || false,
              "মাগরিব": parsed["মাগরিব"] || false,
              "এশা": parsed["এশা"] || false
            });
          } catch (_) {}
        }
      }
    };
    loadNamazTracker();
    // Watch storage events to sync
    window.addEventListener("storage", loadNamazTracker);
    return () => window.removeEventListener("storage", loadNamazTracker);
  }, []);

  const togglePrayerCompleted = (waqtName: string) => {
    const isWaqtDaily = ["ফজর", "যোহর", "আসর", "মাগরিব", "এশা"].includes(waqtName);
    if (!isWaqtDaily) return;

    const updated = { ...completedPrayers, [waqtName]: !completedPrayers[waqtName] };
    setCompletedPrayers(updated);

    // Save to shared localStorage key `np_namaz_tracker_data` for seamless multi-page sync
    if (typeof window !== "undefined") {
      const todayKey = `np_namaz_date_${new Date().toDateString()}`;
      localStorage.setItem("np_namaz_tracker_date", todayKey);
      
      const syncObj: Record<string, boolean> = {
        "ফজর": updated["ফজর"] || false,
        "যোহর": updated["যোহর"] || false,
        "আসর": updated["আসর"] || false,
        "মাগরিব": updated["মাগরিব"] || false,
        "এশা": updated["এশা"] || false
      };
      localStorage.setItem("np_namaz_tracker_data", JSON.stringify(syncObj));
      
      // Dispatch storage event to sync other views instantly
      window.dispatchEvent(new Event("storage"));
    }

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  // Trigger Geolocation on mount or when requested
  const requestUserGeolocation = () => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setLocationLabel("আমার অবস্থান (জিপিএস)");
          setSelectedDivision("");
        },
        () => {
          // Keep defaults on failure
          setLocationLabel("ঢাকা");
          setSelectedDivision("Dhaka");
        }
      );
    }
  };

  useEffect(() => {
    requestUserGeolocation();
  }, []);

  // Fetch Prayer timings based on Latitude & Longitude
  useEffect(() => {
    const fetchTimings = async () => {
      try {
        const dateStr = new Date().toISOString().split("T")[0];
        const res = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=1`);
        if (res.ok) {
          const payload = await res.json();
          const timings = payload?.data?.timings;
          if (timings) {
            setApiTimings(timings);
          }
        }
      } catch (err) {
        console.error("Failed fetching real timings", err);
      }
    };
    fetchTimings();
  }, [latitude, longitude]);

  // Handle Division Selection
  const handleSelectDivision = (key: string) => {
    const coords = DIVISION_COORDINATES[key];
    if (coords) {
      setLatitude(coords.lat);
      setLongitude(coords.lon);
      setLocationLabel(coords.bn);
      setSelectedDivision(key);
    }
    setShowLocationDropdown(false);
  };

  // Convert "05:12" style 24h format to displaying 12-hour format in Bengali
  const formatTimeToBengali = (timeStr: string): string => {
    if (!timeStr) return "--:--";
    const [hStr, mStr] = timeStr.split(":");
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    const suffix = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 || 12;
    const formatted = `${String(displayHour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`;
    return toBengaliNumerals(formatted);
  };

  // Calculate live countdown ticker and SVG circular arc progress
  useEffect(() => {
    const parseTimeToMinutes = (timeStr: string) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const updateTimerAndArc = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

      // Real prayer times limits
      const f = parseTimeToMinutes(apiTimings.Fajr);
      const s = parseTimeToMinutes(apiTimings.Sunrise);
      const d = parseTimeToMinutes(apiTimings.Dhuhr);
      const a = parseTimeToMinutes(apiTimings.Asr);
      const m = parseTimeToMinutes(apiTimings.Maghrib);
      const i = parseTimeToMinutes(apiTimings.Isha);

      let active = "এশা";
      let startLimit = i;
      let endLimit = f + 24 * 60;

      if (currentMinutes >= f && currentMinutes < s) {
        active = "ফজর";
        startLimit = f;
        endLimit = s;
      } else if (currentMinutes >= s && currentMinutes < d) {
        active = "সূর্যোদয় (নিষিদ্ধ)";
        startLimit = s;
        endLimit = d;
      } else if (currentMinutes >= d && currentMinutes < a) {
        active = "যোহর";
        startLimit = d;
        endLimit = a;
      } else if (currentMinutes >= a && currentMinutes < m) {
        active = "আসর";
        startLimit = a;
        endLimit = m;
      } else if (currentMinutes >= m && currentMinutes < i) {
        active = "মাগরিব";
        startLimit = m;
        endLimit = i;
      } else {
        active = "এশা";
        if (currentMinutes >= i) {
          startLimit = i;
          endLimit = f + 24 * 60;
        } else {
          startLimit = i - 24 * 60;
          endLimit = f;
        }
      }

      setCurrentWaqt(active);

      // Handle midnight shift variables
      let adjustedCurrent = currentMinutes;
      if (active === "এশা" && currentMinutes < f) {
        adjustedCurrent = currentMinutes + 24 * 60;
      }

      const totalDuration = endLimit - startLimit;
      const elapsed = adjustedCurrent - startLimit;
      const progress = elapsed / totalDuration;
      setProgressFraction(Math.max(0, Math.min(1, progress)));

      const diffMinutes = endLimit - adjustedCurrent;
      const totalSecsRemaining = Math.max(0, Math.round(diffMinutes * 60));
      setTimeRemainingSeconds(totalSecsRemaining);
    };

    updateTimerAndArc();
    const interval = setInterval(updateTimerAndArc, 1000);
    return () => clearInterval(interval);
  }, [apiTimings]);

  // Format countdown seconds into HH:MM:SS
  const getCountdownString = (totalSecs: number): string => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n: number) => String(n).padStart(2, "0");
    const output = `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
    return toBengaliNumerals(output);
  };

  // Deep linking to more view segments
  const navigateToMoreSegment = (segment: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("more_active_segment", segment);
    }
    onNavigateToTab(4); // tab 4 is MoreView
  };

  // Complete list of prayer times with start-end limits
  const prayerList: TimingDetails[] = [
    { name: "Fajr", bnName: "ফজর", time: apiTimings.Fajr, endTime: apiTimings.Sunrise, isMakruh: false, icon: "🕌" },
    { name: "Sunrise", bnName: "সূর্যোদয় (নিষিদ্ধ সময়)", time: apiTimings.Sunrise, endTime: "06:00", isMakruh: true, icon: "🌅" },
    { name: "Dhuhr", bnName: "যোহর", time: apiTimings.Dhuhr, endTime: apiTimings.Asr, isMakruh: false, icon: "☀️" },
    { name: "Asr", bnName: "আসর", time: apiTimings.Asr, endTime: apiTimings.Maghrib, isMakruh: false, icon: "🌤️" },
    { name: "Maghrib", bnName: "মাগরিব", time: apiTimings.Maghrib, endTime: apiTimings.Isha, isMakruh: false, icon: "🌇" },
    { name: "Isha", bnName: "এশা", time: apiTimings.Isha, endTime: apiTimings.Fajr, isMakruh: false, icon: "🌙" }
  ];

  return (
    <div className="w-full max-w-lg mx-auto pb-10 space-y-6 font-bengali">
      
      {/* TOP BAR / NAVIGATION HEADER (DARK TEAL GRADIENT BACKGROUND LAYER) */}
      <div className="bg-gradient-to-b from-[#063b36] via-[#042d2a] to-[#0d1f1c] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#c9a227_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* TOP BAR BRAND / ACTIONS */}
        <div className="flex items-center justify-between relative z-10 border-b border-white/10 pb-4 mb-5">
          {/* Left side: Date + Hijri */}
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2 text-xs text-gold-brand font-black tracking-wide">
              <Calendar className="w-4 h-4 text-gold-brand" />
              <span>{bengaliDateStr || "২৪ জুন, ২০২৬"}</span>
            </div>
            <p className="text-[11px] text-gray-300 font-medium">
              {hijriDateStr}
            </p>
          </div>

          {/* Right side: Bell & Favorites Icons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowNotificationAlert(true)}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all text-gray-200 cursor-pointer relative"
              title="বিজ্ঞপ্তি"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold-brand animate-ping" />
            </button>
            <button 
              onClick={() => setShowFavoritesAlert(true)}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all text-red-400 cursor-pointer"
              title="পছন্দের তালিকা"
            >
              <Heart className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* 2. CIRCULAR ARC PROGRESS INDICATOR (SVG) */}
        <div className="flex flex-col items-center justify-center py-2 relative z-10">
          
          <div className="relative w-56 h-36 flex items-center justify-center">
            {/* SVG Arc Progress gauge */}
            <svg className="w-full h-full transform" viewBox="0 0 100 60">
              {/* Arc background path */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="7"
                strokeLinecap="round"
              />
              {/* Arc filled path */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#c9a227"
                strokeWidth="7.5"
                strokeLinecap="round"
                strokeDasharray="125.66"
                strokeDashoffset={125.66 * (1 - progressFraction)}
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner countdown elements */}
            <div className="absolute inset-x-0 bottom-4 flex flex-col items-center text-center space-y-0.5 select-none">
              <span className="text-2xl font-black text-gold-brand drop-shadow-sm tracking-wide">
                {currentWaqt}
              </span>
              <span className="text-[10px] text-gray-300 font-medium">
                শেষ হতে বাকি
              </span>
              <span className="text-xl font-mono font-black text-white tracking-widest drop-shadow-md">
                {getCountdownString(timeRemainingSeconds)}
              </span>
            </div>
          </div>

          {/* 3. SUNRISE AND SUNSET PILLS */}
          <div className="flex items-center justify-center gap-3 mt-4 w-full px-2">
            <div className="flex-1 max-w-[150px] bg-white/5 border border-white/10 p-2.5 rounded-2xl flex items-center justify-center gap-2 shadow-sm">
              <Sunrise className="w-4.5 h-4.5 text-gold-brand shrink-0" />
              <div className="text-left">
                <span className="text-[9px] text-gray-400 block uppercase font-bold">সূর্যোদয়</span>
                <span className="text-xs font-bold font-mono text-gold-brand">
                  {formatTimeToBengali(apiTimings.Sunrise)}
                </span>
              </div>
            </div>

            <div className="flex-1 max-w-[150px] bg-white/5 border border-white/10 p-2.5 rounded-2xl flex items-center justify-center gap-2 shadow-sm">
              <Sunset className="w-4.5 h-4.5 text-gold-brand shrink-0" />
              <div className="text-left">
                <span className="text-[9px] text-gray-400 block uppercase font-bold">সূর্যাস্ত</span>
                <span className="text-xs font-bold font-mono text-gold-brand">
                  {formatTimeToBengali(apiTimings.Sunset || apiTimings.Maghrib)}
                </span>
              </div>
            </div>
          </div>

          {/* 4. LOCATION SELECTOR DROP-DOWN PILL */}
          <div className="relative mt-5">
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gold-brand text-black font-extrabold text-xs rounded-full hover:bg-gold-brand/95 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{locationLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showLocationDropdown ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Options */}
            <AnimatePresence>
              {showLocationDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#0a2321] border border-gold-brand/20 rounded-2xl shadow-2xl overflow-hidden z-50 py-1"
                >
                  <button
                    onClick={requestUserGeolocation}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/10 text-xs font-bold text-gold-brand border-b border-white/5 flex items-center gap-2 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5 animate-spin" />
                    <span>আমার জিপিএস অবস্থান</span>
                  </button>
                  {Object.keys(DIVISION_COORDINATES).map((key) => (
                    <button
                      key={key}
                      onClick={() => handleSelectDivision(key)}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 text-xs text-gray-200 block cursor-pointer font-bold"
                    >
                      {DIVISION_COORDINATES[key].bn}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* TOP FEATURES HORIZONTAL SCROLL COMPONENT */}
      <div className="space-y-3 px-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
            <span className="w-1 h-3.5 bg-gold-brand rounded-full" />
            টপ ফিচার
          </h3>
          <button 
            onClick={() => onNavigateToTab(4)} 
            className="text-xs font-bold text-gold-brand hover:underline inline-flex items-center gap-0.5 cursor-pointer"
          >
            <span>আরও দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Feature circle items scroll panel */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2 px-1 no-scrollbar scroll-smooth">
          
          {/* Tracker Feature */}
          <button 
            onClick={() => navigateToMoreSegment("gamification")}
            className="flex flex-col items-center shrink-0 space-y-1.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm group-hover:scale-105 active:scale-95 transition-all">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">ট্র্যাকার</span>
          </button>

          {/* Quran Feature */}
          <button 
            onClick={() => onNavigateToTab(0)}
            className="flex flex-col items-center shrink-0 space-y-1.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm group-hover:scale-105 active:scale-95 transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">কুরআন</span>
          </button>

          {/* Qibla Feature */}
          <button 
            onClick={() => navigateToMoreSegment("qibla")}
            className="flex flex-col items-center shrink-0 space-y-1.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm group-hover:scale-105 active:scale-95 transition-all">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">কিবলা</span>
          </button>

          {/* Tasbih Feature */}
          <button 
            onClick={() => navigateToMoreSegment("tasbih")}
            className="flex flex-col items-center shrink-0 space-y-1.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm group-hover:scale-105 active:scale-95 transition-all">
              <Smile className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">তাসবিহ</span>
          </button>

          {/* Tilawat Feature */}
          <button 
            onClick={() => onNavigateToTab(0)}
            className="flex flex-col items-center shrink-0 space-y-1.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm group-hover:scale-105 active:scale-95 transition-all">
              <Volume2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">তিলাওয়াত</span>
          </button>

          {/* Tafsir Feature */}
          <button 
            onClick={() => onNavigateToTab(0)}
            className="flex flex-col items-center shrink-0 space-y-1.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-sm group-hover:scale-105 active:scale-95 transition-all">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">তাফসির</span>
          </button>

          {/* 99 Names Feature */}
          <button 
            onClick={() => setShowNamesModal(true)}
            className="flex flex-col items-center shrink-0 space-y-1.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-sm group-hover:scale-105 active:scale-95 transition-all">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">৯৯ নাম</span>
          </button>

          {/* Dua Feature */}
          <button 
            onClick={() => navigateToMoreSegment("dua")}
            className="flex flex-col items-center shrink-0 space-y-1.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-105 active:scale-95 transition-all">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">দোয়া</span>
          </button>

        </div>
      </div>

      {/* WHITE CARDS FOR PRAYER TIMES LIST */}
      <div className="bg-white dark:bg-[#0D1E24] border border-gray-100 dark:border-teal-950 rounded-3xl p-5 md:p-6 shadow-md space-y-4">
        
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-teal-950/50 pb-3">
          <h3 className="font-extrabold text-sm text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gold-brand" />
            নামাজের সঠিক সময়সূচী
          </h3>
          <span className="text-[10px] text-gray-400 dark:text-gray-400 font-bold bg-gray-50 dark:bg-teal-950 px-2 py-0.5 rounded-full border border-gray-100 dark:border-teal-900/20">
            রিয়েল-টাইম জিপিএস
          </span>
        </div>

        {/* Timings row list */}
        <div className="space-y-3">
          {prayerList.map((prayer) => {
            const isCompleted = completedPrayers[prayer.bnName] || false;
            const isCurrentWaqt = currentWaqt === prayer.bnName || (prayer.name === "Sunrise" && currentWaqt === "সূর্যোদয় (নিষিদ্ধ)");
            const isMakruh = prayer.isMakruh;

            return (
              <div
                key={prayer.name}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isCurrentWaqt
                    ? "bg-teal-50/50 dark:bg-teal-950/45 border-gold-brand/40 shadow-sm"
                    : "bg-white dark:bg-[#0F2228] border-gray-100 dark:border-teal-950 hover:border-gray-200"
                }`}
              >
                {/* Left details */}
                <div className="flex items-center gap-2.5">
                  {/* Makruh Orange dot or normal circle checkmark indicator */}
                  {isMakruh ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shrink-0 ml-1" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0 ml-1" />
                  )}

                  {/* Premium customized vector icon container with soft ambient bg glow */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all ${
                    isCurrentWaqt
                      ? "bg-gold-brand/15 text-gold-brand border border-gold-brand/30"
                      : isMakruh
                      ? "bg-orange-500/10 text-orange-500 border border-orange-500/10"
                      : "bg-teal-500/5 text-teal-600 dark:text-teal-400 border border-teal-500/5"
                  }`}>
                    {renderPrayerIcon(prayer.name, "w-5 h-5")}
                  </div>

                  <div className="text-left">
                    <span className="text-sm font-black text-gray-800 dark:text-gray-100 block">
                      {prayer.bnName}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {prayer.bnName === "ফজর" ? "সাহরি শেষ ও ফজরের শুরু" : prayer.bnName === "সূর্যোদয় (নিষিদ্ধ সময়)" ? "সালাতের নিষিদ্ধ সময়" : "ওয়াক্তের সময়সীমা"}
                    </span>
                  </div>
                </div>

                {/* Right details: timing + circle checkbox */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-xs text-gold-brand">
                      {formatTimeToBengali(prayer.time)}
                    </span>
                    {prayer.name !== "Sunrise" && prayer.name !== "Sunset" && (
                      <span className="text-[9px] text-gray-400 block font-mono">
                        {toBengaliNumerals(prayer.time)}
                      </span>
                    )}
                  </div>

                  {/* Circle Checkbox for active non-makruh daily prayers */}
                  {!isMakruh && ["ফজর", "যোহর", "আসর", "মাগরিব", "এশা"].includes(prayer.bnName) ? (
                    <button
                      onClick={() => togglePrayerCompleted(prayer.bnName)}
                      className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
                        isCompleted
                          ? "bg-gold-brand border-gold-brand text-black shadow-sm"
                          : "border-gray-300 hover:border-gold-brand bg-transparent"
                      }`}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                  ) : (
                    <div className="w-5 h-5" /> /* Space placeholder */
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* BOTTOM BUTTONS - আলার্ম ও ক্যালেন্ডার */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setShowAlarmAlert(true)}
            className="py-3 px-4 rounded-xl border border-gold-brand/20 bg-gold-brand/5 hover:bg-gold-brand/10 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer text-gold-brand font-bold text-xs"
          >
            <AlarmClock className="w-4 h-4 text-gold-brand" />
            <span>আলার্ম সেট করুন</span>
          </button>

          <button
            onClick={() => setShowCalendarAlert(true)}
            className="py-3 px-4 rounded-xl border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer text-teal-600 dark:text-teal-400 font-bold text-xs"
          >
            <CalendarDays className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>ক্যালেন্ডার</span>
          </button>
        </div>

      </div>

      {/* FOOTER MOTIVATIONAL CARD */}
      <div className="bg-gradient-to-br from-white to-teal-50/20 dark:from-[#0F2228] dark:to-[#0A1B20] border border-gray-100 dark:border-teal-950/60 p-5 rounded-3xl shadow-sm text-center relative overflow-hidden">
        <span className="text-2xl block mb-2">🕌</span>
        <blockquote className="text-xs text-gray-500 dark:text-gray-300 leading-relaxed font-bold italic">
          "নিশ্চয়ই নির্ধারিত সময়ে সালাত কায়েম করা মুমিনদের উপর ফরয করা হয়েছে।"
        </blockquote>
        <span className="text-[10px] text-gold-brand font-bold block mt-1.5">— সূরা আন-নিসা, আয়াত ১০৩</span>
      </div>

      {/* POPUP MODALS / DIALOGS */}
      
      {/* 99 Names of Allah Modal */}
      <AnimatePresence>
        {showNamesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b2521] border border-gold-brand/30 w-full max-w-sm rounded-2xl p-5 shadow-2xl relative max-h-[80vh] overflow-y-auto font-bengali text-white text-center space-y-4"
            >
              <button 
                onClick={() => setShowNamesModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg bg-white/5 border border-white/10 text-gold-brand cursor-pointer hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="space-y-1 pb-2 border-b border-white/10">
                <span className="text-2xl block">✨</span>
                <h3 className="text-lg font-black text-gold-brand">আল্লাহর ৯৯টি পবিত্র নাম</h3>
                <p className="text-[10px] text-gray-300">প্রতিদিন পাঠ করুন এবং বরকত লাভ করুন</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {ALLAH_NAMES.map((name, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center space-y-1 hover:border-gold-brand/40 transition-all">
                    <span className="text-[10px] bg-gold-brand/20 text-gold-brand font-bold px-1.5 py-0.5 rounded-full font-mono">
                      {toBengaliNumerals(i + 1)}
                    </span>
                    <span className="font-amiri text-lg text-white block leading-none font-bold py-1">
                      {name.ar}
                    </span>
                    <span className="text-xs font-black text-gold-brand block">
                      {name.bn}
                    </span>
                    <span className="text-[9px] text-gray-300 block leading-tight">
                      {name.meaning}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowNamesModal(false)}
                className="w-full py-2.5 rounded-xl bg-gold-brand text-black font-black text-xs cursor-pointer shadow-md hover:brightness-105"
              >
                বন্ধ করুন
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Generic Modal Alerts */}
      <AnimatePresence>
        {showNotificationAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-[#0b2521] border border-gold-brand/25 text-white max-w-xs w-full p-5 rounded-2xl text-center space-y-3">
              <span className="text-2xl">🔔</span>
              <h4 className="text-sm font-bold text-gold-brand">আজকের নোটিফিকেশন</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                আপনার এলাকার নামাজের সময় পরিবর্তন হলে রিয়েল-টাইম পুশ নোটিফিকেশন পাঠানো হবে। অনুগ্রহ করে লোকেশন অনুমতি সচল রাখুন।
              </p>
              <button onClick={() => setShowNotificationAlert(false)} className="w-full py-2 bg-gold-brand text-black font-bold text-xs rounded-xl cursor-pointer">
                ঠিক আছে
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFavoritesAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-[#0b2521] border border-gold-brand/25 text-white max-w-xs w-full p-5 rounded-2xl text-center space-y-3">
              <span className="text-2xl">❤️</span>
              <h4 className="text-sm font-bold text-gold-brand">পছন্দের আমলসমূহ</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                আপনার প্রিয় সূরা, হাদিস বা দুয়াসমূহ এখানে সংরক্ষিত থাকবে। যেকোনো আয়াতের পাশে থাকা হৃদস্পন্দন চিহ্নে ক্লিক করে বুকমার্ক করুন।
              </p>
              <button onClick={() => setShowFavoritesAlert(false)} className="w-full py-2 bg-gold-brand text-black font-bold text-xs rounded-xl cursor-pointer">
                ঠিক আছে
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAlarmAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-[#0b2521] border border-gold-brand/25 text-white max-w-xs w-full p-5 rounded-2xl text-center space-y-3">
              <span className="text-2xl">⏰</span>
              <h4 className="text-sm font-bold text-gold-brand">আজান অ্যালার্ম</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                আজানের সময় স্বয়ংক্রিয়ভাবে অ্যালার্ম বাজার সুবিধা যুক্ত করা হয়েছে। এটি ডিভাইস সাউন্ড সচল রাখলে স্বয়ংক্রিয়ভাবে বেজে উঠবে।
              </p>
              <button onClick={() => setShowAlarmAlert(false)} className="w-full py-2 bg-gold-brand text-black font-bold text-xs rounded-xl cursor-pointer">
                ঠিক আছে
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCalendarAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-[#0b2521] border border-gold-brand/25 text-white max-w-xs w-full p-5 rounded-2xl text-center space-y-3">
              <span className="text-2xl">📅</span>
              <h4 className="text-sm font-bold text-gold-brand">ইসলামিক ক্যালেন্ডার</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                চলতি হিজরি সনের গুরুত্বপূর্ণ উৎসব (শবে বরাত, রমজান, ঈদুল ফিতর, ঈদুল আজহা) সমূহ চিহ্নিত ক্যালেন্ডার ভিউ শীঘ্রই চালু হচ্ছে!
              </p>
              <button onClick={() => setShowCalendarAlert(false)} className="w-full py-2 bg-gold-brand text-black font-bold text-xs rounded-xl cursor-pointer">
                ঠিক আছে
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
