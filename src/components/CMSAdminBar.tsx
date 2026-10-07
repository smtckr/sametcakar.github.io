import React, { useState } from "react";
import { 
  Sparkles, 
  Edit3, 
  Eye, 
  PlusCircle, 
  Settings, 
  UploadCloud, 
  RotateCcw, 
  LogOut, 
  Calendar,
  CheckCircle,
  HelpCircle,
  Undo2,
  RefreshCw
} from "lucide-react";
import { useCMS } from "../CMSContext";
import { useLanguage, Translate } from "../LanguageContext";

export default function CMSAdminBar({ onShowToast }: { onShowToast?: (msg: string, type?: "success" | "info" | "error") => void }) {
  const {
    isAdminLoggedIn,
    isEditMode,
    setEditMode,
    isDraftModified,
    publishChanges,
    discardChanges,
    resetToDefaultData,
    canUndo,
    undoLastAction,
    lastDeletedTour,
    restoreLastDeletedTour,
    logoutAdmin,
    setIsNewTourModalOpen,
    setIsSiteConfigModalOpen,
    setIsBookingsModalOpen,
    bookings,
    askConfirmation,
  } = useCMS();
  const { t } = useLanguage();

  const [isPublishing, setIsPublishing] = useState(false);

  if (!isAdminLoggedIn) return null;

  const pendingBookingsCount = bookings.filter((b) => b.status === "Pending").length;

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      publishChanges();
      setIsPublishing(false);
      if (onShowToast) {
        onShowToast("Tüm değişiklikler başarıyla yayınlandı! Siteniz yeni haliyle yayında.", "success");
      }
    }, 400);
  };

  const handleUndo = () => {
    if (lastDeletedTour) {
      const restored = restoreLastDeletedTour();
      if (restored && onShowToast) {
        onShowToast(`"${lastDeletedTour.title}" turu başarıyla geri getirildi.`, "success");
      }
      return;
    }

    const success = undoLastAction();
    if (success && onShowToast) {
      onShowToast("Son yapılan işlem geri alındı.", "info");
    }
  };

  const handleDiscardAll = () => {
    askConfirmation({
      title: "Tüm Taslağı Geri Al?",
      message: "Yayınlanmamış tüm taslak değişiklikleriniz silinecek ve son yayınlanan resmi sürüme dönülecektir.",
      confirmText: "Evet, Taslağı Sıfırla",
      isDanger: true,
      onConfirm: () => {
        discardChanges();
        if (onShowToast) {
          onShowToast("Tüm taslak değişiklikler geri alındı ve önceki sürüme dönüldü.", "info");
        }
      },
    });
  };

  const handleResetDefaults = () => {
    askConfirmation({
      title: "Orijinal Tur Verilerine Sıfırla?",
      message: "Tüm turlar ve içerikler ilk orijinal fabrika ayarlarına döndürülecektir. Bu işlemi yayınlamak için 'YAYINLA' butonuna basmanız gerekecektir.",
      confirmText: "Evet, Fabrika Ayarlarına Dön",
      isDanger: true,
      onConfirm: () => {
        resetToDefaultData();
        if (onShowToast) {
          onShowToast("Orijinal veriler geri yüklendi (Yayınlamak için YAYINLA butonuna basın).", "info");
        }
      },
    });
  };

  const handleLogout = () => {
    if (isDraftModified) {
      askConfirmation({
        title: "Çıkış Yapmak İstiyor Musunuz?",
        message: "Yayınlanmamış değişiklikleriniz var! Çıkış yaparsanız 'Yayınla' demediğiniz için bu değişiklikler SİTEYE UYGULANMAYACAK ve silinecektir.",
        confirmText: "Uygulamadan Çık",
        cancelText: "Vazgeç (Düzenlemeye Devam Et)",
        isDanger: true,
        onConfirm: () => {
          logoutAdmin();
          if (onShowToast) {
            onShowToast("Yönetici oturumu kapatıldı. Yayınlanmamış değişiklikler iptal edildi.", "info");
          }
        },
      });
      return;
    }
    logoutAdmin();
    if (onShowToast) {
      onShowToast("Yönetici oturumu kapatıldı.", "info");
    }
  };

  return (
    <aside 
      aria-label="CMS Yönetim Paneli"
      className="sticky top-0 z-[110] bg-slate-950 text-white border-b border-orange-500/30 shadow-2xl backdrop-blur-xl px-3 sm:px-4 py-2.5 transition-all text-xs sm:text-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Branding & Status */}
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 bg-gradient-to-r from-orange-600 to-amber-600 px-2.5 py-1.5 rounded-lg shadow-sm font-bold text-white text-xs sm:text-sm">
            <Sparkles className="h-4 w-4 text-yellow-200" />
            <span className="tracking-wide">Canlı CMS</span>
          </div>

          <div className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{isEditMode ? "Düzenleme Modu" : "Ön İzleme Modu"}</span>
          </div>

          {isDraftModified ? (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-medium flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping"></span>
              <span>Yayınlanmamış Değişiklikler Var</span>
            </span>
          ) : (
            <span className="hidden xl:inline-flex bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[11px]">
              Tüm Değişiklikler Yayında
            </span>
          )}
        </div>

        {/* Center: Mode Switcher (Düzenle vs Ön İzleme) */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
          <button
            onClick={() => setEditMode(true)}
            className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
              isEditMode 
                ? "bg-orange-600 text-white shadow" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Düzenle</span>
          </button>
          <button
            onClick={() => setEditMode(false)}
            className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium text-xs transition-all cursor-pointer ${
              !isEditMode 
                ? "bg-blue-600 text-white shadow" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Ön İzleme</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          {/* New Tour */}
          <button
            onClick={() => setIsNewTourModalOpen(true)}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-2.5 sm:px-3 py-1.5 rounded-xl font-medium text-xs transition-colors cursor-pointer"
            title="Yeni Tur Ekle"
          >
            <PlusCircle className="h-3.5 w-3.5 text-orange-400" />
            <span className="hidden md:inline">Yeni Tur</span>
          </button>

          {/* Site Content Settings */}
          <button
            onClick={() => setIsSiteConfigModalOpen(true)}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-2.5 sm:px-3 py-1.5 rounded-xl font-medium text-xs transition-colors cursor-pointer"
            title="Hero, Hakkımızda ve İletişim Bilgilerini Düzenle"
          >
            <Settings className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden md:inline">Site Bilgileri</span>
          </button>

          {/* Bookings */}
          <button
            onClick={() => setIsBookingsModalOpen(true)}
            className="relative flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-2.5 sm:px-3 py-1.5 rounded-xl font-medium text-xs transition-colors cursor-pointer"
            title="Rezervasyonları Gör"
          >
            <Calendar className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Rezervasyonlar</span>
            {pendingBookingsCount > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-1">
                {pendingBookingsCount}
              </span>
            )}
          </button>

          {/* STEP-BY-STEP UNDO BUTTON */}
          {(canUndo || lastDeletedTour) && (
            <button
              onClick={handleUndo}
              className="flex items-center space-x-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm animate-pulse"
              title={lastDeletedTour ? `Silinen "${lastDeletedTour.title}" turunu geri getir` : "Son yapılan değişikliği geri al"}
            >
              <Undo2 className="h-3.5 w-3.5" />
              <span>Geri Al</span>
            </button>
          )}

          {/* DISCARD ALL DRAFT CHANGES */}
          {isDraftModified && (
            <button
              onClick={handleDiscardAll}
              className="flex items-center space-x-1 text-slate-400 hover:text-red-400 px-2 py-1.5 text-xs transition-colors cursor-pointer"
              title="Yayınlanmamış tüm taslağı iptal et ve son yayına dön"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">Taslağı İptal Et</span>
            </button>
          )}

          {/* RESET TO FACTORY DEFAULTS */}
          <button
            onClick={handleResetDefaults}
            className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
            title="Orijinal Tur Verilerine Sıfırla"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>

          {/* PUBLISH BUTTON */}
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className={`flex items-center space-x-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer ${
              isDraftModified 
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50 ring-2 ring-emerald-400 scale-[1.03]" 
                : "bg-emerald-800 hover:bg-emerald-700 text-slate-200"
            }`}
            title="Tüm taslak değişikliklerini kalıcı olarak web sitesinde yayınla"
          >
            <UploadCloud className="h-4 w-4" />
            <span>{isPublishing ? "Yayınlanıyor..." : "YAYINLA"}</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ml-1"
            title="Yönetici Oturumunu Kapat"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
