import React, { useState, useEffect } from "react";
import DuaView from "./DuaView.tsx";
import {
  Mail,
  MessageSquare,
  Share2,
  Bell,
  Languages,
  BookOpen,
  CheckCircle,
  Users,
  Compass,
  History,
  TrendingUp,
  Shield,
  Coins,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Flame,
  ShieldAlert,
  MapPin,
  Moon,
  Sun,
  Award,
  Trophy,
  Zap,
  HelpCircle,
  Plus,
  Minus,
  CheckSquare,
  Square,
  Check,
  Star,
  Activity,
  Smile,
  BookOpenCheck,
  Crown,
  ChevronLeft,
  Heart,
  CheckCircle2,
  Settings
} from "lucide-react";
import { contactData } from "../data";
import { motion, AnimatePresence } from "motion/react";

// Helper function to render premium, high-contrast, beautiful vector icons for each module segment
const renderMoreIcon = (id: string, className: string = "w-5 h-5") => {
  switch (id) {
    case "dua":
      return <Heart className={`${className} stroke-[2.2]`} />;
    case "tasbih":
      return <Smile className={`${className} stroke-[2.2]`} />;
    case "qibla":
      return <Compass className={`${className} stroke-[2.2]`} />;
    case "zakat":
      return <Coins className={`${className} stroke-[2.2]`} />;
    case "history":
      return <History className={`${className} stroke-[2.2]`} />;
    case "ai_assistant":
      return <Sparkles className={`${className} stroke-[2.2]`} />;
    case "kids":
      return <Shield className={`${className} stroke-[2.2]`} />;
    case "certificate":
      return <Crown className={`${className} stroke-[2.2]`} />;
    case "dashboard":
      return <Activity className={`${className} stroke-[2.2]`} />;
    case "ramadan":
      return <Moon className={`${className} stroke-[2.2]`} />;
    case "gamification":
      return <Trophy className={`${className} stroke-[2.2]`} />;
    case "settings":
      return <Settings className={`${className} stroke-[2.2]`} />;
    default:
      return <Sparkles className={`${className} stroke-[2.2]`} />;
  }
};

interface ProphetItem {
  id: string;
  name: string;
  title: string;
  summary: string;
  miracle: string;
  bgGradient: string;
}

interface SahabiItem {
  name: string;
  title: string;
  summary: string;
  achievement: string;
}

interface BattleItem {
  name: string;
  year: string;
  muslimsCount: string;
  enemiesCount: string;
  description: string;
  lesson: string;
}

interface TimelineEvent {
  year: string;
  hijri: string;
  title: string;
  desc: string;
  icon: string;
}

const PROPHETS_DATA: ProphetItem[] = [
  {
    id: "adam",
    name: "হযরত আদম (আঃ)",
    title: "আবুল বাশার (মানবজাতির পিতা)",
    summary: "পৃথিবীর প্রথম মানুষ ও প্রথম নবী। মহান আল্লাহ নিজ কুদরতে মাটি দিয়ে সৃষ্টি করেন এবং ফেরেস্তাদের মাধ্যমে সিজদা করান। জান্নাত থেকে পৃথিবীতে প্রেরণের পর তাঁর থেকে মানববংশের সূচনা ঘটে।",
    miracle: "সকল সৃষ্টির নামকরণ শিক্ষা দান করা এবং সরাসরি জান্নাতে সৃষ্টি লাভ করা।",
    bgGradient: "from-amber-900/40 to-amber-950/20"
  },
  {
    id: "nuh",
    name: "হযরত নূহ (আঃ)",
    title: "নাজীউল্লাহ (আল্লাহর পরিত্রাণপ্রাপ্ত)",
    summary: "ইসলামের প্রথম রাসুল। দীর্ঘ ৯৫০ বছর ধরে কওমকে একত্ববাদের দাওয়াত দেন। অবিশ্বাসীদের চরম ধৃষ্টতার পর আল্লাহর নির্দেশে কাঠের বিশাল বহর (কিস্তি/নৌকা) তৈরি করেন এবং মহাপ্লাবন থেকে মুমিনদের রক্ষা করেন।",
    miracle: "কাঠের অলৌকিক কিস্তি তৈরি ও জোড়ায় জোড়ায় পৃথিবীতে জীব ধরে রেখে মহাপ্লাবন অতিক্রম করা।",
    bgGradient: "from-cyan-950/40 to-indigo-950/25"
  },
  {
    id: "ibrahim",
    name: "হযরত ইবরাহিম (আঃ)",
    title: "খলিলুল্লাহ (আল্লাহর বন্ধু)",
    summary: "মুসলিম উম্মাহর পিতা এবং তাওহীদের মহান প্রতীক। স্বৈরাচারী নমরুদের একশ্বরবাদী বিরোধিতায় অগ্নিকুণ্ডে নিক্ষিপ্ত হয়েও অলৌকিকভাবে বেঁচে যান। আল্লাহ তাঁর ছেলে ইসমাইল (আঃ) কে কুরবানি দেওয়ার পরীক্ষার বিনিময়ে কুরবানি উৎসব জারী করেন ও পবিত্র কাবার পুনর্নির্মাণ করেন।",
    miracle: "নমরুদের লেলিহান অগ্নিকুণ্ডে নিক্ষিপ্ত করার পর আগুন তাঁর জন্য শান্তিদায়ক বাগানে পরিণত হওয়া।",
    bgGradient: "from-rose-950/40 to-amber-950/25"
  },
  {
    id: "musa",
    name: "হযরত মূসা (আঃ)",
    title: "কালিমুল্লাহ (যাঁর সাথে আল্লাহ কথা পেতেন)",
    summary: "বনী ইসরাঈলকে ফেরাউনের অবর্ণনীয় দাসত্ব থেকে মুক্ত করতে প্রেরিত রাসুল। ফেরাউনের জাদুকরদের লাঠির অলৌকিক সাপে রূপান্তর দ্বারা পরাস্ত করেন। লোহিত সাগরের পানির মাঝ দিয়ে অলৌকিক রাস্তা তৈরি করে বনী ইসরাঈলকে পার করেন এবং তাওরাত কিতাব লাভ করেন।",
    miracle: "লাঠি সাপ হওয়া, হাতের বগল উজ্জ্বল হওয়া ও বিশাল সমুদ্র দ্বিখণ্ডিত করে রাস্তা তৈরি করা।",
    bgGradient: "from-blue-950/40 to-sky-950/25"
  },
  {
    id: "isa",
    name: "হযরত ঈসা (আঃ)",
    title: "রুহুল্লাহ (আল্লাহর আত্মা)",
    summary: "পিতা ছাড়াই কুমারী মারয়ামের গর্ভে পবিত্র অলৌকিক জন্ম লাভ করেন। শৈশবে দোলনায় দাঁড়িয়ে কথা বলেন এবং অন্ধ ও কুষ্ঠ রোগীদের সুস্থ করতেন। আল্লাহ তাঁকে ইহুদীদের চক্রান্ত থেকে মুক্ত করতে জীবিত অবস্থায় আকাশে তুলে নেন এবং কিয়ামতের পূর্বে তিনি পুনরায় পৃথিবীতে আগমন করবেন।",
    miracle: "দোলনায় কথা বলা, মৃত ব্যক্তিকে আল্লাহর হুকুমে জীবিত করা ও স্পর্শে কুষ্ঠরোগ ও অন্ধত্ব নিরাময় করা।",
    bgGradient: "from-emerald-950/40 to-teal-950/25"
  }
];

const SAHABIS_DATA: SahabiItem[] = [
  {
    name: "হযরত আবু বকর সিদ্দিক (রাঃ)",
    title: "সিদ্দিক (মহামান্য সত্যবাদী)",
    summary: "ইসলামের প্রথম খলিফা এবং রাসুলুল্লাহর (সাঃ) সুহৃদ হিজরতের সাথি। মেরাজের সত্যতা সবচেয়ে আগে স্বীকার করায় 'সিদ্দিক' উপাধি পান। নিজের যাবতীয় রাজকীয় ব্যবসা ও সম্পদ ইসলামের জন্য বিসর্জন দিয়েছেন।",
    achievement: "ইসলামের ইতিহাসে প্রথম কুরআন শরীফকে গ্রন্থাকারে একত্রিতকরণের চূড়ান্ত সূচনা করেন।"
  },
  {
    name: "হযরত ওমর ইবনুল খাত্তাব (রাঃ)",
    title: "ফারুক (সত্য-মিথ্যার প্রভেদকারী)",
    summary: "ইসলামের দ্বিতীয় খলিফা। এক প্রলয়ংকরী ন্যায়বিচারের প্রতীক। তাঁর সময়কালে অর্ধ-পৃথিবীতে ইসলামের ইনসাফপূর্ণ শাসন প্রতিষ্ঠিত হয় এবং মুসলিমদের এক অপ্রতিরোধ্য সাম্রাজ্য গড়ে ওঠে।",
    achievement: "হিজরি সাল (হিজরত বর্ষ গণনা) চালু করেন এবং বিচারালয় ও রাষ্ট্রের নিরাপত্তা ব্যবস্থা সুসংহত করেন।"
  },
  {
    name: "হযরত ওসমান জিন্নুরাইন (রাঃ)",
    title: "জিন্নুরাইন (দুই জ্যোতির অধিকারী)",
    summary: "ইসলামের ৩য় খলিফা। অত্যন্ত বিনয়ী, পরোপকারী ও দানশীল সাহাবী। রাসূলুল্লাহর দুই কন্যা রুকাইয়া ও উম্মে কুলছুমকে বিয়ে করায় 'জিন্নুরাইন' উমর উপাধি লাভ করেন। নিজের সম্পদ দিয়ে মদিনার ক্রাইসিস দূর করতে কূয়া ক্রয় করেন।",
    achievement: "পবিত্র কুরআনকে এক প্রমিত বর্ণলিপিতে সাজিয়ে পৃথিবীর সর্বত্র প্রচারের চূড়ান্ত স্থপতি।"
  },
  {
    name: "হযরত আলী ইবনে আবি তালিব (রাঃ)",
    title: "আসাদুল্লাহ (আল্লাহর সিংহ)",
    summary: "ইসলামের ৪র্থ খলিফা ও রাসূলের জামাতা। জ্ঞান সমুদ্রের প্রবেশদ্বার এবং প্রখ্যাত মহাবীর সাহাবী। খাইবার দুর্গ বিজয়ের অন্যতম নায়ক ছিলেন এবং জ্ঞানের গভীরতায় ও আল্লাহর প্রতি তাকওয়ায় অন্যন্য ছিলেন।",
    achievement: "ইসলামিক আইনশাস্ত্র (ফিকহ) এবং কোরআনের ব্যাকরণ প্রণয়নে অনবদ্য দিকনির্দেশক ছিলেন।"
  },
  {
    name: "হযরত খালেদ বিন ওয়ালিদ (রাঃ)",
    title: "সাইফুল্লাহ (আল্লাহর তরবারি)",
    summary: "ইসলামের অপরাজেয় সর্বাধিনায়ক মহাবীর সাহাবী। নবুওয়াতের যুগে ও পরবর্তী খেলাফতকালে বহু যুদ্ধে অংশগ্রহণ করেন এবং একটি যুদ্ধও হারেননি। রোমান এবং পারস্যের সুবিশাল বাহিনীকে পরাজিত করে মুসলিমদের সীমানা বিস্তৃত করেন।",
    achievement: "শত শত রণাঙ্গনে নিজের তেজস্বী রণকৌশল ব্যবহার করে রোমান সাম্রাজ্যকে স্তব্ধ করে দেন।"
  }
];

const BATTLES_DATA: BattleItem[] = [
  {
    name: "বদরের যুদ্ধ",
    year: "২ হিজরি (৬২৪ খ্রিস্টাব্দ)",
    muslimsCount: "৩১৩ জন",
    enemiesCount: "১০০০ জন",
    description: "ইসলামের ইতিহাসের প্রথম এবং সর্বাধিক রণকৌশলগত যুদ্ধ। মক্কার মূর্তিপূজারী কাফেরদের ১০০০ সুসজ্জিত সেনার বিরুদ্ধে মাত্র ৩১৩ জন অত্যন্ত দুর্বল ও নিরস্ত্র সাহাবীর বিজয় ঘটে। এতে অত্যাচারী কাফের দলনেতা আবু জাহেল নিহত হয়।",
    lesson: "বিজয় সৈন্যসংখ্যার আধিক্য বা উন্নত অস্ত্রের উপর নয়, বরং দৃঢ় ঈমান ও আল্লাহর গায়েবী সাহায্যের ওপর নির্ভর করে।"
  },
  {
    name: "উহুদের যুদ্ধ",
    year: "৩ হিজরি (৬২৫ খ্রিস্টাব্দ)",
    muslimsCount: "৭০০ জন",
    enemiesCount: "৩০০০ জন",
    description: "মদিনার উহুদ পাহাড়ের পাদদেশে সংঘটিত হওয়া ২য় প্রধান যুদ্ধ। গিরিপথ পাহারা দেওয়ার জন্য নির্দেশিত তীরন্দাজদের সামান্য অসাবধানতা ও রাসুলের নির্দেশনা ভঙ্গের কারণে অর্জিত বিজয় ক্ষণস্থায়ী বিপযর্য়ে রূপ নেয়। এতে আমির হামযা (রাঃ) সহ ৭০ জন শ্রেষ্ঠ সাহাবী শাহাদাত বরণ করেন।",
    lesson: "যেকোনো কঠিন পরিস্থিতিতে নেতার দেওয়া আদেশ ও সুন্নাহর নিঃশর্ত আনুগত্য রক্ষার জ্বলন্ত উদাহরণ।"
  },
  {
    name: "খন্দকের যুদ্ধ (পরিখার যুদ্ধ)",
    year: "৫ হিজরি (৬২৭ খ্রিস্টাব্দ)",
    muslimsCount: "৩০০০ জন",
    enemiesCount: "১০,০০০ জন কুরাইশ জোট",
    description: "মক্কার সম্মিলিত মুশরিক দল যখন মদিনা সমূলে ধ্বংস করতে অবরুদ্ধ করার পরিকল্পনা করে, তখন হযরত সালমান ফারসীর (রাঃ) পরামর্শে প্রথমবারের মতো মদিনার চারপাশে বিশাল পরিখা খনন প্রতিরক্ষামূলক প্রযুক্তি ব্যবহার করে জয়লাভ করা হয়।",
    lesson: "ইসলামিক শাসন ব্যবস্থায় পারস্পরিক পরামর্শ ও অভিনব বৈজ্ঞানিক বুদ্ধি ব্যবহারের অতুলনীয় উপযোগ রক্ষা।"
  }
];

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: "৫৭০ খ্রিস্টাব্দ",
    hijri: "হিজরত পূর্ব ৫৩ বছর",
    title: "নবী মুহাম্মদ (সাঃ) এর পবিত্র জন্ম",
    desc: "কুরাইশ বংশের সম্ভ্রান্ত হাশেমী পরিবারে পিতা আব্দুল্লাহর পরলোকগমনের পর মা আমিনার কোল আলোকিত করে মহামানব হযরত মুহাম্মদ (সাঃ) পৃথিবীতে শুভাগমন করেন।",
    icon: "🌸"
  },
  {
    year: "৬১০ খ্রিস্টাব্দ",
    hijri: "হিজরত পূর্ব ১৩ বছর",
    title: "হেরা গুহায় ওহী লাভ ও নবুওয়াত প্রাপ্তি",
    desc: "চল্লিশ বছর বয়সে মক্কার জাবালে নূরের হেরা গুহায় আল্লাহর ফেরেশতা জিব্রাইল (আঃ) এর মাধ্যমে 'ইকরা' (পড়ুন) বাণী নিয়ে সর্বপ্রথম ওহী ও নবুওয়াত লাভ করেন।",
    icon: "📖"
  },
  {
    year: "৬২২ খ্রিস্টাব্দ",
    hijri: "১ হিজরি",
    title: "ঐতিহাসিক মদিনায় হিজরত",
    desc: "মক্কার কাফেরদের সীমাহীন ও বর্বরোচিত জুলুমের কারণে আল্লাহর নির্দেশানুযায়ী নিজ মাতৃভূমি মক্কা ত্যাগ করে মদিনায় হিজরত করেন।",
    icon: "🕌"
  }
];

const KIDS_STORIES = [
  {
    id: "kids_pro_adam",
    title: "হযরত আদম (আঃ) ও সুন্দর জান্নাত",
    icon: "🌳",
    content: "আল্লাহ প্রথম মানুষ হযরত আদম (আঃ) কে তাঁর কুদরতি হাত দিয়ে মাটি থেকে তৈরি করলেন। তারপর তাঁকে অতি সুন্দর জান্নাতে থাকতে দিলেন। জান্নাতে ছিল মজার মজার মিষ্টি ফল, সুন্দর ঝরনা আর চমৎকার সুখের দিন। আল্লাহ আদম (আঃ)-কে সব জিনিসের নাম শিখিয়েছিলেন যাতে তিনি অনেক জ্ঞানী হন।",
    lesson: "আল্লাহর নির্দেশ মেনে চলা এবং শয়তানের ধোঁকা থেকে দূরে থাকা।"
  },
  {
    id: "kids_pro_nuh",
    title: "হযরত নূহ (আঃ) ও বিশাল কিস্তি",
    icon: "🚢",
    content: "নূহ (আঃ) এর অন্যায়কারী কওম যখন আল্লাহর চমৎকার সৎ উপদেশ শুনল না, তখন আল্লাহ পৃথিবীতে এক মহাপ্লাবন দিলেন। আল্লাহ নূহ (আঃ)-কে একটি বিশাল কাঠের নৌকা (কিস্তি) তৈরির নির্দেশ দিলেন। তিনি ও তাঁর চমৎকার ঈমানদার সাথীরা এবং প্রতিটা পশুপাখির এক একটি জোড়া সে নৌকায় উঠলো। আল্লাহর ইচ্ছায় তাঁরা সবাই বেঁচে গেল!",
    lesson: "সবসময় আল্লাহর ওপর ভরসা রাখা এবং কঠিন বিপদেও ধৈর্যশীল থাকা।"
  },
  {
    id: "kids_pro_ibrahim",
    title: "হযরত ইব্রাহিম (আঃ) ও ফুলের বাগান",
    icon: "🌹",
    content: "খারাপ রাজা নমরুদ নবী ইব্রাহিম (আঃ) কে এক বিশাল লেলিহান অগ্নিকুণ্ডে ফেলে দিয়েছিল। কিন্তু নবী ইব্রাহিম (আঃ) একটুও ভয় পাননি, কারণ তিনি আল্লাহকে ভালোবাসতেন। আল্লাহর হুকুমে সেই ভয়ানক গরম আগুনটি তাঁর জন্য চমৎকার সুশীতল ফুলের বাগান হয়ে গেল! ঈমানদারদেরকে আল্লাহ এভাবেই সাহায্য করেন।",
    lesson: "একমাত্র আল্লাহর ওপর ঈমান রাখলে তিনি যেকোনো কঠিন বিপদ থেকে রক্ষা করেন।"
  },
  {
    id: "kids_pro_yunus",
    title: "হযরত ইউনুস (আঃ) ও বড় মাছ",
    icon: "🐳",
    content: "নবী ইউনুস (আঃ) যখন সমুদ্রের এক বড় ঝড়ে পড়লেন, তখন বিশাল এক তিমি মাছ আল্লাহর ইশারায় তাঁকে গিলে ফেলে। মাছের পেটে অন্ধকার অবস্থায় তিনি একটুও আশা হারাননি, বরং চমৎকার এক তওবা বা ক্ষমা প্রার্থনা করেন। আল্লাহ তাঁর ডাক শুনলেন এবং মাছটিকে বললেন নিরাপদে তাঁকে সমুদ্রের তীরে ফিরিয়ে দিতে।",
    lesson: "ভুল হলে সাথে সাথে আল্লাহর কাছে ক্ষমা প্রার্থনা করা উচিত, তিনি ক্ষমাশীল।"
  },
  {
    id: "kids_pro_solaiman",
    title: "হযরত সোলাইমান (আঃ) ও পিঁপড়ের কথা",
    icon: "🐜",
    content: "হযরত সোলাইমান (আঃ)-কে আল্লাহ চমৎকার দান করেছিলেন—তিনি সব পশুপাখি, জিন ও ক্ষুদ্র পিঁপড়ের ভাষাও বুঝতেন! একদিন তাঁর বিশাল সেনাবাহিনীর চলার পথে এক ছোট্ট পিঁপড়ে অন্য পিঁপড়েদের বলছিল, 'তাড়াতাড়ি পালাও, পাছে সোলাইমান ও তাঁর বাহিনী তোমাদের পিষে ফেলে!' সোলাইমান (আঃ) তা শুনে হেসে হাসিমুখে আল্লাহর কৃতজ্ঞতা জানালেন।",
    lesson: "আল্লাহর দেওয়া সব নেয়ামতের জন্য সবসময় মন থেকে শুকরিয়া আদায় করা।"
  }
];

