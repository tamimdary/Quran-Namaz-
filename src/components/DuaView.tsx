import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, 
  Sparkles, 
  ArrowLeft, 
  RotateCcw, 
  BookOpen, 
  Feather,
  Compass
} from "lucide-react";

interface DuaItem {
  id: string;
  arabic: string;
  pronunciation: string;
  meaning: string;
  reference: string;
}

interface DuaCategory {
  id: string;
  name: string;
  icon: string;
  desc: string;
  duas: DuaItem[];
}

// 8 Dua categories with 3-5 real duas each
const REAl_DUAS_DATA: DuaCategory[] = [
  {
    id: "morning",
    name: "সকালের দোয়া",
    icon: "🌅",
    desc: "দিনের শুরুতে বরকত ও হেফাজত লাভের মাসনুন আমলসমূহ",
    duas: [
      {
        id: "m1",
        arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
        pronunciation: "আল্লাহুম্মা বিকা আসবাহনা ওয়া বিকা আমসাইনা ওয়া বিকা নাহয়া ওয়া বিকা নামুতু ওয়া ইলাইহান নুশুর।",
        meaning: "হে আল্লাহ! আপনার অনুগ্রহেই আমরা সকালে পৌছেছি এবং আপনার অনুগ্রহেই বিকেলে পৌছেছি, আপনার নির্দেশেই আমরা জীবিত থাকি ও মৃত্যুবরণ করি। আর আপনার দিকেই আমাদের পুনরুত্থান হবে।",
        reference: "আবু দাউদ: ৫০৬৮, তিরমিজি: ৩৩৯১"
      },
      {
        id: "m2",
        arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ",
        pronunciation: "আসবাহনা ওয়া আসবাহাল মুলকু লিল্লাহি ওয়াল হামদু লিল্লাহি লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু।",
        meaning: "আমরা সকালে উপনীত হয়েছি এবং আল্লাহর সার্বভৌমত্বও সকালে উপনীত হয়েছে। সমস্ত প্রশংসা আল্লাহর যিনি একক, তাঁর কোনো শরিক নেই।",
        reference: "সহীহ মুসলিম: ৪/২০৮৮"
      },
      {
        id: "m3",
        arabic: "اللَّهُمَّ عافِني في بَدَني اللَّهُمَّ عافِني في سَمْعي اللَّهُمَّ عافِني في بَصَরি لا إلهَ إلا أنتَ",
        pronunciation: "আল্লাহুম্মা আফিনি ফি বাদানি, allahumma aafinee fee sam'ee, allahumma aafinee fee basaree, la ilaha illa anta.",
        meaning: "হে আল্লাহ, আমার শরীর সুস্থ রাখুন। হে আল্লাহ, আমার শ্রবণশক্তি সুস্থ রাখুন। হে আল্লাহ, আমার দৃষ্টিশক্তি সুস্থ রাখুন। আপনি ছাড়া কোনো সত্য ইলাহ নেই।",
        reference: "আবু দাউদ: ৫০৯০, আহমদ: ২০৪৩০"
      }
    ]
  },
  {
    id: "evening",
    name: "সন্ধ্যার দোয়া",
    icon: "🌙",
    desc: "সন্ধ্যা ও রাতে শয়তান ও অনিষ্ট থেকে বাঁচার দুয়াহসমূহ",
    duas: [
      {
        id: "ev1",
        arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
        pronunciation: "আল্লাহুম্মা বিকা আমসাইনা ওয়া বিকা আসবাহনা ওয়া বিকা নাহয়া ওয়া বিকা নামুতু ওয়া ইলাইহাল মাছীর।",
        meaning: "হে আল্লাহ! আপনার কল্যাণে আমরা সন্ধ্যায় উপনীত হয়েছি এবং আপনারই কল্যাণে সকালে উপনীত হয়েছে, আপনার নির্দেশেই জীইয়ে থাকি ও মরি। আর আপনার দিকেই সকলের গন্তব্যস্থল।",
        reference: "সুনানে আবু দাউদ: ৫০৬৮"
      },
      {
        id: "ev2",
        arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        pronunciation: "আউজু বিকালিমাতি-ল্লাহিত তাম্মাতি মিন শাররি মা খালাক।",
        meaning: "আমি আল্লাহর সৃষ্টি করা সকল অনিষ্ট ও মন্দ থেকে তাঁর সম্পূর্ণ বাক্যসমূহের আশ্রয় নিচ্ছি। (সন্ধ্যায় ৩ বার পড়লে বিষাক্ত দংশন ক্ষতি করবে না)",
        reference: "সহীহ মুসলিম: ২৭০৯, তিরমিজি: ৩৬০৪"
      },
      {
        id: "ev3",
        arabic: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
        pronunciation: "ইয়া হাইয়্যু ইয়া কাইয়্যুমু বিরাহমাতিকা আস্তাগিস, আশলিহ লী শানি কুল্লাহু, ওয়া লা তাকিলনী ইলা নাফসী তারফাতা আইন।",
        meaning: "হে চিরঞ্জীব, হে মহাবিশ্বের ধারক! আমি আপনার রহমতের উসিলায় উদ্ধার কামনা করছি। আপনি আমার সব অবস্থা সংশোধন করে দিন এবং চোখের পলকের জন্যও আমাকে আমার নিজের কাছে সোপর্দ করবেন না।",
        reference: "নাসায়ী: ১০৪০৫, হাকিম: ১/৪৩০"
      }
    ]
  },
  {
    id: "eating",
    name: "খাবারের দোয়া",
    icon: "🍎",
    desc: "খাবার শুরু, শেষ এবং মেহমানের কল্যাণে মাসনুন দোয়া",
    duas: [
      {
        id: "et1",
        arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
        pronunciation: "বিসমিল্লাহি ওয়া আলা বারাকাতিল্লাহ।",
        meaning: "আল্লাহর নামে এবং আল্লাহর বরকতের উপর ভরসা করে খাওয়া শুরু করলাম।",
        reference: "হাকিম: ৭০৮৪"
      },
      {
        id: "et2",
        arabic: "بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ",
        pronunciation: "বিসমিল্লাহি আওয়াল্লাহু ওয়া আখিরাহু।",
        meaning: "শুরুতে বিসমিল্লাহ বলতে ভুলে গেলে এটি পাঠ করতে হয়: আল্লাহর নামে এর শুরু এবং শেষ।",
        reference: "আবু দাউদ: ৩৭৬৭, তিরমিজি: ১৮৫৮"
      },
      {
        id: "et3",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
        pronunciation: "আলহামদু লিল্লাহিল্লাজি আত-আমানা ওয়া সাকানা ওয়া জা-আলানা মুসলিমিন।",
        meaning: "সমস্ত প্রশংসা আল্লাহর জন্য, যিনি আমাদেরকে খাইয়েছেন, পান করিয়েছেন এবং মুসলিম বানিয়েছেন।",
        reference: "আবু দাউদ: ৩৮৫০, তিরমিজি: ৩৪৫৭"
      }
    ]
  },
  {
    id: "sleep",
    name: "ঘুমানোর দোয়া",
    icon: "🛌",
    desc: "ঘুমানোর পূর্বে এবং ঘুম থেকে ওঠার সুন্দর জিকিরসমূহ",
    duas: [
      {
        id: "sl1",
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        pronunciation: "বিসমিকা আল্লাহুম্মা আমুতু ওয়া আহয়া।",
        meaning: "হে আল্লাহ! আপনারই নামে আমি মৃত্যুবরণ করি (ঘুমাই) এবং আপনারই নামে জীবিত হই (জেগে উঠি)।",
        reference: "সহীহ বুখারি: ৬৩২৪"
      },
      {
        id: "sl2",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        pronunciation: "আলহামদু লিল্লাহিল্লাজি আহয়ানা বা'দা মা আমাতানা ওয়া ইলাইহিন নুশুর।",
        meaning: "সমস্ত প্রশংসা আল্লাহর জন্য, যিনি আমাদের মৃত্যুর (ঘুমের) পর পুনরায় জীবিত করলেন। আর তাঁর দিকেই সকলের প্রত্যাবর্তন।",
        reference: "সহীহ বুখারি: ৬৩১৪"
      }
    ]
  },
  {
    id: "travel",
    name: "সফরের দোয়া",
    icon: "🚗",
    desc: "যানবাহনে আরোহণ ও দীর্ঘ ভ্রমণের সময় নিরাপত্তার দোয়া",
    duas: [
      {
        id: "tr1",
        arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        pronunciation: "সুবহানাল্লাজি সাখখারা লানা হাজা ওয়া মা কুন্না লাহু মুকরিনিন, ওয়া ইন্না ইলা রাব্বিনা লামুনকালিবুন।",
        meaning: "পবিত্র সেই সত্তা যিনি এই যানবাহনকে আমাদের বশীভূত করে দিয়েছেন, অথচ আমরা একে বশীভূত করতে সমর্থ ছিলাম না। আর নিশ্চয়ই আমরা আমাদের রবের দিকে প্রত্যাবর্তনকারী।",
        reference: "সূরা যুখরুফ: ১৩-১৪"
      }
    ]
  },
  {
    id: "mosque",
    name: "মসজিদের দোয়া",
    icon: "🕌",
    desc: "মসজিদে প্রবেশ এবং মসজিদ থেকে বের হওয়ার বরকতময় দুয়া",
    duas: [
      {
        id: "mq1",
        arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        pronunciation: "আল্লাহুম্মাফ তাহলী আবওয়াবা রাহমাতিকা।",
        meaning: "হে আল্লাহ! আমার জন্য আপনার রহমতের দরজাগুলো উন্মুক্ত করে দিন। (মসজিদে প্রবেশকালে পাঠ্য)",
        reference: "সহীহ মুসলিম: ৭১৩"
      },
      {
        id: "mq2",
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
        pronunciation: "আল্লাহুম্মা ইন্নী আসআলুকা মিন ফাদলিকা।",
        meaning: "হে আল্লাহ! আমি আপনার অনুগ্রহ প্রার্থনা করছি। (মসজিদ থেকে বের হওয়ার সময় পাঠ্য)",
        reference: "সহীহ মুসলিম: ৭১৩"
      }
    ]
  },
  {
    id: "parent",
    name: "পিতা-মাতার দোয়া",
    icon: "🤲",
    desc: "পিতা-মাতার দীর্ঘায়ু ও মাগফিরাতের জন্য চিরন্তন দোয়া",
    duas: [
      {
        id: "pr1",
        arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
        pronunciation: "রাব্বির হামহুমা কামা রাব্বায়ানি সাগিরা।",
        meaning: "হে আমাদের প্রতিপালক! পিতা-মাতার প্রতি দয়া করুন যেভাবে তারা শৈশবে আমাকে স্নেহ ও মমতায় লালন-পালন করেছেন।",
        reference: "সূরা বনী ইসরাঈল: ২৪"
      },
      {
        id: "pr2",
        arabic: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
        pronunciation: "রাব্বানাগ ফিরলী ওয়ালিওয়ালিদাইয়্যা ওয়া লিল মু'মিনিনা ইয়াওমা ইয়াকুমুল হিসাব।",
        meaning: "হে আমাদের পালনকর্তা! যেদিন হিসাব অনুষ্ঠিত হবে সেদিন আমাকে, আমার পিতা-মাতাকে এবং সমস্ত মুমিনদের ক্ষমা করে দিন।",
        reference: "সূরা ইব্রাহীম: ৪১"
      }
    ]
  },
  {
    id: "exam",
    name: "পরীক্ষা ও কঠিন কাজের দোয়া",
    icon: "📝",
    desc: "মনোযোগ বৃদ্ধি, স্মরণশক্তি এবং জটিলতা থেকে মুক্তির দোয়া",
    duas: [
      {
        id: "ex1",
        arabic: "رَّبِّ زِدْنِي عِلْمًا",
        pronunciation: "রাব্বি জিদনি ইলমা।",
        meaning: "হে আমার পালনকর্তা! আমার জ্ঞান বৃদ্ধি করে দিন।",
        reference: "সূরা ত্বহা: ১১৪"
      },
      {
        id: "ex2",
        arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي",
        pronunciation: "রাব্বিশ রাহলী সাদরী, ওয়া ইয়াসসিরলী আমরী, ওয়াহলুল উকদাতাম মিল লিসানী, ইয়াফকাহু কাওলী।",
        meaning: "হে আমার রব! আমার বক্ষকে জ্ঞানের আলোয় প্রশস্ত করে দিন এবং আমার দ্বায়িত্ব ও কর্তব্যকে আমার জন্য সহজ করে দিন। আর আমার জিব্বার জড়িয়ে যাওয়া জড়তা খুলে দিন যাতে মানুষ আমার কথা সঠিকভাবে বুঝতে পারে।",
        reference: "সূরা ত্বহা: ২৫-২৮"
      },
      {
        id: "ex3",
        arabic: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
        pronunciation: "আল্লাহুম্মা লা সাহলা ইল্লা মা জাআলতাহু সাহলান, ওয়া আন্তা তাজআলুল হাজনা ইজা শি'তা সাহলা।",
        meaning: "হে আল্লাহ! কোনো কিছুই সহজ নয় কেবলমাত্র তা ছাড়া যাকে আপনি সহজ করে দেন। আর পরম শক্তিময় আপনি চাইলে ঘোরতম কঠিনকেও সহজ ও অবলীলা করে দিতে পারেন।",
        reference: "সহীহ ইবনে হিব্বান: ৯৭৪"
      }
    ]
  }
];

