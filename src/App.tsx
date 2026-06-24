import { useState, useEffect } from "react";
import Splash from "./components/Splash.tsx";
import Header from "./components/Header.tsx";
import BottomNav from "./components/BottomNav.tsx";
import HomeDashboardView from "./components/HomeDashboardView.tsx";
import QuranView from "./components/QuranView.tsx";
import HadithView from "./components/HadithView.tsx";
import PrayerTimesView from "./components/PrayerTimesView.tsx";
import DuaView from "./components/DuaView.tsx";
import MoreView from "./components/MoreView.tsx";

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(2); // Default to Home tab (index 2)

  // Language state: defaults to Bengali
  const [lang, setLang] = useState<"bn" | "en" | "ar">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("app_language");
      if (saved === "en" || saved === "bn" || saved === "ar") {
        return saved;
      }
    }
    return "bn";
  });
  
  // Theme state: defaults to Day Mode (false) as requested in UPDATE 3
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme_mode");
      if (saved) return saved === "dark";
      return false; // Default to Day mode
    }
    return false;
  });

  // Handle document class manipulation on theme change
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme_mode", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Set document direction for RTL when Arabic is selected
  useEffect(() => {
    const root = window.document.documentElement;
    if (lang === "ar") {
      root.setAttribute("dir", "rtl");
    } else {
      root.setAttribute("dir", "ltr");
    }
  }, [lang]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Helper routine to render active view
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <QuranView lang={lang} />;
      case 1:
        return <HadithView lang={lang} />;
      case 2:
        return <HomeDashboardView key="dashboard" onNavigateToTab={setActiveTab} />;
      case 3:
        return <PrayerTimesView key="prayer" />;
      case 4:
        return <MoreView key="more" lang={lang} onChangeLang={setLang} onNavigateToTab={setActiveTab} />;
      default:
        return <HomeDashboardView key="dashboard" onNavigateToTab={setActiveTab} />;
    }
  };

  const [isOffline, setIsOffline] = useState<boolean>(() => {
    if (typeof navigator !== "undefined") {
      return !navigator.onLine;
    }
    return false;
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen relative font-sans flex flex-col bg-bg-brand text-text-brand overflow-x-hidden antialiased">
      {isOffline && (
        <div className="fixed top-[60px] left-0 right-0 z-50 bg-red-600 text-white text-center py-2 text-xs font-bengali font-bold select-none shadow">
          {lang === "bn" ? "আপনি অফলাইনে আছেন, সংরক্ষিত তথ্য দেখাচ্ছে" : "You are offline, showing cached information"}
        </div>
      )}
      {showSplash ? (
        <Splash key="splash" onComplete={() => setShowSplash(false)} />
      ) : (
        <div className="flex flex-col min-h-screen relative w-full">
          {/* Background pattern layer */}
          <div className="absolute inset-0 islamic-pattern opacity-5 pointer-events-none z-0" />

          {/* Premium Fixed Header */}
          <Header darkMode={darkMode} onToggle={toggleTheme} lang={lang} />

          {/* Central content */}
          <main className="flex-1 w-full pt-[80px] pb-[95px] px-4 md:px-6 relative z-10 max-h-screen overflow-y-auto no-scrollbar scroll-smooth">
            <div className="w-full">
              {renderTabContent()}
            </div>
          </main>

          {/* Fixed Premium Bottom Navigation */}
          <BottomNav activeIndex={activeTab} onChange={(idx) => setActiveTab(idx)} lang={lang} />
        </div>
      )}
    </div>
  );
}