const KIDS_QUIZ_QUESTIONS = [
  {
    question: "আমাদের ইসলাম ধর্মের মূল পবিত্র কিতাবের নাম কী?",
    options: ["কোরআন মাজীদ", "হাদিস শরীফ", "তাওরাত", "যবুর"],
    answer: 0,
    hint: "এটি আল্লাহর সবশেষ ও শ্রেষ্ঠ আসমানী কিতাব"
  },
  {
    question: "আমাদের শেষ ও প্রিয় নবীর নাম কী?",
    options: ["হযরত আদম (আঃ)", "হযরত মূসা (আঃ)", "হযরত মুহাম্মদ (সাঃ)", "হযরত ঈসা (আঃ)"],
    answer: 2,
    hint: "তিনি মক্কায় জন্মগ্রহণ করেছিলেন এবং মদিনায় তাঁর রওজা মোবারক রয়েছে"
  },
  {
    question: "মুসলমানদের দৈনিক কত ওয়াক্ত ফরজ নামাজ পড়তে হয়?",
    options: ["২ ওয়াক্ত", "৩ ওয়াক্ত", "৪ ওয়াক্ত", "৫ ওয়াক্ত"],
    answer: 3,
    hint: "ফজর, যোহর, আসর, মাগরিব ও ইশা"
  },
  {
    question: "পবিত্র কাবা শরীফটি বিশ্বের কোন পবিত্র শহরে অবস্থিত?",
    options: ["ঢাকা", "মক্কা মুকাররমা", "জেরুজালেম", "মদিনা মুনাওয়ারা"],
    answer: 1,
    hint: "সৌদি আরবে অবস্থিত, যেখানে আমরা মুখ ফিরিয়ে সালাত আদায় করি"
  },
  {
    question: "ইসলামের প্রথম খলিফা এবং রাসুলুল্লাহর হিজরতের পরম সঙ্গী কে ছিলেন?",
    options: ["হযরত আবু বকর (রাঃ)", "হযরত ওমর (রাঃ)", "হযরত ওসমান (রাঃ)", "হযরত আলী (রাঃ)"],
    answer: 0,
    hint: "তাঁকে 'সিদ্দিক' উপাধি দেওয়া হয়েছিল"
  },
  {
    question: "সালাত শুরুর আগে শরীর ও অঙ্গসমূহ পবিত্র করার চমৎকার নিয়মকে কী বলে?",
    options: ["গোসল", "আতর মাখা", "অজু করা", "কাপড় ধোয়া"],
    answer: 2,
    hint: "হাত ধোয়া, কুলি করা, মুখ ও পা ধৌত করার মাধ্যমে পবিত্র হাছিল করা"
  },
  {
    question: "কোন কল্যাণময় মাসে মুসলমানরা সুবহে সাদেক থেকে সূর্যাস্ত পর্যন্ত রোজা বা সিয়াম রাখেন?",
    options: ["শাওয়াল মাস", "রজব মাস", "রমজান মাস", "মহররম মাস"],
    answer: 2,
    hint: "এই মাসে মহাগ্রন্থ আল-কোরআন নাজিল হওয়া শুরু হয়"
  },
  {
    question: "জান্নাতে মুমিন বান্দাদের জন্য পুরস্কার হিসেবে নিচের কোন চমৎকার ধারা বইবে?",
    options: ["গরম জল", "নদী ও সুমিষ্ট পানির ঝরনাধারা", "সোনার কয়েন বৃষ্টি", "আগুনের নদী"],
    answer: 1,
    hint: "তাতে থাকবে দুধ, মধু ও সুমিষ্ট পানির প্রবাহ"
  },
  {
    question: "আল্লাহর কোন নবীকে এক বিশাল তিমি মাছ গিলে ফেলার পরও তিনি অলৌকিকভাবে বেঁচে ফিরেন?",
    options: ["হযরত ইউনুস (আঃ)", "হযরত নূহ (আঃ)", "হযরত দাউদ (আঃ)", "হযরত সুলাইমান (আঃ)"],
    answer: 0,
    hint: "তিমি মাছের পেটে অন্ধকারে তিনি লা ইলাহা ইল্লা আনতা সুবহানাকা... দোয়া পড়েছিলেন"
  },
  {
    question: "কাবা ঘরের চারদিকে সাতবার প্রদক্ষিণ করাকে হজের সময় কী চমৎকার নাম দেওয়া হয়?",
    options: ["সাঈ করা", "ইহরাম", "তাওয়াফ", "আরাফাহ"],
    answer: 2,
    hint: "এটি হজের একটি অন্যতম প্রধান আমল ও রুকন"
  }
];

