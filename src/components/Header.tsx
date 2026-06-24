import React, { useRef } from "react";
import { useAdmin } from "../AdminContext";
import { translationDict } from "../translationUtils.ts";

interface HeaderProps {
  darkMode: boolean;
  onToggle: () => void;
  lang?: "bn" | "en" | "ar";
}

export default function Header({ darkMode, onToggle, lang }: HeaderProps) {
  const { triggerLogoTap, isAdmin, setShowLoginModal } = useAdmin();
  const lastEventRef = useRef<number>(0);
  const appName = translationDict[lang || "bn"].appName;

  const handleLogoTap = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const now = Date.now();
    if (now - lastEventRef.current < 405) {
      return;
    }
    lastEventRef.current = now;
    triggerLogoTap();
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] z-40 glass-effect flex items-center justify-between px-5 select-none border-b border-[rgba(201,162,39,0.25)] shadow-sm">
      {/* Left side: branding - clicking/tapping triggers Admin login */}
      <div 
        className="flex items-center gap-3 cursor-pointer group active:opacity-80"
        onClick={handleLogoTap}
        onTouchStart={handleLogoTap}
        title="নূরের পথ"
      >
        {/* Detailed golden crescent moon and star logo (FIX 4) */}
        <div className="relative flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gold-brand drop-shadow-[0_0_6px_rgba(201,162,39,0.4)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Elegant crescent moon shape */}
            <path
              d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
              fill="currentColor"
            />
            {/* Detailed 8-point geometric star inside crescent */}
            <path
              d="M16 5.5l.5.8.9-.2-.3.9.7.6-.9.2.1 1-.7-.7-.8.5.2-.9-.7-.5.9-.2-.1-.9z"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        </div>
        <h1 className="font-bengali text-xl font-bold tracking-normal text-text-brand bg-gradient-to-r from-text-brand to-gold-brand bg-clip-text text-transparent">
          {appName}
        </h1>
      </div>

      {/* Right side: Admin indicator & Mode Toggle Button */}
      <div className="flex items-center gap-2">
        {isAdmin && (
          <button
            onClick={() => setShowLoginModal(true)}
            className="p-2.5 rounded-full border border-red-500/20 bg-red-950/20 text-red-400 cursor-pointer flex items-center justify-center"
            title="এডমিন প্যানেল"
          >
            {/* Detailed shield alert SVG (FIX 4) */}
            <svg
              className="w-5 h-5 text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </button>
        )}

        <button
          id="theme-toggle-btn"
          onClick={onToggle}
          className="relative p-2.5 rounded-full border border-gold-brand/20 bg-card-brand/40 text-gold-brand hover:bg-gold-brand/10 shadow-inner flex items-center justify-center cursor-pointer overflow-hidden"
          aria-label="Toggle Theme Mode"
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            {darkMode ? (
              // DETAILED SUN SVG (FIX 4) - Detailed nested circles and flame flares
              <svg
                className="w-5 h-5 text-gold-brand"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" fill="currentColor" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                <circle cx="12" cy="12" r="6" strokeWidth="0.8" strokeDasharray="2 2" />
              </svg>
            ) : (
              // DETAILED MOON SVG (FIX 4) - Detailed craters and shadows
              <svg
                className="w-5 h-5 text-gold-brand"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" />
                {/* Minute craters detail */}
                <circle cx="9" cy="11" r="1.2" fill="var(--brand-bg)" stroke="none" opacity="0.3" />
                <circle cx="13" cy="15" r="0.8" fill="var(--brand-bg)" stroke="none" opacity="0.3" />
                <circle cx="8" cy="16" r="1" fill="var(--brand-bg)" stroke="none" opacity="0.3" />
              </svg>
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
