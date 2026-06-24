import { useState, useEffect } from "react";
import { BookOpen, Star, Sparkles, Share2, Compass, ArrowRight, Heart } from "lucide-react";
import { EditableText } from "../AdminContext";

interface HomeDashboardViewProps {
  onNavigateToTab: (index: number) => void;
  key?: string;
}

export default function HomeDashboardView({ onNavigateToTab }: HomeDashboardViewProps) {
  const [greeting, setGreeting] = useState<string>("আসসালামু আলাইকুম ওয়া রাহমানুল্লাহ");
  const [subGreeting, setSubGreeting] = useState<string>("আলোর পথে চলো");
  const [activePrayer, setActivePrayer] = useState<string>("আসর");

  // Load time-based messages and set current active prayer based on 2026 local time
  useEffect(() => {
    const updateTimeBasedContent = () => {
      const now = new Date();
      const hr = now.getHours();
      const min = now.getMinutes();
      const totalMins = hr * 60 + min;

      // 1. Time-based Bengali Greeting Messages
      if (hr >= 4 && hr < 7) {
        setSubGreeting("ফজরের পবিত্র সকাল");
      } else if (hr >= 7 && hr < 12) {
        setSubGreeting("শুভ সকাল");
      } else if (hr >= 12 && hr < 17) {
        setSubGreeting("শুভ দুপুর");
      } else if (hr >= 17 && hr < 20) {
        setSubGreeting("শুভ সন্ধ্যা");
      } else {
        setSubGreeting("শুভ রাত্রি");
      }

      // 2. Determine active prayer based on times:
      // Fajr: 04:12 AM, Dhuhr: 12:06 PM, Asr: 04:30 PM, Maghrib: 06:50 PM, Isha: 08:15 PM
      const fajarMins = 4 * 60 + 12;
      const dhuhrMins = 12 * 60 + 6;
      const asrMins = 16 * 60 + 30;
      const maghribMins = 18 * 60 + 50;
      const ishaMins = 20 * 60 + 15;

      if (totalMins >= fajarMins && totalMins < dhuhrMins) {
        setActivePrayer("ফজর");
      } else if (totalMins >= dhuhrMins && totalMins < asrMins) {
        setActivePrayer("যোহর");
      } else if (totalMins >= asrMins && totalMins < maghribMins) {
        setActivePrayer("আসর");
      } else if (totalMins >= maghribMins && totalMins < ishaMins) {
        setActivePrayer("মাগরিব");
      } else {
        setActivePrayer("ইশা");
      }
    };

    updateTimeBasedContent();
    const interval = setInterval(updateTimeBasedContent, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  // Quick helper to share Ayah details or copy them
  const handleShare = () => {
    const text = "আজকের আয়াত:\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّহِيمِ\nউচ্চারণ: বিসমিল্লাহির রাহমানির রাহিম\nঅর্থ: পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি\n(সূরা আল-ফাতিহা, আয়াত ১)\n\nনূরের পথ অ্যাপ থেকে শেয়ারকৃত।";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert("আয়াতটি ক্লিপবোর্ডে কপি করা হয়েছে!");
    } else {
      alert(text);
    }
  };

  const prayers = [
    { name: "ফজর", time: "০৪:১২" },
    { name: "যোহর", time: "১২:০৬" },
    { name: "আসর", time: "০৪:৩০" },
    { name: "মাগরিব", time: "০৬:৫০" },
    { name: "ইশা", time: "০৮:১৫" },
  ];

  return (
    <div className="space-y-6 w-full max-w-lg mx-auto pb-6">
      {/* 1. GREETING SECTION */}
      <div className="text-center py-2 select-none relative">
        <h2 className="font-bengali text-2xl md:text-3xl font-black text-text-brand leading-snug tracking-wide">
          <EditableText id="home.greeting" defaultText={greeting} />
        </h2>
        <div className="font-bengali text-sm text-gold-brand mt-1.5 font-bold tracking-widest uppercase flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-gold-brand animate-pulse" />
          <EditableText id="home.subgreeting" defaultText={subGreeting} />
        </div>
      </div>

      {/* 2. DAILY AYAH CARD */}
      <div className="bg-card-brand border border-gold-brand/25 p-5 md:p-6 rounded-2xl relative shadow-md overflow-hidden active:scale-98 transition-transform">
        {/* Subtle decorative gold light accent in corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gold-brand/5 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-gold-brand/10 pb-3 mb-4">
          <h3 className="font-bengali text-sm font-black text-gold-brand flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gold-brand" />
            <EditableText id="home.title.daily_ayah" defaultText="আজকের আয়াত" />
          </h3>
          <span className="font-bengali text-[10px] bg-gold-brand/10 text-gold-brand px-2.5 py-0.5 rounded-full font-bold">
            <EditableText id="home.daily_ayah.surah_name" defaultText="সূরা আল-ফাতিহা" />
          </span>
        </div>

        {/* Large Arabic Text */}
        <div className="space-y-4 my-5">
          <div className="w-full flex justify-end">
            <EditableText id="home.daily_ayah.arabic" defaultText="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" className="font-amiri text-2xl md:text-3xl text-right font-semibold text-text-brand leading-[1.8] tracking-wide pr-1" isTextArea={true} />
          </div>

          <div className="w-12 h-[1px] bg-gold-brand/20 my-3 mx-auto" />

          {/* Bengali Pronunciation */}
          <div className="space-y-1">
            <span className="font-bengali text-[10px] text-gold-brand font-extrabold uppercase bg-gold-brand/5 px-2 py-0.5 rounded mr-1.5 inline-block">
              উচ্চারণ
            </span>
            <EditableText id="home.daily_ayah.pronunciation" defaultText="&ldquo;বিসমিল্লাহির রাহমানির রাহিম&rdquo;" className="font-bengali text-sm text-gray-500 dark:text-gray-400 font-semibold leading-relaxed inline-block" isTextArea={true} />
          </div>

          {/* Bengali Meaning */}
          <div className="space-y-1 pt-1">
            <span className="font-bengali text-[10px] text-brand-primary dark:text-[#2ECC71] font-extrabold uppercase bg-brand-primary/5 dark:bg-[#2ECC71]/10 px-2 py-0.5 rounded mr-1.5 inline-block">
              অর্থ
            </span>
            <EditableText id="home.daily_ayah.meaning" defaultText="&ldquo;পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি&rdquo;" className="font-bengali text-sm text-text-brand leading-relaxed inline-block" isTextArea={true} />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gold-brand/10 pt-3 mt-4">
          <EditableText id="home.daily_ayah.reference" defaultText="— সূরা আল-ফাতিহা, আয়াত ১" className="font-bengali text-[11px] text-gray-400 font-medium" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="group/btn relative overflow-hidden p-1 px-2.5 rounded-lg border border-gold-brand/20 bg-gold-brand/5 text-gold-brand hover:bg-gold-brand/10 text-xs font-semibold font-bengali cursor-pointer active:scale-95"
          >
            <span className="flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              শেয়ার
            </span>
          </button>
        </div>
      </div>

      {/* 3. PRAYER TIMES WIDGET */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bengali text-sm font-black text-text-brand flex items-center gap-2">
            <Compass className="w-4 h-4 text-gold-brand" />
            <EditableText id="home.prayer_times.title" defaultText="নামাজের সময়সূচী" />
          </h3>
          <span className="font-bengali text-xs text-gray-400 dark:text-gray-400 font-bold flex items-center gap-1 bg-card-brand px-2.5 py-1 rounded-full border border-gold-brand/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <EditableText id="home.prayer_times.location" defaultText="ঢাকা, বাংলাদেশ" />
          </span>
        </div>

        {/* Horizontal scrollable cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar scroll-smooth">
          {prayers.map((prayer) => {
            const isActive = activePrayer === prayer.name;
            return (
              <div
                key={prayer.name}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border min-w-[90px] shrink-0 transition-all active:scale-95 ${
                  isActive
                    ? "bg-brand-primary/10 border-gold-brand text-text-brand shadow-[0_2px_8px_rgba(201,162,39,0.15)] transform scale-105"
                    : "bg-card-brand border-gold-brand/10 text-text-brand hover:border-gold-brand/20"
                }`}
              >
                <span className="font-bengali text-xs font-medium text-gray-400">
                  ওয়াক্ত
                </span>
                <span className="font-bengali text-base font-black mt-1">
                  {prayer.name}
                </span>
                <span className={`font-poppins text-xs font-bold mt-2 px-2 py-0.5 rounded-full ${
                  isActive ? "bg-gold-brand text-white dark:text-[#0D1B2A]" : "text-gold-brand bg-gold-brand/5"
                }`}>
                  {prayer.time}
                </span>
                {isActive && (
                  <span className="font-bengali text-[8px] mt-1.5 bg-gold-brand/25 text-gold-brand px-1.5 py-0.5 rounded font-bold">
                    চলতি
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. MY AKHIRAH DASHBOARD PREVIEW */}
      <div className="bg-card-brand border border-gold-brand/10 p-5 md:p-6 rounded-2xl relative shadow-sm overflow-hidden space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bengali text-sm font-black text-text-brand flex items-center gap-2">
            <Star className="w-4 h-4 text-gold-brand" />
            <EditableText id="home.akhirah.title" defaultText="আমার আখিরাহ" />
          </h3>
          <span className="font-poppins text-[10px] bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
            Daily Progress
          </span>
        </div>

        {/* 3 Circular progress rings side-by-side */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {/* Progress Ring 1: নামাজ */}
          <div className="flex flex-col items-center text-center space-y-1.5">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-gold-brand/10 fill-none"
                  strokeWidth="4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-gold-brand fill-none"
                  strokeWidth="4"
                  strokeDasharray="163.3"
                  strokeDashoffset="65.3"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-poppins text-xs font-black text-text-brand">
                60%
              </span>
            </div>
            <span className="font-bengali text-xs font-bold text-gray-500">
              নামাজ
            </span>
          </div>

          {/* Progress Ring 2: কুরআন */}
          <div className="flex flex-col items-center text-center space-y-1.5">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-gold-brand/10 fill-none"
                  strokeWidth="4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-gold-brand fill-none"
                  strokeWidth="4"
                  strokeDasharray="163.3"
                  strokeDashoffset="98.0"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-poppins text-xs font-black text-text-brand">
                40%
              </span>
            </div>
            <span className="font-bengali text-xs font-bold text-gray-500">
              কুরআন
            </span>
          </div>

          {/* Progress Ring 3: যিকির */}
          <div className="flex flex-col items-center text-center space-y-1.5">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-gold-brand/10 fill-none"
                  strokeWidth="4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-gold-brand fill-none"
                  strokeWidth="4"
                  strokeDasharray="163.3"
                  strokeDashoffset="40.8"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-poppins text-xs font-black text-text-brand">
                75%
              </span>
            </div>
            <span className="font-bengali text-xs font-bold text-gray-500">
              যিকির
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <div className="pt-2 border-t border-gold-brand/5 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigateToTab(4); /* Switches to আরও/More tab */
            }}
            className="group/btn relative overflow-hidden font-bengali text-xs text-gold-brand hover:text-gold-brand/75 font-black flex items-center gap-1 cursor-pointer py-1 px-2 rounded-lg active:scale-95"
          >
            বিস্তারিত দেখুন
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5. আজকের শিক্ষা CARD */}
      <div className="bg-gradient-to-br from-card-brand to-gold-brand/5 border border-gold-brand/20 p-5 md:p-6 rounded-2xl relative shadow-md overflow-hidden">
        <div className="absolute right-[-5%] bottom-[-5%] opacity-10 pointer-events-none text-gold-brand">
          <Heart className="w-24 h-24 rotate-12" />
        </div>

        <h3 className="font-bengali text-sm font-black text-gold-brand mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-brand" />
          <EditableText id="home.title.daily_lesson" defaultText="আজকের শিক্ষা" />
        </h3>

        <div className="space-y-3.5">
          <blockquote className="font-bengali text-sm text-text-brand leading-relaxed font-bold italic border-l-2 border-gold-brand pl-3">
            <EditableText id="home.daily_lesson.text" defaultText="&ldquo;রাসূলুল্লাহ ﷺ বলেছেন — তোমাদের মধ্যে সে-ই উত্তম যে কুরআন শেখে এবং অন্যকে শেখায়।&rdquo;" isTextArea={true} />
          </blockquote>

          <div className="flex items-center justify-between pt-1">
            <EditableText id="home.daily_lesson.source" defaultText="সহিহ বুখারি" className="font-bengali text-[11px] text-gray-400 font-medium" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToTab(1); /* switches to হাদিস tab */
              }}
              className="group/btn relative overflow-hidden font-bengali text-xs font-black text-white px-3.5 py-2 rounded-xl gold-shimmer-btn cursor-pointer shadow-sm flex items-center gap-1 active:scale-95"
            >
              আরো পড়ুন
              <ArrowRight className="w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