function GoalProgressRing({ percent, label, colorClass, size = 64 }: { percent: number; label: string; colorClass: string; size?: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percent, 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center space-y-1 bg-black/20 p-2.5 rounded-xl border border-white/5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
          <circle
            className="text-gray-800"
            strokeWidth="3"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="30"
            cy="30"
          />
          <circle
            className={colorClass}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="30"
            cy="30"
            style={{ transition: "stroke-dashoffset 0.4s ease" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-sans font-bold text-white">
          {Math.round(percent)}%
        </span>
      </div>
      <span className="font-bengali text-[10px] text-gray-300 font-bold whitespace-nowrap">{label}</span>
    </div>
  );
}

interface MoreViewProps {
  key?: string;
  lang?: "bn" | "en" | "ar";
  onChangeLang?: (lang: "bn" | "en" | "ar") => void;
  onNavigateToTab?: (index: number) => void;
}

export default function MoreView({ lang = "bn", onChangeLang, onNavigateToTab }: MoreViewProps) {
  // Navigation segment state of MoreView - defaults to "menu" for the beautiful box grid layout
  const [activeSegment, setActiveSegment] = useState<"menu" | "dua" | "tasbih" | "qibla" | "zakat" | "history" | "ai_assistant" | "kids" | "certificate" | "dashboard" | "ramadan" | "gamification" | "settings">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("more_active_segment");
      if (saved) {
        localStorage.removeItem("more_active_segment");
        return saved as any;
      }
    }
    return "menu";
  });

  // --- CERTIFICATE STATES ---
  const [certName, setCertName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("certificate_user_name") || "";
    }
    return "";
  });
  const [certType, setCertType] = useState<"quran" | "hadith" | "ramadan">("quran");
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [downloadingCert, setDownloadingCert] = useState<boolean>(false);

  // --- AI ISLAMIC ASSISTANT STATES ---
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("islamic_ast_api_key");
      if (saved) return saved;
      return ((import.meta as any).env?.VITE_GEMINI_API_KEY as string) || "server-proxy-mode";
    }
    return "server-proxy-mode";
  });
  
  const [chatMessages, setChatMessages] = useState<Array<{role: "user" | "model", text: string, reference?: string}>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("islamic_chat_history");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // Fallback
        }
      }
    }
    return [
      {
        role: "model",
        text: "আসসালামু আলাইকুম! আমি 'নূরের পথ' ইসলামিক এআই সহকারী। কোরআন এবং সুন্নাহর আলোকে আপনার যেকোনো ধর্মীয় বা ইসলামিক প্রশ্নের উত্তর দিতে আমি প্রস্তুত। বাংলা ভাষায় আপনার যেকোনো প্রশ্ন জিজ্ঞেস করুন।"
      }
    ];
  });

  // AI Quiz States
  const [aiQuizQuestions, setAiQuizQuestions] = useState<any[]>([]);
  const [aiQuizLoading, setAiQuizLoading] = useState<boolean>(false);
  const [aiQuizError, setAiQuizError] = useState<string | null>(null);
  const [aiQuizActive, setAiQuizActive] = useState<boolean>(false);
  const [aiQuizCurrentIdx, setAiQuizCurrentIdx] = useState<number>(0);
  const [aiQuizSelectedOpt, setAiQuizSelectedOpt] = useState<number | null>(null);
  const [aiQuizScore, setAiQuizScore] = useState<number>(0);
  const [aiQuizFinished, setAiQuizFinished] = useState<boolean>(false);

  // --- CHAT AND ASSISTANT STATES ---
  const [chatInput, setChatInput] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [apiKeyVisible, setApiKeyVisible] = useState<boolean>(false);

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    setChatInput("");
    setChatError(null);
    setChatLoading(true);

    const updatedMessages = [...chatMessages, { role: "user" as const, text: userText }];
    setChatMessages(updatedMessages);
    localStorage.setItem("islamic_chat_history", JSON.stringify(updatedMessages));

    try {
      const contents = updatedMessages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ contents })
      });

      if (response.status !== 200) {
        throw new Error("সার্ভার থেকে সঠিক উত্তর পাওয়া যায়নি।");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || "এআই সার্ভার ত্রুটি।");
      }

      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!replyText) {
        throw new Error("কোনো উত্তর পাওয়া যায়নি।");
      }

      const finalMessages = [...updatedMessages, { role: "model" as const, text: replyText }];
      setChatMessages(finalMessages);
      localStorage.setItem("islamic_chat_history", JSON.stringify(finalMessages));
    } catch (err: any) {
      console.error(err);
      setChatError(err.message || "বার্তা পাঠাতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setChatLoading(false);
    }
  };

    const handleStartAiQuiz = async () => {
    setAiQuizActive(true);
    setAiQuizLoading(true);
    setAiQuizError(null);
    setAiQuizFinished(false);
    setAiQuizScore(0);
    setAiQuizCurrentIdx(0);
    setAiQuizSelectedOpt(null);

    const quizPrompt = `ইসলামিক সাধারণ জ্ঞান কুইজের জন্য বাংলা ভাষায় ৫টি অত্যন্ত চমৎকার, বৈচিত্র্যময় এবং শিক্ষণীয় প্রশ্ন এবং উত্তর সহ একটি JSON অ্যারে (Array) তৈরি করুন। প্রতিটি প্রশ্নে ৪টি করে অপশন বা বিকল্প থাকবে এবং সঠিক বিকল্পটির ০-ভিত্তিক ইনডেক্স "answer" ফিল্ডে রাখতে হবে। সাথে একটি চমৎকার ইঙ্গিত বা হিন্ট "hint" ফিল্ডে দিতে হবে।
কোনো ব্যাখ্যা, অতিরিক্ত টেক্সট বা মার্কডাউন ব্যাকটিক্স (যেমন \`\`\`json) অন্তর্ভুক্ত করবে না।

JSON ফরম্যাটটি নিচের মতো অবশ্যই হতে হবে:
[
  {
    "question": "প্রশ্ন এখানে লিখুন। যেমন: যাকাত দেওয়ার শর্ত কয়টি?",
    "options": ["২টি", "৫টি", "৭টি", "৯টি"],
    "answer": 2,
    "hint": "যাকাত ফরয হওয়ার কন্ডিশন ৭টি।"
  }
]`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: quizPrompt }] }]
        })
      });

      if (response.status !== 200) {
        throw new Error("সার্ভার থেকে সঠিক সাড়া পাওয়া যায়নি।");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || "কুইজ সার্ভার ত্রুটি।");
      }

      let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("প্রশ্ন জেনারেট করা সম্ভব হয়নি।");
      }

      let cleaned = text.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.substring(7);
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.substring(3);
      }
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.substring(0, cleaned.length - 3);
      }
      cleaned = cleaned.trim();

      const parsedQuestions = JSON.parse(cleaned);
      if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
        setAiQuizQuestions(parsedQuestions);
      } else {
        throw new Error("ভুল ফরম্যাটে প্রশ্ন ফেরত পাঠানো হয়েছে।");
      }
    } catch (err: any) {
      console.error(err);
      setAiQuizError("কুইজ তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।");
    } finally {
      setAiQuizLoading(false);
    }
  };
  
  // Settings Tab states
  const [notificationActive, setNotificationActive] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("notify_active");
      return saved !== "false";
    }
    return true;
  });

  const toggleNotification = () => {
    setNotificationActive((prev) => {
      localStorage.setItem("notify_active", (!prev).toString());
      return !prev;
    });
  };

  // --- AKHIRAH DASHBOARD STATES ---
  const [akhNamaz, setAkhNamaz] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("akh_namaz");
      return saved ? JSON.parse(saved) : { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false };
    }
    return { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false };
  });

  const [akhQuranPages, setAkhQuranPages] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("akh_quran_pages");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const [akhZikirCount, setAkhZikirCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("akh_zikir_count");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const [akhSadaqah, setAkhSadaqah] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("akh_sadaqah") === "true";
    }
    return false;
  });

  const [akhRoza, setAkhRoza] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("akh_roza") === "true";
    }
    return false;
  });

  const [weeklyHistory, setWeeklyHistory] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("akh_weekly_history");
      return saved ? JSON.parse(saved) : [72, 85, 60, 92, 78, 80, 0];
    }
    return [72, 85, 60, 92, 78, 80, 0];
  });

  // Save states to localstorage
  React.useEffect(() => {
    localStorage.setItem("akh_namaz", JSON.stringify(akhNamaz));
  }, [akhNamaz]);

  React.useEffect(() => {
    localStorage.setItem("akh_quran_pages", akhQuranPages.toString());
  }, [akhQuranPages]);

  React.useEffect(() => {
    localStorage.setItem("akh_zikir_count", akhZikirCount.toString());
  }, [akhZikirCount]);

  React.useEffect(() => {
    localStorage.setItem("akh_sadaqah", akhSadaqah.toString());
  }, [akhSadaqah]);

  React.useEffect(() => {
    localStorage.setItem("akh_roza", akhRoza.toString());
  }, [akhRoza]);

  // Mid-night check & reset & streak trigger logic
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const todayStr = new Date().toDateString();
    const lastSavedDate = localStorage.getItem("akh_last_date");

    const calculateCurrentDayScore = () => {
      const nCompleted = Object.values(akhNamaz).filter(Boolean).length;
      const namazScore = nCompleted * 20; // 5 waqts = 100%
      const quranScore = Math.min((akhQuranPages / 10) * 100, 100); // 10 pages target = 100%
      const zikirScore = Math.min((akhZikirCount / 100) * 100, 100); // 100 times target = 100%
      const sadaqahScore = akhSadaqah ? 100 : 0;
      const rozaScore = akhRoza ? 100 : 0;
      return Math.round((namazScore + quranScore + zikirScore + sadaqahScore + rozaScore) / 5);
    };

    if (lastSavedDate !== todayStr) {
      // Calculate day progress before clearing
      const score = calculateCurrentDayScore();
      
      const savedHist = localStorage.getItem("akh_weekly_history");
      const currentHistoryList = savedHist ? JSON.parse(savedHist) : [72, 85, 60, 92, 78, 80, 0];
      
      currentHistoryList.shift();
      currentHistoryList.push(score);
      setWeeklyHistory(currentHistoryList);
      localStorage.setItem("akh_weekly_history", JSON.stringify(currentHistoryList));

      // Namaz Streak check
      const allNamazDone = Object.values(akhNamaz).every(Boolean);
      let currentStreak = parseInt(localStorage.getItem("namaz_streak_count") || "0", 10);
      let streakActiveDate = localStorage.getItem("namaz_streak_last_date");

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (allNamazDone) {
        if (streakActiveDate === yesterdayStr) {
          currentStreak += 1;
        } else if (streakActiveDate !== todayStr) {
          currentStreak = 1;
        }
      } else {
        if (streakActiveDate !== todayStr && streakActiveDate !== yesterdayStr) {
          currentStreak = 0;
        }
      }
      localStorage.setItem("namaz_streak_count", currentStreak.toString());
      localStorage.setItem("namaz_streak_last_date", todayStr);

      // Reset
      setAkhNamaz({ Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false });
      setAkhQuranPages(0);
      setAkhZikirCount(0);
      setAkhSadaqah(false);
      setAkhRoza(false);

      localStorage.setItem("akh_namaz", JSON.stringify({ Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false }));
      localStorage.setItem("akh_quran_pages", "0");
      localStorage.setItem("akh_zikir_count", "0");
      localStorage.setItem("akh_sadaqah", "false");
      localStorage.setItem("akh_roza", "false");
      localStorage.setItem("akh_last_date", todayStr);
    } else {
      // Create initial streaks & placeholders if empty
      if (!localStorage.getItem("namaz_streak_count")) {
        localStorage.setItem("namaz_streak_count", "0");
        localStorage.setItem("namaz_streak_last_date", todayStr);
      }
    }
  }, []);

  // Compute live today score to update visually
  const nCompleted = Object.values(akhNamaz).filter(Boolean).length;
  const namazPercent = nCompleted * 20;
  const quranPercent = Math.min((akhQuranPages / 10) * 100, 100);
  const zikirPercent = Math.min((akhZikirCount / 100) * 100, 100);
  const sadaqahPercent = akhSadaqah ? 100 : 0;
  const rozaPercent = akhRoza ? 100 : 0;
  const overallTodayScore = Math.round((namazPercent + quranPercent + zikirPercent + sadaqahPercent + rozaPercent) / 5);

  const finalWeeklyData = [...weeklyHistory];
  if (finalWeeklyData.length > 0) {
    finalWeeklyData[finalWeeklyData.length - 1] = overallTodayScore;
  }

  // --- RAMADAN MODE STATES ---
  const [ramadanModeActive, setRamadanModeActive] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ramadan_active") === "true";
    }
    return false;
  });

  const [ramadanTimings, setRamadanTimings] = useState<{ sehri: string; iftar: string }>({
    sehri: "04:05 AM",
    iftar: "06:55 PM"
  });

  const [countdownText, setCountdownText] = useState<string>("");
  const [countdownLabel, setCountdownLabel] = useState<string>("");

  // Khatm Quran (30 Parts) State
  const [khatmParts, setKhatmParts] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ramadan_khatm_parts");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const toggleKhatmPart = (part: number) => {
    setKhatmParts((prev) => {
      const updated = prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part];
      localStorage.setItem("ramadan_khatm_parts", JSON.stringify(updated));
      return updated;
    });
  };

  // Ramadan Challenges State
  const [challengeDeeds, setChallengeDeeds] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ramadan_deeds");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const toggleDeedChallenge = (id: number) => {
    setChallengeDeeds((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem("ramadan_deeds", JSON.stringify(updated));
      return updated;
    });
  };

  // Zakat Calculator state
  const [zakatGoldPrice, setZakatGoldPrice] = useState<number>(11500); // BDT per gram
  const [zakatSilverPrice, setZakatSilverPrice] = useState<number>(155); // BDT per gram
  const [zakatGoldGrams, setZakatGoldGrams] = useState<string>("");
  const [zakatSilverGrams, setZakatSilverGrams] = useState<string>("");
  const [zakatCash, setZakatCash] = useState<string>("");

  // --- WIKIPEDIA HISTORY STATES ---
  interface WikiData {
    title: string;
    extract: string;
    thumbnail: string;
    url: string;
  }
  const [wikiData, setWikiData] = useState<Record<string, WikiData>>({});
  const [wikiLoading, setWikiLoading] = useState<boolean>(false);

  // --- KIDS CORNER STATE ---
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [kidsQuizScore, setKidsQuizScore] = useState<number>(0);
  const [activeKidsQuizIndex, setActiveKidsQuizIndex] = useState<number>(0);
  const [kidsQuizSelectedOption, setKidsQuizSelectedOption] = useState<number | null>(null);
  const [kidsQuizFinished, setKidsQuizFinished] = useState<boolean>(false);

  // --- QIBLA COMPASS STATES ---
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [qiblaAngle, setQiblaAngle] = useState<number>(263); // Default for Dhaka
  const [deviceDirectionActive, setDeviceDirectionActive] = useState<boolean>(false);

  const [visibleCount, setVisibleCount] = useState<number>(5);

  const HISTORY_TOPICS = [
    {
      key: "Muhammad",
      topicEn: "Muhammad",
      topicBn: "হযরত_মুহাম্মদ",
      titleEn: "Prophet Muhammad",
      titleBn: "হযরত মুহাম্মদ (সা.)",
      fallbackEn: "Muhammad was an Arab religious, social, and political leader and the founder of Islam. According to Islamic doctrine, he was a prophet, divinely inspired to preach and confirm the monotheistic teachings.",
      fallbackBn: "হযরত মুহাম্মাদ (সা.) ছিলেন ইসলামের প্রতিষ্ঠাতা এবং কিতাবীদের বিশ্বাসমতে আল্লাহর প্রেরিত সর্বশেষ নবী ও রাসূল। তিনি মানব ইতিহাসের সবচেয়ে প্রভাবশালী ব্যক্তিদের অন্যতম ছিলেন।",
      imageFallback: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "AbuBakr",
      topicEn: "Abu_Bakr",
      topicBn: "হযরত_আবু_বকর",
      titleEn: "Abu Bakr as-Siddiq",
      titleBn: "হযরত আবু বকর (রা.)",
      fallbackEn: "Abu Bakr al-Siddiq was the founder and first caliph of the Rashidun Caliphate. He was the closest companion and father-in-law of the Islamic prophet Muhammad.",
      fallbackBn: "হযরত আবু বকর সিদ্দিক (রা.) ছিলেন ইসলামের প্রথম খলিফা এবং রাসুলুল্লাহ (সা.)-এর সবচেয়ে ঘনিষ্ঠতম সাহাবী ও শ্বশুর। তিনি খিলাফতে রাশেদার প্রতিষ্ঠাতা।",
      imageFallback: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "Umar",
      topicEn: "Umar",
      topicBn: "হযরত_উমর",
      titleEn: "Umar ibn al-Khattab",
      titleBn: "হযরত উমর ইবনুল খাত্তাব (রা.)",
      fallbackEn: "Umar was the second caliph of the Rashidun Caliphate, ruling from August 634 until his assassination in 644. He was one of the most powerful and influential Muslim caliphs in history.",
      fallbackBn: "হযরত উমর ইবনুল খাত্তাব (রা.) ছিলেন ইসলামের দ্বিতীয় খলিফা এবং মানব ইতিহাসের অন্যতম ন্যায়পরায়ণ ও শক্তিশালী শাসক। তাঁর সময়ে খিলাফতের অভূতপূর্ব বিস্তার ঘটে।",
      imageFallback: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "Uthman",
      topicEn: "Uthman",
      topicBn: "হযরত_উসমান",
      titleEn: "Uthman ibn Affan",
      titleBn: "হযরত উসমান (রা.)",
      fallbackEn: "Uthman ibn Affan was a companion of the Islamic prophet Muhammad and the third of the Rashidun caliphs.",
      fallbackBn: "হযরত উসমান ইবনে আফফান (রা.) ছিলেন ইসলামের তৃতীয় খলিফা। তিনি দুই নূর বা দুটি আলোর অধিকারী (জুন-নুরাইন) নামেও পরিচিত ছিলেন।",
      imageFallback: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "Ali",
      topicEn: "Ali",
      topicBn: "হযরত_আলী",
      titleEn: "Ali ibn Abi Talib",
      titleBn: "হযরত আলী (রা.)",
      fallbackEn: "Ali ibn Abi Talib was the cousin, son-in-law, and companion of the Islamic prophet Muhammad. He ruled as the fourth Rashidun caliph.",
      fallbackBn: "হযরত আলী ইবনে আবী তালিব (রা.) ছিলেন ইসলামের চতুর্থ খলিফা। তিনি রাসুলুল্লাহ (সা.)-এর চাচাতো ভাই এবং জামাতা ছিলেন।",
      imageFallback: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "BattleBadr",
      topicEn: "Battle_of_Badr",
      topicBn: "বদরের_যুদ্ধ",
      titleEn: "Battle of Badr",
      titleBn: "ঐতিহাসিক বদরের যুদ্ধ",
      fallbackEn: "The Battle of Badr, fought in 624 CE in western Arabia, was a key battle in the early days of Islam and a turning point in Muhammad's struggle.",
      fallbackBn: "বদরের যুদ্ধ ২ হিজরীর ১৭ রমজান মদীনার মুসলমান ও মক্কার কুরাইশদের মধ্যে সংঘটিত হয়। এটি ইসলামের ইতিহাসে প্রথম বড় যুদ্ধ ছিল।",
      imageFallback: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "BattleUhud",
      topicEn: "Battle_of_Uhud",
      topicBn: "উহুদের_যুদ্ধ",
      titleEn: "Battle of Uhud",
      titleBn: "উহুদের যুদ্ধ",
      fallbackEn: "The Battle of Uhud was fought on Saturday, 23 March 625 CE between a force from the Muslim community of Medina and a force led by Abu Sufyan.",
      fallbackBn: "উহুদের যুদ্ধ ৩ হিজরীর শওয়াল মাসে মদীনার মুসলমান ও মক্কার কুরাইশদের মধ্যে সংঘটিত হয়।",
      imageFallback: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "BattleTrench",
      topicEn: "Battle_of_the_Trench",
      topicBn: "খন্দকের_যুদ্ধ",
      titleEn: "Battle of the Trench",
      titleBn: "খন্দকের যুদ্ধ",
      fallbackEn: "The Battle of the Trench was a 27-day-long defense by Muslims of Yathrib (now Medina) from Arab and Jewish tribes.",
      fallbackBn: "খন্দকের যুদ্ধ বা আহযাবের যুদ্ধ ৫ হিজরীর শাওয়াল মাসে মদীনার মুসলমান ও মিত্রবাহিনীর মধ্যে সংঘটিত হয়।",
      imageFallback: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "ConquestMecca",
      topicEn: "Conquest_of_Mecca",
      topicBn: "مكة_விஜয়",
      topicBn_Correct: "মক্কা_বিজয়",
      topicBn_Raw: "মক্কা_বিজয়",
      titleEn: "Conquest of Mecca",
      titleBn: "ঐতিহাসিক মক্কা বিজয়",
      fallbackEn: "The Conquest of Mecca refers to the event when Mecca was conquered by Muslims led by Muhammad in December 629 or January 630 CE.",
      fallbackBn: "৮ হিজরীর রমজান মাসে নবী করীম (সা.)-এর নেতৃত্বে মদীনার মুসলিম বাহিনী রক্তপাতহীনভাবে মক্কা নগরী জয় করে।",
      imageFallback: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "Ibrahim",
      topicEn: "Abraham_in_Islam",
      topicBn: "হযরত_ইব্রাহিম",
      titleEn: "Prophet Abraham",
      titleBn: "হযরত ইব্রাহিম (আ.)",
      fallbackEn: "Abraham, known as Ibrahim in Islam, is recognized as a prophet and messenger of God, and an ancestor of Ishmael and Isaac.",
      fallbackBn: "হযরত ইব্রাহিম (আ.) ছিলেন মুসলিম জাতির পিতা এবং আল্লাহর পরম বন্ধু (খলিলুল্লাহ)। তিনি কাবার পুনর্নির্মাণ করেন।",
      imageFallback: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "Musa",
      topicEn: "Moses_in_Islam",
      topicBn: "হযরত_মূসা",
      titleEn: "Prophet Moses",
      titleBn: "হযরত মূসা (আ.)",
      fallbackEn: "Moses, known as Musa in Islam, is considered a highly important prophet and messenger of God.",
      fallbackBn: "হযরত মূসা (আ.) ছিলেন বনী ইসরাঈল বংশের একজন মহান নবী ও রাসূল। তিনি তাওরাত লাভ করেছিলেন।",
      imageFallback: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "Isa",
      topicEn: "Jesus_in_Islam",
      topicBn: "হযরত_ঈসা",
      titleEn: "Prophet Jesus",
      titleBn: "হযরত ঈসা (আ.)",
      fallbackEn: "Jesus, known as Isa in Islam, is recognized as a major prophet and messenger of God.",
      fallbackBn: "হযরত ঈসা (আ.) ছিলেন আল্লাহর অন্যতম প্রধান নবী ও রাসূল, যাকে পিতা ছাড়াই অলৌকিকভাবে কুমারী মরিয়মের গর্ভ থেকে সৃষ্টি করা হয়েছিল।",
      imageFallback: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "Nuh",
      topicEn: "Noah_in_Islam",
      topicBn: "হযরত_নূহ",
      titleEn: "Prophet Noah",
      titleBn: "হযরত নূহ (আ.)",
      fallbackEn: "Noah, known as Nuh in Islam, is recognized as a prophet and messenger of God who built the Ark.",
      fallbackBn: "হযরত নূহ (আ.) ছিলেন প্রথম উলুল আজম রাসূল। আল্লাহর নির্দেশে মহা-প্লাবন থেকে বিশ্বাসীদের বাঁচাতে বিশাল কিস্তি তৈরি করেছিলেন।",
      imageFallback: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "Yusuf",
      topicEn: "Joseph_in_Islam",
      topicBn: "হযরত_ইউসুফ",
      titleEn: "Prophet Joseph",
      titleBn: "হযরত ইউসুফ (আ.)",
      fallbackEn: "Joseph, known as Yusuf in Islam, is recognized as a prophet of God, known for his beauty and wisdom.",
      fallbackBn: "হযরত ইউসুফ (আ.) ছিলেন আল্লাহর একজন নবী এবং হযরত ইয়াকুব (আ.)-এর অন্যতম পুত্র। তাঁর অসাধারণ রূপ এবং স্বপ্নের ব্যাখ্যার অলৌকিক ক্ষমতা ছিল।",
      imageFallback: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "HistoryOfIslam",
      topicEn: "History_of_Islam",
      topicBn: "ইসলামের_ইতিহাস",
      titleEn: "History of Islam",
      titleBn: "ইসলামের ইতিহাস ও ঐতিহ্য",
      fallbackEn: "The history of Islam concerns the political, social, economic, and cultural developments of Islamic civilization.",
      fallbackBn: "ইসলামের ইতিহাস ৭ম শতাব্দীতে আরবে রাসুলুল্লাহ (সা.)-এর উপর ওহী নাযিল হওয়ার মাধ্যমে তাওহীদের পূর্ণতার মাধ্যমে শুরু হয়ে বিশ্বব্যাপী বিস্তৃত হয়।",
      imageFallback: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "Caliphate",
      topicEn: "Caliphate",
      topicBn: "খিলাফত",
      titleEn: "The Caliphate",
      titleBn: "ইসলামি খিলাফত",
      fallbackEn: "A caliphate is an institution or public office under the leadership of an Islamic steward with the title of caliph.",
      fallbackBn: "খিলাফত হলো ইসলামের রাজনৈতিক ও প্রশাসনিক নেতৃত্বাধীন সার্বভৌম রাষ্ট্র ব্যবস্থা, যা রাসুলুল্লাহ (সা.)-এর ওফাতের পর খোলাফায়ে রাশেদার মাধ্যমে শুরু হয়।",
      imageFallback: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "GoldenAge",
      topicEn: "Islamic_Golden_Age",
      topicBn: "ইসলামি_স্বর্ণযুগ",
      titleEn: "Islamic Golden Age",
      titleBn: "ইসলামি স্বর্ণযুগ",
      fallbackEn: "The Islamic Golden Age was a period of scientific, economic and cultural flourishing in the history of Islam, traditionally dated from the 8th century to the 14th century.",
      fallbackBn: "ইসলামি স্বর্ণযুগ ছিল ইসলামের ইতিহাসে বিজ্ঞান, চিকিৎসা, জ্যোতির্বিদ্যা ও দর্শনের এক চরম শিখরে আরোহণকাল, যা ৮ম থেকে ১৪শ শতাব্দী পর্যন্ত স্থায়ী ছিল।",
      imageFallback: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "AlAndalus",
      topicEn: "Al-Andalus",
      topicBn: "আল_আন্দালুস",
      titleEn: "Al-Andalus",
      titleBn: "আল আন্দালুস (স্পেন)",
      fallbackEn: "Al-Andalus was the Muslim-ruled area of the Iberian Peninsula, in what is today Spain and Portugal.",
      fallbackBn: "আল-আন্দালুস ছিল মুসলিম স্পেনের সোনালী যুগের অধ্যায়, যা বিজ্ঞান, সংস্কৃতি ও স্থাপত্যবিদ্যায় অনন্য শ্রেষ্ঠত্বের স্বাক্ষর বহন করে।",
      imageFallback: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "OttomanEmpire",
      topicEn: "Ottoman_Empire",
      topicBn: "উসমানীয়_সাম্রাজ্য",
      titleEn: "Ottoman Empire",
      titleBn: "উসমানীয় সাম্রাজ্য",
      fallbackEn: "The Ottoman Empire was an empire that controlled much of Southeast Europe, Western Asia, and North Africa between the 14th and early 20th centuries.",
      fallbackBn: "উসমানীয় সাম্রাজ্য বা অটোমান খিলাফত ছিল দীর্ঘ ৬ শতাব্দীরও বেশি সময় ধরে বিস্তৃত এক বিশ্ব শাসক রাজবংশ, যার পতনের মধ্য দিয়ে প্রথাগত খিলাফতের সমাপ্তি ঘটে।",
      imageFallback: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=600&auto=format&fit=crop&q=60"
    },
    {
      key: "MasjidAlHaram",
      topicEn: "Masjid_al-Haram",
      topicBn: "মসজিদুল_হারাম",
      titleEn: "Masjid al-Haram",
      titleBn: "পবিত্র মসজিদুল হারাম",
      fallbackEn: "The Masjid al-Haram, commonly known as the Great Mosque of Mecca, is the largest mosque in the world.",
      fallbackBn: "মসজিদুল হারাম হলো মক্কায় অবস্থিত পৃথিবীর সবচেয়ে বড় ও সম্মানিত মসজিদ, যার কেন্দ্রবিন্দুতে পবিত্র কাবা শরিফ অবস্থিত।",
      imageFallback: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=60"
    }
  ];

  const handleKidsQuizAnswer = (optionIdx: number) => {
    setKidsQuizSelectedOption(optionIdx);
    const isCorrect = optionIdx === KIDS_QUIZ_QUESTIONS[activeKidsQuizIndex].answer;
    if (isCorrect) {
      setKidsQuizScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (activeKidsQuizIndex + 1 < KIDS_QUIZ_QUESTIONS.length) {
        setActiveKidsQuizIndex((prev) => prev + 1);
        setKidsQuizSelectedOption(null);
      } else {
        setKidsQuizFinished(true);
      }
    }, 1500);
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    // @ts-ignore
    const heading = event.webkitCompassHeading || 360 - event.alpha;
    if (heading !== undefined) {
      setCompassHeading(heading);
    }
  };

  // Compass sensors / rotation logic
  const requestCompassPermission = () => {
    if (
      typeof window !== "undefined" &&
      // @ts-ignore
      typeof DeviceOrientationEvent !== "undefined" &&
      // @ts-ignore
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      // @ts-ignore
      DeviceOrientationEvent.requestPermission()
        .then((permissionState: string) => {
          if (permissionState === "granted") {
            window.addEventListener("deviceorientation", handleOrientation, true);
            setDeviceDirectionActive(true);
          }
        })
        .catch(console.error);
    } else if (typeof window !== "undefined") {
      window.addEventListener("deviceorientation", handleOrientation, true);
      setDeviceDirectionActive(true);
    }
  };

  const handleManualCompassRotate = () => {
    setCompassHeading((prev) => (prev + 15) % 360);
  };

  useEffect(() => {
    // Only fetch Wikipedia if activeSegment is "history"
    if (activeSegment !== "history") return;

    const fetchWikipediaData = async () => {
      setWikiLoading(true);
      const updatedData = { ...wikiData };

      // Load 5 at a time, fetch only what is missing
      const sliceToFetch = HISTORY_TOPICS.slice(0, visibleCount);
      for (const t of sliceToFetch) {
        if (updatedData[t.key]) continue; // Cached

        try {
          const searchTopic = t.key === "ConquestMecca" ? "মক্কা_বিজয়" : t.topicBn;
          const endpoint = lang === "bn" 
            ? `https://bn.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTopic)}`
            : `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t.topicEn)}`;
          
          const res = await fetch(endpoint);
          if (res.ok) {
            const data = await res.json();
            updatedData[t.key] = {
              title: data.title || (lang === "bn" ? t.titleBn : t.titleEn),
              extract: data.extract || (lang === "bn" ? t.fallbackBn : t.fallbackEn),
              thumbnail: data.originalimage?.source || data.thumbnail?.source || t.imageFallback,
              url: data.content_urls?.desktop?.page || `https://${lang === "bn" ? "bn" : "en"}.wikipedia.org/wiki/${lang === "bn" ? searchTopic : t.topicEn}`
            };
          } else {
            throw new Error("Wikipedia API error response");
          }
        } catch (err) {
          // Fallback to beautiful static content if API fails
          updatedData[t.key] = {
            title: lang === "bn" ? t.titleBn : t.titleEn,
            extract: lang === "bn" ? t.fallbackBn : t.fallbackEn,
            thumbnail: t.imageFallback,
            url: `https://${lang === "bn" ? "bn" : "en"}.wikipedia.org/wiki/${lang === "bn" ? t.topicBn : t.topicEn}`
          };
        }
      }

      setWikiData(updatedData);
      setWikiLoading(false);
    };

    fetchWikipediaData();
  }, [activeSegment, lang, visibleCount]);

  // Countdown timer clock
  React.useEffect(() => {
    if (!ramadanModeActive) return;

    // Load dynamic cached timings if fetched in other screens or local storage
    if (typeof window !== "undefined") {
      try {
        const savedTimingsRaw = localStorage.getItem("prayer_times") || localStorage.getItem("saved_timings");
        if (savedTimingsRaw) {
          const parsed = JSON.parse(savedTimingsRaw);
          if (parsed.Fajr && parsed.Maghrib) {
            setRamadanTimings({
              sehri: parsed.Fajr,
              iftar: parsed.Maghrib
            });
          }
        }
      } catch (e) {
        // quiet
      }
    }

    const intervalId = setInterval(() => {
      const now = new Date();
      
      const parseTime = (timeStr: string, isNextDay = false): Date => {
        const d = new Date();
        if (isNextDay) d.setDate(d.getDate() + 1);
        
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (match) {
          let hrs = parseInt(match[1], 10);
          const mins = parseInt(match[2], 10);
          const ampm = match[3];
          
          if (ampm) {
            if (ampm.toUpperCase() === "PM" && hrs < 12) hrs += 12;
            if (ampm.toUpperCase() === "AM" && hrs === 12) hrs = 0;
          }
          d.setHours(hrs, mins, 0, 0);
        } else {
          if (timeStr === ramadanTimings.sehri) {
            d.setHours(4, 5, 0, 0);
          } else {
            d.setHours(18, 55, 0, 0);
          }
        }
        return d;
      };

      const sehriTimeToday = parseTime(ramadanTimings.sehri, false);
      const iftarTimeToday = parseTime(ramadanTimings.iftar, false);
      const sehriTimeTomorrow = parseTime(ramadanTimings.sehri, true);

      let target: Date;
      let lbl: string;

      if (now < sehriTimeToday) {
        target = sehriTimeToday;
        lbl = "আজকের সাহরীর শেষ সময় বাকি";
      } else if (now < iftarTimeToday) {
        target = iftarTimeToday;
        lbl = "আজকের ইফতারের পবিত্র সময় বাকি";
      } else {
        target = sehriTimeTomorrow;
        lbl = "আগামীকালের সাহরীর শেষ সময় বাকি";
      }

      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdownText("আলহামদুলিল্লাহ! সময় হয়েছে।");
        setCountdownLabel(lbl);
      } else {
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mns = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const scs = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdownText(
          `${hrs.toString().padStart(2, "0")}:${mns.toString().padStart(2, "0")}:${scs.toString().padStart(2, "0")}`
        );
        setCountdownLabel(lbl);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [ramadanModeActive, ramadanTimings]);

  // Save ramadan mode state
  const handleRamadanToggle = () => {
    setRamadanModeActive((prev) => {
      const next = !prev;
      localStorage.setItem("ramadan_active", next.toString());
      return next;
    });
  };

  // --- GAMIFICATION STATES ---
  const [streakCount, setStreakCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("namaz_streak_count");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const interval = setInterval(() => {
        const saved = localStorage.getItem("namaz_streak_count");
        if (saved) setStreakCount(parseInt(saved, 10));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, []);

  // Claim Weekly Reward simulation
  const [weeklyClaimed, setWeeklyClaimed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("weekly_claimed") === "true";
    }
    return false;
  });

  const handleWeeklyClaim = () => {
    if (weeklyClaimed) return;
    setWeeklyClaimed(true);
    localStorage.setItem("weekly_claimed", "true");
    alert("মাশাআল্লাহ! আপনি সপ্তাহের চ্যালঞ্জ পূর্ণ করার কৃতিত্ব অর্জন করেছেন এবং ৫০ পয়েন্ট সংগ্রহ করেছেন!");
  };

  // Children section stories & quiz states (using defined parent states)

  // Restart Kids Quiz
  const handleRestartQuiz = () => {
    setActiveKidsQuizIndex(0);
    setKidsQuizSelectedOption(null);
    setKidsQuizScore(0);
    setKidsQuizFinished(false);
  };

  const handleKidsQuizOptionClick = (idx: number) => {
    if (kidsQuizSelectedOption !== null) return; // Answer locked
    setKidsQuizSelectedOption(idx);
    
    const correctIdx = KIDS_QUIZ_QUESTIONS[activeKidsQuizIndex].answer;
    if (idx === correctIdx) {
      setKidsQuizScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (activeKidsQuizIndex < KIDS_QUIZ_QUESTIONS.length - 1) {
        setActiveKidsQuizIndex((prev) => prev + 1);
        setKidsQuizSelectedOption(null);
      } else {
        setKidsQuizFinished(true);
      }
    }, 1500);
  };

  // Zakat values calculations
  const parsedGoldG = parseFloat(zakatGoldGrams) || 0;
  const parsedSilverG = parseFloat(zakatSilverGrams) || 0;
  const parsedCash = parseFloat(zakatCash) || 0;

  const goldWealth = parsedGoldG * zakatGoldPrice;
  const silverWealth = parsedSilverG * zakatSilverPrice;
  const totalWealthBDT = goldWealth + silverWealth + parsedCash;

  const nisabThresholdSilver = 612.36 * zakatSilverPrice; // Nisab of pure silver (52.5 tolas / 612.36g)
  const isNisabReached = totalWealthBDT >= nisabThresholdSilver;
  const payableZakatBDT = isNisabReached ? Math.round(totalWealthBDT * 0.025) : 0;

  // Streak badge criteria:
  const badgeStreakEarned = streakCount >= 7;
  const badgeQuranEarned = akhQuranPages >= 10 || khatmParts.length >= 3;
  const badgeRamadanEarned = khatmParts.length >= 10 || challengeDeeds.length >= 3;
  const badgeZikirEarned = akhZikirCount >= 100 || (typeof window !== "undefined" && parseInt(localStorage.getItem("tasbih_total_sessions") || "0", 10) >= 10);

  const DAYS_LABELS = ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "আজ"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 w-full max-w-lg mx-auto pb-8"
    >
      {/* Back to Menu button if not on menu */}
      {activeSegment !== "menu" && (
        <button
          onClick={() => setActiveSegment("menu")}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bengali font-extrabold bg-gold-brand/10 text-gold-brand border border-gold-brand/20 hover:bg-gold-brand/15 cursor-pointer mb-2 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          {lang === "ar" ? "العودة للقائمة" : lang === "en" ? "Back to Menu" : "মেন্যুতে ফিরে যান"}
        </button>
      )}

      <AnimatePresence mode="wait">
        {/* ============================== PORTAL 0: BEAUTIFUL BOX GRID MENU ============================== */}
        {activeSegment === "menu" && (
          <motion.div
            key="more_menu_grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 w-full max-w-lg mx-auto"
          >
            {/* Beautiful greeting title */}
            <div className="text-center space-y-1.5 py-2">
              <h2 className="font-bengali text-2xl font-black text-text-brand bg-gradient-to-r from-text-brand via-gold-brand to-text-brand bg-clip-text text-transparent">
                {lang === "ar" ? "خدمات إضافية" : lang === "en" ? "Islamic Hub" : "ইসলামিক সেবা সমূহ"}
              </h2>
              <p className="font-bengali text-xs text-gray-400">
                {lang === "ar" ? "استكشف خدماتنا الإسلامية المتكاملة" : lang === "en" ? "Explore our comprehensive Islamic features" : "সবগুলো প্রয়োজনীয় ইসলামিক ফিচার এক জায়গায়"}
              </p>
            </div>

            {/* The 12-box Premium Box Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full">
              {[
                {
                  id: "dua" as const,
                  label: lang === "ar" ? "الأدعية والأذكار" : lang === "en" ? "Dua & Zikir" : "দোয়া ও যিকির",
                  icon: "🤲",
                  iconBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                },
                {
                  id: "tasbih" as const,
                  label: lang === "ar" ? "مسبحة رقمية" : lang === "en" ? "Tasbih Counter" : "তসবিহ",
                  icon: "📿",
                  iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                },
                {
                  id: "qibla" as const,
                  label: lang === "ar" ? "بوصلة القبلة" : lang === "en" ? "Qibla Compass" : "কিবলা",
                  icon: "🧭",
                  iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                },
                {
                  id: "zakat" as const,
                  label: lang === "ar" ? "حساب الزكاة" : lang === "en" ? "Zakat Calculator" : "যাকাত",
                  icon: "🪙",
                  iconBg: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                },
                {
                  id: "history" as const,
                  label: lang === "ar" ? "التاريخ الإسلامي" : lang === "en" ? "Islamic History" : "ইসলামিক ইতিহাস",
                  icon: "🕌",
                  iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                },
                {
                  id: "ai_assistant" as const,
                  label: lang === "ar" ? "مساعد الذكاء الاصطناعي" : lang === "en" ? "AI Assistant" : "AI সহকারী",
                  icon: "🤖",
                  iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                },
                {
                  id: "kids" as const,
                  label: lang === "ar" ? "ركن الأطفال" : lang === "en" ? "Kids Corner" : " some child corner",
                  icon: "👶",
                  iconBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400"
                },
                {
                  id: "certificate" as const,
                  label: lang === "ar" ? "إجازة وشهادة تقدير" : lang === "en" ? "Certificate" : "সার্টিফিকেট",
                  icon: "📜",
                  iconBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                },
                {
                  id: "dashboard" as const,
                  label: lang === "ar" ? "تتبع الآخرة" : lang === "en" ? "My Akhirah" : "My Akhirah",
                  icon: "🌌",
                  iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                },
                {
                  id: "ramadan" as const,
                  label: lang === "ar" ? "وضع رمضان" : lang === "en" ? "Ramadan Mode" : "রমজান মোড",
                  icon: "🌙",
                  iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                },
                {
                  id: "gamification" as const,
                  label: lang === "ar" ? "التحديات والمكافآت" : lang === "en" ? "Gamification" : "গেমিফিকেশন",
                  icon: "🏆",
                  iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                },
                {
                  id: "settings" as const,
                  label: lang === "ar" ? "إعدادات التطبيق" : lang === "en" ? "Settings" : "সেটিংস",
                  icon: "⚙️",
                  iconBg: "bg-slate-500/10 text-slate-600 dark:text-slate-400"
                }
              ].map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSegment(item.id)}
                  whileTap={{ scale: 0.95 }}
                  className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-card-brand border border-gold-brand/10 hover:border-gold-brand/35 shadow-sm transition-all text-center h-[120px] select-none cursor-pointer overflow-hidden"
                >
                  {/* Subtle active clicked gold border highlight */}
                  <div className="absolute inset-0 border-2 border-transparent group-active:border-gold-brand rounded-2xl pointer-events-none transition-all" />
                  
                  {/* Icon with ambient bg circle */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-115 shadow-inner ${item.iconBg}`}>
                    {renderMoreIcon(item.id, "w-6 h-6")}
                  </div>

                  {/* Label string */}
                  <span className="font-bengali text-xs font-black text-text-brand tracking-wide leading-tight px-1 block">
                    {item.id === "kids" ? (lang === "ar" ? "ركن الأطفال" : lang === "en" ? "Kids Corner" : "শিশু কর্নার") : item.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ============================== DUA MODULE HUB ============================== */}
        {activeSegment === "dua" && (
          <motion.div
            key="dua_portal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            <DuaView initialSubTab="dua" />
          </motion.div>
        )}

        {/* ============================== TASBIH MODULE HUB ============================== */}
        {activeSegment === "tasbih" && (
          <motion.div
            key="tasbih_portal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            <DuaView initialSubTab="tasbih" />
          </motion.div>
        )}

        {/* ============================== QIBLA COMPASS PORTAL ============================== */}
        {activeSegment === "qibla" && (
          <motion.div
            key="qibla_segment"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-card-brand border border-gold-brand/25 p-6 rounded-2xl relative shadow-md text-center">
              <h3 className="font-bengali text-lg font-black text-gold-brand mb-2">
                {lang === "ar" ? "بوصلة القبلة" : lang === "en" ? "Qibla Compass" : "কিবলা কম্পাস"}
              </h3>
              <p className="font-bengali text-xs text-gray-400 mb-6">
                {lang === "ar" ? "ابحث عن اتجاه القبلة من موقعك الحالي" : lang === "en" ? "Find the direction of the Kaaba from your location" : "আপনার বর্তমান অবস্থান থেকে পবিত্র কাবার দিক নির্ণয় করুন"}
              </p>

              {/* Compass Needle Visualization */}
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center bg-black/10 dark:bg-black/40 rounded-full border border-gold-brand/20 shadow-inner">
                {/* Compass Dial Rose */}
                <div className="absolute inset-2 rounded-full border border-gold-brand/10 border-dashed" />
                <span className="absolute top-2 font-poppins text-[10px] font-black text-red-500">N</span>
                <span className="absolute bottom-2 font-poppins text-[10px] font-black text-gray-500">S</span>
                <span className="absolute left-2 font-poppins text-[10px] font-black text-gray-500">W</span>
                <span className="absolute right-2 font-poppins text-[10px] font-black text-gray-500">E</span>

                {/* Rotating Needle */}
                <motion.div
                  className="relative w-full h-full flex items-center justify-center pointer-events-none"
                  animate={{ rotate: qiblaAngle - compassHeading }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                  {/* Beautiful Gold Dial Pointer Arrow */}
                  <svg
                    className="w-12 h-36 text-gold-brand drop-shadow-[0_0_8px_rgba(201,162,39,0.6)]"
                    viewBox="0 0 24 120"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M12 0L24 60H0L12 0Z" fill="currentColor" />
                    <path d="M12 120L24 60H0L12 120Z" fill="gray" opacity="0.5" />
                  </svg>
                </motion.div>

                {/* Center Core Cap */}
                <div className="absolute w-4 h-4 bg-white dark:bg-gray-800 rounded-full border-2 border-gold-brand shadow-md" />
              </div>

              {/* Current orientation direction indicators */}
              <div className="mt-6 space-y-4">
                <div className="flex justify-around text-center">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-400">
                      {lang === "ar" ? "زاوية القبلة" : lang === "en" ? "Qibla Angle" : "কিবলার কোণ"}
                    </span>
                    <span className="font-poppins text-sm font-black text-gold-brand">
                      {qiblaAngle}° N
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-400">
                      {lang === "ar" ? "اتجاه جهازك" : lang === "en" ? "Device Heading" : "ডিভাইসের দিক"}
                    </span>
                    <span className="font-poppins text-sm font-black text-emerald-500">
                      {Math.round(compassHeading)}°
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 justify-center">
                  <button
                    onClick={requestCompassPermission}
                    className="py-2 px-3.5 rounded-xl border border-gold-brand/20 bg-gold-brand/5 hover:bg-gold-brand/10 text-gold-brand text-xs font-bengali font-bold cursor-pointer transition-all"
                  >
                    {deviceDirectionActive 
                      ? (lang === "ar" ? "البوصلة نشطة" : lang === "en" ? "Compass Active" : "কম্পাস সচল আছে")
                      : (lang === "ar" ? "تفعيل الحساس" : lang === "en" ? "Enable Compass" : "কম্পাস সেন্সর সচল করুন")
                    }
                  </button>
                  <button
                    onClick={handleManualCompassRotate}
                    className="py-2 px-3.5 rounded-xl border border-gold-brand/20 bg-gold-brand/5 hover:bg-gold-brand/10 text-gold-brand text-xs font-bengali font-bold cursor-pointer transition-all"
                  >
                    {lang === "ar" ? "تدوير يدوي (+15)" : lang === "en" ? "Rotate Manual (+15°)" : "ম্যানুয়াল ঘুরান (+১৫°)"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ============================== ZAKAT PORTAL ============================== */}
        {activeSegment === "zakat" && (
          <motion.div
            key="zakat_portal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-card-brand border border-gold-brand/25 p-5 md:p-6 rounded-2xl relative shadow-md space-y-4">
              <h3 className="font-bengali text-lg font-black text-gold-brand">
                {lang === "ar" ? "حساب الزكاة" : lang === "en" ? "Zakat Calculator" : "যাকাত ক্যালকুলেটর"}
              </h3>
              
              <p className="font-bengali text-xs text-gray-400 leading-normal">
                {lang === "ar" 
                  ? "يجب إخراج زكاة المال (2.5%) إذا بلغ النصاب وهو ما يعادل قيمة 87.48 جرام من الذهب أو 612.36 جرام من الفضة مرور عام هجري عليها." 
                  : lang === "en" 
                  ? "Zakat (2.5%) is obligatory on wealth exceeding the Nisab threshold (equivalent to 87.48g gold or 612.36g silver) held for one Islamic year."
                  : "সোনার নিসাব (৮৭.৪৮ গ্রাম) অথবা রূপার নিসাব (৬১২.৩৬ গ্রাম) সমপরিমাণ সম্পদের ওপর ২.৫% যাকাত আদায় করা ফরজ। রূপার নিসাব সর্বনিম্ন ধরে হিসাব করুন:"}
              </p>

              <div className="space-y-4">
                {/* inputs with labels */}
                <div className="grid grid-cols-2 gap-3 text-xs font-bengali">
                  <div className="space-y-1">
                    <span className="text-gray-300">{lang === "ar" ? "الذهب (جرام):" : lang === "en" ? "Gold (grams):" : "সোনার পরিমাণ (গ্রাম):"}</span>
                    <input
                      type="number"
                      value={zakatGoldGrams}
                      onChange={(e) => setZakatGoldGrams(e.target.value)}
                      placeholder="e.g. 10g"
                      className="w-full bg-black/40 text-white p-2 border border-white/10 focus:border-gold-brand/50 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-gray-300">{lang === "ar" ? "الفضة (جرام):" : lang === "en" ? "Silver (grams):" : "রূপার পরিমাণ (গ্রাম):"}</span>
                    <input
                      type="number"
                      value={zakatSilverGrams}
                      onChange={(e) => setZakatSilverGrams(e.target.value)}
                      placeholder="e.g. 50g"
                      className="w-full bg-black/40 text-white p-2 border border-white/10 focus:border-gold-brand/50 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs font-bengali">
                  <span className="text-gray-300">{lang === "ar" ? "رصيد البنك والنقدية (BDT):" : lang === "en" ? "Bank Balance & Savings (BDT):" : "ব্যাংক ব্যালেন্স ও অতিরিক্ত নগদ সঞ্চয় (টাকা):"}</span>
                  <input
                    type="number"
                    value={zakatCash}
                    onChange={(e) => setZakatCash(e.target.value)}
                    placeholder="e.g. 50000 BDT"
                    className="w-full bg-black/40 text-white p-2 border border-white/10 focus:border-gold-brand/50 rounded-xl outline-none"
                  />
                </div>

                {/* Adjustable price configurations */}
                <div className="grid grid-cols-2 gap-3 text-[10px] font-bengali pt-1.5 border-t border-white/5 text-gray-400">
                  <div className="space-y-0.5">
                    <span>{lang === "ar" ? "سعر غرام الذهب:" : lang === "en" ? "Gold Price per Gram:" : "সোনা প্রতি গ্রাম দাম (BDT):"}</span>
                    <input 
                      type="number" 
                      value={zakatGoldPrice} 
                      onChange={(e) => setZakatGoldPrice(parseFloat(e.target.value) || 0)} 
                      className="bg-black/30 text-white border border-white/5 p-1 text-center w-full rounded outline-none" 
                    />
                  </div>
                  <div className="space-y-0.5">
                    <span>{lang === "ar" ? "سعر غرام الفضة:" : lang === "en" ? "Silver Price per Gram:" : "রূপা প্রতি গ্রাম দাম (BDT):"}</span>
                    <input 
                      type="number" 
                      value={zakatSilverPrice} 
                      onChange={(e) => setZakatSilverPrice(parseFloat(e.target.value) || 0)} 
                      className="bg-black/30 text-white border border-white/5 p-1 text-center w-full rounded outline-none" 
                    />
                  </div>
                </div>

                {/* Output result */}
                <div className="p-3 bg-black/40 rounded-xl border border-gold-brand/10 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bengali text-gray-400">
                    <span>{lang === "ar" ? "إجمالي ثروتك:" : lang === "en" ? "Your Total Wealth:" : "আপনার মোট সম্পদ (BDT):"}</span>
                    <span className="font-sans font-bold text-white">{totalWealthBDT.toLocaleString()} BDT</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bengali text-gray-400">
                    <span>{lang === "ar" ? "حد النصاب الشرعي للفضة:" : lang === "en" ? "Silver Nisab Threshold:" : "রূপার সর্বনিম্ন নিসাব সীমা:"}</span>
                    <span className="font-sans font-bold text-amber-500">{Math.round(nisabThresholdSilver).toLocaleString()} BDT</span>
                  </div>
                  
                  <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-1.5">
                    <span className="font-bengali text-xs font-bold text-white">{lang === "ar" ? "الزكاة المستحقة (2.5%):" : lang === "en" ? "Payable Zakat (2.5%):" : "প্রদেয় যাকাত (২.৫%):"}</span>
                    <div className="text-right">
                      <span className="font-sans text-lg font-black text-emerald-500 block">
                        {payableZakatBDT.toLocaleString()} BDT
                      </span>
                      {payableZakatBDT > 0 && (
                        <span className="font-bengali text-[8px] text-gray-400 block">
                          {lang === "ar" ? "الزكاة فرض عليك" : lang === "en" ? "Zakat is Obligatory" : "আপনার ওপর যাকাত ফরয"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ============================== WIKIPEDIA HISTORY PORTAL ============================== */}
        {activeSegment === "history" && (
          <motion.div
            key="islamic_history_hub"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="glass-effect p-5 rounded-2xl relative overflow-hidden border border-gold-brand/15 shadow-sm text-center">
              <span className="font-poppins text-[9px] uppercase tracking-widest text-gold-brand font-black bg-gold-brand/10 px-2.5 py-1 rounded-full text-center">
                Islamic Legacy
              </span>
              <h2 className="font-bengali text-2xl font-black mt-3 text-text-brand leading-snug">
                {lang === "ar" ? "التاريخ الإسلامي" : lang === "en" ? "Islamic History" : "ইসলামিক ইতিহাস ও ঐতিহ্য"}
              </h2>
              <p className="font-bengali text-xs text-gray-400 mt-2 leading-relaxed">
                {lang === "ar" 
                  ? "استكشف السيرة العطرة للنبي وتاريخ الخلفاء الراشدين والفتوحات الإسلامية العظيمة عبر التاريخ برواية موثقة." 
                  : lang === "en"
                  ? "Explore the biographies of the prophets, the achievements of the noble companions, and the glorious Islamic Golden Age."
                  : "তাওহীদের সূচনা থেকে বিদায় হজ্ব পর্যন্ত—মানবেতিহাসের গৌরবময় নবীদের জীবনী, বীর সাহাবীদের অবদান এবং মহান ঐতিহাসিক কালজয়ী বর্ণনা।"}
              </p>
            </div>

            {/* Wikipedia articles list */}
            <div className="space-y-4">
              {HISTORY_TOPICS.slice(0, visibleCount).map((topic) => {
                const searchTopic = topic.key === "ConquestMecca" ? "মক্কা_বিজয়" : topic.topicBn;
                const data = wikiData[topic.key] || {
                  title: lang === "bn" ? topic.titleBn : topic.titleEn,
                  extract: lang === "bn" ? topic.fallbackBn : topic.fallbackEn,
                  thumbnail: topic.imageFallback,
                  url: `https://${lang === "bn" ? "bn" : "en"}.wikipedia.org/wiki/${lang === "bn" ? searchTopic : topic.topicEn}`
                };
                return (
                  <div
                    key={topic.key}
                    className="bg-card-brand border border-gold-brand/10 rounded-2xl overflow-hidden shadow-sm hover:border-gold-brand/25 transition-all flex flex-col md:flex-row"
                  >
                    {/* Image Thumbnail */}
                    <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                      <img
                        src={data.thumbnail}
                        alt={data.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/30" />
                    </div>

                    {/* Content details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <h4 className="font-bengali text-lg font-black text-gold-brand">
                          {data.title}
                        </h4>
                        <p className="font-bengali text-xs text-gray-300 leading-relaxed line-clamp-4">
                          {data.extract}
                        </p>
                      </div>

                      <div>
                        <a
                          href={data.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-gold-brand text-black font-bengali text-xs font-black px-3.5 py-1.5 rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shadow"
                        >
                          {lang === "ar" ? "اقرأ المزيد" : lang === "en" ? "Read More" : "আরো পড়ুন"}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}

              {wikiLoading && (
                <div className="text-center py-6 space-y-2">
                  <div className="w-8 h-8 border-3 border-gold-brand border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="font-bengali text-xs text-gold-brand animate-pulse">
                    {lang === "ar" ? "جاري التحميل..." : lang === "en" ? "Loading..." : "লোড হচ্ছে..."}
                  </p>
                </div>
              )}

              {visibleCount < HISTORY_TOPICS.length && !wikiLoading && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => setVisibleCount((prev) => Math.min(prev + 5, HISTORY_TOPICS.length))}
                    className="bg-gold-brand text-black font-bengali text-xs font-black px-5 py-2.5 rounded-xl hover:bg-gold-brand/90 transition-all cursor-pointer shadow inline-flex items-center gap-2"
                  >
                    <span>
                      {lang === "ar" ? "تحميل المزيد" : lang === "en" ? "Load More" : "আরো দেখুন"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ============================== KIDS ISLAMIC CORNER PORTAL ============================== */}
        {activeSegment === "kids" && (
          <motion.div
            key="kids_segment"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="p-5 bg-gradient-to-r from-pink-950/45 via-rose-955/20 to-indigo-950/40 rounded-2xl border-2 border-dashed border-rose-500/30 space-y-4 text-center">
              <span className="font-bengali text-[10px] bg-rose-500/20 text-rose-300 px-2.5 py-1 rounded-full uppercase tracking-widest font-black inline-block">
                🍒 {lang === "ar" ? "ركن الأطفال" : lang === "en" ? "Kids Corner" : "বাচ্চাদের ইসলামিক কর্নার"}
              </span>

              <h4 className="font-bengali text-[15px] font-black text-white">{lang === "ar" ? "قصص الأنبياء وسؤال وجواب للأطفال" : lang === "en" ? "Prophet Stories & Quizzes for Kids" : "শিশুদের ছোট ছোট নবীর গল্প ও মজার কুইজ"}</h4>
              <p className="font-bengali text-xs text-gray-300 leading-normal">
                {lang === "ar" ? "قصص مفيدة بأسلوب شيق وجذاب مع أسئلة مسلية ومفيدة." : lang === "en" ? "Simple inspiring stories of the Prophets and playful religious quizzes for little ones." : "ছোট্ট সোনামণিদের জন্য সহজ ভাষার শিক্ষণীয় দ্বীনি গল্প এবং মজার কুইজ খেলা।"}
              </p>
            </div>

            {/* Stories Section */}
            <div className="bg-card-brand border border-white/10 p-5 rounded-2xl space-y-4">
              <span className="font-bengali text-sm text-rose-300 block font-bold">📖 {lang === "ar" ? "اختر قصة لقرائتها:" : lang === "en" ? "Select a story to read:" : "নিচের যেকোনো গল্পে ক্লিক করে সম্পূর্ণ পড়ে নাও:"}</span>
              
              <div className="grid grid-cols-1 gap-2">
                {KIDS_STORIES.map((sty) => (
                  <div key={sty.id} className="rounded-xl overflow-hidden bg-black/25 border border-white/5">
                    <button
                      onClick={() => setSelectedStory(selectedStory === sty.id ? null : sty.id)}
                      className="w-full p-3 text-left flex items-center justify-between font-bengali text-xs font-bold text-white hover:bg-white/5 transition-all outline-none"
                    >
                      <span className="flex items-center gap-2"><span>✨</span> {sty.title}</span>
                      <ChevronRight className={`w-4 h-4 transform transition-transform ${selectedStory === sty.id ? "rotate-90 text-rose-300" : ""}`} />
                    </button>
                    
                    {selectedStory === sty.id && (
                      <div className="p-4 bg-black/35 border-t border-white/5 space-y-3 font-bengali text-xs leading-relaxed text-gray-300">
                        <p>{sty.content}</p>
                        <div className="p-2.5 bg-rose-500/10 rounded-lg text-rose-300 border border-rose-500/10">
                          <strong>{lang === "ar" ? "العبرة المستفادة:" : lang === "en" ? "Moral Lesson:" : "শিক্ষণীয় বিষয়:"}</strong> {sty.lesson}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quiz Section */}
            <div className="bg-card-brand border border-white/10 p-5 rounded-2xl space-y-4">
              <h3 className="font-bengali text-sm font-bold text-white flex items-center gap-1.5 pb-1 border-b border-white/5">
                🎯 {lang === "ar" ? "مسابقة معلوماتية للأطفال" : lang === "en" ? "Islamic Quiz for Kids" : "শিশুদের ইসলামিক কুইজ খেলা"}
              </h3>

              {kidsQuizFinished ? (
                <div className="text-center py-6 space-y-3">
                  <span className="text-4xl">🏆</span>
                  <h4 className="font-bengali text-base font-black text-gold-brand">{lang === "ar" ? "أحسنت يا بطل!" : lang === "en" ? "Great Job, Champ!" : "মাশাআল্লাহ! অভিনন্দন সোনামণি!"}</h4>
                  <p className="font-bengali text-xs text-gray-300">
                    {lang === "ar" ? `لقد أجبت بشكل صحيح على: ${kidsQuizScore} من ${KIDS_QUIZ_QUESTIONS.length}` : lang === "en" ? `You answered: ${kidsQuizScore} out of ${KIDS_QUIZ_QUESTIONS.length} correctly!` : `তোমার মোট স্কোর: ${kidsQuizScore}/${KIDS_QUIZ_QUESTIONS.length}`}
                  </p>
                  <button
                    onClick={() => {
                      setActiveKidsQuizIndex(0);
                      setKidsQuizScore(0);
                      setKidsQuizFinished(false);
                      setKidsQuizSelectedOption(null);
                    }}
                    className="py-1.5 px-4 bg-rose-500 hover:bg-rose-600 text-white font-bengali text-xs font-black rounded-xl cursor-pointer"
                  >
                    {lang === "ar" ? "إعادة المحاولة" : lang === "en" ? "Play Again" : "আবার খেলো"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold">
                    <span>{lang === "ar" ? "سؤال:" : lang === "en" ? "Question:" : "প্রশ্ন:"} {activeKidsQuizIndex + 1}/{KIDS_QUIZ_QUESTIONS.length}</span>
                    <span className="text-rose-300">{lang === "ar" ? `النقاط: ${kidsQuizScore}` : lang === "en" ? `Score: ${kidsQuizScore}` : `স্কোর: ${kidsQuizScore}`}</span>
                  </div>

                  <p className="font-bengali text-sm font-black text-white leading-normal">
                    {KIDS_QUIZ_QUESTIONS[activeKidsQuizIndex].question}
                  </p>

                  <div className="grid grid-cols-1 gap-2.5">
                    {KIDS_QUIZ_QUESTIONS[activeKidsQuizIndex].options.map((opt, oIdx) => {
                      const isSelected = kidsQuizSelectedOption === oIdx;
                      const isCorrect = oIdx === KIDS_QUIZ_QUESTIONS[activeKidsQuizIndex].answer;
                      let btnStyle = "bg-black/20 border-white/10 hover:bg-white/5 text-gray-300";
                      
                      if (kidsQuizSelectedOption !== null) {
                        if (isSelected) {
                          btnStyle = isCorrect ? "bg-emerald-500/25 border-emerald-500 text-emerald-400" : "bg-red-500/25 border-red-500 text-red-400";
                        } else if (isCorrect) {
                          btnStyle = "bg-emerald-500/25 border-emerald-500 text-emerald-400";
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={kidsQuizSelectedOption !== null}
                          onClick={() => handleKidsQuizAnswer(oIdx)}
                          className={`w-full p-2.5 text-left rounded-xl border font-bengali text-xs font-bold transition-all outline-none ${btnStyle} ${kidsQuizSelectedOption === null ? "cursor-pointer" : "cursor-default"}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2.5 bg-yellow-500/10 rounded-lg text-yellow-300 border border-yellow-500/10 text-[11px] leading-relaxed">
                    💡 <strong>{lang === "ar" ? "تلميح الذهب:" : lang === "en" ? "Hint:" : "ইঙ্গিত:"}</strong> {KIDS_QUIZ_QUESTIONS[activeKidsQuizIndex].hint}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ============================== PORTAL 2: MY AKHIRAH DASHBOARD ============================== */}
        {activeSegment === "dashboard" && (
          <motion.div
            key="my_akhirah_dashboard_full_v"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Elegant Header Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-brand-bg border border-indigo-500/20 relative overflow-hidden space-y-2">
              <div className="absolute top-0 right-0 p-4 opacity-15">
                <Trophy className="w-20 h-20 text-gold-brand" />
              </div>
              <span className="font-poppins text-[9px] uppercase tracking-widest text-[#2ECC71] font-black bg-emerald-500/10 px-2.5 py-1 rounded-full">
                Sincere Akhirah Storage
              </span>
              <h2 className="font-bengali text-xl font-bold text-white">আমার আখিরাত ড্যাশবোর্ড</h2>
              <p className="font-bengali text-xs text-gray-400 leading-relaxed">
                আপনার দৈনন্দিন আমলসমূহ নিষ্ঠার সাথে হিসাব করুন এবং আখিরাতের কল্যাণ অর্জনে অনুপ্রাণিত হোন।
              </p>
            </div>

            {/* Circular Progress Rings Box */}
            <div className="bg-card-brand p-5 rounded-2xl border border-gold-brand/10 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h3 className="font-bengali text-sm font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#2ECC71]" /> আজকের সামগ্রিক আমল অগ্রগতি
                </h3>
                <span className="font-poppins text-xs font-black text-gold-brand bg-gold-brand/10 px-2 py-0.5 rounded-md">
                  {overallTodayScore}% সমাপ্ত
                </span>
              </div>

              {/* Progress rings row */}
              <div className="grid grid-cols-5 gap-1.5">
                <GoalProgressRing percent={namazPercent} label="৫ ওয়াক্ত সালাত" colorClass="text-emerald-500" />
                <GoalProgressRing percent={quranPercent} label="কোরআন তিলাওয়াত" colorClass="text-amber-500" />
                <GoalProgressRing percent={zikirPercent} label="দৈনিক যিকির" colorClass="text-teal-400" />
                <GoalProgressRing percent={sadaqahPercent} label="দান সদকাহ" colorClass="text-[#E74C3C]" />
                <GoalProgressRing percent={rozaPercent} label="নফল রোজা" colorClass="text-indigo-400" />
              </div>
            </div>

            {/* Daily Control Inputs */}
            <div className="bg-card-brand border border-white/10 p-5 rounded-2xl space-y-6">
              <h3 className="font-bengali text-base font-bold text-white border-b border-white/5 pb-2">
                আজকের আমল ইনপুট করুন
              </h3>

              {/* 1. Namaz checkbox row */}
              <div className="space-y-2">
                <label className="font-bengali text-sm font-bold text-gray-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> ৫ ওয়াক্ত ফরজ সালাত আদায় করেছেন?
                </label>
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {Object.keys(akhNamaz).map((waqt) => (
                    <button
                      key={waqt}
                      onClick={() => {
                        setAkhNamaz((prev) => ({ ...prev, [waqt]: !prev[waqt] }));
                      }}
                      className={`py-2 rounded-xl text-center transition-all border flex flex-col items-center justify-center gap-1 select-none cursor-pointer ${
                        akhNamaz[waqt]
                          ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-400 font-bold"
                          : "bg-black/25 border-white/5 text-gray-400 hover:border-white/10"
                      }`}
                    >
                      <span className="font-sans text-[10px]">{waqt}</span>
                      {akhNamaz[waqt] ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-3.5 h-3.5 text-gray-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Quran read volume helper */}
              <div className="space-y-2">
                <label className="font-bengali text-sm font-bold text-gray-300 flex items-center justify-between">
                  <span>📗 আল-কোরআন তিলাওয়াত (আজ কয় পৃষ্ঠা পড়েছেন?)</span>
                  <span className="font-sans text-xs text-gold-brand font-bold bg-white/5 px-2 py-0.5 rounded-md">
                    লক্ষ্য: ১০ পৃষ্ঠা
                  </span>
                </label>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAkhQuranPages((prev) => Math.max(0, prev - 1))}
                    className="p-2.5 bg-black/20 border border-white/10 rounded-xl hover:border-gold-brand/30 active:scale-95 transition-all text-white cursor-pointer"
                  >
                    <Minus className="w-4 h-4 text-gold-brand" />
                  </button>
                  
                  <input
                    type="number"
                    value={akhQuranPages === 0 ? "" : akhQuranPages}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setAkhQuranPages(isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    placeholder="0"
                    className="flex-1 bg-black/35 text-center text-white border border-white/15 focus:border-gold-brand/50 rounded-xl py-2 font-poppins text-sm outline-none"
                  />

                  <button
                    onClick={() => setAkhQuranPages((prev) => prev + 1)}
                    className="p-2.5 bg-black/20 border border-white/10 rounded-xl hover:border-gold-brand/30 active:scale-95 transition-all text-white cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-gold-brand" />
                  </button>
                </div>
              </div>

              {/* 3. Daily Tasbih count input */}
              <div className="space-y-2">
                <label className="font-bengali text-sm font-bold text-gray-300 flex items-center justify-between">
                  <span>📿 সকাল-সন্ধ্যা ও নফল যিকির আদায় (সংখ্যা)</span>
                  <span className="font-sans text-xs text-gold-brand font-bold bg-white/5 px-2 py-0.5 rounded-md">
                    লক্ষ্য: ১০০ বার
                  </span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAkhZikirCount((prev) => Math.max(0, prev - 10))}
                    className="p-2.5 bg-black/20 border border-white/10 rounded-xl hover:border-gold-brand/30 active:scale-95 transition-all text-white cursor-pointer flex items-center justify-center text-xs font-sans text-amber-500 font-bold"
                  >
                    -১০
                  </button>
                  
                  <input
                    type="number"
                    value={akhZikirCount === 0 ? "" : akhZikirCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setAkhZikirCount(isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    placeholder="0"
                    className="flex-1 bg-black/35 text-center text-white border border-white/15 focus:border-gold-brand/50 rounded-xl py-2 font-poppins text-sm outline-none"
                  />

                  <button
                    onClick={() => setAkhZikirCount((prev) => prev + 10)}
                    className="p-2.5 bg-black/20 border border-white/10 rounded-xl hover:border-gold-brand/30 active:scale-95 transition-all text-white cursor-pointer flex items-center justify-center text-xs font-sans text-emerald-500 font-bold"
                  >
                    +১০
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-0.5">
                  <button onClick={() => setAkhZikirCount((prev) => prev + 33)} className="py-1.5 bg-black/15 text-[10px] text-gray-400 border border-white/5 rounded-lg active:scale-95 hover:border-white/15 transition-all cursor-pointer font-bold font-sans">+৩৩ বার</button>
                  <button onClick={() => setAkhZikirCount(100)} className="py-1.5 bg-black/15 text-[10px] text-gray-400 border border-white/5 rounded-lg active:scale-95 hover:border-white/15 transition-all cursor-pointer font-bold font-sans">১০০ বার (লক্ষ্য)</button>
                  <button onClick={() => setAkhZikirCount(0)} className="py-1.5 bg-black/15 text-[10px] text-[#E74C3C]/60 border border-white/5 rounded-lg active:scale-95 hover:border-[#E74C3C]/30 transition-all cursor-pointer font-bold font-bengali">পরিষ্কার</button>
                </div>
              </div>

              {/* 4 & 5 Sadaqah and Roza Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* sadaqah */}
                <button
                  onClick={() => setAkhSadaqah((p) => !p)}
                  className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-20 select-none cursor-pointer ${
                    akhSadaqah 
                      ? "bg-red-500/10 border-red-500/40 text-red-100" 
                      : "bg-black/20 border-white/5 text-gray-400 hover:border-white/10"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bengali text-xs font-bold block">দান সদকাহ / ভালো কাজ</span>
                    <Heart className={`w-4 h-4 ${akhSadaqah ? "text-red-500 fill-red-500 animate-pulse" : "text-gray-600"}`} />
                  </div>
                  <span className="font-bengali text-[10px] text-gray-500 block">অন্যদের দান করেছেন বা হাসিমুখে কথা বলেছেন?</span>
                </button>

                {/* roza */}
                <button
                  onClick={() => setAkhRoza((p) => !p)}
                  className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-20 select-none cursor-pointer ${
                    akhRoza 
                      ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-100" 
                      : "bg-black/20 border-white/5 text-gray-400 hover:border-white/10"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bengali text-xs font-bold block">নফল রোজা / সিয়াম</span>
                    <Moon className={`w-4 h-4 ${akhRoza ? "text-indigo-400 fill-indigo-400" : "text-gray-600"}`} />
                  </div>
                  <span className="font-bengali text-[10px] text-gray-500 block">আজ কি রোজা পালন করছেন?</span>
                </button>
              </div>
            </div>

            {/* Weekly Progress Graph Using Pure CSS Bars */}
            <div className="bg-card-brand p-5 rounded-2xl border border-white/10 space-y-4">
              <h3 className="font-bengali text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-gold-brand" /> সাপ্তাহিক আমল ইতিহাস (৭ দিন)
              </h3>
              
              <div className="flex justify-between items-end h-28 bg-black/15 p-3 rounded-xl border border-gold-brand/5 pt-6 select-none shadow-inner">
                {finalWeeklyData.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1 space-y-1 h-full justify-end group">
                    <div className="relative w-4 bg-zinc-850 rounded-md h-full flex items-end">
                      <div 
                        className="w-full bg-gradient-to-t from-gold-brand/70 to-emerald-500 rounded-md transition-all duration-300 relative group-hover:brightness-110" 
                        style={{ height: `${val}%` }}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-sans text-[8px] font-bold text-gold-brand opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black px-1 rounded-sm border border-gold-brand/20 z-10">
                          {val}%
                        </span>
                      </div>
                    </div>
                    <span className="font-bengali text-[8px] text-gray-500 font-bold whitespace-nowrap truncate max-w-full">
                      {DAYS_LABELS[idx]}
                    </span>
                  </div>
                ))}
              </div>
              <p className="font-bengali text-[10px] text-gray-400 text-center leading-normal">
                বি.দ্র. প্রতিদিন মধ্যরাতে (১২:০০ AM) আমল ড্যাশবোর্ড নতুন দিনের জিরো আমল দিয়ে রিসেট হয়।
              </p>
            </div>
          </motion.div>
        )}

        {/* ============================== PORTAL 3: RAMADAN MODE ============================== */}
        {activeSegment === "ramadan" && (
          <motion.div
            key="ramadan_section_full_v"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Ramadan Activation Toggle block */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-teal-950/30 to-brand-bg border border-emerald-500/25 relative overflow-hidden space-y-3 shadow-md">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Moon className="w-24 h-24 text-emerald-400" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-bengali text-xs uppercase tracking-widest text-emerald-400 font-extrabold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-emerald-400" /> রমজানুল মুবারক স্পেশাল
                </span>
                
                <button
                  onClick={handleRamadanToggle}
                  className={`px-3 py-1 text-xs rounded-xl font-bold cursor-pointer transition-all ${
                    ramadanModeActive
                      ? "bg-emerald-500 text-black font-black"
                      : "bg-zinc-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {ramadanModeActive ? "✓ সক্রিয়" : "সক্রিয় করুন"}
                </button>
              </div>

              <h2 className="font-bengali text-xl font-black text-white leading-snug">রমজান মোড (Ramadan Special)</h2>
              <p className="font-bengali text-xs text-gray-300 leading-relaxed">
                পবিত্র মাহে রমজানের রহমত, মাগফিরাত ও নাজাত অর্জনের জন্য বিশেষ কাউন্টডাউন, পারাপার খতম ট্র্যাকার এবং যাকাত হিসাব সেবা।
              </p>
            </div>

            {/* RENDER DYNAMIC PORTIONS ONLY IF ACTIVATED */}
            {!ramadanModeActive ? (
              <div className="bg-card-brand/40 border border-dashed border-gold-brand/20 p-8 rounded-2xl text-center space-y-3">
                <p className="font-bengali text-sm text-gray-400">
                  রমজানের বিশেষ আমল, সুবহে সাদেক / সেহরি ও ইফতারের রিয়েলটাইম কাউন্টডাউন ও কুইজ অ্যাক্সেস করতে রমজান মোড চালু করুন।
                </p>
                <button
                  onClick={handleRamadanToggle}
                  className="font-bengali text-xs font-black bg-gold-brand text-black px-5 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  রমজান মোড সক্রিয় করুন
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* 1. SEHRI & IFTAR REALTIME COUNTDOWN CARD */}
                <div className="bg-card-brand border border-gold-brand/15 p-5 rounded-2xl relative overflow-hidden space-y-4 text-center">
                  <span className="font-bengali text-[10px] text-gray-500 block uppercase tracking-widest">
                    {countdownLabel || "কাউন্টডাউন রানিং..."}
                  </span>
                  
                  <div className="font-sans text-3.5xl font-black text-gold-brand tracking-widest drop-shadow animate-pulse">
                    {countdownText || "00:00:00"}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2.5 border-t border-white/5 text-center">
                    <div className="space-y-0.5">
                      <span className="font-bengali text-[10px] text-gray-400">সেহরি শেষ (Fajr):</span>
                      <span className="font-sans text-xs font-bold text-white block">{ramadanTimings.sehri}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-bengali text-[10px] text-gray-400">ইফতারের সময় (Maghrib):</span>
                      <span className="font-sans text-xs font-bold text-emerald-400 block">{ramadanTimings.iftar}</span>
                    </div>
                  </div>
                </div>

                {/* 2. QURAN KHATM TRACKER (30 PARTS) */}
                <div className="bg-card-brand p-5 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h3 className="font-bengali text-sm font-bold text-white flex items-center gap-1.5">
                      <BookOpenCheck className="w-4 h-4 text-gold-brand" /> কোরআন খতম ট্র্যাকার (৩০ পারা)
                    </h3>
                    <span className="font-sans text-xs font-bold text-gold-brand">
                      {Math.round((khatmParts.length / 30) * 100)}% সম্পন্ন
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-zinc-800 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-gold-brand to-emerald-500 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.round((khatmParts.length / 30) * 100)}%` }}
                    />
                  </div>

                  <p className="font-bengali text-xs text-gray-400 leading-normal">
                    মাহে রমজানে পুরো কোরআন খতম করার জন্য আপনি যেকোনো পারায় ক্লিক করে পড়া হয়েছে তা চিহ্নিত করে রাখুন।
                  </p>

                  {/* 30 Para Grid */}
                  <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((partNum) => {
                      const isDone = khatmParts.includes(partNum);
                      return (
                        <button
                          key={partNum}
                          onClick={() => toggleKhatmPart(partNum)}
                          className={`py-1.5 rounded-xl font-sans text-xs font-bold flex items-center justify-center transition-all cursor-pointer border select-none ${
                            isDone
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 scale-[0.98]"
                              : "bg-black/20 border-white/5 text-gray-400 hover:border-white/15"
                          }`}
                        >
                          P-{partNum}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. DAILY RAMADAN CHALLENGE CARDS */}
                <div className="bg-card-brand p-5 rounded-2xl border border-white/10 space-y-3">
                  <h3 className="font-bengali text-sm font-black text-white flex items-center gap-1.5 pb-2 border-b border-white/5">
                    <Star className="w-3.5 h-3.5 text-yellow-500" /> আজকের নেক আমল চ্যালেঞ্জ
                  </h3>

                  <div className="space-y-2.5">
                    {[
                      { id: 1, title: "আজ অন্তত ১ জন দরিদ্র রোগীকে খাবার খাওয়ান বা যথাসাধ্য সাহায্য করুন।" },
                      { id: 2, title: "আজ রাগ নিয়ন্ত্রণ করুন, সারাদিন কারও সাথে ঝগড়াবিবাদ এবং কটূ কথা বলবেন না।" },
                      { id: 3, title: "অন্তত ১০ বার দরূদ শরীফ পাঠ করুন এবং মা-বাবার নেক হায়াত অর্জনে মোনাজাত করুন।" },
                      { id: 4, title: "কোনো ছোট ইসলামিক হাদীসের অনুবাদ মুখস্থ করে পরিবারের অন্তত ১ জনকে শোনান।" },
                      { id: 5, title: "আজ রাতে ঘুমানোর আগে অন্তত ২ রাকাত সালাতুল তাহাজ্জুদ আদায় করার চেষ্টা করুন।" }
                    ].map((item) => {
                      const complete = challengeDeeds.includes(item.id);
                      return (
                        <div 
                          key={item.id}
                          onClick={() => toggleDeedChallenge(item.id)}
                          className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer select-none transition-all ${
                            complete 
                              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                              : "bg-black/20 border-white/5 text-gray-300 hover:border-white/10"
                          }`}
                        >
                          <div className="mt-0.5">
                            {complete ? (
                              <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded border border-gray-600 shrink-0" />
                            )}
                          </div>
                          <span className="font-bengali text-xs leading-relaxed">{item.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. REALTIME ZAKAT CALCULATOR */}
                <div className="bg-card-brand p-5 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="font-bengali text-sm font-black text-white flex items-center gap-2 pb-1.5 border-b border-white/5">
                    <Coins className="w-4 h-4 text-gold-brand animate-bounce" /> যাকাতে হিসেব ক্যালকুলেটর (Zakat)
                  </h3>

                  <p className="font-bengali text-xs text-gray-400 leading-normal">
                    সোনার নিসাব (৮৭.৪৮ গ্রাম) অথবা রূপার নিসাব (৬১২.৩৬ গ্রাম) সমপরিমাণ সম্পদের ওপর ২.৫% যাকাত আদায় করা ফরজ। রূপার নিসাব সর্বনিম্ন ধরে হিসাব করুন:
                  </p>

                  <div className="space-y-3">
                    {/* inputs with labels */}
                    <div className="grid grid-cols-2 gap-3 text-xs font-bengali">
                      <div className="space-y-1">
                        <span className="text-gray-300">সোনার পরিমাণ (গ্রাম):</span>
                        <input
                          type="number"
                          value={zakatGoldGrams}
                          onChange={(e) => setZakatGoldGrams(e.target.value)}
                          placeholder="e.g. 10g"
                          className="w-full bg-black/40 text-white p-2 border border-white/10 focus:border-gold-brand/50 rounded-xl outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-300">রূপার পরিমাণ (গ্রাম):</span>
                        <input
                          type="number"
                          value={zakatSilverGrams}
                          onChange={(e) => setZakatSilverGrams(e.target.value)}
                          placeholder="e.g. 50g"
                          className="w-full bg-black/40 text-white p-2 border border-white/10 focus:border-gold-brand/50 rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs font-bengali">
                      <span className="text-gray-300">ব্যাংক ব্যালেন্স ও অতিরিক্ত নগদ সঞ্চয় (টাকা):</span>
                      <input
                        type="number"
                        value={zakatCash}
                        onChange={(e) => setZakatCash(e.target.value)}
                        placeholder="e.g. 50000 BDT"
                        className="w-full bg-black/40 text-white p-2 border border-white/10 focus:border-gold-brand/50 rounded-xl outline-none"
                      />
                    </div>

                    {/* Adjustable price configurations */}
                    <div className="grid grid-cols-2 gap-3 text-[10px] font-bengali pt-1.5 border-t border-white/5 text-gray-400">
                      <div className="space-y-0.5">
                        <span>সোনা প্রতি গ্রাম দাম (BDT):</span>
                        <input 
                          type="number" 
                          value={zakatGoldPrice} 
                          onChange={(e) => setZakatGoldPrice(parseFloat(e.target.value) || 0)} 
                          className="bg-black/30 text-white border border-white/5 p-1 text-center w-full rounded outline-none" 
                        />
                      </div>
                      <div className="space-y-0.5">
                        <span>রূপা প্রতি গ্রাম দাম (BDT):</span>
                        <input 
                          type="number" 
                          value={zakatSilverPrice} 
                          onChange={(e) => setZakatSilverPrice(parseFloat(e.target.value) || 0)} 
                          className="bg-black/30 text-white border border-white/5 p-1 text-center w-full rounded outline-none" 
                        />
                      </div>
                    </div>

                    {/* Output result */}
                    <div className="p-3 bg-black/40 rounded-xl border border-gold-brand/10 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bengali text-gray-400">
                        <span>আপনার মোট সম্পদ (BDT):</span>
                        <span className="font-sans font-bold text-white">{totalWealthBDT.toLocaleString()} BDT</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bengali text-gray-400">
                        <span>রূপার সর্বনিম্ন নিসাব সীমা:</span>
                        <span className="font-sans font-bold text-amber-500">{Math.round(nisabThresholdSilver).toLocaleString()} BDT</span>
                      </div>
                      
                      <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-1.5">
                        <span className="font-bengali text-xs font-bold text-white">প্রদেয় যাকাত (২.৫%):</span>
                        <div className="text-right">
                          <span className="font-sans text-lg font-black text-emerald-400 block">
                            {payableZakatBDT.toLocaleString()} BDT
                          </span>
                          <span className="font-bengali text-[9px] text-[#2ECC71] block font-bold">
                            {isNisabReached ? "✓ আপনার উপর যাকাত ফরজ" : "যাকাত ফরজ নয় (নিসাব স্পর্শ করেনি)"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </motion.div>
        )}

        {/* ============================== PORTAL 4: GAMIFICATION & KIDS CORNER ============================== */}
        {activeSegment === "gamification" && (
          <motion.div
            key="gamification_and_rewards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Streak & Score Banner */}
            <div className="p-4.5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-yellow-950/20 to-brand-bg border border-gold-brand/20 flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1 max-w-[70%]">
                <span className="font-poppins text-[10px] bg-gold-brand/10 text-gold-brand px-2 py-0.5 rounded font-black">
                  Spiritual Milestones
                </span>
                <h3 className="font-bengali text-base font-black text-white">আমার অর্জন ও পুরস্কারসমূহ</h3>
                <p className="font-bengali text-xs text-gray-400 leading-normal">
                  প্রতিদিন ৫ ওয়াক্ত সালাত ও চমৎকার ওহীর আমল পূর্ণ করার মাধ্যমে স্ট্রিক সংরক্ষণ করুন।
                </p>
              </div>

              {/* Fire Flame badge for Streak */}
              <div className="flex flex-col items-center justify-center p-2 bg-black/35 rounded-xl border border-gold-brand/25 relative">
                <Flame className="w-8 h-8 text-amber-500 animate-bounce" />
                <span className="font-sans text-xs font-black text-white mt-1 block">{streakCount} দিন</span>
                <span className="font-bengali text-[8px] text-gray-500 font-bold block whitespace-nowrap">সালাত স্ট্রিক</span>
              </div>
            </div>

            {/* Badges System Grid */}
            <div className="bg-card-brand p-5 rounded-2xl border border-white/10 space-y-4">
              <h3 className="font-bengali text-sm font-bold text-white flex items-center gap-2 pb-1 bg-gradient-to-r from-transparent via-transparent to-transparent">
                <Trophy className="w-4 h-4 text-gold-brand" /> চমৎকার ঈমানী ব্যাজ
              </h3>

              <div className="grid grid-cols-2 gap-3.5 select-none">
                {/* Badge 1: Namaz Champion */}
                <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center space-y-2 transition-all duration-300 relative ${
                  badgeStreakEarned 
                    ? "bg-gradient-to-br from-indigo-950/45 to-black/40 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.25)]" 
                    : "bg-black/25 border-white/5 opacity-50"
                }`}>
                  <div className={`p-3 rounded-full relative ${badgeStreakEarned ? "bg-indigo-500/10 text-indigo-400" : "bg-zinc-800 text-gray-600"}`}>
                    <Crown className="w-8 h-8 filter drop-shadow" />
                    {!badgeStreakEarned && <span className="absolute inset-0 flex items-center justify-center text-xs">🔒</span>}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bengali text-xs font-black text-white block">সালাত চ্যাম্পিয়ন</span>
                    <p className="font-bengali text-[9px] text-gray-400 leading-normal">
                      ৭ দিন টানা ৫ ওয়াক্ত সালাত আদায় করার স্ট্রিক
                    </p>
                  </div>
                </div>

                {/* Badge 2: Quran Reader */}
                <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center space-y-2 transition-all duration-300 relative ${
                  badgeQuranEarned 
                    ? "bg-gradient-to-br from-emerald-950/45 to-black/40 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]" 
                    : "bg-black/25 border-white/5 opacity-50"
                }`}>
                  <div className={`p-3 rounded-full relative ${badgeQuranEarned ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-gray-600"}`}>
                    <BookOpenCheck className="w-8 h-8 filter drop-shadow" />
                    {!badgeQuranEarned && <span className="absolute inset-0 flex items-center justify-center text-xs">🔒</span>}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bengali text-xs font-black text-white block">কুরআন তিলাওয়াতকারী</span>
                    <p className="font-bengali text-[9px] text-gray-400 leading-normal">
                      আজকের দিনে অন্তত ১০ পৃষ্ঠা কোরআন পড়া
                    </p>
                  </div>
                </div>

                {/* Badge 3: Ramadan Hero */}
                <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center space-y-2 transition-all duration-300 relative ${
                  badgeRamadanEarned 
                    ? "bg-gradient-to-br from-amber-950/45 to-black/40 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)]" 
                    : "bg-black/25 border-white/5 opacity-50"
                }`}>
                  <div className={`p-3 rounded-full relative ${badgeRamadanEarned ? "bg-amber-500/10 text-amber-400" : "bg-zinc-800 text-gray-600"}`}>
                    <Star className="w-8 h-8 filter drop-shadow" />
                    {!badgeRamadanEarned && <span className="absolute inset-0 flex items-center justify-center text-xs">🔒</span>}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bengali text-xs font-black text-white block">রমজানুল মুজাহিদ</span>
                    <p className="font-bengali text-[9px] text-gray-400 leading-normal">
                      রমজানের অন্তত ৩টি চ্যালেঞ্জ বা কোরআনের পারা শেষ
                    </p>
                  </div>
                </div>

                {/* Badge 4: Zikir Specialist */}
                <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center space-y-2 transition-all duration-300 relative ${
                  badgeZikirEarned 
                    ? "bg-gradient-to-br from-teal-950/45 to-black/40 border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.25)]" 
                    : "bg-black/25 border-white/5 opacity-50"
                }`}>
                  <div className={`p-3 rounded-full relative ${badgeZikirEarned ? "bg-teal-500/10 text-teal-400" : "bg-zinc-800 text-gray-600"}`}>
                    <Zap className="w-8 h-8 filter drop-shadow" />
                    {!badgeZikirEarned && <span className="absolute inset-0 flex items-center justify-center text-xs">🔒</span>}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bengali text-xs font-black text-white block">যিকির সাধক</span>
                    <p className="font-bengali text-[9px] text-gray-400 leading-normal">
                      ১০০ বার তসবিহ বা যিকির সম্পন্ন করা
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Spiritual Challenge */}
            <div className="bg-card-brand border border-white/10 p-5 rounded-2xl space-y-3">
              <h3 className="font-bengali text-sm font-bold text-white flex items-center gap-1.5 pb-1">
                📅 এই সপ্তাহের আধ্যাত্মিক চ্যালেঞ্জ
              </h3>
              
              <div className="p-3 bg-gold-brand/5 border border-gold-brand/15 rounded-xl space-y-2.5">
                <p className="font-bengali text-xs text-gray-300 leading-relaxed">
                  <strong>চ্যালেঞ্জ:</strong> এই সপ্তাহে প্রতিদিন ৪ ওয়াক্ত নফল সালাত (যেমন চাশত বা তাহাজ্জুদ) পড়ার চেষ্টা করুন এবং অন্তত ৩ জন এতিম বা দরিদ্রকে খাদ্য কিনে দিন।
                </p>

                <button
                  onClick={handleWeeklyClaim}
                  disabled={weeklyClaimed}
                  className={`w-full py-2 rounded-xl font-bengali text-xs font-black transition-all cursor-pointer ${
                    weeklyClaimed 
                      ? "bg-zinc-800 text-gray-500 cursor-not-allowed" 
                      : "bg-gold-brand text-black hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  {weeklyClaimed ? "✓ চ্যালেঞ্জ রিওয়ার্ড সংগ্রহ করেছেন" : "চ্যালেঞ্জ সম্পন্ন করে পয়েন্ট নিন"}
                </button>
              </div>
            </div>

            {/* ============================== CHILDREN ISLAMIC CORNER ============================== */}
            <div className="p-5 bg-gradient-to-r from-pink-950/45 via-rose-955/20 to-indigo-950/40 rounded-2xl border-2 border-dashed border-rose-500/30 space-y-5">
              <span className="font-bengali text-[9px] bg-rose-500/20 text-rose-300 px-2.5 py-1 rounded-full uppercase tracking-widest font-black inline-block">
                🍒 বাচ্চাদের ইসলামিক কর্নার (Kids Corner)
              </span>

              <div className="space-y-0.5">
                <h4 className="font-bengali text-[15px] font-black text-white">শিশুদের ছোট ছোট নবীর গল্প ও মজার কুইজ</h4>
                <p className="font-bengali text-xs text-gray-300 leading-normal">
                  ছোট্ট সোনামণিদের জন্য সহজ ভাষার শিক্ষণীয় দ্বীনি গল্প এবং মজার কুইজ খেলা।
                </p>
              </div>

              {/* LIST OF STORY BADGES */}
              <div className="space-y-2 pt-1 border-t border-white/5">
                <span className="font-bengali text-[11px] text-rose-300 block font-bold">📖 নিচের যেকোনো গল্পে ক্লিক করে সম্পূর্ণ পড়ে নাও:</span>
                
                <div className="grid grid-cols-1 gap-2">
                  {KIDS_STORIES.map((sty) => (
                    <div key={sty.id} className="rounded-xl overflow-hidden bg-black/25 border border-white/5">
                      <button
                        onClick={() => setSelectedStory(selectedStory === sty.id ? null : sty.id)}
                        className="w-full p-2.5 text-left flex items-center justify-between font-bengali text-xs font-bold text-white hover:bg-white/5 transition-all outline-none"
                      >
                        <span className="flex items-center gap-1.5 text-ellipsis overflow-hidden">
                          <span>{sty.icon}</span> {sty.title}
                        </span>
                        <span className="text-gray-500 text-[10px] shrink-0">
                          {selectedStory === sty.id ? "বন্ধ করো ▴" : "পড়ো ▾"}
                        </span>
                      </button>

                      {selectedStory === sty.id && (
                        <div className="p-3 bg-black/40 border-t border-white/5 font-bengali text-xs text-gray-300 leading-relaxed pr-4">
                          {sty.content}
                          <div className="mt-2 text-rose-400 font-bold text-[10px] text-right">
                            মাশাআল্লাহ! ঈমান শিখলাম।
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* KIDS ISLAMIC QUIZ PANEL */}
              <div className="bg-black/35 p-4 rounded-xl border border-white/10 space-y-3.5">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="font-bengali text-xs font-black text-white flex items-center gap-1">
                    🎯 কুইজ খেলে পুরস্কার জিতো!
                  </span>
                  <span className="font-sans text-[10px] font-bold text-rose-300">
                    প্রশ্ন: {activeKidsQuizIndex + 1}/{KIDS_QUIZ_QUESTIONS.length}
                  </span>
                </div>

                {!kidsQuizFinished ? (
                  <div className="space-y-3">
                    {/* The Active question text */}
                    <div className="p-2 bg-gradient-to-r from-rose-500/10 to-indigo-500/10 rounded-lg">
                      <p className="font-bengali text-xs text-white font-bold leading-relaxed">
                        {KIDS_QUIZ_QUESTIONS[activeKidsQuizIndex].question}
                      </p>
                    </div>

                    {/* Quiz hints */}
                    <span className="font-bengali text-[9px] text-gray-400 block tracking-normal italic pl-1">
                      হিন্টস: {KIDS_QUIZ_QUESTIONS[activeKidsQuizIndex].hint}
                    </span>

                    {/* Option button grids */}
                    <div className="grid grid-cols-1 gap-2">
                      {KIDS_QUIZ_QUESTIONS[activeKidsQuizIndex].options.map((opt, oIdx) => {
                        const isSelected = kidsQuizSelectedOption === oIdx;
                        const isCorrect = oIdx === KIDS_QUIZ_QUESTIONS[activeKidsQuizIndex].answer;
                        
                        let optBtnStyle = "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10";
                        if (kidsQuizSelectedOption !== null) {
                          if (isSelected) {
                            optBtnStyle = isCorrect 
                              ? "bg-emerald-500/25 border-emerald-500 text-emerald-300"
                              : "bg-red-500/25 border-red-500 text-red-300";
                          } else if (isCorrect) {
                            // Show the correct one in green anyway
                            optBtnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300";
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleKidsQuizOptionClick(oIdx)}
                            className={`w-full py-2 px-3 text-left font-bengali text-xs transition-all rounded-lg border cursor-pointer ${optBtnStyle}`}
                          >
                            {oIdx + 1}. {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5 text-center py-2">
                    <Trophy className="w-12 h-12 text-gold-brand mx-auto animate-bounce" />
                    <div className="space-y-1 text-center">
                      <h5 className="font-bengali text-sm font-black text-white">অভিনন্দন চমৎকার খেলেছো!</h5>
                      <p className="font-bengali text-xs text-gray-400 leading-normal">
                        তুমি ১০টি প্রশ্নের মধ্যে <strong className="text-rose-400 font-sans text-sm font-black">{kidsQuizScore}টি</strong> সঠিক উত্তর দিয়েছ।
                      </p>
                    </div>

                    <p className="font-bengali text-[10px] text-emerald-400 font-extrabold max-w-[90%] mx-auto leading-normal bg-emerald-500/10 p-1.5 rounded border border-emerald-500/20">
                      {kidsQuizScore >= 8 
                        ? "মাশাআল্লাহ! তুমি তো অনেক জানো, চমৎকার ঈমানদার বুদ্ধিজীবী তুমি!" 
                        : "খুব দারুণ চেষ্টা করেছ! গল্পগুলো আরেকবার পড়ে পুনরায় চেষ্টা করো।"
                      }
                    </p>

                    <button
                      onClick={handleRestartQuiz}
                      className="font-bengali text-xs font-black bg-gold-brand text-black px-4 py-1.5 rounded-lg active:scale-95 transition-transform"
                    >
                      আবার খেলো কুইজ
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ============================== PORTAL 5: CERTIFICATE GENERATOR ============================== */}
        {activeSegment === "certificate" && (
          <motion.div
            key="islamic_certificate_generator_panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="text-center py-4 bg-gradient-to-r from-gold-brand/5 via-gold-brand/10 to-gold-brand/5 rounded-2xl border border-gold-brand/10">
              <span className="text-2xl">📜</span>
              <h3 className="font-bengali text-lg font-black text-gold-brand mt-1">ইসলামিক সনদপত্র জেনারেটর</h3>
              <p className="font-bengali text-xs text-gray-400 mt-1">আপনার গৌরবময় সফল অর্জনের প্রশংসাসূচক সনদপত্র ডাউনলোড করুন</p>
            </div>

            {!showCertificate ? (
              <div className="bg-card-brand rounded-2xl border border-gold-brand/10 p-5 space-y-4 shadow-sm text-left">
                <div className="space-y-1.5 text-left">
                  <label className="font-bengali text-xs text-gray-300 font-bold">পূর্ণ নাম (বাংলা অথবা ইংরেজি)</label>
                  <input
                    type="text"
                    value={certName}
                    onChange={(e) => {
                      setCertName(e.target.value);
                      localStorage.setItem("certificate_user_name", e.target.value);
                    }}
                    placeholder="যেমনঃ মুহাম্মাদ তামিম দরি"
                    className="w-full bg-black/20 text-white rounded-xl border border-gold-brand/20 px-4 py-3 placeholder:text-gray-500 font-bengali text-sm focus:outline-none focus:ring-1 focus:ring-gold-brand"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="font-bengali text-xs text-gray-300 font-bold">সনদ বা সার্টিফিকেট এর ক্যাটাগরি</label>
                  <select
                    value={certType}
                    onChange={(e) => setCertType(e.target.value as any)}
                    className="w-full bg-card-brand text-gray-200 rounded-xl border border-gold-brand/20 px-4 py-3 font-bengali text-sm focus:outline-none focus:ring-1 focus:ring-gold-brand cursor-pointer"
                  >
                    <option value="quran">কুরআন খতম সার্টিফিকেট</option>
                    <option value="hadith">হাদিস কোর্স সার্টিফিকেট</option>
                    <option value="ramadan">রমজান চ্যালেঞ্জ সার্টিফিকেট</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    if (!certName.trim()) {
                      alert("অনুগ্রহ করে আপনার নামটি লিখুন!");
                      return;
                    }
                    setShowCertificate(true);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 via-gold-brand to-amber-600 hover:brightness-110 active:scale-[0.99] text-black font-bengali font-extrabold text-sm rounded-xl select-none transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <Crown className="w-4 h-4 text-black" /> ৫ সেকেন্ডে সার্টিফিকেট তৈরি করুন
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Responsive horizontal aspect wrapper with safe rendering */}
                <div className="w-full overflow-x-auto pb-2 scrollbar-none">
                  {/* Certificate preview area carefully sized for horizontal landscape capture */}
                  <div
                    id="certificate-preview-area"
                    className="relative w-[760px] h-[525px] bg-[#0E1724] text-white flex flex-col justify-between p-12 select-none border border-gold-brand/40 overflow-hidden mx-auto rounded-md shadow-2xl"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {/* SVG Intricate Luxury Gold Borders */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 760 525" fill="none">
                      <rect x="18" y="18" width="724" height="489" rx="12" stroke="#C9A227" strokeWidth="3" />
                      <rect x="25" y="25" width="710" height="475" rx="8" stroke="#C9A227" strokeWidth="1" strokeDasharray="6 3" opacity="0.7" />
                      <rect x="30" y="30" width="700" height="465" rx="6" stroke="#C9A227" strokeWidth="1.2" opacity="0.4" />
                      
                      {/* Corner Ornamental Medallions */}
                      {/* Top-Left */}
                      <path d="M18 45 L45 18 M28 28 L40 40 M18 55 M55 18" stroke="#C9A227" strokeWidth="2" />
                      <circle cx="36" cy="36" r="4" fill="#C9A227" />
                      {/* Top-Right */}
                      <path d="M742 45 L715 18 M732 28 L720 40" stroke="#C9A227" strokeWidth="2" />
                      <circle cx="724" cy="36" r="4" fill="#C9A227" />
                      {/* Bottom-Left */}
                      <path d="M18 480 L45 507 M28 497 L40 485" stroke="#C9A227" strokeWidth="2" />
                      <circle cx="36" cy="489" r="4" fill="#C9A227" />
                      {/* Bottom-Right */}
                      <path d="M742 480 L715 507 M732 497 L720 485" stroke="#C9A227" strokeWidth="2" />
                      <circle cx="724" cy="489" r="4" fill="#C9A227" />
                    </svg>

                    {/* Top Islamic Crescent Branding Header */}
                    <div className="z-10 text-center flex flex-col items-center mt-2">
                      <div className="relative flex items-center justify-center">
                        <svg className="w-10 h-10 text-[#C9A227] drop-shadow-[0_0_6px_rgba(201,162,39,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor"/>
                        </svg>
                        <span className="absolute text-[9px] font-black pointer-events-none text-black mt-0.5">নূর</span>
                      </div>
                      <h4 className="font-bengali text-sm font-bold tracking-widest text-[#C9A227] mt-1">নূরের পথ - আলোর পথে চলো</h4>
                      <p className="font-amiri text-xs text-gray-400 italic tracking-wider mt-0.5">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                    </div>

                    {/* Center Title Content */}
                    <div className="z-10 text-center px-12 -mt-4">
                      <h2 className="font-bengali text-2xl font-black text-[#C9A227] bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-wide">
                        {certType === "quran" && "পবিত্র কুরআন খতম সম্মাননা সনদপত্র"}
                        {certType === "hadith" && "ইলম ও হাদিস কোর্স সফলতা প্রশংসাপত্র"}
                        {certType === "ramadan" && "রমজানুল মুবারক সিয়াম ও তাকওয়া প্রশংসাপত্র"}
                      </h2>
                      
                      <p className="font-bengali text-[13px] text-gray-300 leading-relaxed font-bold mt-3">
                        {certType === "quran" && "এই মোবারক প্রশংসাপত্র সগৌরবে প্রদান করা যাচ্ছে যে,"}
                        {certType === "hadith" && "এই সম্মানজনক ডিক্লেয়ারেশন ও প্রশংসাপত্র প্রদান করা যাচ্ছে যে,"}
                        {certType === "ramadan" && "এই পবিত্র ও মহিমান্বিত ডিক্লেয়ারেশন প্রদান করা যাচ্ছে যে,"}
                      </p>

                      {/* User's Name displayed in super elegant luxury styled font */}
                      <h1 className="font-sans font-extrabold text-3xl py-1 my-2 tracking-wide text-transparent bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text border-b border-dashed border-[#C9A227]/30 max-w-[80%] mx-auto drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                        {certName}
                      </h1>

                      <p className="font-bengali text-xs text-gray-300 max-w-[85%] mx-auto leading-relaxed mt-1 font-bold">
                        {certType === "quran" && "পবিত্র কুরআন মাজীদের শিক্ষাসমূহ হৃদয়ে ধারণ করে অত্যন্ত সফলতার সহিত কুরআনুল কারীমের খতম ও তিলাওয়াত সম্পন্ন করার গৌরবময় আধ্যাত্মিক কৃতিত্ব অর্জন করায় এই বিশেষ স্বীকৃতিস্বরূপ সম্মাননা সনদ প্রদান করা হল।"}
                        {certType === "hadith" && "রাসুলুল্লাহ (সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম)-এর নূর ছড়ানো সহীহ সুন্নাহ ও অমূল্য হাদিস শিক্ষার পাঠ্যক্রম অত্যন্ত মনোযোগ, শৃঙ্খলা এবং ধারাবাহিক নিষ্ঠার সাথে সফলভাবে সম্পন্ন করার মাধ্যমে সুন্নাহর অতন্দ্র প্রহরী হওয়ার গৌরব অর্জন করেছেন।"}
                        {certType === "ramadan" && "আল্লাহ রাব্বুল আলামীনের প্রতি অশেষ মহব্বতে তাকওয়া ও আত্মসংযমের পবিত্র মাহে রমজানের সিয়াম সাধনা, তারাবীহ, কিয়ামুল লাইল এবং আত্মশুদ্ধির কঠিন শারীরিক ও মানসিক চ্যালেঞ্জগুলো বিজয়ী ধৈর্যের সাথে সফলভাবে সম্পন্ন করেছেন।"}
                      </p>
                    </div>

                    {/* Footer Row containing Seals & Watermarks */}
                    <div className="z-10 flex items-end justify-between px-6 mb-1 text-left">
                      
                      {/* Left: Certificate date stamp */}
                      <div className="flex flex-col text-left">
                        <span className="font-bengali text-[10px] text-gray-400 uppercase">সনদ প্রদানের তারিখ</span>
                        <span className="font-bengali text-xs text-amber-200/90 font-bold mt-0.5">
                          {(() => {
                            const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
                            const bnNums = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
                            const cleanY = (y: number) => String(y).split("").map(c => !isNaN(parseInt(c)) ? bnNums[parseInt(c)] : c).join("");
                            const cleanD = (d: number) => String(d).split("").map(c => !isNaN(parseInt(c)) ? bnNums[parseInt(c)] : c).join("");
                            const now = new Date();
                            return `${cleanD(now.getDate())} ${months[now.getMonth()]}, ${cleanY(now.getFullYear())} ইং`;
                          })()}
                        </span>
                        <span className="font-sans text-[8px] text-gray-500 font-bold mt-1 tracking-wider uppercase">VERIFIED SECURE DIGITALLY</span>
                      </div>

                      {/* Center: RS Digital Hub Luxury Gold Stamped Seal */}
                      <div className="relative flex flex-col items-center justify-center -mb-2">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#C9A227]/70 bg-gradient-to-br from-amber-600/20 to-black flex items-center justify-center relative shadow-inner">
                          {/* Inner gold circular crest */}
                          <div className="w-12 h-12 rounded-full border border-[#C9A227] bg-[#0E1724] flex flex-col items-center justify-center text-center">
                            <span className="font-sans text-[6px] font-black text-amber-300 uppercase tracking-widest leading-none">RS HUB</span>
                            <span className="text-[10px] text-amber-400 mt-0.5 leading-none">⭐</span>
                            <span className="font-sans text-[5px] text-gray-400 leading-none mt-0.5 uppercase">APPROVED</span>
                          </div>
                          {/* Subtle vector ribbon */}
                          <div className="absolute -bottom-1 w-8 h-2.5 bg-amber-500 rounded-sm flex items-center justify-center shadow opacity-90">
                            <span className="text-[5px] font-black text-black select-none uppercase tracking-widest">SEAL</span>
                          </div>
                        </div>
                        <p className="font-sans text-[8px] text-amber-400/90 font-bold tracking-wider mt-2 bg-black/45 px-2 py-0.5 rounded-full uppercase border border-[#C9A227]/20">PRESENTED BY RS DIGITAL HUB</p>
                      </div>

                      {/* Right: Signature Watermark of developer */}
                      <div className="flex flex-col text-right">
                        <span className="font-sans text-[9px] font-black text-white italic tracking-wider border-b border-[#C9A227]/40 pb-0.5">Tamim Dary</span>
                        <span className="font-bengali text-[9px] text-gray-400 tracking-wider mt-1">ডেভেলপার ও প্রযুক্তি উপদেষ্টা</span>
                        <span className="font-sans text-[8px] text-gray-500 mt-0.5 uppercase tracking-wider">DEVELOPED BY TAMIM DARY</span>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  <button
                    onClick={() => {
                      setDownloadingCert(true);
                      setTimeout(() => {
                        const target = document.getElementById("certificate-preview-area");
                        if (target && (window as any).html2canvas) {
                          (window as any).html2canvas(target, {
                            scale: 2.2,
                            useCORS: true,
                            backgroundColor: "#0E1724"
                          }).then((canvas: any) => {
                            const link = document.createElement("a");
                            link.download = `${certName || "certificate"}_noorer_poth.png`;
                            link.href = canvas.toDataURL("image/png");
                            link.click();
                            setDownloadingCert(false);
                          }).catch((err: any) => {
                            console.error(err);
                            setDownloadingCert(false);
                            alert("ডাউনলোডে সমস্যা সৃষ্টি হয়েছে, দয়া করে আবার চেষ্টা করুন।");
                          });
                        } else {
                          setDownloadingCert(false);
                          alert("ডাউনলোড লাইব্রেরি লোড হয়নি অথবা রেন্ডারিং ত্রুটি।");
                        }
                      }, 400);
                    }}
                    disabled={downloadingCert}
                    className={`font-bengali text-xs font-black bg-gold-brand text-black py-3 px-4 rounded-xl cursor-pointer hover:brightness-110 active:scale-95 transition-transform flex items-center justify-center gap-1.5 ${downloadingCert ? "opacity-65 animate-pulse cursor-not-allowed" : ""}`}
                  >
                    {downloadingCert ? "ডাউনলোড হচ্ছে..." : "সনদ ডাউনলোড করুন 🎉"}
                  </button>
                  <button
                    onClick={() => {
                      setShowCertificate(false);
                      setCertName("");
                    }}
                    className="font-bengali text-xs font-black bg-[#152335] text-gold-brand border border-gold-brand/20 py-3 px-4 rounded-xl hover:bg-gold-brand/10 active:scale-95 transition-all text-center"
                  >
                    নতুন প্রশংসাপত্র তৈরি
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ============================== PORTAL 6: AI ISLAMIC ASSISTANT ============================== */}
        {activeSegment === "ai_assistant" && (
          <motion.div
            key="ai_islamic_assistant_hud_portal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            <div className="text-center py-4 bg-gradient-to-r from-gold-brand/5 via-gold-brand/10 to-gold-brand/5 rounded-2xl border border-gold-brand/10 flex flex-col items-center">
              <span className="w-9 h-9 rounded-full bg-gold-brand/15 flex items-center justify-center text-gold-brand drop-shadow-[0_0_5px_rgba(201,162,39,0.3)] select-none">
                <Sparkles className="w-5 h-5" />
              </span>
              <h3 className="font-bengali text-lg font-black text-gold-brand mt-1.5">এআই ইসলামিক সহকারী</h3>
              <p className="font-bengali text-xs text-gray-400 mt-1 max-w-[85%]">পবিত্র কুরআন ও সহীহ সুন্নাহর নির্ভরযোগ্য আলোকে ধর্মীয় যেকোনো জিজ্ঞাসার সুন্দর ব্যাখ্যা পান</p>
            </div>

            {/* API Key Gatekeepers */}
            {!geminiApiKey.trim() ? (
              <div className="bg-card-brand rounded-2xl border border-gold-brand/15 p-5 text-left space-y-4">
                <div className="flex gap-3 items-start select-none">
                  <span className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-lg mt-0.5">⚠️</span>
                  <div>
                    <h4 className="font-bengali text-xs font-bold text-gray-200">Gemini API Key সংযুক্ত করুন</h4>
                    <p className="font-bengali text-[11px] text-gray-400 leading-relaxed mt-0.5">সুরক্ষা বিধান মেনে চ্যাট এআই সক্রিয় করতে আপনার নিজস্ব এপিআই কি প্রয়োজন। এটি আপনার ফোনে সম্পূর্ণ সুরক্ষিত থাকবে।</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-left relative">
                  <label className="font-bengali text-xs text-gray-300 font-bold flex justify-between">
                    <span>আপনার Gemini API Key</span>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline text-[10px]">ফ্রি এপিআই কি পেতে ভিজিট করুন ↗</a>
                  </label>
                  <div className="relative">
                    <input
                      type={apiKeyVisible ? "text" : "password"}
                      value={geminiApiKey}
                      onChange={(e) => {
                        setGeminiApiKey(e.target.value);
                        localStorage.setItem("islamic_ast_api_key", e.target.value);
                      }}
                      placeholder="AIzaSy..."
                      className="w-full bg-black/25 text-white rounded-xl border border-gold-brand/20 pr-12 pl-4 py-3 placeholder:text-gray-600 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-gold-brand"
                    />
                    <button
                      type="button"
                      onClick={() => setApiKeyVisible(!apiKeyVisible)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-[10px] font-sans uppercase scroll-none select-none bg-transparent"
                    >
                      {apiKeyVisible ? "অদৃশ্য" : "দৃশ্য"}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!geminiApiKey.trim()) {
                      alert("অনুগ্রহ করে একটি এআই কি প্রদান করুন।");
                    }
                  }}
                  disabled={!geminiApiKey.trim()}
                  className="w-full py-2.5 bg-gold-brand text-black font-bengali font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer shadow disabled:opacity-50"
                >
                  সহকারী আনলক করুন
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Utilities Floating Bar */}
                <div className="flex items-center justify-between gap-2 bg-[#101b2a] border border-gold-brand/10 px-4 py-2.5 rounded-xl text-xs">
                  <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-bengali font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    সহকারী সক্রিয় আছে
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleStartAiQuiz}
                      className="text-amber-400 hover:text-white bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 font-bengali font-extrabold text-[10px] active:scale-95 hover:bg-amber-500/20 select-none scroll-none"
                    >
                      🎰 ইসলামিক কুইজ খেলুন
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("আপনি কি চ্যাট হিস্ট্রি মুছে দিতে চান?")) {
                          const fresh = [
                            { role: "model" as const, text: "আসসালামু আলাইকুম! আমি 'নূরের পথ' ইসলামিক এআই সহকারী। কোরআন এবং সুন্নাহর আলোকে আপনার যেকোনো ধর্মীয় বা ইসলামিক প্রশ্নের উত্তর দিতে আমি প্রস্তুত। অনুগ্রহ করে নিচে আপনার নিজের Gemini API কি (Key) প্রদান করে বাংলা ভাষায় যেকোনো প্রশ্ন করুন।" }
                          ];
                          setChatMessages(fresh);
                          localStorage.setItem("islamic_chat_history", JSON.stringify(fresh));
                        }
                      }}
                      className="text-gray-400 hover:text-red-400 font-bengali font-bold text-[10px]"
                    >
                      মুছে দিন
                    </button>
                    <button
                      onClick={() => {
                        setGeminiApiKey("");
                        localStorage.removeItem("islamic_ast_api_key");
                      }}
                      className="text-gray-400 hover:text-gray-100 font-sans text-[10px] underline ml-1"
                    >
                      KEY পরিবর্তন
                    </button>
                  </div>
                </div>

                {/* Main Dynamic Panel: AI Generated Interactive Quiz or Standard Chat UI */}
                {aiQuizActive ? (
                  <div className="bg-[#0f1d2c] border border-gold-brand/20 rounded-2xl p-5 text-left space-y-4 relative overflow-hidden shadow-xl">
                    {/* Floating Close Button */}
                    <button
                      onClick={() => setAiQuizActive(false)}
                      className="absolute right-4 top-4 text-xs font-bengali bg-[#1a2e44] text-gray-300 font-bold px-2 py-1 rounded hover:bg-red-900/40 select-none scroll-none"
                    >
                      কুইজ বন্ধ করুন ✕
                    </button>

                    <h4 className="font-bengali text-xs font-black text-amber-400 tracking-wider flex items-center gap-1 uppercase">
                      <Sparkles className="w-3.5 h-3.5" /> এআই ইসলামিক কুইজ
                    </h4>

                    {aiQuizLoading ? (
                      <div className="text-center py-12 space-y-4">
                        <div className="w-9 h-9 border-2 border-gold-brand border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="font-bengali text-xs text-gray-400 animate-pulse">Gemini এআই আপনার জন্য ৫টি চমৎকার মোবারক প্রশ্ন সাজাচ্ছে, অনুগ্রহ করে একটু অপেক্ষা করুন...</p>
                      </div>
                    ) : aiQuizError ? (
                      <div className="text-center py-8 space-y-3">
                        <p className="font-bengali text-xs text-red-400">{aiQuizError}</p>
                        <button
                          onClick={handleStartAiQuiz}
                          className="px-4 py-1.5 bg-amber-500 hover:bg-gold-brand text-black font-bengali text-xs font-bold rounded-lg"
                        >
                          পুনরায় চেষ্টা করুন
                        </button>
                      </div>
                    ) : aiQuizFinished ? (
                      <div className="text-center py-8 space-y-4">
                        <span className="text-4xl">🏆</span>
                        <h4 className="font-bengali text-base font-black text-gold-brand">কুইজ সমাপ্ত হয়েছে!</h4>
                        <div className="bg-black/20 p-4 rounded-xl inline-block border border-gold-brand/10">
                          <p className="font-bengali text-xs text-gray-300">আপনার প্রাপ্ত কুইজ স্কোর</p>
                          <p className="font-sans text-3xl font-black text-amber-400 mt-1">{aiQuizScore} / {aiQuizQuestions.length}</p>
                        </div>
                        <p className="font-bengali text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                          {aiQuizScore === 5 && "মাশাআল্লাহ! দ্বীনি জ্ঞানে আপনার এই অসাধারণ গভীরতায় আমরা ধন্য ও চির কৃতজ্ঞ। সুবহানাল্লাহ!"}
                          {aiQuizScore >= 3 && aiQuizScore < 5 && "আলহামদুলিল্লাহ! আপনার চমৎকার ইসলামিক জ্ঞান স্পষ্ট লক্ষ্যণীয়। জ্ঞান বৃদ্ধি অব্যাহত রাখুন।"}
                          {aiQuizScore < 3 && "মাশাআল্লাহ, দারুন চেষ্টা করেছেন। কুরআন মাজীদ ও হাদিসের অমূল্য বাণী বেশি বেশি পড়ে পুনরায় চেষ্টা করতে পারেন।"}
                        </p>
                        <button
                          onClick={handleStartAiQuiz}
                          className="font-bengali text-xs font-black bg-gold-brand text-black px-5 py-2.5 rounded-xl active:scale-95 transition-transform"
                        >
                          নতুন কুইজ অবতীর্ণ করুন 🎰
                        </button>
                      </div>
                    ) : aiQuizQuestions.length > 0 ? (
                      <div className="space-y-4">
                        {/* Question Tracker Header */}
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bengali text-gray-400 font-bold">প্রশ্ন সংখ্যাঃ {aiQuizCurrentIdx + 1} / {aiQuizQuestions.length}</span>
                          <span className="font-bengali text-amber-300 font-black">চলতি স্কোরঃ {aiQuizScore}</span>
                        </div>
                        
                        {/* Progress Bar indicator */}
                        <div className="w-full h-1 bg-black/30 rounded-full overflow-hidden">
                          <div 
                            className="bg-gold-brand h-full" 
                            style={{ width: `${((aiQuizCurrentIdx + 1) / aiQuizQuestions.length) * 100}%` }}
                          />
                        </div>

                        <div className="space-y-1">
                          <p className="font-bengali text-sm font-black text-white leading-relaxed">
                            {aiQuizQuestions[aiQuizCurrentIdx].question}
                          </p>
                          {aiQuizQuestions[aiQuizCurrentIdx].hint && (
                            <p className="font-bengali text-[10px] text-gray-400 italic">⭐ ইঙ্গিত: {aiQuizQuestions[aiQuizCurrentIdx].hint}</p>
                          )}
                        </div>

                        {/* Options list in beautiful grid schema */}
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {aiQuizQuestions[aiQuizCurrentIdx].options.map((opt, idx) => {
                            let optionStyle = "border-gold-brand/10 bg-gold-brand/5 text-gray-300 hover:bg-gold-brand/10";
                            if (aiQuizSelectedOpt !== null) {
                              if (idx === aiQuizQuestions[aiQuizCurrentIdx].answer) {
                                optionStyle = "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-black";
                              } else if (idx === aiQuizSelectedOpt) {
                                optionStyle = "bg-red-500/20 border-red-400 text-red-300";
                              } else {
                                optionStyle = "opacity-45 bg-black/10 border-transparent text-gray-500";
                              }
                            }

                            return (
                              <button
                                key={idx}
                                disabled={aiQuizSelectedOpt !== null}
                                onClick={() => {
                                  if (aiQuizSelectedOpt !== null) return;
                                  setAiQuizSelectedOpt(idx);
                                  if (idx === aiQuizQuestions[aiQuizCurrentIdx].answer) {
                                    setAiQuizScore((prev) => prev + 1);
                                  }
                                  setTimeout(() => {
                                    if (aiQuizCurrentIdx < aiQuizQuestions.length - 1) {
                                      setAiQuizCurrentIdx((p) => p + 1);
                                      setAiQuizSelectedOpt(null);
                                    } else {
                                      setAiQuizFinished(true);
                                    }
                                  }, 2000);
                                }}
                                className={`w-full py-2.5 px-4 font-bengali text-xs rounded-xl border text-left cursor-pointer transition-all active:scale-[0.99] flex justify-between items-center ${optionStyle}`}
                              >
                                <span>{opt}</span>
                                {aiQuizSelectedOpt !== null && idx === aiQuizQuestions[aiQuizCurrentIdx].answer && (
                                  <span className="text-emerald-400">✓ সঠিক</span>
                                )}
                                {aiQuizSelectedOpt !== null && idx === aiQuizSelectedOpt && idx !== aiQuizQuestions[aiQuizCurrentIdx].answer && (
                                  <span className="text-red-400">✕ ভুল</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  /* Standard Chat Interface */
                  <div className="flex flex-col h-[400px] border border-gold-brand/10 rounded-2xl bg-black/10 overflow-hidden shadow-inner font-sans relative">
                    {/* Messages Panel Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 text-left scrollbar-none scroll-smooth">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-2.5`}
                        >
                          {msg.role !== "user" && (
                            <span className="w-6 h-6 rounded-full bg-gold-brand/15 text-gold-brand border border-gold-brand/20 flex items-center justify-center font-bold text-[9px] mt-0.5 select-none shrink-0 uppercase">এআই</span>
                          )}
                          <div
                            className={`px-3.5 py-2.5 rounded-2xl text-[12px] font-bengali leading-relaxed max-w-[85%] ${
                              msg.role === "user"
                                ? "bg-gold-brand text-black font-semibold rounded-tr-none hover:bg-gold-brand/95 shadow"
                                : "bg-card-brand text-gray-200 rounded-tl-none border border-gold-brand/5 relative"
                            }`}
                          >
                            <p className="whitespace-pre-line">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                      
                      {/* Loading Animation indicator */}
                      {chatLoading && (
                        <div className="flex justify-start items-center gap-2.5 select-none animate-pulse">
                          <span className="w-6 h-6 rounded-full bg-gold-brand/15 text-gold-brand border border-gold-brand/20 flex items-center justify-center font-bold text-[9px] shrink-0 uppercase">এআই</span>
                          <div className="px-4 py-3 rounded-2xl bg-card-brand rounded-tl-none border border-gold-brand/5 flex items-center gap-2 text-xs">
                            <span className="w-1.5 h-1.5 bg-gold-brand rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 bg-gold-brand rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 bg-gold-brand rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            <span className="font-bengali text-[10px] text-gray-400 ml-1">এআই কোরআন হাদিস মন্থন করছে...</span>
                          </div>
                        </div>
                      )}

                      {/* Chat error notice with dynamic Retry trigger */}
                      {chatError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center space-y-2 select-none">
                          <p className="font-bengali text-xs text-red-400 font-bold leading-relaxed">{chatError}</p>
                          <button
                            onClick={handleSendChatMessage}
                            className="text-[10px] uppercase font-sans font-bold bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded-md"
                          >
                            RETRY SEND ↺
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Footer Prompt Input controls */}
                    <div className="p-3 border-t border-gold-brand/10 bg-black/25 flex gap-2 items-center">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendChatMessage();
                          }
                        }}
                        disabled={chatLoading}
                        placeholder="আপনার মনে জাগ্রত যেকোনো ইসলামিক জিজ্ঞাসা টাইপ করুন..."
                        className="flex-1 bg-black/35 text-white rounded-xl border border-gold-brand/20 px-3 py-2.5 placeholder:text-gray-600 font-bengali text-xs focus:outline-none focus:ring-1 focus:ring-gold-brand disabled:opacity-50"
                      />
                      <button
                        onClick={handleSendChatMessage}
                        disabled={chatLoading || !chatInput.trim()}
                        className="p-2.5 rounded-xl bg-gold-brand text-black hover:brightness-110 disabled:opacity-40 disabled:scale-100 active:scale-95 transition-all flex items-center justify-center cursor-pointer shrink-0"
                      >
                        <ArrowRight className="w-4 h-4 text-black font-black" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* ============================== PORTAL 7: APP SETTINGS AND CONTACTS HUB ============================== */}
        {activeSegment === "settings" && (
          <motion.div
            key="original_application_settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="text-center py-4 bg-gradient-to-r from-gold-brand/5 via-gold-brand/10 to-gold-brand/5 rounded-2xl border border-gold-brand/10">
              <p className="font-amiri text-2xl text-gold-brand tracking-wide font-semibold">
                بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>
              <p className="font-bengali text-xs text-[#2ECC71] mt-1.5 font-bold">
                পরম করুণাময় অতি দয়ালু আল্লাহর নামে
              </p>
            </div>

            <div className="bg-card-brand rounded-2xl border border-gold-brand/10 p-2 divide-y divide-gold-brand/5 shadow-sm">
              <div className="flex items-center justify-between p-4 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gold-brand/10 rounded-lg text-gold-brand">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bengali text-sm font-bold text-text-brand block">
                      দৈনন্দিন নোটিফিকেশন
                    </span>
                    <span className="font-bengali text-[10px] text-gray-400">
                      সালাতের ওয়াক্ত ও আমলের রিমাইন্ডার
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleNotification}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center cursor-pointer ${
                    notificationActive ? "bg-gold-brand" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`w-4 shadow h-4 bg-white rounded-full absolute transition-transform ${
                      notificationActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div 
                onClick={() => {
                  const nextLang = lang === "bn" ? "en" : "bn";
                  if (onChangeLang) {
                    onChangeLang(nextLang);
                  }
                  localStorage.setItem("app_language", nextLang);
                }}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gold-brand/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gold-brand/10 rounded-lg text-gold-brand">
                    <Languages className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bengali text-sm font-bold text-text-brand block">
                      {lang === "bn" ? "অ্যাপের ভাষা (Language)" : "App Language"}
                    </span>
                    <span className="font-bengali text-[10px] text-gray-400">
                      {lang === "bn" ? "Bengali / বাংলা সিলেক্ট করা রয়েছে" : "English has been selected"}
                    </span>
                  </div>
                </div>
                <span className="font-bengali text-xs text-gold-brand font-bold bg-gold-brand/10 px-2.5 py-1 rounded">
                  {lang === "bn" ? "বাংলা" : "English"}
                </span>
              </div>

              <div 
                onClick={() => {
                  const shareText = "নূরের পথ - আলোর পথে চলো। ইসলাম ও সঠিক পথের সন্ধান পেতে কুরআন, হাদিস, নামাজ ও দোয়া শিক্ষা এবং দিকনির্দেশক অ্যাপ।";
                  if (navigator.share) {
                    navigator.share({ title: "নূরের পথ", text: shareText }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(shareText);
                    alert("লিঙ্ক কপি করা হয়েছে!");
                  }
                }}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gold-brand/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gold-brand/10 rounded-lg text-gold-brand">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bengali text-sm font-bold text-text-brand block">
                      বন্ধুদের সাথে শেয়ার করুন
                    </span>
                    <span className="font-bengali text-[10px] text-gray-400">
                      নেক কাজের দাওয়াত ছড়িয়ে দিন
                    </span>
                  </div>
                </div>
                <span className="text-gray-400">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="border-[3px] border-double border-gold-brand/40 p-6 rounded-2xl bg-gradient-to-br from-card-brand to-gold-brand/5 relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gold-brand/5 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-brand-primary/5 rounded-full blur-xl" />

              <div className="relative z-10 space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="font-bengali text-lg font-black text-gold-brand tracking-wide">
                    যোগাযোগ করুন
                  </h3>
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-8 h-[1px] bg-gold-brand/35" />
                    <p className="font-amiri text-xs text-gray-500 italic">
                      ইসলামিক ডেভেলপমেন্ট পার্টনার
                    </p>
                    <div className="w-8 h-[1px] bg-gold-brand/35" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bengali text-xs uppercase tracking-widest text-[#2ECC71] font-bold flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5" />
                    প্রতিষ্ঠাতা ও ডেভেলপার
                  </h4>

                  <div className="glass-effect p-4 rounded-xl border border-gold-brand/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bengali text-sm font-black text-text-brand block">
                        {contactData.developer.name}
                      </span>
                      <span className="font-poppins text-[10px] bg-gold-brand/10 text-gold-brand font-bold px-2 py-0.5 rounded-full">
                        Lead Dev
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pt-1">
                      <a
                        href={contactData.developer.whatsappLink}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="flex items-center gap-2.5 text-xs text-text-brand hover:text-gold-brand transition-colors p-1.5 rounded bg-brand-bg/40 font-poppins"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-semibold">{contactData.developer.whatsapp}</span>
                        <span className="text-[10px] font-bengali text-gray-400 ml-auto">
                          (হোয়াটসঅ্যাপ মেসেজ)
                        </span>
                      </a>

                      <a
                        href={`mailto:${contactData.developer.email}`}
                        className="flex items-center gap-2.5 text-xs text-text-brand hover:text-gold-brand transition-colors p-1.5 rounded bg-brand-bg/40 font-poppins"
                      >
                        <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-semibold">{contactData.developer.email}</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bengali text-xs uppercase tracking-widest text-[#2ECC71] font-bold flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" />
                    উপস্থাপনায়
                  </h4>

                  <div className="glass-effect p-4 rounded-xl border border-gold-brand/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bengali text-sm font-black text-text-brand">
                        {contactData.presentedBy.name}
                      </span>
                      <span className="font-poppins text-[10px] bg-brand-primary/15 text-brand-primary dark:text-[#2ECC71] font-bold px-2 py-0.5 rounded-full">
                        Media Hub
                      </span>
                    </div>

                    <a
                      href={`mailto:${contactData.presentedBy.email}`}
                      className="flex items-center gap-2.5 text-xs text-text-brand hover:text-gold-brand transition-colors p-1.5 rounded bg-brand-bg/40 font-poppins"
                    >
                      <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="font-semibold">{contactData.presentedBy.email}</span>
                    </a>

                    <div className="pt-1.5 border-t border-gold-brand/5">
                      <p className="font-bengali text-[10px] text-gray-500 mb-2">
                        আমাদের সোশ্যাল হ্যান্ডেল সমূহ:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {contactData.presentedBy.channels.map((ch, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 text-[10px] font-sans font-bold bg-gold-brand/10 text-gold-brand px-2.5 py-1 rounded-full border border-gold-brand/5 cursor-default select-none transition-transform hover:scale-105"
                          >
                            <span className="w-1 h-1 bg-gold-brand rounded-full" />
                            {ch.platform}: {ch.handle}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <p className="font-bengali text-[10px] text-gray-400 tracking-wide font-medium">
                    নূরের পথ অ্যাপে যুক্ত থাকার জন্য আপনাকে ধন্যবাদ।
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
