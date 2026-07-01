import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldAlert, 
  MapPin, 
  Calendar, 
  Loader2, 
  Bell, 
  BellOff,
  ChevronRight,
  Sparkles,
  Maximize2,
  X,
  Volume2,
  Info,
  Compass,
  ArrowRight,
  Sun,
  Sunrise,
  Sunset,
  CloudSun,
  Moon,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PrayerTimePair {
  name: string;
  english: string;
  time: string; // raw string "HH:MM"
  formatted: string; // display string
}

const MOTIVATIONAL_HADITHS = [
  { text: "“যে ব্যক্তি ঈমানের সাথে সওয়াবের আশায় রমজানের রোজা রাখবে, তার পূর্বের সকল গুনাহ মাফ করে দেওয়া হবে।”", source: "সহিহ বুখারি" },
  { text: "“রোজাদারের মুখের গন্ধ আল্লাহর নিকট কস্তুরীর সুবাসের চেয়েও উত্তম ও সুগন্ধিময়।”", source: "সহিহ মুসলিম" },
  { text: "“জান্নাতে ‘রাইয়ান’ নামক একটি দরজা আছে, যা দিয়ে কেবল রোজাদাররাই কিয়ামতের দিন প্রবেশ করবে।”", source: "সহিহ বুখারি" }
];