interface DuaViewProps {
  initialSubTab?: "dua" | "tasbih";
}

export default function DuaView({ initialSubTab = "dua" }: DuaViewProps) {
  // Tabs for subview: "dua" or "tasbih"
  const [activeSubTab, setActiveSubTab] = useState<"dua" | "tasbih">(initialSubTab);

  useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);
  
  const [selectedCat, setSelectedCat] = useState<DuaCategory | null>(null);

  // Tasbih Counter states
  const [tasbihCount, setTasbihCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tasbih_count");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const [tasbihPreset, setTasbihPreset] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tasbih_preset");
      return saved || "সুবহানাল্লাহ";
    }
    return "সুবহানাল্লাহ";
  });

  const [tasbihTarget, setTasbihTarget] = useState<number>(33);
  const [totalTasbihSessions, setTotalTasbihSessions] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tasbih_total_sessions");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  // Save details dynamically to localStorage
  useEffect(() => {
    localStorage.setItem("tasbih_count", tasbihCount.toString());
    localStorage.setItem("tasbih_preset", tasbihPreset);
    localStorage.setItem("tasbih_total_sessions", totalTasbihSessions.toString());
  }, [tasbihCount, tasbihPreset, totalTasbihSessions]);

  const lastTasbihEventRef = useRef<number>(0);

  const handleTasbihTap = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(60);
    }

    setTasbihCount((prev) => {
      const next = prev + 1;
      if (next % tasbihTarget === 0) {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
        setTotalTasbihSessions(p => p + 1);
      }
      return next;
    });
  };

  const handleTasbihButtonPress = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const now = Date.now();
    if (now - lastTasbihEventRef.current < 150) {
      return;
    }
    lastTasbihEventRef.current = now;
    handleTasbihTap();
  };

  const resetTasbih = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(120);
    }
    setTasbihCount(0);
  };

  const changePreset = (presetName: string, target: number) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(40);
    }
    setTasbihPreset(presetName);
    setTasbihTarget(target);
    setTasbihCount(0);
  };

  const ringProgressPercent = Math.min((tasbihCount / tasbihTarget) * 100, 100);

  return (
    <div className="space-y-6 w-full max-w-lg mx-auto pb-6">
      {/* Subtab selection header */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl p-1 bg-card-brand/50 border border-gold-brand/10 select-none">
          <button
            onClick={() => {
              setActiveSubTab("dua");
              setSelectedCat(null);
            }}
            className={`px-5 py-1.5 rounded-lg text-xs font-bengali font-bold cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "dua" 
                ? "bg-gold-brand text-black shadow font-black" 
                : "text-gray-400 dark:text-gray-400 font-medium"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> প্রয়োজনীয় দোয়া
          </button>
          <button
            onClick={() => setActiveSubTab("tasbih")}
            className={`px-5 py-1.5 rounded-lg text-xs font-bengali font-bold cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "tasbih" 
                ? "bg-gold-brand text-black shadow font-black" 
                : "text-gray-400 dark:text-gray-400 font-medium"
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> তাসবিহ কাউন্টার
          </button>
        </div>
      </div>

      {activeSubTab === "dua" && !selectedCat && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="glass-effect p-5 rounded-2xl relative overflow-hidden border border-gold-brand/10 shadow-sm">
            <div className="absolute right-[-14%] top-[-25%] opacity-10 pointer-events-none text-gold-brand">
              <Heart className="w-48 h-48 -rotate-12" />
            </div>
            <span className="font-poppins text-[10px] uppercase tracking-widest text-gold-brand font-bold bg-gold-brand/10 px-2.5 py-1 rounded-full">
              Duas & Supplications
            </span>
            <h2 className="font-bengali text-2xl font-black mt-3 text-text-brand leading-snug">
              দৈনন্দিন মাসনুন দোয়া
            </h2>
            <p className="font-bengali text-xs text-gray-400 mt-2 leading-relaxed">
              পবিত্র কুরআন ও বিশুদ্ধ সূত্র থেকে সংকলিত ক্যাটাগরি থেকে দোয়া পাঠ করুন।
            </p>
          </div>

          {/* Grid of category cards */}
          <div className="space-y-3.5">
            <h3 className="font-bengali text-sm font-bold text-text-brand flex items-center gap-2 pl-1">
              <Sparkles className="w-4 h-4 text-gold-brand" />
              দোয়া ক্যাটাগরি নির্বাচন করুন
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {REAl_DUAS_DATA.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCat(cat)}
                  className="p-4 bg-card-brand border border-gold-brand/10 hover:border-gold-brand/25 rounded-2xl cursor-pointer transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group shadow-sm active:scale-98"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl filter drop-shadow-sm group-hover:scale-105 transition-transform">
                      {cat.icon}
                    </span>
                    <span className="font-bengali text-[9px] bg-gold-brand/10 text-gold-brand font-black px-2 py-0.5 rounded-full">
                      {cat.duas.length} টি দোয়া
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bengali text-[15px] font-bold text-text-brand group-hover:text-gold-brand transition-colors">
                      {cat.name}
                    </h4>
                    <p className="font-bengali text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="w-full h-[2px] bg-gold-brand/5 group-hover:bg-gold-brand/20 transition-all rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Static Reminder */}
          <div className="border border-gold-brand/10 bg-gold-brand/5 p-4 rounded-xl flex gap-3 items-start">
            <Feather className="w-5 h-5 text-gold-brand shrink-0 mt-0.5" />
            <p className="font-bengali text-xs text-gray-400 leading-relaxed">
              রাসূলুল্লাহ (সাঃ) বলেছেন: <strong className="text-white">“দোয়া হলো ইবাদতের মূল মগজ।”</strong> আল্লাহর দরবারে দোয়ার হাত বাড়ানো মুমিনের পরম সৌন্দর্য।
            </p>
          </div>
        </div>
      )}

      {/* DETAILED DUA LIST */}
      {activeSubTab === "dua" && selectedCat && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedCat(null)}
              className="px-3 py-1.5 rounded-xl border border-gold-brand/15 bg-card-brand/35 text-gold-brand font-bengali text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-gold-brand/10 transition-all active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> তালিকা ফিরে যান
            </button>
            <div className="font-bengali text-xs text-gray-400">
              ক্যাটাগরি: <strong className="text-gold-brand">{selectedCat.name}</strong>
            </div>
          </div>

          <div className="bg-gradient-to-br from-card-brand to-gold-brand/5 border border-gold-brand/15 p-5 rounded-2xl relative overflow-hidden text-center space-y-1">
            <div className="absolute top-0 right-0 py-1 px-4 text-2xl opacity-20 pointer-events-none">
              {selectedCat.icon}
            </div>
            <h3 className="font-bengali text-xl font-black text-text-brand flex items-center justify-center gap-2">
              <span>{selectedCat.icon}</span> {selectedCat.name}
            </h3>
            <p className="font-bengali text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
              {selectedCat.desc}
            </p>
          </div>

          {/* List of Duas */}
          <div className="space-y-4">
            {selectedCat.duas.map((dua, index) => (
              <div 
                key={dua.id} 
                className="bg-card-brand border border-gold-brand/10 p-5 rounded-2xl space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between pb-2 border-b border-gold-brand/5">
                  <span className="font-poppins text-xs font-bold bg-gold-brand/10 text-gold-brand w-7 h-7 flex items-center justify-center rounded-lg">
                    {index + 1}
                  </span>
                  <span className="font-poppins text-[10px] text-gray-400 uppercase tracking-widest font-black">
                    Dua #{index + 1}
                  </span>
                </div>

                <p className="font-amiri text-2xl text-right text-text-brand leading-[1.9] font-medium tracking-wide my-2 select-all select-none">
                  {dua.arabic}
                </p>

                <div className="w-full h-[1px] bg-gold-brand/5 my-3" />

                <div className="space-y-1 bg-black/10 p-3 rounded-lg border border-gold-brand/5">
                  <span className="font-bengali text-[9px] text-gold-brand font-black bg-gold-brand/10 px-2 py-0.5 rounded-full inline-block">
                    উচ্চারণ
                  </span>
                  <p className="font-bengali text-sm text-gray-200 leading-relaxed font-semibold">
                    {dua.pronunciation}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="font-bengali text-[9px] text-blue-400 font-black bg-blue-500/10 px-2 py-0.5 rounded-full inline-block">
                    অর্থ
                  </span>
                  <p className="font-bengali text-xs md:text-sm text-gray-300 leading-relaxed">
                    “{dua.meaning}”
                  </p>
                </div>

                <div className="pt-2 text-right border-t border-gold-brand/5 text-[10px] text-gray-500 font-bengali font-medium">
                  উৎস: {dua.reference}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================== TASBIH HUB ======================== */}
      {activeSubTab === "tasbih" && (
        <div className="space-y-6">
          <div className="glass-effect p-5 rounded-2xl relative overflow-hidden border border-gold-brand/10 shadow-sm text-center">
            <span className="font-poppins text-[10px] uppercase tracking-widest text-gold-brand font-black bg-gold-brand/10 px-2.5 py-1 rounded-full">
              Interactive Digital Dhikr
            </span>
            <h2 className="font-bengali text-xl font-bold mt-2.5 text-text-brand">
              ডিজিটাল তাসবিহ গণক
            </h2>
            <p className="font-bengali text-xs text-gray-400 mt-1.5 leading-relaxed">
              সহজে আঙ্গুল দিয়ে স্পর্শ করে তাসবিহ ও জিকির গণনা করুন। ভাইব্রেশন প্রতিক্রিয়া যুক্ত জিকির ইঞ্জিন।
            </p>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <h4 className="font-bengali text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-1">পছন্দসই জিকির নির্ধারণ করুন:</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: "সুবহানাল্লাহ", eng: "Subhanallah", target: 33 },
                { name: "আলহামদুলিল্লাহ", eng: "Alhamdulillah", target: 33 },
                { name: "আল্লাহু আকবার", eng: "Allahu Akbar2", target: 34 }
              ].map((item) => {
                const isCur = tasbihPreset === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => changePreset(item.name, item.target)}
                    className={`font-bengali p-2.5 rounded-xl text-xs font-bold flex flex-col justify-center items-center gap-0.5 border cursor-pointer transition-all active:scale-95 ${
                      isCur 
                        ? "bg-gold-brand text-black border-gold-brand shadow-sm font-black" 
                        : "bg-card-brand text-gray-400 border-gold-brand/10 hover:border-gold-brand/20"
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className="text-[9px] opacity-70 font-semibold">{item.target} বার</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Circular Counter */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-gray-300 dark:text-gray-800"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-gold-brand"
                  strokeWidth="5"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - ringProgressPercent / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>

              <button
                onClick={handleTasbihButtonPress}
                onTouchStart={handleTasbihButtonPress}
                className="w-44 h-44 rounded-full bg-gradient-to-br from-card-brand to-black/30 border-2 border-gold-brand/25 flex flex-col items-center justify-center cursor-pointer shadow-lg active:scale-95 active:border-gold-brand/70 select-none"
              >
                <span className="font-poppins text-xs uppercase tracking-widest text-gold-brand font-black opacity-80 mb-1">
                  {tasbihPreset}
                </span>
                
                <span className="font-poppins text-4xl font-extrabold text-white tracking-wider my-0.5">
                  {tasbihCount}
                </span>

                <div className="text-[10px] text-gray-500 font-bengali flex items-center justify-center gap-1 font-bold bg-gold-brand/10 text-gold-brand/90 px-2.5 py-0.5 rounded-full mt-2">
                  টার্গেট: {tasbihTarget} বার
                </div>
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center w-full max-w-xs mt-6 px-4">
              <div className="flex flex-col items-start">
                <span className="font-bengali text-[10px] text-gray-500">মোট সম্পন্ন চক্র:</span>
                <span className="font-poppins text-xs font-black text-gold-brand bg-gold-brand/10 px-2 py-0.5 rounded-md mt-0.5">
                  {totalTasbihSessions} টি
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetTasbih}
                  className="p-2.5 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-xs font-bold font-bengali active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> রিসেট
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card-brand/50 border border-gold-brand/10 p-4 rounded-xl flex gap-3.5 items-center justify-center text-center">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full shrink-0 animate-pulse" />
            <p className="font-bengali text-xs text-gray-400">
              চক্র পূরণ হতে বাকি জিকির: <strong className="text-white font-poppins">{Math.max(tasbihTarget - (tasbihCount % tasbihTarget), 0)}</strong> বার।
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
