import { useEffect } from "react";

interface SplashProps {
  onComplete: () => void;
  key?: string;
}

export default function Splash({ onComplete }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500); // reduced splash delay slightly for faster load time
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D1B2A] text-[#F0F0F0] select-none overflow-hidden">
      {/* Golden subtle glow in background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(240,192,64,0.12)_0%,transparent_60%)] pointer-events-none" />

      {/* Subtle Repeating Islamic Star Pattern in background */}
      <div className="absolute inset-0 islamic-pattern opacity-10" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Large Crescent & Star SVG */}
        <div className="relative mb-6 drop-shadow-[0_0_15px_rgba(240,192,64,0.45)]">
          <svg
            className="w-28 h-28 text-[#F0C040]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Elegant Crescent Moon */}
            <path
              d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
              fill="currentColor"
              className="text-[#F0C040]"
            />
            {/* Sparkle Star near the crescent */}
            <path
              d="M18.5 2.5l.3.8.8.3-.8.3-.3.8-.3-.8-.8-.3.8-.3z"
              fill="currentColor"
              className="text-[#FFE380]"
            />
          </svg>
        </div>

        {/* App Name */}
        <h1 className="font-bengali text-5xl font-bold tracking-wide text-[#F0C040] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          নূরের পথ
        </h1>

        {/* Tagline */}
        <p className="font-bengali text-lg tracking-widest mt-4 text-gray-300 font-light">
          আলোর পথে চলো
        </p>
      </div>

      {/* Brand presentation badge */}
      <div className="absolute bottom-8 font-poppins text-xs tracking-wider font-light opacity-40">
        RS Digital Hub
      </div>
    </div>
  );
}
