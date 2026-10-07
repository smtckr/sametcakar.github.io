import React, { useState, useEffect } from "react";
import { Cookie, X, ShieldCheck, Check, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage, Translate } from "../LanguageContext";

interface CookiePreferences {
  essential: boolean;
  preferences: boolean;
  analytics: boolean;
}

export default function CookieConsent() {
  const { t, currentLanguage } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    preferences: true,
    analytics: true,
  });

  useEffect(() => {
    // Check if user has already made a choice
    try {
      const savedConsent = localStorage.getItem("cesur_cookie_consent");
      if (!savedConsent) {
        // Delay slightly for smooth initial page load experience
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      } else {
        const storedPrefs = localStorage.getItem("cesur_cookie_preferences");
        if (storedPrefs) {
          try {
            setPreferences(JSON.parse(storedPrefs));
          } catch {
            // fallback to defaults
          }
        }
      }
    } catch (e) {
      console.warn("Storage check failed:", e);
    }
  }, []);

  // Listen for custom event to reopen preferences anytime (e.g. from footer link or cookie page)
  useEffect(() => {
    const handleReopen = () => {
      setIsVisible(true);
      setShowDetails(true);
    };
    window.addEventListener("open_cookie_preferences", handleReopen);
    return () => window.removeEventListener("open_cookie_preferences", handleReopen);
  }, []);

  const saveConsent = (status: "accepted" | "rejected" | "custom", prefs: CookiePreferences) => {
    try {
      localStorage.setItem("cesur_cookie_consent", status);
      localStorage.setItem("cesur_cookie_consent_date", new Date().toISOString());
      localStorage.setItem("cesur_cookie_preferences", JSON.stringify(prefs));
    } catch (e) {
      console.warn("Could not save cookie preferences:", e);
    }

    setSavedNotification(
      status === "accepted"
        ? (t("Çerez tercihiniz kaydedildi. Tüm çerezler kabul edildi.") || "Tüm çerezler kabul edildi.")
        : status === "rejected"
        ? (t("Tercihiniz kaydedildi. Yalnızca zorunlu çerezler etkin.") || "Zorunlu olmayan çerezler reddedildi.")
        : (t("Özel çerez tercihleriniz kaydedildi.") || "Çerez tercihleriniz kaydedildi.")
    );

    setTimeout(() => {
      setSavedNotification(null);
      setIsVisible(false);
      setShowDetails(false);
    }, 1200);
  };

  const handleAcceptAll = () => {
    const fullPrefs = { essential: true, preferences: true, analytics: true };
    setPreferences(fullPrefs);
    saveConsent("accepted", fullPrefs);
  };

  const handleRejectAll = () => {
    const minimalPrefs = { essential: true, preferences: false, analytics: false };
    setPreferences(minimalPrefs);
    saveConsent("rejected", minimalPrefs);
  };

  const handleSaveCustom = () => {
    saveConsent("custom", preferences);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-lg z-[120] animate-fade-in pointer-events-auto">
      <div className="bg-slate-900/98 backdrop-blur-xl text-white p-5 sm:p-6 rounded-3xl shadow-2xl border border-slate-700/80 space-y-4 ring-1 ring-white/10">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 shrink-0 shadow-inner">
              <Cookie className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block">
                {t("Gizlilik ve Çerez Politikası") || "Gizlilik ve Çerez Politikası"}
              </span>
              <h4 className="text-sm font-bold text-white">
                {t("Çerez Tercihlerinizi Belirleyin") || "Çerez Tercihlerinizi Belirleyin"}
              </h4>
            </div>
          </div>

          <button
            onClick={() => handleRejectAll()}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title={t("Kapat ve Reddet") || "Kapat"}
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Text */}
        <p className="text-xs text-slate-300 leading-relaxed">
          {t("Sitemizde size en iyi kullanıcı deneyimini sunabilmek, rezervasyon işlemlerinizi güvenle yönetebilmek ve site trafiğini analiz edebilmek için çerezler (cookies) kullanıyoruz.") ||
            "Sitemizde size en iyi kullanıcı deneyimini sunabilmek, rezervasyon işlemlerinizi güvenle yönetebilmek ve site trafiğini analiz edebilmek için çerezler (cookies) kullanıyoruz."}
        </p>

        {/* Notification Feedback */}
        {savedNotification && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-fade-in">
            <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{savedNotification}</span>
          </div>
        )}

        {/* Detailed Preferences Accordion */}
        {showDetails && (
          <div className="space-y-2.5 pt-2 border-t border-slate-800 animate-fade-in">
            {/* Essential */}
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-white">
                  <Lock className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{t("Zorunlu Çerezler") || "Zorunlu Çerezler"}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {t("Web sitesinin ve güvenli rezervasyon sisteminin çalışması için zorunludur.") || "Sitenin çalışması için zorunludur."}
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-1 rounded-lg shrink-0">
                {t("Aktif") || "Aktif"}
              </span>
            </div>

            {/* Preferences */}
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-white">
                  <span>{t("İşlevsellik ve Tercihler") || "İşlevsellik ve Tercihler"}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {t("Dil seçimi ve para birimi gibi kullanıcı tercihlerinizi hatırlar.") || "Dil ve para birimi tercihlerinizi hatırlar."}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            {/* Analytics */}
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-white">
                  <span>{t("Performans ve Analitik") || "Performans ve Analitik"}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {t("Anonim ziyaretçi istatistikleri ve sayfa hızı analizi sağlar.") || "Anonim analiz ve istatistik sağlar."}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* Links row */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
          <Link
            to={`/${currentLanguage}/cookie-policy`}
            className="text-orange-400 hover:text-orange-300 font-semibold underline underline-offset-2 transition-colors"
          >
            {t("Çerez Politikası Detayları") || "Çerez Politikası"}
          </Link>

          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <span>{showDetails ? (t("Daha Az Göster") || "Daha Az") : (t("Özelleştir") || "Özelleştir")}</span>
            {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>

        {/* Action Buttons: Kabul Et / Reddet */}
        <div className="flex items-center space-x-2.5 pt-1">
          {showDetails ? (
            <>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-lg shadow-orange-600/30 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Check className="h-4 w-4" />
                <span>{t("Seçimleri Kaydet") || "Seçimleri Kaydet"}</span>
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs py-2.5 px-3 rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                <span>{t("Tümünü Kabul Et") || "Tümünü Kabul Et"}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>{t("Kabul Et") || "Kabul Et"}</span>
              </button>

              <button
                type="button"
                onClick={handleRejectAll}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs py-2.5 px-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-all cursor-pointer text-center"
              >
                <span>{t("Reddet") || "Reddet"}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
