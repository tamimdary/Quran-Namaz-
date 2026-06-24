import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, ArrowLeft, ChevronRight, Search, Bookmark, Check } from "lucide-react";
import { BENGALI_SURAHS } from "../surahData.ts";
import { dailyVerse } from "../data.ts";
import { translationDict } from "../translationUtils.ts";

interface SurahListItem {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface AyahItem {
  number: number;
  numberInSurah: number;
  text: string;
  bengaliMeaning: string;
  englishMeaning: string;
  pronunciation: string;
}

interface SavedBookmark {
  surahNumber: number;
  surahNameBangla: string;
  ayahNumberInSurah: number;
  text: string;
  bengaliMeaning: string;
}

interface QuranViewProps {
  lang: "bn" | "en" | "ar";
}

export default function QuranView({ lang }: QuranViewProps) {
  const dict = translationDict[lang || "bn"];

  const [viewMode, setViewMode] = useState<"list" | "surahDetail" | "bookmarks">("list");
  const [surahs, setSurahs] = useState<SurahListItem[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<SurahListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSurah, setSelectedSurah] = useState<SurahListItem | null>(null);
  const [selectedSurahAyahs, setSelectedSurahAyahs] = useState<AyahItem[]>([]);
  
  // Bookmarks & Last Read State
  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>([]);
  const [mushafMode, setMushafMode] = useState<boolean>(false);
  const [playingAyahNumber, setPlayingAyahNumber] = useState<number | null>(null);

  // Loaders and Errors
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // 1. Initial Load: list of surahs from Alquran Cloud API
  useEffect(() => {
    setIsLoadingList(true);
    setErrorMsg("");
    fetch("https://api.alquran.cloud/v1/surah")
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.data && Array.isArray(payload.data)) {
          setSurahs(payload.data);
          setFilteredSurahs(payload.data);
        } else {
          throw new Error("Invalid API payload");
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg("সূরা তালিকা লোড করতে ব্যর্থ হয়েছে। ইন্টারনেট চেক করুন।");
      })
      .finally(() => {
        setIsLoadingList(false);
      });

    // Load Bookmarks
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nures-path-bookmarks-v2");
      if (saved) {
        try {
          setBookmarks(JSON.parse(saved));
        } catch (_) {
          // ignore
        }
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Filter surahs list on search query
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSurahs(surahs);
      return;
    }
    const term = searchTerm.toLowerCase();
    const matches = surahs.filter((s) => {
      const bnInfo = BENGALI_SURAHS[s.number];
      const bnName = bnInfo ? bnInfo.nameBangla.toLowerCase() : "";
      const bnMeaning = bnInfo ? bnInfo.meaningBangla.toLowerCase() : "";
      return (
        s.number.toString() === term ||
        s.englishName.toLowerCase().includes(term) ||
        bnName.includes(term) ||
        bnMeaning.includes(term)
      );
    });
    setFilteredSurahs(matches);
  }, [searchTerm, surahs]);

  // Load Surah details including translation and pronunciation
  const loadSurahDetails = (surah: SurahListItem) => {
    setSelectedSurah(surah);
    setIsLoadingDetail(true);
    setErrorMsg("");
    setPlayingAyahNumber(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Parallel calls: Arabic + Bengali Translation + English Translation
    const arabicUrl = `https://api.alquran.cloud/v1/surah/${surah.number}/quran-uthmani`;
    const bnMeaningUrl = `https://api.alquran.cloud/v1/surah/${surah.number}/bn.bengali`;
    const enMeaningUrl = `https://api.alquran.cloud/v1/surah/${surah.number}/en.asad`;

    Promise.all([
      fetch(arabicUrl).then((r) => r.json()),
      fetch(bnMeaningUrl).then((r) => r.json()),
      fetch(enMeaningUrl).then((r) => r.json())
    ])
      .then(([arData, bnData, enData]) => {
        if (arData?.data?.ayahs && bnData?.data?.ayahs && enData?.data?.ayahs) {
          const combined: AyahItem[] = arData.data.ayahs.map((arAyah: any, idx: number) => {
            const bnAyah = bnData.data.ayahs[idx];
            const enAyah = enData.data.ayahs[idx];
            return {
              number: arAyah.number,
              numberInSurah: arAyah.numberInSurah,
              text: arAyah.text,
              bengaliMeaning: bnAyah?.text || "",
              englishMeaning: enAyah?.text || "",
              // Use bn.bengali as requested for simple Bengali pronunciation (FIX 3)
              pronunciation: bnAyah?.text || ""
            };
          });
          setSelectedSurahAyahs(combined);
          setViewMode("surahDetail");
        } else {
          throw new Error("Data parsing failed");
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg("সূরা তথ্য লোড করা সম্ভব হয়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।");
      })
      .finally(() => {
        setIsLoadingDetail(false);
      });
  };

  const playAudio = (verseNumber: number) => {
    if (playingAyahNumber === verseNumber) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAyahNumber(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    setPlayingAyahNumber(verseNumber);
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${verseNumber}.mp3`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.play().catch(() => {
      setPlayingAyahNumber(null);
    });

    audio.onended = () => {
      setPlayingAyahNumber(null);
    };
  };

  const toggleBookmark = (ayah: AyahItem, surahNumber: number, surahName: string) => {
    const isSaved = bookmarks.some((b) => b.surahNumber === surahNumber && b.ayahNumberInSurah === ayah.numberInSurah);
    let updated: SavedBookmark[] = [];
    if (isSaved) {
      updated = bookmarks.filter((b) => !(b.surahNumber === surahNumber && b.ayahNumberInSurah === ayah.numberInSurah));
    } else {
      updated = [
        ...bookmarks,
        {
          surahNumber,
          surahNameBangla: BENGALI_SURAHS[surahNumber]?.nameBangla || surahName,
          ayahNumberInSurah: ayah.numberInSurah,
          text: ayah.text,
          bengaliMeaning: ayah.bengaliMeaning
        }
      ];
    }
    setBookmarks(updated);
    localStorage.setItem("nures-path-bookmarks-v2", JSON.stringify(updated));
  };

  const isAyahBookmarked = (surahNumber: number, ayahNumber: number) => {
    return bookmarks.some((b) => b.surahNumber === surahNumber && b.ayahNumberInSurah === ayahNumber);
  };

  const copyAyahText = (ayah: AyahItem, surahName: string) => {
    const copyString = `আয়াত (${surahName} - ${ayah.numberInSurah}):\n\n${ayah.text}\n\nঅর্থ: ${ayah.bengaliMeaning}`;
    navigator.clipboard.writeText(copyString);
    alert(lang === "bn" ? "ক্লিপবোর্ডে কপি করা হয়েছে!" : "Copied successfully!");
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Title Header Section */}
      {viewMode === "list" && (
        <div className="text-center space-y-2">
          <h2 className="font-bengali text-3xl font-black text-text-brand tracking-wide">
            {dict.quran.title}
          </h2>
          <p className="font-bengali text-xs text-gray-500 max-w-lg mx-auto leading-relaxed">
            {dict.quran.subtitle}
          </p>
        </div>
      )}

      {/* ========================== VIEW 1: SURAH LIST ========================== */}
      {viewMode === "list" && (
        <>
          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={dict.quran.searchPlaceholder}
                className="w-full bg-card-brand border border-gold-brand/20 focus:border-gold-brand px-4 py-2.5 pl-10 rounded-xl font-bengali text-xs text-text-brand focus:outline-none"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              onClick={() => setViewMode("bookmarks")}
              className="text-xs font-bold text-gold-brand bg-gold-brand/10 hover:bg-gold-brand/15 px-3 py-2.5 rounded-xl flex items-center gap-1 cursor-pointer"
            >
              ⭐ {lang === "bn" ? "বুকমার্কসমূহ" : "Bookmarks"} ({bookmarks.length})
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 font-bengali text-sm text-center rounded-xl">
              {errorMsg}
            </div>
          )}

          {isLoadingList ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-10 h-10 border-4 border-gold-brand border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-bengali text-sm text-gold-brand">সূরা তালিকা লোড হচ্ছে...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSurahs.map((surah) => {
                const bnInfo = BENGALI_SURAHS[surah.number];
                return (
                  <div
                    key={surah.number}
                    onClick={() => loadSurahDetails(surah)}
                    className="p-4 bg-card-brand border border-gold-brand/10 hover:border-gold-brand/25 rounded-2xl cursor-pointer flex items-center justify-between shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gold-brand/10 text-gold-brand flex items-center justify-center font-bold font-poppins text-xs border border-gold-brand/10">
                        {surah.number}
                      </div>
                      <div>
                        <h4 className="font-bengali text-base font-bold text-text-brand">
                          {lang === "bn" ? (bnInfo?.nameBangla || surah.englishName) : surah.englishName}
                        </h4>
                        <p className="font-bengali text-[11px] text-gray-400">
                          {lang === "bn" ? `অর্থ: ${bnInfo?.meaningBangla || surah.englishNameTranslation}` : surah.englishNameTranslation} | {lang === "bn" ? `আয়াত: ${surah.numberOfAyahs}` : `Verses: ${surah.numberOfAyahs}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-2">
                      <div>
                        <span className="font-amiri text-lg font-bold text-text-brand block">
                          {surah.name}
                        </span>
                        <span className="text-[9px] text-gold-brand bg-gold-brand/10 px-2 py-0.5 rounded font-bold font-bengali">
                          {surah.revelationType === "Meccan" ? "মাক্কী" : "মাদানী"}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ========================== VIEW 2: SURAH DETAIL ========================== */}
      {viewMode === "surahDetail" && selectedSurah && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
            <button
              onClick={() => setViewMode("list")}
              className="text-xs font-bold text-gold-brand bg-gold-brand/10 hover:bg-gold-brand/15 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              &larr; {lang === "bn" ? "সূরা তালিকা" : "Surahs List"}
            </button>

            <button
              onClick={() => setMushafMode(!mushafMode)}
              className="text-xs font-bold text-gold-brand border border-gold-brand/25 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              {mushafMode ? "📖 সাধারণ মোড" : "📜 মুসহাফ মোড"}
            </button>
          </div>

          {isLoadingDetail ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-10 h-10 border-4 border-gold-brand border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-bengali text-sm text-gold-brand">সূরা লোড হচ্ছে...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Surah Header Card */}
              <div className="bg-card-brand border border-gold-brand/20 p-6 rounded-2xl text-center shadow-sm space-y-2">
                <span className="text-xs font-bold text-gold-brand uppercase tracking-wider block font-poppins">
                  Surah {selectedSurah.number} | {selectedSurah.revelationType}
                </span>
                <h3 className="font-bengali text-2xl font-black text-text-brand">
                  {lang === "bn" ? (BENGALI_SURAHS[selectedSurah.number]?.nameBangla || selectedSurah.englishName) : selectedSurah.englishName}
                </h3>
                <p className="font-bengali text-xs text-gray-400">
                  {lang === "bn" ? `অর্থ: ${BENGALI_SURAHS[selectedSurah.number]?.meaningBangla}` : selectedSurah.englishNameTranslation} | {lang === "bn" ? `${selectedSurah.numberOfAyahs} টি আয়াত` : `${selectedSurah.numberOfAyahs} verses`}
                </p>
                {selectedSurah.number !== 9 && (
                  <div className="font-amiri text-2xl text-gold-brand pt-2 block">
                    {dict.quran.bismillah}
                  </div>
                )}
              </div>

              {/* Ayah List */}
              <div className="space-y-4">
                {selectedSurahAyahs.map((ayah) => {
                  const isPlaying = playingAyahNumber === ayah.number;
                  const isSaved = isAyahBookmarked(selectedSurah.number, ayah.numberInSurah);

                  return (
                    <div
                      key={ayah.numberInSurah}
                      className={`bg-card-brand p-5 rounded-2xl border ${
                        isPlaying ? "border-gold-brand ring-1 ring-gold-brand" : "border-gold-brand/10"
                      } space-y-4`}
                    >
                      {/* Actions row inside verse */}
                      {!mushafMode && (
                        <div className="flex items-center justify-between border-b border-gold-brand/5 pb-2">
                          <span className="w-7 h-7 rounded-full bg-gold-brand/10 border border-gold-brand/15 text-gold-brand font-poppins text-xs font-bold flex items-center justify-center">
                            {ayah.numberInSurah}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => playAudio(ayah.number)}
                              className={`text-xs font-bold font-bengali px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer border ${
                                isPlaying ? "bg-gold-brand text-black border-gold-brand" : "bg-gold-brand/10 text-gold-brand border-transparent"
                              }`}
                            >
                              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                              <span>{isPlaying ? dict.quran.tilawatPause : dict.quran.tilawatLabel}</span>
                            </button>

                            <button
                              onClick={() => toggleBookmark(ayah, selectedSurah.number, selectedSurah.englishName)}
                              className={`p-1.5 rounded-lg border cursor-pointer ${
                                isSaved ? "bg-gold-brand/20 border-gold-brand text-gold-brand" : "bg-gold-brand/5 border-gold-brand/10 text-gray-400 hover:text-gold-brand"
                              }`}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                            </button>

                            <button
                              onClick={() => copyAyahText(ayah, selectedSurah.englishName)}
                              className="p-1.5 rounded-lg bg-gold-brand/5 border border-gold-brand/10 text-gray-400 hover:text-gold-brand cursor-pointer text-xs font-bold"
                            >
                              {dict.general.copy}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Large beautiful Arabic text */}
                      <div className={`text-right font-amiri text-text-brand leading-[2.2] select-all select-none ${mushafMode ? "text-3xl md:text-4xl py-2" : "text-2xl md:text-3xl"}`}>
                        {ayah.text}
                      </div>

                      {/* Meanings / Pronunciations localized */}
                      {!mushafMode && (
                        <div className="pt-3 border-t border-gold-brand/5 space-y-2">
                          {/* Bengali Pronunciation (bn.bengali simple readable Bengali per FIX 3) */}
                          {lang === "bn" && ayah.pronunciation && (
                            <p className="font-bengali text-xs font-medium text-emerald-600 dark:text-emerald-500">
                              <span className="text-[10px] uppercase bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-black mr-2 font-bengali">উচ্চারণ</span>
                              {ayah.pronunciation}
                            </p>
                          )}

                          {/* Meanings based on active language (FIX 7) */}
                          {lang === "bn" && ayah.bengaliMeaning && (
                            <p className="font-bengali text-xs md:text-sm text-gray-500 leading-relaxed font-medium">
                              <span className="text-[10px] bg-gold-brand/10 text-gold-brand px-1.5 py-0.5 rounded font-black mr-2 font-bengali">অনুবাদ</span>
                              {ayah.bengaliMeaning}
                            </p>
                          )}

                          {lang === "en" && ayah.englishMeaning && (
                            <p className="font-poppins text-xs md:text-sm text-gray-500 leading-relaxed">
                              <span className="text-[9px] uppercase bg-gold-brand/10 text-gold-brand px-1.5 py-0.5 rounded font-black mr-2 font-poppins">Translation</span>
                              {ayah.englishMeaning}
                            </p>
                          )}
                          {/* Arabic language mode has Arabic text only, meaning section remains fully empty */}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================== VIEW 3: BOOKMARKS ========================== */}
      {viewMode === "bookmarks" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <button
              onClick={() => setViewMode("list")}
              className="text-xs font-bold text-gold-brand bg-gold-brand/10 hover:bg-gold-brand/15 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              &larr; {lang === "bn" ? "সূরা তালিকা" : "Surahs List"}
            </button>
            <h3 className="font-bengali text-base font-black text-text-brand flex items-center gap-1.5">
              ⭐ {lang === "bn" ? "আপনার বুকমার্কসমূহ" : "Your Bookmarks"}
            </h3>
          </div>

          {bookmarks.length === 0 ? (
            <div className="text-center py-16 bg-card-brand/20 border border-dashed border-gold-brand/15 rounded-2xl flex flex-col items-center justify-center space-y-2">
              <span className="text-3xl">⭐</span>
              <p className="font-bengali text-xs text-gray-500">আপনার কোনো আয়াত বুকমার্ক করা নেই।</p>
              <p className="font-bengali text-[10px] text-gray-400">সূরা পাঠের সময় বুকমার্ক আইকনটিতে ট্যাপ করে পছন্দ তালিকায় আয়াত সংরক্ষণ করুন।</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((b, idx) => (
                <div key={idx} className="bg-card-brand border border-gold-brand/10 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-gold-brand/5 pb-2">
                    <span className="font-bengali text-xs font-bold text-gold-brand">
                      {b.surahNameBangla} - {lang === "bn" ? `আয়াত নং ${b.ayahNumberInSurah}` : `Verse ${b.ayahNumberInSurah}`}
                    </span>
                    <button
                      onClick={() => {
                        const filtered = bookmarks.filter((_, i) => i !== idx);
                        setBookmarks(filtered);
                        localStorage.setItem("nures-path-bookmarks-v2", JSON.stringify(filtered));
                      }}
                      className="text-xs font-bold text-red-500 cursor-pointer"
                    >
                      {lang === "bn" ? "মুছে ফেলুন" : "Delete"}
                    </button>
                  </div>
                  <p className="text-right font-amiri text-lg font-bold text-text-brand leading-relaxed select-none">
                    {b.text}
                  </p>
                  <p className="font-bengali text-xs text-gray-500 font-medium">
                    {lang === "bn" ? b.bengaliMeaning : "Saved bookmark verse translation"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
