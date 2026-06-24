import { translationDict } from "../translationUtils.ts";

interface BottomNavProps {
  activeIndex: number;
  onChange: (index: number) => void;
  lang?: "bn" | "en" | "ar";
}

export default function BottomNav({ activeIndex, onChange, lang }: BottomNavProps) {
  const dict = translationDict[lang || "bn"];
  const tabs = [
    {
      label: dict.tabs.quran,
      // DETAILED QURAN ICON (FIX 4) - Detailed pages, binding, ribbon, and radiant sparkles
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Detailed outer book covers */}
          <path d="M2 3c1.5 0 3 .5 4 1.5M22 3c-1.5 0-3 .5-4 1.5" />
          <path d="M6 4.5V19c-1 0-2.5-.5-4-.5M18 4.5V19c1 0 2.5-.5 4-.5" />
          {/* Paper pages thickness details */}
          <path d="M6 19c1.5 0 3 .5 4 1.5M18 19c-1.5 0-3 .5-4 1.5" />
          <path d="M12 6v14.5" strokeWidth="1.2" strokeDasharray="1 1" />
          {/* Hanging bookmark ribbon */}
          <path d="M11 5h2v10l-1-1.5-1 1.5V5z" fill="currentColor" stroke="none" />
          {/* Spiritual glow lines/stars */}
          <path d="M12 2v1.5M3 8.5h1M20 8.5h1" strokeWidth="1" />
        </svg>
      ),
    },
    {
      label: dict.tabs.hadith,
      // DETAILED HADITH SCROLL (FIX 4) - Rolled parchment paper with detailed curl ends and wax seal
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Top detailed scroll roller bar */}
          <path d="M6 4h12c1.1 0 2-.9 2-2s-.9-2-2-2H6C4.9 0 4 .9 4 2s.9 2 2 2z" />
          {/* Bottom detailed scroll roller bar */}
          <path d="M18 20H6c-1.1 0-2 .9-2 2s.9 2 2 2h12c1.1 0 2-.9 2-2s-.9-2-2-2z" />
          {/* Scroll parchment body boundaries */}
          <path d="M4.5 2v18M19.5 2v18" />
          {/* Traditional text lines layout */}
          <path d="M8 7h8M8 11h8M8 15h5" strokeWidth="1.2" />
          {/* Hanging ribbon with wax seal */}
          <path d="M15 20v3.5l1.5-.8 1.5.8V20h-3z" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      label: dict.tabs.home,
      // DETAILED HOME / MOSQUE ENTRANCE (FIX 4) - Dome roof, crescent peak, arched mihrab door
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Sacred Dome as Home Roof */}
          <path d="M12 2c-3.5 0-5 3-5 5h10c0-2-1.5-5-5-5z" />
          <path d="M12 1v1" />
          {/* Main structure walls */}
          <path d="M4 11v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V11" />
          {/* Mihrab/Arched Doorway */}
          <path d="M9 23v-5c0-1.5 1-3 3-3s3 1.5 3 3v5" />
          {/* Miniature islamic star carving */}
          <path d="M12 10l.7.7.7-.7-.7-.7z" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: dict.tabs.prayer,
      // DETAILED MOSQUE / PRAYER TIMES (FIX 4) - Triple dome facade, minarets, crescents, mihrab doors
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Large Center Dome with peak */}
          <path d="M12 6c-2.5 0-3.5 2-3.5 4h7c0-2-1-4-3.5-4z" />
          <path d="M12 4v2" />
          {/* Two Small Side Domes */}
          <path d="M5.5 10c-1.5 0-2 1.5-2 3h4c0-1.5-.5-3-2-3zM18.5 10c-1.5 0-2 1.5-2 3h4c0-1.5-.5-3-2-3z" />
          {/* Heavy Stone Base Wall */}
          <path d="M2 13v9a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-9" />
          {/* Detailed arches and doorways */}
          <path d="M10 23v-5c0-1.1.9-2 2-2s2 .9 2 2v5" />
          <path d="M5 23v-3c0-.5.5-1 1-1s1 .5 1 1v3M17 23v-3c0-.5.5-1 1-1s1 .5 1 1v3" />
          {/* Detailed Tall Minarets */}
          <path d="M2 13V8h1v5M21 13V8h1v5" />
          {/* Minaret peaks */}
          <path d="M2.5 8l-.5-1 .5-1 .5 1zm19 0l-.5-1 .5-1 .5 1z" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      label: dict.tabs.more,
      // DETAILED ISLAMIC GEOMETRIC STAR (FIX 4) - Concentric Rub el Hizb 8-pointed star with circles
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Two perfectly nested overlapping squares forming 8-pointed Rub el Hizb */}
          <rect x="5" y="5" width="14" height="14" rx="1.2" />
          <rect x="5" y="5" width="14" height="14" rx="1.2" transform="rotate(45 12 12)" />
          {/* Inner concentric circular lines */}
          <circle cx="12" cy="12" r="3.2" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[65px] z-40 glass-effect border-t border-[rgba(201,162,39,0.2)] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] px-4 flex items-center justify-around select-none">
      {tabs.map((tab, idx) => {
        const isActive = activeIndex === idx;
        return (
          <button
            key={idx}
            onClick={() => onChange(idx)}
            className="group relative flex flex-col items-center justify-center w-16 h-full cursor-pointer focus:outline-none focus-visible:outline-none active:outline-none overflow-hidden"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {/* Sliding Active Dot indicator above the icon */}
            <div className="absolute top-1 h-1 flex items-center justify-center">
              {isActive && (
                <div className="w-1.5 h-1.5 bg-gold-brand rounded-full shadow-[0_0_8px_rgba(201,162,39,0.9)]" />
              )}
            </div>

            {/* Icon and text space - completely static and instant transition */}
            <div
              className={`flex flex-col items-center gap-1 ${
                isActive ? "text-gold-brand font-bold" : "text-gray-400 dark:text-gray-500"
              }`}
            >
              <div className="pt-2">
                {tab.icon}
              </div>
              <span className="font-bengali text-xs tracking-wide">
                {tab.label}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
