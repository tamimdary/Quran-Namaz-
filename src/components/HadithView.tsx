import React, { useState, useEffect } from "react";
import { translationDict } from "../translationUtils.ts";

interface HadithBook {
  id: string;
  nameBangla: string;
  nameEnglish: string;
  url: string;
  count: string;
  icon: string;
}

interface RawHadith {
  hadithnumber: number;
  arabicnumber: number;
  text: string;
}

interface SavedHadithBookmark {
  bookId: string;
  hadithNumber: number;
  text: string;
  timestamp: number;
}

const HADITH_BOOKS: HadithBook[] = [
  {
    id: "bukhari",
    nameBangla: "সহিহ বুখারি",
    nameEnglish: "Sahih Bukhari",
    url: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-bukhari.json",
    count: "৭,৫৬৩ টি হাদিস",
    icon: "📖"
  },
  {
    id: "muslim",
    nameBangla: "সহিহ মুসলিম",
    nameEnglish: "Sahih Muslim",
    url: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-muslim.json",
    count: "৭,৪৫৩ টি হাদিস",
    icon: "📚"
  },
  {
    id: "ibnmajah",
    nameBangla: "সুনান ইবনে মাজাহ",
    nameEnglish: "Sunan Ibn Majah",
    url: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-ibnmajah.json",
    count: "৪,৩০০+ টি হাদিস",
    icon: "🕌"
  }
];

// Fallback daily hadiths in Bengali, English, Arabic
const FALLBACK_DAILY_HADITHS = [
  {
    number: 1,
    bn: "নিশ্চয়ই আমল নিয়তের উপর নির্ভরশীল। প্রত্যেক ব্যক্তি তাই পাবে যার সে নিয়ত করবে।",
    en: "Actions are judged by intentions, and every person will get what he intended.",
    ar: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    source: "Sahih Bukhari 1"
  },
  {
    number: 10,
    bn: "প্রকৃত মুসলিম সে-ই, যার মুখ ও হাত থেকে অন্য মুসলিম নিরাপদ থাকে।",
    en: "A true Muslim is one from whose tongue and hand other Muslims are safe.",
    ar: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    source: "Sahih Bukhari 10"
  },
  {
    number: 26,
    bn: "পবিত্রতা ঈমানের অর্ধেক।",
    en: "Purity is half of faith.",
    ar: "الطُّهُورُ شَطْرُ الإِيمَانِ",
    source: "Sahih Muslim 223"
  }
];

interface HadithViewProps {
  lang: "bn" | "en" | "ar";
}

