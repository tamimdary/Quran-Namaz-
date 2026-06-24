import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Edit2, Check, X, LogOut, Key } from "lucide-react";

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (oldPw: string, newPw: string) => boolean;
  currentPassword: string;
  getTranslation: (id: string, defaultText: string) => string;
  saveTranslation: (id: string, text: string) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  triggerLogoTap: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("noorer_poth_is_admin") === "true";
    }
    return false;
  });

  const [password, setPassword] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("noorer_poth_admin_password") || "darytamim51";
    }
    return "darytamim51";
  });

  const [translations, setTranslations] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("noorer_poth_translations");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse translations:", e);
        }
      }
    }
    return {};
  });

  const [showLoginModal, setShowLoginModal] = useState(false);

  // Logo tapping state for 5 times quick tap
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  const triggerLogoTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 1000) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }
    lastTapRef.current = now;

    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      setShowLoginModal(true);
    }
  };

  const login = (inputPassword: string): boolean => {
    if (inputPassword === password) {
      setIsAdmin(true);
      localStorage.setItem("noorer_poth_is_admin", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.setItem("noorer_poth_is_admin", "false");
  };

  const changePassword = (oldPw: string, newPw: string): boolean => {
    if (oldPw === password) {
      setPassword(newPw);
      localStorage.setItem("noorer_poth_admin_password", newPw);
      return true;
    }
    return false;
  };

  const getTranslation = (id: string, defaultText: string): string => {
    return translations[id] ?? defaultText;
  };

  const saveTranslation = (id: string, text: string) => {
    setTranslations((prev) => {
      const updated = { ...prev, [id]: text };
      localStorage.setItem("noorer_poth_translations", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        login,
        logout,
        changePassword,
        currentPassword: password,
        getTranslation,
        saveTranslation,
        showLoginModal,
        setShowLoginModal,
        triggerLogoTap,
      }}
    >
      {children}
      <AdminLoginModal />
    </AdminContext.Provider>
  );
}

// EditableText wrapper helper component with contentEditable
interface EditableTextProps {
  id: string;
  defaultText: string;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";
  isTextArea?: boolean;
}

export function EditableText({
  id,
  defaultText,
  className = "",
  as = "span",
  isTextArea = false,
}: EditableTextProps) {
  const { isAdmin, getTranslation, saveTranslation } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [showPencil, setShowPencil] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const touchTimer = useRef<NodeJS.Timeout | null>(null);

  const renderedText = getTranslation(id, defaultText) || defaultText;

  // Keep content in sync with translations
  useEffect(() => {
    if (ref.current && !isEditing) {
      ref.current.textContent = renderedText;
    }
  }, [renderedText, isEditing]);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (ref.current) {
      const text = ref.current.textContent || "";
      saveTranslation(id, text);
    }
    setIsEditing(false);
    setShowPencil(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (ref.current) {
      ref.current.textContent = renderedText;
    }
    setIsEditing(false);
    setShowPencil(false);
  };

  // Touch triggers for mobile long press
  const handleTouchStart = () => {
    if (!isAdmin) return;
    touchTimer.current = setTimeout(() => {
      setShowPencil(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
    }
  };

  const handleTouchMove = () => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
    }
  };

  const Component = as;

  if (isAdmin) {
    return (
      <div
        className="relative inline-block group max-w-full font-bengali"
        onMouseEnter={() => setShowPencil(true)}
        onMouseLeave={() => {
          if (!isEditing) setShowPencil(false);
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        <Component
          ref={ref as any}
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
          className={`outline-none transition-all duration-150 inline-block max-w-full break-words select-text ${
            isEditing
              ? "border border-dashed border-gold-brand px-2 py-1 rounded bg-gold-brand/5 focus:ring-1 focus:ring-gold-brand ring-offset-0"
              : `hover:bg-gold-brand/5 px-1 rounded ${className}`
          }`}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (ref.current) {
                saveTranslation(id, ref.current.textContent || "");
              }
              setIsEditing(false);
              setShowPencil(false);
            }
          }}
        >
          {renderedText}
        </Component>

        {isEditing ? (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 flex items-center gap-1 bg-[#0F2033]/95 border border-gold-brand/30 rounded-lg p-1 shadow-xl z-50">
            <button
              onMouseDown={handleSave}
              className="p-1 rounded bg-green-900/40 text-green-400 border border-green-700/30 hover:bg-green-800/40 cursor-pointer"
              title="দাখিল করুন"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onMouseDown={handleCancel}
              className="p-1 rounded bg-red-900/40 text-red-400 border border-red-700/30 hover:bg-red-800/40 cursor-pointer"
              title="বাতিল করুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          showPencil && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="absolute -top-3 -right-3 p-1 rounded-full bg-gold-brand text-dark-bg hover:bg-gold-brand/95 shadow-md flex items-center justify-center cursor-pointer transition-transform duration-100 scale-90 hover:scale-100 z-30"
              title="সম্পাদনা করুন"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )
        )}
      </div>
    );
  }

  return <Component className={className}>{renderedText}</Component>;
}

// Built-in Login & Logout + Password Change view/modal
function AdminLoginModal() {
  const {
    showLoginModal,
    setShowLoginModal,
    login,
    logout,
    isAdmin,
    currentPassword,
    changePassword,
  } = useAdmin();
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Password change form parameters
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwSuccessMsg, setPwSuccessMsg] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const ok = login(passwordInput);
    if (ok) {
      setPasswordInput("");
      setShowLoginModal(false);
    } else {
      setErrorMsg("ভুল পাসওয়ার্ড, পুনরায় চেষ্টা করুন!");
    }
  };

  const handlePwChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwSuccessMsg("");
    setErrorMsg("");
    const ok = changePassword(oldPw, newPw);
    if (ok) {
      setOldPw("");
      setNewPw("");
      setPwSuccessMsg("পাসওয়ার্ড সাফল্যের সাথে পরিবর্তন করা হয়েছে!");
      setTimeout(() => setPwSuccessMsg(""), 3000);
    } else {
      setErrorMsg("পূর্বের পাসওয়ার্ডটি সঠিক নয়!");
    }
  };

  if (!showLoginModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-gold-brand/20 bg-[#0F2033] p-6 text-text-brand shadow-2xl font-bengali">
        <button
          onClick={() => {
            setShowLoginModal(false);
            setIsChangingPassword(false);
            setErrorMsg("");
            setPwSuccessMsg("");
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-gold-brand/10 bg-card-brand/40 text-gold-brand hover:bg-gold-brand/10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!isAdmin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="text-center pb-2">
              <div className="mx-auto w-10 h-10 rounded-full bg-gold-brand/10 text-gold-brand flex items-center justify-center border border-gold-brand/20 mb-2">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">এডমিন প্যানেলে লগইন</h3>
              <p className="text-xs text-gray-400 mt-1">প্যানেল এক্সেস করতে অনুগ্রহ করে পাসওয়ার্ড প্রবেশ করান</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">পাসওয়ার্ড</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full font-sans tracking-widest p-2.5 rounded-xl bg-card-brand/50 border border-gold-brand/20 focus:border-gold-brand text-text-brand text-sm outline-none"
                placeholder="••••••••"
                autoFocus
              />
            </div>

            {errorMsg && (
              <div className="p-2 text-xs text-red-400 bg-red-955/20 rounded border border-red-900/30 text-center font-semibold">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full p-2.5 rounded-xl bg-gold-brand text-dark-bg font-bold text-sm cursor-pointer hover:bg-gold-brand/90 transition-all font-bengali"
            >
              লগইন করুন
            </button>
          </form>
        ) : (
          <div className="space-y-4 font-bengali">
            <div className="text-center pb-2">
              <div className="mx-auto w-10 h-10 rounded-full bg-green-905/20 text-green-400 flex items-center justify-center border border-green-700/30 mb-2">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-green-400">আপনি এডমিন মোডে আছেন</h3>
              <p className="text-xs text-gray-400 mt-1">যেকোনো টেক্সট লেখার পাশে থাকা পেন আইকন দিয়ে এডিট করুন</p>
            </div>

            {!isChangingPassword ? (
              <div className="space-y-2">
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full p-2.5 rounded-xl border border-gold-brand/20 bg-gold-brand/10 text-gold-brand font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-gold-brand/20"
                >
                  <Key className="w-4 h-4" />
                  <span>পাসওয়ার্ড পরিবর্তন করুন</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setShowLoginModal(false);
                  }}
                  className="w-full p-2.5 rounded-xl bg-red-900/30 text-red-400 border border-red-900/20 hover:bg-red-800/30 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>লগআউট করুন</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handlePwChangeSubmit} className="space-y-3">
                <h4 className="text-xs font-bold text-gold-brand uppercase tracking-wider">পাসওয়ার্ড পরিবর্তন</h4>
                
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 mb-1">বর্তমান পাসওয়ার্ড</label>
                  <input
                    type="password"
                    required
                    value={oldPw}
                    onChange={(e) => setOldPw(e.target.value)}
                    className="w-full font-sans tracking-widest p-2 rounded-lg bg-card-brand/50 border border-gold-brand/20 focus:border-gold-brand text-text-brand text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 mb-1">নতুন পাসওয়ার্ড</label>
                  <input
                    type="password"
                    required
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full font-sans tracking-widest p-2 rounded-lg bg-card-brand/50 border border-gold-brand/20 focus:border-gold-brand text-text-brand text-xs outline-none"
                  />
                </div>

                {errorMsg && (
                  <div className="p-2 text-xs text-red-400 bg-red-955/20 rounded border border-red-900/30 text-center">
                    {errorMsg}
                  </div>
                )}

                {pwSuccessMsg && (
                  <div className="p-2 text-xs text-green-400 bg-green-955/20 rounded border border-green-900/30 text-center">
                    {pwSuccessMsg}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setErrorMsg("");
                      setPwSuccessMsg("");
                    }}
                    className="flex-1 p-2 rounded-lg border border-gray-700 bg-transparent text-gray-400 font-bold text-xs cursor-pointer hover:bg-gray-800"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="flex-1 p-2 rounded-lg bg-gold-brand text-dark-bg font-bold text-xs cursor-pointer hover:bg-gold-brand/90"
                  >
                    দাখিল করুন
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