export default function PrayerTimesView({ lang = "bn" }: { lang?: "bn" | "en" | "ar" }) {
  const [activeSubTab, setActiveSubTab] = useState<"namaz" | "fasting">("namaz");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [bengaliDate, setBengaliDate] = useState("");
  
  // Coordinates State
  const [latitude, setLatitude] = useState<number>(23.8103);
  const [longitude, setLongitude] = useState<number>(90.4125);
  const [locationName, setLocationName] = useState(lang === "ar" ? "دكا (افتراضي)" : lang === "en" ? "Dhaka (Default)" : "ঢাকা (ডিফল্ট)");
  const [isLocating, setIsLocating] = useState(false);
  const [isFetchingTimes, setIsFetchingTimes] = useState(false);

  // Raw API Timings
  const [apiTimings, setApiTimings] = useState<Record<string, string>>({
    Fajr: "04:15",
    Sunrise: "05:32",
    Dhuhr: "12:12",
    Asr: "15:35",
    Sunset: "18:48",
    Maghrib: "18:48",
    Isha: "20:05"
  });

  // Circle countdown and arc calculations
  const [currentWaqtIndex, setCurrentWaqtIndex] = useState<number>(0);
  const [currentWaqtName, setCurrentWaqtName] = useState<string>("যোহর");
  const [countdownText, setCountdownText] = useState("০০:০০:০০");
  const [progressFraction, setProgressFraction] = useState<number>(0.5);

  // Fasting hadith slider state
  const [hadithIndex, setHadithIndex] = useState(0);

  // Interactive full-screen timer modal
  const [showLargeTimer, setShowLargeTimer] = useState(false);

  // Bell alarms state for Sahri/Iftar
  const [sahriAlarmActive, setSahriAlarmActive] = useState(false);
  const [iftarAlarmActive, setIftarAlarmActive] = useState(false);
  const [showAlarmToast, setShowAlarmToast] = useState<string | null>(null);

  // Localized numerals converter
  const toBengaliNumerals = (num: string | number): string => {
    if (lang === "en") return String(num);
    if (lang === "ar") {
      const arDict: Record<string, string> = {
        "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤",
        "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩"
      };
      return String(num).split("").map((c) => arDict[c] || c).join("");
    }
    const dict: Record<string, string> = {
      "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
      "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
    };
    return String(num).split("").map((c) => dict[c] || c).join("");
  };

  // Convert time "05:32" into 12h display localized format
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

  // Add minutes to "HH:MM" raw time format
  const addMinutesToTimeStr = (timeStr: string, minutesToAdd: number): string => {
    if (!timeStr) return "00:00";
    const [h, m] = timeStr.split(":").map(Number);
    let totalMins = h * 60 + m + minutesToAdd;
    if (totalMins < 0) totalMins += 24 * 60;
    const endH = Math.floor(totalMins / 60) % 24;
    const endM = totalMins % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  // Subtraction / Addition Display
  const getnaflDisplayRange = (startStr: string, minutes: number, endStr: string, offsetEnd: number = 0): string => {
    const s = addMinutesToTimeStr(startStr, minutes);
    const e = addMinutesToTimeStr(endStr, offsetEnd);
    return `${formatTimeToBengali(s)} - ${formatTimeToBengali(e)}`;
  };

  // Geolocation & Live dates
  useEffect(() => {
    // 1. Bengali Date Ticker
    const updateBengaliDate = () => {
      const now = new Date();
      setCurrentTime(now);
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setBengaliDate(now.toLocaleDateString("bn-BD", options));
    };
    updateBengaliDate();
    const intervalId = setInterval(updateBengaliDate, 1000);

    // 2. Request Geolocation on mount
    detectGPSLocation();

    return () => clearInterval(intervalId);
  }, []);

  // Sliding hadiths timer
  useEffect(() => {
    const slider = setInterval(() => {
      setHadithIndex((prev) => (prev + 1) % MOTIVATIONAL_HADITHS.length);
    }, 6000);
    return () => clearInterval(slider);
  }, []);

  // GPS Location Locator
  const detectGPSLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);
        setLocationName(
          lang === "ar"
            ? `نظام تحديد المواقع (${lat.toFixed(2)}, ${lon.toFixed(2)})`
            : lang === "en"
            ? `GPS Detected (${lat.toFixed(2)}, ${lon.toFixed(2)})`
            : `সনাক্তকৃত জিপিএস (${lat.toFixed(2)}, ${lon.toFixed(2)})`
        );
        setIsLocating(false);
        fetchPrayerTimesFromAPI(lat, lon);
      },
      () => {
        setIsLocating(false);
        // Fallback default coordinates (Dhaka)
        fetchPrayerTimesFromAPI(23.8103, 90.4125);
      },
      { timeout: 7000 }
    );
  };

  // Fetch API times
  const fetchPrayerTimesFromAPI = async (lat: number, lon: number) => {
    setIsFetchingTimes(true);
    try {
      const dateStr = new Date().toISOString().split("T")[0];
      // method=1 is used as requested in prompt
      const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=1`;
      const res = await fetch(url);
      if (res.ok) {
        const payload = await res.json();
        const timings = payload?.data?.timings;
        if (timings) {
          setApiTimings(timings);
        }
      }
    } catch (_) {
      // Stay on defaults
    } finally {
      setIsFetchingTimes(false);
    }
  };

  // Calculate live countdown timer & progress arc (updates every second)
  useEffect(() => {
    const parseTimeToMinutes = (timeStr: string) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const calcWaqtAndRemaining = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

      const f = parseTimeToMinutes(apiTimings.Fajr);
      const s = parseTimeToMinutes(apiTimings.Sunrise);
      const d = parseTimeToMinutes(apiTimings.Dhuhr);
      const a = parseTimeToMinutes(apiTimings.Asr);
      const m = parseTimeToMinutes(apiTimings.Maghrib);
      const i = parseTimeToMinutes(apiTimings.Isha);

      let active = "এশা";
      let startLimit = i;
      let endLimit = f + 24 * 60;
      let waqtIdx = 4; // Isha

      if (currentMinutes >= f && currentMinutes < s) {
        active = "ফজর";
        startLimit = f;
        endLimit = s;
        waqtIdx = 0;
      } else if (currentMinutes >= s && currentMinutes < d) {
        active = "সূর্যোদয় (নিষিদ্ধ)";
        startLimit = s;
        endLimit = d;
        waqtIdx = 5;
      } else if (currentMinutes >= d && currentMinutes < a) {
        active = "যোহর";
        startLimit = d;
        endLimit = a;
        waqtIdx = 1;
      } else if (currentMinutes >= a && currentMinutes < m) {
        active = "আসর";
        startLimit = a;
        endLimit = m;
        waqtIdx = 2;
      } else if (currentMinutes >= m && currentMinutes < i) {
        active = "মাগরিব";
        startLimit = m;
        endLimit = i;
        waqtIdx = 3;
      } else {
        active = "এশা";
        waqtIdx = 4;
        if (currentMinutes >= i) {
          startLimit = i;
          endLimit = f + 24 * 60;
        } else {
          startLimit = i - 24 * 60;
          endLimit = f;
        }
      }

      setCurrentWaqtName(active);
      setCurrentWaqtIndex(waqtIdx);

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

      const hours = Math.floor(totalSecsRemaining / 3600);
      const mins = Math.floor((totalSecsRemaining % 3600) / 60);
      const secs = totalSecsRemaining % 60;

      const pad = (n: number) => String(n).padStart(2, "0");
      setCountdownText(toBengaliNumerals(`${pad(hours)}:${pad(mins)}:${pad(secs)}`));
    };

    calcWaqtAndRemaining();
    const interval = setInterval(calcWaqtAndRemaining, 1000);
    return () => clearInterval(interval);
  }, [apiTimings]);

  // Fasting specific countdown to Sahri end (Fajr) or Iftar (Maghrib)
  const getFastingStatus = () => {
    const parseTimeToMinutes = (timeStr: string) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const f = parseTimeToMinutes(apiTimings.Fajr);
    const m = parseTimeToMinutes(apiTimings.Maghrib);

    // If before Fajr: Count down to Sahri end (Fajr)
    // If after Fajr but before Maghrib: Count down to Iftar
    // If after Maghrib: Count down to Sahri of next day
    let label = "সাহরি শেষ হতে বাকি";
    let targetMins = f;
    let startMins = m - 24 * 60; // previous sunset

    if (currentMins >= f && currentMins < m) {
      label = "ইফতারের বাকি সময়";
      targetMins = m;
      startMins = f;
    } else if (currentMins >= m) {
      label = "পরবর্তী সাহরি শেষ হতে বাকি";
      targetMins = f + 24 * 60;
      startMins = m;
    } else {
      label = "সাহরি শেষ হতে বাকি";
      targetMins = f;
      startMins = m - 24 * 60;
    }

    let currentVal = currentMins;
    if (currentMins >= m && targetMins > 24 * 60) {
      currentVal = currentMins;
    } else if (currentMins < f && targetMins === f) {
      currentVal = currentMins;
    }

    const totalDuration = targetMins - startMins;
    const elapsed = currentVal - startMins;
    const progress = Math.max(0, Math.min(1, elapsed / totalDuration));

    const diffMinutes = targetMins - currentVal;
    const remainingSecs = Math.max(0, Math.round(diffMinutes * 60));

    const hrs = Math.floor(remainingSecs / 3600);
    const mins = Math.floor((remainingSecs % 3600) / 60);
    const secs = remainingSecs % 60;
    const pad = (n: number) => String(n).padStart(2, "0");

    return {
      label,
      countdown: toBengaliNumerals(`${pad(hrs)}:${pad(mins)}:${pad(secs)}`),
      progress,
      rawSecs: remainingSecs
    };
  };

  const fastingStatus = getFastingStatus();

  // Prohibited ranges computed dynamically
  const prohibitedTimes = [
    {
      name: "সকাল (সূর্যোদয়)",
      icon: "🌅",
      desc: "সূর্যোদয় কালীন প্রথম ১৫ মিনিট সালাত আদায় নিষিদ্ধ",
      range: `${formatTimeToBengali(apiTimings.Sunrise)} - ${formatTimeToBengali(addMinutesToTimeStr(apiTimings.Sunrise, 15))}`
    },
    {
      name: "দুপুর (জাওয়াল/জেনিত)",
      icon: "☀️",
      desc: "ঠিক মধ্যাহ্ন সময়ে সূর্য ঠিক মাথার উপর থাকলে সালাত নিষিদ্ধ",
      range: `${formatTimeToBengali(addMinutesToTimeStr(apiTimings.Dhuhr, -15))} - ${formatTimeToBengali(apiTimings.Dhuhr)}`
    },
    {
      name: "সন্ধ্যা (সূর্যাস্ত)",
      icon: "🌇",
      desc: "সূর্যাস্ত কালীন শেষ ১৫ মিনিট সালাত আদায় নিষিদ্ধ",
      range: `${formatTimeToBengali(addMinutesToTimeStr(apiTimings.Maghrib, -15))} - ${formatTimeToBengali(apiTimings.Maghrib)}`
    }
  ];

  // Supererogatory ranges computed dynamically
  const naflTimes = [
    { name: "দুহা (ইশরাক)", icon: "🌤️", range: getnaflDisplayRange(apiTimings.Sunrise, 15, apiTimings.Dhuhr, -15) },
    { name: "জাওয়াল (মধ্যাহ্ন)", icon: "☀️", range: `${formatTimeToBengali(addMinutesToTimeStr(apiTimings.Dhuhr, -15))} - ${formatTimeToBengali(apiTimings.Dhuhr)}` },
    { name: "আওয়াবিন", icon: "🌌", range: getnaflDisplayRange(apiTimings.Maghrib, 15, apiTimings.Isha, 0) },
    { name: "তাহাজ্জুদ", icon: "🌙", range: getnaflDisplayRange(apiTimings.Isha, 120, apiTimings.Fajr, 0) }
  ];

  const triggerAlarmToggle = (type: "sahri" | "iftar") => {
    if (type === "sahri") {
      setSahriAlarmActive(!sahriAlarmActive);
      setShowAlarmToast(!sahriAlarmActive ? "সাহরির অ্যালার্ম সচল করা হয়েছে" : "সাহরির অ্যালার্ম বন্ধ করা হয়েছে");
    } else {
      setIftarAlarmActive(!iftarAlarmActive);
      setShowAlarmToast(!iftarAlarmActive ? "ইফতারের অ্যালার্ম সচল করা হয়েছে" : "ইফতারের অ্যালার্ম বন্ধ করা হয়েছে");
    }
    setTimeout(() => setShowAlarmToast(null), 3000);
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-10 space-y-6 font-bengali">
      
      {/* PRAYER / FASTING TOP SUB-TAB SELECTOR */}
      <div className="flex bg-white dark:bg-[#0D1E24] p-1.5 rounded-2xl border border-gray-100 dark:border-teal-950/60 shadow-sm relative z-10">
        <button
          onClick={() => setActiveSubTab("namaz")}
          className={`flex-1 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === "namaz"
              ? "bg-gold-brand text-black shadow-md scale-102"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <span>🕌</span>
          <span>সালাতের সময়</span>
        </button>

        <button
          onClick={() => setActiveSubTab("fasting")}
          className={`flex-1 py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTab === "fasting"
              ? "bg-gold-brand text-black shadow-md scale-102"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <span>🌙</span>
          <span>সাওম (রোজা)</span>
        </button>
      </div>

      {/* LOCATION BAR BANNER */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#0D1E24] rounded-2xl border border-gray-100 dark:border-teal-950/50 shadow-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gold-brand animate-pulse" />
          <span className="text-xs text-gray-500 dark:text-gray-300 font-bold">
            {locationName}
          </span>
        </div>
        <button
          onClick={detectGPSLocation}
          disabled={isLocating}
          className="text-[10px] font-black text-gold-brand hover:underline flex items-center gap-1 disabled:opacity-50 cursor-pointer"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <span>লোকেশন আপডেট</span>
              <ChevronRight className="w-3 h-3" />
            </>
          )}
        </button>
      </div>

      {/* ACTIVE SUB-TAB CONTENT RENDERING */}
      {activeSubTab === "namaz" ? (
        // ========================== SALAT / NAMAZ VIEW REDESIGN ==========================
        <div className="space-y-6">
          
          {/* 1. CIRCULAR COUNTDOWN ARC CARD */}
          <div className="bg-gradient-to-b from-[#063b36] via-[#042d2a] to-[#0d1f1c] text-white p-6 rounded-3xl shadow-xl text-center relative overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#c9a227_1px,transparent_1px)] [background-size:20px_20px]" />
            
            {/* View full-screen button */}
            <button
              onClick={() => setShowLargeTimer(true)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all text-gold-brand cursor-pointer flex items-center gap-1.5 text-[10px] font-black"
              title="বড় করে দেখুন"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>বড় করে দেখুন</span>
            </button>

            {/* Circular SVG Arc */}
            <div className="relative w-56 h-36 mt-2 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 60">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="7.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#c9a227"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="125.66"
                  strokeDashoffset={125.66 * (1 - progressFraction)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-x-0 bottom-4 flex flex-col items-center text-center space-y-0.5 select-none">
                <span className="text-2xl font-black text-gold-brand">
                  {currentWaqtName}
                </span>
                <span className="text-[10px] text-gray-300 font-medium">
                  ওয়াক্ত শেষ হতে বাকি
                </span>
                <span className="text-xl font-mono font-black text-white tracking-widest">
                  {countdownText}
                </span>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-gray-400 flex items-center gap-1 font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{bengaliDate || "শুক্রবার, ১৯ জুন, ২০২৬"}</span>
            </div>
          </div>

          {/* 2. "সালাতের নিষিদ্ধ সময়" SECTION */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-red-500 flex items-center gap-1.5 px-1">
              <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
              সালাতের নিষিদ্ধ সময়সূচী
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              {prohibitedTimes.map((item, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#0D1E24] border border-red-500/10 p-3.5 rounded-2xl shadow-sm text-center flex flex-col items-center justify-between hover:border-red-500/20 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-1.5 shadow-inner shrink-0">
                    {i === 0 ? <Sunrise className="w-4 h-4" /> : i === 1 ? <Sun className="w-4 h-4" /> : <Sunset className="w-4 h-4" />}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-100 block">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono font-black text-orange-500 bg-orange-500/5 px-2 py-0.5 rounded-full inline-block">
                      {item.range}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. "নফল সালাতের সময়" SECTION */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-gray-800 dark:text-gray-100 flex items-center gap-1.5 px-1">
              <Sparkles className="w-4 h-4 text-gold-brand" />
              নফল সালাতের সময়সমূহ
            </h3>

            <div className="bg-white dark:bg-[#0D1E24] border border-gray-100 dark:border-teal-950/50 rounded-2xl p-4 shadow-sm space-y-3">
              {naflTimes.map((nafl, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between pb-3 last:pb-0 border-b border-gray-50 dark:border-teal-950/20 last:border-b-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gold-brand/10 text-gold-brand flex items-center justify-center shadow-inner shrink-0">
                      {i === 0 ? <CloudSun className="w-4 h-4" /> : i === 1 ? <Sun className="w-4 h-4" /> : i === 2 ? <Moon className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                      {nafl.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-gold-brand bg-gold-brand/5 px-2.5 py-0.5 rounded-lg border border-gold-brand/5">
                    {nafl.range}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. SEHRI/IFTAR SECTION AT BOTTOM */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-gray-800 dark:text-gray-100 flex items-center gap-1.5 px-1">
              <Clock className="w-4.5 h-4.5 text-gold-brand" />
              আজকের সাহরি ও ইফতার সময়সূচী
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              
              {/* Sehri time box */}
              <div className="bg-white dark:bg-[#0D1E24] border border-gray-100 dark:border-teal-950 p-3.5 rounded-2xl text-center shadow-sm flex flex-col justify-between">
                <span className="text-sm font-black text-gray-800 dark:text-gray-100 block">পরবর্তী সাহরি</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">শেষ সময়</span>
                <span className="text-xs font-mono font-black text-gold-brand bg-gold-brand/5 py-1 rounded-lg block mt-2">
                  {formatTimeToBengali(apiTimings.Fajr)}
                </span>
              </div>

              {/* Iftar time box */}
              <div className="bg-white dark:bg-[#0D1E24] border border-gray-100 dark:border-teal-950 p-3.5 rounded-2xl text-center shadow-sm flex flex-col justify-between">
                <span className="text-sm font-black text-gray-800 dark:text-gray-100 block">পরবর্তী ইফতার</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">শুরুর সময়</span>
                <span className="text-xs font-mono font-black text-emerald-500 bg-emerald-500/5 py-1 rounded-lg block mt-2">
                  {formatTimeToBengali(apiTimings.Maghrib)}
                </span>
              </div>

              {/* Countdown box */}
              <div className="bg-white dark:bg-[#0D1E24] border border-gray-100 dark:border-teal-950 p-3.5 rounded-2xl text-center shadow-sm flex flex-col justify-between">
                <span className="text-[11px] font-black text-gray-800 dark:text-gray-100 block">সাহরির বাকি</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">লাইভ কাউন্টডাউন</span>
                <span className="text-xs font-mono font-black text-white bg-[#063b36] py-1 rounded-lg block mt-2 tracking-wider">
                  {fastingStatus.label.includes("সাহরি") ? fastingStatus.countdown : "পূর্ণ হয়েছে"}
                </span>
              </div>

            </div>
          </div>

        </div>
      ) : (
        // ========================== FASTING PAGE VIEW REDESIGN ==========================
        <div className="space-y-6">
          
          {/* 1. LARGE CIRCULAR ARC SEHRI COUNTDOWN */}
          <div className="bg-gradient-to-b from-[#063b36] via-[#042d2a] to-[#0d1f1c] text-white p-6 rounded-3xl shadow-xl text-center relative overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#c9a227_1px,transparent_1px)] [background-size:20px_20px]" />
            
            <span className="text-xs font-black text-gold-brand px-3 py-1 rounded-full bg-gold-brand/10 border border-gold-brand/20 animate-pulse">
              {fastingStatus.label}
            </span>

            {/* Circular Arc representing fasting count */}
            <div className="relative w-56 h-36 mt-4 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 60">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#c9a227"
                  strokeWidth="7.5"
                  strokeLinecap="round"
                  strokeDasharray="125.66"
                  strokeDashoffset={125.66 * (1 - fastingStatus.progress)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-x-0 bottom-4 flex flex-col items-center text-center space-y-0.5 select-none">
                <span className="text-xl font-mono font-black text-white tracking-widest">
                  {fastingStatus.countdown}
                </span>
                <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mt-0.5">
                  HH:MM:SS TIMER
                </span>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-gray-400 flex items-center gap-1 font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{bengaliDate || "শুক্রবার, ১৯ জুন, ২০২৬"}</span>
            </div>
          </div>

          {/* 2. MOTIVATIONAL HADITH CARD WITH SLIDING DOTS */}
          <div className="bg-white dark:bg-[#0D1E24] border border-gray-100 dark:border-teal-950 p-5 rounded-2xl shadow-sm text-center relative overflow-hidden space-y-4">
            <span className="text-2xl">✨</span>
            
            {/* Hadith slider box */}
            <div className="min-h-[80px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={hadithIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <p className="text-xs text-gray-600 dark:text-gray-200 leading-relaxed font-bold italic">
                    {MOTIVATIONAL_HADITHS[hadithIndex].text}
                  </p>
                  <span className="text-[10px] text-gold-brand font-bold block">
                    — {MOTIVATIONAL_HADITHS[hadithIndex].source}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {MOTIVATIONAL_HADITHS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHadithIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                    hadithIndex === idx ? "bg-gold-brand w-3" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 3. "সাওমের সময়সূচী" WITH SAHRI & IFTAR + ALARM BELLS */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-gray-800 dark:text-gray-100 flex items-center gap-1.5 px-1">
              <Calendar className="w-4.5 h-4.5 text-gold-brand" />
              সাওমের দৈনিক সময়সূচী ও আমল
            </h3>

            <div className="space-y-3">
              
              {/* Sahri Timetable row */}
              <div className="bg-white dark:bg-[#0D1E24] border border-gray-100 dark:border-teal-950 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gold-brand/10 text-gold-brand flex items-center justify-center shadow-inner shrink-0">
                    <Moon className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-black text-gray-800 dark:text-gray-100 block">সাহরি শেষ সময়</span>
                    <span className="text-[10px] text-gray-400">ফজরের ঠিক পূর্ববর্তী সময়</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-black text-gold-brand">
                    {formatTimeToBengali(apiTimings.Fajr)}
                  </span>
                  
                  {/* Bell icon toggle */}
                  <button
                    onClick={() => triggerAlarmToggle("sahri")}
                    className={`p-2 rounded-xl border cursor-pointer transition-all ${
                      sahriAlarmActive
                        ? "bg-gold-brand/10 border-gold-brand text-gold-brand"
                        : "border-gray-200 text-gray-400 hover:text-gold-brand"
                    }`}
                  >
                    {sahriAlarmActive ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Iftar Timetable row */}
              <div className="bg-white dark:bg-[#0D1E24] border border-gray-100 dark:border-teal-950 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner shrink-0">
                    <Sunset className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-black text-gray-800 dark:text-gray-100 block">ইফতার শুরু সময়</span>
                    <span className="text-[10px] text-gray-400">মাগরিব ওয়াক্তের শুরুর সময়</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-black text-emerald-500">
                    {formatTimeToBengali(apiTimings.Maghrib)}
                  </span>
                  
                  {/* Bell icon toggle */}
                  <button
                    onClick={() => triggerAlarmToggle("iftar")}
                    className={`p-2 rounded-xl border cursor-pointer transition-all ${
                      iftarAlarmActive
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                        : "border-gray-200 text-gray-400 hover:text-emerald-500"
                    }`}
                  >
                    {iftarAlarmActive ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* FULL-SCREEN TIMER MODAL OVERLAY */}
      <AnimatePresence>
        {showLargeTimer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-bengali text-center text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm space-y-8 flex flex-col justify-center items-center relative"
            >
              <button
                onClick={() => setShowLargeTimer(false)}
                className="absolute top-0 right-0 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gold-brand cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-4xl block animate-bounce">🕌</span>
                <h3 className="text-xl font-black text-gold-brand uppercase tracking-widest mt-1">নূরের পথ সালাত</h3>
                <p className="text-xs text-gray-300">তাত্ক্ষণিক নামাজ লাইভ কাউন্টডাউন</p>
              </div>

              {/* Enormous Display Ticker */}
              <div className="space-y-2 p-6 rounded-3xl bg-white/5 border border-white/10 shadow-2xl w-full">
                <span className="text-xs bg-gold-brand/20 text-gold-brand font-black px-4 py-1 rounded-full uppercase animate-pulse border border-gold-brand/10">
                  চলতি ওয়াক্ত: {currentWaqtName}
                </span>

                <div className="pt-4 pb-2">
                  <span className="text-5xl font-mono font-black tracking-widest text-white drop-shadow-lg block">
                    {countdownText}
                  </span>
                  <span className="text-[10px] text-gray-400 block uppercase tracking-widest mt-1 font-bold">
                    hours : minutes : seconds
                  </span>
                </div>

                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-3">
                  <div
                    style={{ width: `${progressFraction * 100}%` }}
                    className="bg-gold-brand h-full rounded-full transition-all duration-1000"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-400 font-bold">
                <p className="flex items-center gap-1 justify-center">
                  <MapPin className="w-3.5 h-3.5 text-gold-brand" />
                  <span>{locationName}</span>
                </p>
                <p className="text-[10px]">আপডেট হচ্ছে প্রতি ১ সেকেন্ডে</p>
              </div>

              <button
                onClick={() => setShowLargeTimer(false)}
                className="w-full py-3 rounded-2xl bg-gold-brand text-black font-black text-xs cursor-pointer hover:brightness-105 active:scale-95 shadow-lg"
              >
                ফিরে যান
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Alarm success toast notification */}
      <AnimatePresence>
        {showAlarmToast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-[#063b36] text-white border border-gold-brand/30 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2"
            >
              <Volume2 className="w-4.5 h-4.5 text-gold-brand animate-pulse" />
              <span className="text-xs font-bold text-gray-100">{showAlarmToast}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