export default function HadithView({ lang }: HadithViewProps) {
  const dict = translationDict[lang || "bn"];

  const [activeBook, setActiveBook] = useState<HadithBook | null>(null);
  const [hadiths, setHadiths] = useState<RawHadith[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(20);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Bookmarks state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<RawHadith[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<SavedHadithBookmark[]>([]);

  // Daily Hadith
  const [dailyHadith, setDailyHadith] = useState<typeof FALLBACK_DAILY_HADITHS[0]>(() => {
    const today = new Date().getDate();
    return FALLBACK_DAILY_HADITHS[today % FALLBACK_DAILY_HADITHS.length];
  });

  // Load Bookmarks from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hadith_bookmarks_v2");
      if (saved) {
        try {
          setBookmarks(JSON.parse(saved));
        } catch (_) {
          // ignore
        }
      }
    }
  }, []);

  // Save Bookmarks to LocalStorage
  const saveBookmarks = (newBookmarks: SavedHadithBookmark[]) => {
    setBookmarks(newBookmarks);
    localStorage.setItem("hadith_bookmarks_v2", JSON.stringify(newBookmarks));
  };

  const toggleBookmark = (hadith: RawHadith) => {
    if (!activeBook) return;
    const exists = bookmarks.find(b => b.bookId === activeBook.id && b.hadithNumber === hadith.hadithnumber);
    if (exists) {
      saveBookmarks(bookmarks.filter(b => !(b.bookId === activeBook.id && b.hadithNumber === hadith.hadithnumber)));
    } else {
      saveBookmarks([...bookmarks, {
        bookId: activeBook.id,
        hadithNumber: hadith.hadithnumber,
        text: hadith.text,
        timestamp: Date.now()
      }]);
    }
  };

  const isBookmarked = (hadithNumber: number) => {
    if (!activeBook) return false;
    return !!bookmarks.find(b => b.bookId === activeBook.id && b.hadithNumber === hadithNumber);
  };

  // Fetch Hadiths from selected book
  const selectBook = async (book: HadithBook) => {
    setLoading(true);
    setError(null);
    setActiveBook(book);
    setHadiths([]);
    setVisibleCount(20);
    setSearchQuery("");
    setSearchResults([]);

    try {
      const response = await fetch(book.url);
      if (!response.ok) {
        throw new Error("হাদিস লোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন।");
      }
      const data = await response.json();
      if (data && Array.isArray(data.hadiths)) {
        setHadiths(data.hadiths);
      } else {
        throw new Error("হাদিসের তথ্য সঠিক ফরম্যাটে পাওয়া যায়নি।");
      }
    } catch (err: any) {
      setError(err.message || "সার্ভার থেকে সঠিক সাড়া পাওয়া যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  // Search logic (Client side search for loaded items)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = hadiths.filter(h => 
      h.hadithnumber.toString() === query || 
      h.text.toLowerCase().includes(query)
    );
    setSearchResults(filtered);
  }, [searchQuery, hadiths]);

  const handleShare = (text: string, title: string) => {
    const shareText = `${title}\n\n${text}\n\n${lang === "bn" ? "অ্যাপ: নূরের পথ" : "App: Noor Path"}`;
    if (navigator.share) {
      navigator.share({ title, text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert(lang === "bn" ? "হাদিসটি ক্লিপবোর্ডে কপি করা হয়েছে!" : "Hadith copied to clipboard!");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(lang === "bn" ? "কপি করা হয়েছে!" : "Copied successfully!");
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Title Header Section */}
      <div className="text-center space-y-2">
        <h2 className="font-bengali text-3xl font-black text-text-brand tracking-wide">
          {dict.hadith.title}
        </h2>
        <p className="font-bengali text-xs text-gray-500 max-w-lg mx-auto leading-relaxed">
          {dict.hadith.subtitle}
        </p>
      </div>

      {!activeBook && !showBookmarksOnly ? (
        <>
          {/* Daily Inspiring Hadith Card */}
          <div className="bg-card-brand border border-gold-brand/20 p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <span className="text-xs font-bold text-gold-brand bg-gold-brand/10 px-3 py-1 rounded-full">
                {lang === "bn" ? "আজকের হাদিস" : lang === "en" ? "Daily Hadith" : "الحديث اليومي"}
              </span>
            </div>
            <div className="space-y-4">
              <h3 className="font-bengali text-lg font-bold text-gold-brand">
                {dict.hadith.dailyHadithTitle}
              </h3>
              <p className="font-bengali text-base leading-relaxed text-text-brand font-medium">
                {lang === "bn" ? dailyHadith.bn : lang === "en" ? dailyHadith.en : dailyHadith.ar}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-gold-brand/10 text-xs text-gray-400">
                <span>{dict.hadith.hadithSource}: {dailyHadith.source}</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleCopy(lang === "bn" ? dailyHadith.bn : lang === "en" ? dailyHadith.en : dailyHadith.ar)}
                    className="hover:text-gold-brand text-xs font-bold px-2 py-1 bg-gold-brand/5 rounded cursor-pointer"
                  >
                    {dict.general.copy}
                  </button>
                  <button 
                    onClick={() => handleShare(lang === "bn" ? dailyHadith.bn : lang === "en" ? dailyHadith.en : dailyHadith.ar, dict.hadith.dailyHadithTitle)}
                    className="hover:text-gold-brand text-xs font-bold px-2 py-1 bg-gold-brand/5 rounded cursor-pointer"
                  >
                    {dict.general.share}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Book Selection Header */}
          <div className="flex items-center justify-between pt-4">
            <h3 className="font-bengali text-xl font-black text-text-brand">
              {dict.hadith.booksGridTitle}
            </h3>
            <button 
              onClick={() => setShowBookmarksOnly(true)}
              className="text-xs font-bold text-gold-brand bg-gold-brand/10 hover:bg-gold-brand/15 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              ⭐ {lang === "bn" ? "সংরক্ষিত হাদিস" : "Saved Hadiths"} ({bookmarks.length})
            </button>
          </div>

          {/* Books List / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HADITH_BOOKS.map((book) => (
              <div
                key={book.id}
                onClick={() => selectBook(book)}
                className="bg-card-brand border border-gold-brand/15 rounded-2xl p-5 shadow-sm hover:border-gold-brand/30 cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl p-3 bg-gold-brand/5 rounded-2xl group-hover:bg-gold-brand/10">
                    {book.icon}
                  </span>
                  <div>
                    <h4 className="font-bengali text-lg font-bold text-text-brand">
                      {lang === "bn" ? book.nameBangla : book.nameEnglish}
                    </h4>
                    <span className="font-bengali text-[11px] text-gray-400">
                      {book.count}
                    </span>
                  </div>
                </div>
                <span className="text-gold-brand font-bold text-xl group-hover:translate-x-1">
                  &rarr;
                </span>
              </div>
            ))}
          </div>
        </>
      ) : showBookmarksOnly ? (
        // Saved Bookmarks Mode View
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <button
              onClick={() => setShowBookmarksOnly(false)}
              className="text-xs font-bold text-gold-brand border border-gold-brand/20 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              &larr; {dict.general.back}
            </button>
            <h3 className="font-bengali text-lg font-bold text-text-brand">
              ⭐ {lang === "bn" ? "আপনার সংরক্ষিত হাদিসসমূহ" : "Your Saved Hadiths"} ({bookmarks.length})
            </h3>
          </div>

          {bookmarks.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gold-brand/25 rounded-2xl text-gray-400 space-y-2">
              <span className="text-3xl">⭐</span>
              <p className="font-bengali text-sm font-medium">
                {lang === "bn" ? "আপনার কোনো সংরক্ষিত হাদিস নেই।" : "No saved Hadiths yet."}
              </p>
              <p className="font-bengali text-xs text-gray-400">
                {lang === "bn" ? "হাদিস পড়ার সময় স্টার আইকন ট্যাপ করে সংরক্ষণ করুন।" : "Tap star icon to bookmark hadiths."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((b, index) => (
                <div key={`${b.bookId}-${b.hadithNumber}-${index}`} className="bg-card-brand border border-gold-brand/15 p-5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs text-gold-brand font-bold">
                    <span>{b.bookId.toUpperCase()} - {lang === "bn" ? "হাদিস নং: " : "Hadith No: "}{b.hadithNumber}</span>
                    <button 
                      onClick={() => {
                        const next = bookmarks.filter(bm => !(bm.bookId === b.bookId && bm.hadithNumber === b.hadithNumber));
                        saveBookmarks(next);
                      }}
                      className="text-red-500 font-bold hover:underline cursor-pointer"
                    >
                      {lang === "bn" ? "মুছে ফেলুন" : "Remove"}
                    </button>
                  </div>
                  <p className="font-bengali text-base leading-relaxed text-text-brand font-medium">
                    {b.text}
                  </p>
                  <div className="flex items-center gap-4 pt-2 border-t border-gold-brand/10 text-xs">
                    <button onClick={() => handleCopy(b.text)} className="text-gold-brand font-bold cursor-pointer">
                      {dict.general.copy}
                    </button>
                    <button onClick={() => handleShare(b.text, `Hadith ${b.hadithNumber}`)} className="text-gold-brand font-bold cursor-pointer">
                      {dict.general.share}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Active Book Hadiths List
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2">
            <button
              onClick={() => setActiveBook(null)}
              className="text-xs font-bold text-gold-brand border border-gold-brand/20 px-3 py-1.5 rounded-lg flex items-center gap-1 self-start cursor-pointer"
            >
              &larr; {lang === "bn" ? "গ্রন্থসমূহ" : "Books"}
            </button>
            <h3 className="font-bengali text-xl font-bold text-text-brand">
              {lang === "bn" ? activeBook.nameBangla : activeBook.nameEnglish} ({hadiths.length} {lang === "bn" ? "টি হাদিস" : "hadiths"})
            </h3>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={dict.hadith.searchPlaceholder}
              className="w-full bg-card-brand border border-gold-brand/20 focus:border-gold-brand focus:ring-1 focus:ring-gold-brand px-4 py-3 rounded-xl font-bengali text-sm text-text-brand placeholder-gray-400 focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text-brand cursor-pointer text-xs font-bold"
              >
                {dict.general.clear}
              </button>
            )}
          </div>

          {/* Loading and Error Indicators */}
          {loading && (
            <div className="text-center py-12 space-y-3">
              <div className="w-10 h-10 border-4 border-gold-brand border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-bengali text-sm text-gold-brand">
                {lang === "bn" ? "হাদিস গ্রন্থ লোড করা হচ্ছে..." : "Loading Hadith book..."}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-center">
              <p className="font-bengali text-sm text-red-500 font-bold">{error}</p>
              <button 
                onClick={() => selectBook(activeBook)} 
                className="mt-2 text-xs font-bold text-gold-brand underline cursor-pointer"
              >
                {lang === "bn" ? "আবার চেষ্টা করুন" : "Retry"}
              </button>
            </div>
          )}

          {/* Hadiths Listing */}
          {!loading && !error && (
            <div className="space-y-4">
              {/* If search is active, show search results. Else show paginated list */}
              {(searchQuery.trim() ? searchResults : hadiths).slice(0, searchQuery.trim() ? undefined : visibleCount).map((hadith) => (
                <div key={hadith.hadithnumber} className="bg-card-brand border border-gold-brand/15 p-5 rounded-2xl shadow-sm space-y-4 relative">
                  <div className="flex items-center justify-between border-b border-gold-brand/10 pb-2.5">
                    <span className="text-xs font-bold text-gold-brand">
                      {lang === "bn" ? "হাদিস নম্বর: " : "Hadith No: "}{hadith.hadithnumber}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleBookmark(hadith)}
                        className="text-xs font-bold cursor-pointer px-2 py-1 rounded"
                        title="সংরক্ষণ"
                      >
                        {isBookmarked(hadith.hadithnumber) ? "⭐" : "☆"}
                      </button>
                    </div>
                  </div>

                  <p className="font-bengali text-base leading-relaxed text-text-brand font-medium">
                    {hadith.text}
                  </p>

                  <div className="flex items-center gap-4 pt-2 border-t border-gold-brand/10 text-xs text-gray-400">
                    <button 
                      onClick={() => handleCopy(hadith.text)} 
                      className="hover:text-gold-brand font-bold cursor-pointer bg-gold-brand/5 px-2.5 py-1 rounded"
                    >
                      {dict.general.copy}
                    </button>
                    <button 
                      onClick={() => handleShare(hadith.text, `${activeBook.nameBangla} - হাদিস ${hadith.hadithnumber}`)} 
                      className="hover:text-gold-brand font-bold cursor-pointer bg-gold-brand/5 px-2.5 py-1 rounded"
                    >
                      {dict.general.share}
                    </button>
                  </div>
                </div>
              ))}

              {/* No Hadiths Found Fallback */}
              {(searchQuery.trim() ? searchResults : hadiths).length === 0 && (
                <div className="text-center py-12 text-gray-400 font-bengali">
                  <p>{dict.hadith.noHadithFound}</p>
                </div>
              )}

              {/* Pagination Load More button */}
              {!searchQuery.trim() && visibleCount < hadiths.length && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 20)}
                    className="w-full md:w-auto font-bengali text-sm font-bold text-gold-brand bg-gold-brand/10 hover:bg-gold-brand/15 px-6 py-3 rounded-xl cursor-pointer"
                  >
                    {dict.general.loadMore} (আরো ২০টি)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
