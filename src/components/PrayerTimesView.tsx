import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  MapPin, 
  Calendar, 
  Loader2, 
  CheckSquare, 
  Square,
  ExternalLink,
  Map
} from "lucide-react";

interface PrayerTimePair {
  name: string;
  english: string;
  time: string; // raw string e.g. "04:12"
  formatted: string; // display string e.g. "০৪:১২ AM"
}

export default function PrayerTimesView() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [bengaliDate, setBengaliDate] = useState("");
  
  // Geolocation & Map Coordinates State
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationName, setLocationName] = useState("ঢাকা (ডিফল্ট)");
  const [isLocating, setIsLocating] = useState(false);
  const [isFetchingTimes, setIsFetchingTimes] = useState(false);
  
  // Prayer times state
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimePair[]>([
    { name: "ফজর", english: "Fajr", time: "04:12", formatted: "০৪:১২ AM" },
    { name: "যোহর", english: "Dhuhr", time: "12:06", formatted: "১২:০৬ PM" },
    { name: "আসর", english: "Asr", time: "16:30", formatted: "০৪:৩০ PM" },
    { name: "মাগরিব", english: "Maghrib", time: "18:50", formatted: "০৬:৫০ PM" },
    { name: "এশা", english: "Isha", time: "20:15", formatted: "০৮:১৫ PM" }
  ]);

  // Current and Next prayer state
  const [currentWaqtIndex, setCurrentWaqtIndex] = useState<number>(0);
  const [nextWaqtIndex, setNextWaqtIndex] = useState<number>(1);
  const [countdownText, setCountdownText] = useState("লোড হচ্ছে...");

  // Qibla orientation details state
  const [qiblaAngle, setQiblaAngle] = useState<number>(263.15); // Dhaka default
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [deviceDirectionActive, setDeviceDirectionActive] = useState(false);

  // Namaz Tracker LocalStorage state
  const [namazTracker, setNamazTracker] = useState<Record<string, boolean>>({
    ফজর: false,
    যোহর: false,
    আসর: false,
    মাগরিব: false,
    এশা: false
  });

  // Fetch Prayer timings initially
  useEffect(() => {
    // 1. Initial Local Time
    const updateTimeTick = () => {
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
    updateTimeTick();
    const intervalId = setInterval(updateTimeTick, 1000);

    // 2. Load tracker, handle midnight reset
    loadTrackerAndHandleReset();

    // 3. Request Geolocation dynamically on mount
    detectLocationAndFetchTimes();

    return () => clearInterval(intervalId);
  }, []);

  // Calculate live ticks for active prayer highlight and countdown
  useEffect(() => {
    const calcActiveWaqtAndCountdown = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
      const nowMins = currentHours * 60 + currentMinutes + currentSeconds / 60;

      // Parse prayer times to mins
      const parsedMins = prayerTimes.map((p) => {
        const [h, m] = p.time.split(":").map(Number);
        return h * 60 + m;
      });

      // Find current active index
      let curIndex = 4; // Default to Isha if before Fajr or after Isha
      let nextIndex = 0; // Default next is Fajr

      if (nowMins >= parsedMins[0] && nowMins < parsedMins[1]) {
        curIndex = 0;
        nextIndex = 1;
      } else if (nowMins >= parsedMins[1] && nowMins < parsedMins[2]) {
        curIndex = 1;
        nextIndex = 2;
      } else if (nowMins >= parsedMins[2] && nowMins < parsedMins[3]) {
        curIndex = 2;
        nextIndex = 3;
      } else if (nowMins >= parsedMins[3] && nowMins < parsedMins[4]) {
        curIndex = 3;
        nextIndex = 4;
      } else {
        curIndex = 4;
        nextIndex = 0;
      }

      setCurrentWaqtIndex(curIndex);
      setNextWaqtIndex(nextIndex);

      // Countdown remaining calculations
      let nextMinsTotal = parsedMins[nextIndex];
      if (nextIndex === 0 && nowMins >= parsedMins[4]) {
        nextMinsTotal += 24 * 60; // rolls into next day morning Fajr
      }

      const diffMins = nextMinsTotal - nowMins;
      const hoursLeft = Math.floor(diffMins / 60);
      const minsLeft = Math.floor(diffMins % 60);
      const secsLeft = Math.floor((diffMins * 60) % 60);

      // Format Bengali text
      const bnHours = hoursLeft.toString().toLocaleIntl("bn-BD");
      const bnMins = minsLeft.toString().toLocaleIntl("bn-BD");
      const bnSecs = secsLeft.toString().toLocaleIntl("bn-BD");

      let out = "";
      if (hoursLeft > 0) out += `${bnHours} ঘণ্টা `;
      out += `${bnMins} মিনিট ${bnSecs} সেকেন্ড`;
      setCountdownText(out);
    };

    calcActiveWaqtAndCountdown();
    const tick = setInterval(calcActiveWaqtAndCountdown, 1000);
    return () => clearInterval(tick);
  }, [prayerTimes]);

  // Hack prototype to translate numbers to Bengali
  const extendProto = () => {
    if (!String.prototype.toLocaleIntl) {
      String.prototype.toLocaleIntl = function (locale: string) {
        if (locale === "bn-BD") {
          const dict: Record<string, string> = {
            "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
            "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
          };
          return this.split("").map((c) => dict[c] || c).join("");
        }
        return this.toString();
      };
    }
  };
  extendProto();

  // Load tracker details from localStorage
  const loadTrackerAndHandleReset = () => {
    if (typeof window !== "undefined") {
      const todayKey = `np_namaz_date_${new Date().toDateString()}`;
      const savedDate = localStorage.getItem("np_namaz_tracker_date");
      
      if (savedDate !== todayKey) {
        // New day reset
        const emptyTracker = {
          ফজর: false,
          যোহর: false,
          আসর: false,
          মাগরিব: false,
          এশা: false
        };
        localStorage.setItem("np_namaz_tracker_date", todayKey);
        localStorage.setItem("np_namaz_tracker_data", JSON.stringify(emptyTracker));
        setNamazTracker(emptyTracker);
      } else {
        const data = localStorage.getItem("np_namaz_tracker_data");
        if (data) {
          try {
            setNamazTracker(JSON.parse(data));
          } catch (_) {
            // ignore
          }
        }
      }
    }
  };

  const toggleNamazCheckbox = (waqtName: string) => {
    const next = { ...namazTracker, [waqtName]: !namazTracker[waqtName] };
    setNamazTracker(next);
    localStorage.setItem("np_namaz_tracker_data", JSON.stringify(next));

    // Support gentle double vibration feedback on checkmark toggle
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(60);
    }
  };

  // Helper geolocation fetching logic
  const detectLocationAndFetchTimes = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);
        setLocationName(`সনাক্তকৃত জিপিএস (${lat.toFixed(2)}, ${lon.toFixed(2)})`);
        setIsLocating(false);
        fetchPrayerTimesFromAPI(lat, lon);
        calculateQibla(lat, lon);
      },
      () => {
        setIsLocating(false);
        // Fallback to Dhaka
        fetchPrayerTimesFromAPI(23.81, 90.41);
      },
      { timeout: 8000 }
    );
  };

  const fetchPrayerTimesFromAPI = async (lat: number, lon: number) => {
    setIsFetchingTimes(true);
    try {
      const dateStr = new Date().toISOString().split("T")[0];
      const apiURL = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=2`;
      const response = await fetch(apiURL);
      if (!response.ok) throw new Error("API failure");
      const payload = await response.json();
      const timings = payload?.data?.timings;

      if (timings) {
        // Transform and translate raw timings
        const formattedList: PrayerTimePair[] = [
          { name: "ফজর", english: "Fajr", time: timings.Fajr, formatted: convertToBengaliFormattedTime(timings.Fajr) },
          { name: "যোহর", english: "Dhuhr", time: timings.Dhuhr, formatted: convertToBengaliFormattedTime(timings.Dhuhr) },
          { name: "আসর", english: "Asr", time: timings.Asr, formatted: convertToBengaliFormattedTime(timings.Asr) },
          { name: "মাগরিব", english: "Maghrib", time: timings.Maghrib, formatted: convertToBengaliFormattedTime(timings.Maghrib) },
          { name: "এশা", english: "Isha", time: timings.Isha, formatted: convertToBengaliFormattedTime(timings.Isha) }
        ];
        setPrayerTimes(formattedList);
      }
    } catch (_) {
      // Keep static defaults on error
    } finally {
      setIsFetchingTimes(false);
    }
  };

  const convertToBengaliFormattedTime = (raw24h: string): string => {
    const [h, m] = raw24h.split(":").map(Number);
    const hour12 = h % 12 || 12;
    const suffix = h >= 12 ? "PM" : "AM";
    const padHour = hour12.toString().padStart(2, "0");
    const padMin = m.toString().padStart(2, "0");
    const rawFormatted = `${padHour}:${padMin} ${suffix}`;
    return rawFormatted.toLocaleIntl("bn-BD");
  };

  // Mathematically calculate precise Qibla bearing towards Makkah (21.42° N, 39.82° E)
  const calculateQibla = (lat: number, lon: number) => {
    const mLat = (21.4225 * Math.PI) / 180;
    const mLon = (39.8262 * Math.PI) / 180;
    const pLat = (lat * Math.PI) / 180;
    const pLon = (lon * Math.PI) / 180;

    const y = Math.sin(mLon - pLon);
    const x = Math.cos(pLat) * Math.tan(mLat) - Math.sin(pLat) * Math.cos(mLon - pLon);
    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    if (bearing < 0) bearing += 360;
    setQiblaAngle(bearing);
  };

  const requestCompassPermission = () => {
    if (typeof window !== "undefined" && (window as any).DeviceOrientationEvent && (window as any).DeviceOrientationEvent.requestPermission) {
      (window as any).DeviceOrientationEvent.requestPermission()
        .then((response: string) => {
          if (response === "granted") {
            setDeviceDirectionActive(true);
            window.addEventListener("deviceorientation", (e) => {
              if (e.alpha !== null) {
                setCompassHeading(e.alpha);
              }
            });
          }
        })
        .catch(() => {
          setDeviceDirectionActive(true);
        });
    } else {
      setDeviceDirectionActive(true);
      alert("কম্পাস সক্রিয় করা হয়েছে। মোবাইলটি সোজা সমতল স্থানে রাখুন।");
    }
  };

  const handleManualCompassRotate = () => {
    setCompassHeading((prev) => (prev + 30) % 360);
    setDeviceDirectionActive(true);
  };

  const needleRotation = qiblaAngle - compassHeading;

  const openNearestMosques = () => {
    const lat = latitude || 23.81;
    const lon = longitude || 90.41;
    const osmUrl = `https://www.openstreetmap.org/search?query=mosque#map=16/${lat}/${lon}`;
    window.open(osmUrl, "_blank");
  };

  return (
    <div className="space-y-6 w-full max-w-lg mx-auto pb-8">
      {/* Time and location details banner */}
      <div className="glass-effect p-6 rounded-2xl relative overflow-hidden border border-gold-brand/10 shadow-sm text-center flex flex-col items-center">
        <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-gold-brand/5 blur-xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-24 h-24 rounded-full bg-gold-brand/10 blur-xl pointer-events-none" />

        <div className="inline-flex items-center gap-1.5 font-bold text-xs text-gold-brand tracking-wide uppercase mb-1.5 bg-gold-brand/10 px-3 py-1 rounded-full animate-pulse">
          <MapPin className="w-3.5 h-3.5" />
          {locationName}
        </div>

        {/* Current ticking time */}
        <h2 className="font-poppins text-4xl font-extrabold text-white tracking-wider select-none my-1">
          {currentTime.toLocaleTimeString("bn-BD", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </h2>
        
        <p className="font-bengali text-xs text-gray-400 mt-1 font-semibold flex items-center gap-1 justify-center">
          <Calendar className="w-3.5 h-3.5" />
          {bengaliDate || "শুক্রবার, ১৯ জুন, ২০২৬"}
        </p>

        {/* Manual refresh button */}
        <button
          onClick={detectLocationAndFetchTimes}
          disabled={isLocating}
          className="absolute right-3.5 bottom-3.5 p-2 bg-gold-brand/10 hover:bg-gold-brand/20 text-gold-brand border border-gold-brand/10 rounded-lg cursor-pointer text-[10px] font-bold font-bengali transition-colors disabled:opacity-50"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            "লোকেশন খুঁজুন"
          )}
        </button>
      </div>

      {/* Countdown card */}
      <div className="bg-card-brand border border-gold-brand/20 p-5 rounded-2xl flex items-center justify-between shadow-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-gold-brand to-transparent" />
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gold-brand/10 rounded-xl text-gold-brand">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <h3 className="font-bengali text-sm font-black text-text-brand flex items-center gap-1">
              পরবর্তী ওয়াক্ত: <span className="text-gold-brand">{prayerTimes[nextWaqtIndex]?.name || ""}</span>
            </h3>
            <p className="font-bengali text-[10px] text-gray-400">
              পরবর্তী সালাতের বাকি সময়সীমা
            </p>
          </div>
        </div>
        <span className="font-bengali text-xs font-bold text-black bg-gold-brand px-3 py-1.5 rounded-xl block cursor-default select-none shadow-sm">
          {countdownText}
        </span>
      </div>

      {/* Qibla Compass Widget */}
      <div className="bg-card-brand/40 border border-gold-brand/15 p-5 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between relative shadow-sm">
        <div className="space-y-2 max-w-xs text-center md:text-left">
          <span className="font-poppins text-[10px] tracking-widest uppercase font-black text-gold-brand bg-gold-brand/10 px-2 py-0.5 rounded">
            Kaaba Finder
          </span>
          <h3 className="font-bengali text-base font-bold text-white flex items-center justify-center md:justify-start gap-1">
            কিবলা কম্পাস (Qibla)
          </h3>
          <p className="font-bengali text-xs text-gray-400 leading-relaxed">
            কেবলা কোন দিকে তা সনাক্ত করতে মোবাইলটি সোজা রাখুন। ঢাকা থেকে এঙ্গেল: <strong className="text-gold-brand font-poppins">{Math.round(qiblaAngle)}°</strong>
          </p>
          
          <div className="flex flex-col md:flex-row gap-2.5 items-center justify-center md:justify-start">
            <button 
              type="button"
              onClick={requestCompassPermission}
              className="text-[10px] bg-gold-brand text-black px-2.5 py-1 rounded-md font-bengali font-bold cursor-pointer hover:brightness-110 active:scale-95 transition-transform"
            >
              কম্পাস চালু করুন (অনুমতি)
            </button>
            <button 
              type="button"
              onClick={handleManualCompassRotate}
              className="text-[10px] text-gold-brand font-bengali font-bold underline cursor-pointer"
            >
              {deviceDirectionActive 
                ? "হেডিং পরীক্ষা" 
                : "কম্পাস টেস্ট"}
            </button>
          </div>
        </div>

        {/* Visual Rotating Compass Ring */}
        <div className="relative w-36 h-36 flex items-center justify-center bg-black/20 rounded-full border border-gold-brand/10">
          <div className="absolute inset-2 rounded-full border border-dashed border-gold-brand/15 opacity-60 flex items-center justify-center">
            <span className="absolute top-1 text-[8px] font-bold font-poppins text-red-500">N</span>
            <span className="absolute bottom-1 text-[8px] font-bold font-poppins text-gray-500">S</span>
            <span className="absolute left-1 text-[8px] font-bold font-poppins text-gray-500">W</span>
            <span className="absolute right-1 text-[8px] font-bold font-poppins text-gray-500">E</span>
          </div>

          <div className="w-2.5 h-2.5 bg-gold-brand rounded-full relative z-20 shadow-sm" />

          {/* Compass Needle (Points up, representing Qibla angle) */}
          <div 
            style={{ transform: `rotate(${needleRotation}deg)` }} 
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            <div className="relative w-full h-full flex justify-center">
              <div className="absolute top-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[38px] border-b-gold-brand" />
              <div className="absolute bottom-4 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[38px] border-t-gray-700" />
              <span className="absolute top-[3px] text-xs">🕋</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prayer Schedule Cards Grid */}
      <div className="space-y-3">
        <h3 className="font-bengali text-md font-bold text-text-brand flex items-center gap-2">
          <span className="w-1.5 h-3 bg-text-brand rounded-full inline-block" />
          আজকের নামাজের ওয়াক্ত ও সময়সূচী
        </h3>

        {isFetchingTimes ? (
          <div className="flex flex-col items-center justify-center py-10 bg-card-brand/50 rounded-2xl border border-gold-brand/5">
            <Loader2 className="w-8 h-8 text-gold-brand animate-spin" />
            <p className="font-bengali text-xs text-gray-500 mt-2">সময়সূচী ক্লাউড থেকে আপডেট হচ্ছে...</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {prayerTimes.map((prayer, i) => {
              const isCurrent = i === currentWaqtIndex;
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? "bg-gradient-to-r from-gold-brand/10 to-transparent border-gold-brand text-text-brand shadow-[0_2px_12px_rgba(201,162,39,0.2)]"
                      : "glass-effect border-gold-brand/10 text-white dark:text-text-brand hover:border-gold-brand/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        isCurrent
                          ? "bg-gold-brand"
                          : "bg-gray-400 dark:bg-gray-700"
                      }`}
                    />
                    <span className="font-bengali text-base font-bold">
                      {prayer.name}
                    </span>
                    {isCurrent && (
                      <span className="font-bengali text-[10px] bg-gold-brand/20 text-gold-brand px-2 py-0.5 rounded-md font-black ml-1.5 border border-gold-brand/20">
                        চলতি ওয়াক্ত
                      </span>
                    )}
                  </div>
                  <span className="font-poppins text-sm font-bold text-text-brand">
                    {prayer.formatted}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Namaz Tracker Component */}
      <div className="bg-card-brand border border-gold-brand/10 p-5 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-gold-brand/5 pb-3">
          <div className="space-y-0.5">
            <h4 className="font-bengali text-sm font-bold text-white">দৈনন্দিন নামাজ ট্র্যাকার</h4>
            <p className="font-bengali text-[10px] text-gray-400">প্রতি ওয়াক্ত আদায় করে সংরক্ষণ করুন (আজকের আমল)</p>
          </div>
          <span className="font-bengali text-[10px] bg-gold-brand/15 text-gold-brand px-2.5 py-1 rounded-full font-bold">
            রিসেট: প্রতি মধ্যরাত
          </span>
        </div>

        {/* 5 columns checklist */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          {["ফজর", "যোহর", "আসর", "মাগরিব", "এশা"].map((waqt) => {
            const isCompleted = namazTracker[waqt] || false;
            return (
              <button
                key={waqt}
                onClick={() => toggleNamazCheckbox(waqt)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                  isCompleted 
                    ? "bg-gold-brand/10 border-gold-brand text-gold-brand" 
                    : "bg-black/15 border-gold-brand/5 text-gray-400"
                }`}
              >
                <span className="font-bengali text-xs font-bold mb-1.5">{waqt}</span>
                {isCompleted ? (
                  <CheckSquare className="w-5 h-5 text-gold-brand" />
                ) : (
                  <Square className="w-5 h-5 text-gray-500 hover:text-gold-brand" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Near Me Mosque Button (OSM Link) */}
      <button
        onClick={openNearestMosques}
        className="w-full bg-[#1A1A2E] hover:bg-[#1A1A2E]/80 border border-gold-brand/20 p-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-98"
      >
        <Map className="w-4 h-4 text-gold-brand" />
        <span className="font-bengali text-xs font-bold text-gold-brand flex items-center gap-1">
          কাছের মসজিদ খুঁজুন (OpenStreetMap) <ExternalLink className="w-3.5 h-3.5" />
        </span>
      </button>

      {/* Makruh alerting */}
      <div className="glass-effect p-3 px-4 rounded-xl border border-red-500/10 flex items-center gap-2.5">
        <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
        <p className="font-bengali text-xs text-gray-400 leading-relaxed">
          সূর্যোদয়, সূর্যাস্ত এবং ঠিক দ্বিপ্রহরের সময় নামাজ পড়া নিষেধ।
        </p>
      </div>
    </div>
  );
}

// Ensure compilation works on all TypeScript types
declare global {
  interface String {
    toLocaleIntl(locale: string): string;
  }
}
