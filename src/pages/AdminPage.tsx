import React, { useState, useEffect, useRef } from "react";
import { Tour, Booking } from "../types";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  Phone, 
  Mail, 
  User, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Undo2, 
  UploadCloud, 
  RotateCcw,
  Images,
  Calendar,
  Eye,
  Check,
  Globe,
  Upload,
  Star,
  ArrowUp,
  ArrowDown,
  Layers,
  Play,
  Pause
} from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useNavigate } from "react-router-dom";
import { useCMS, ADMIN_USERNAME, ADMIN_PASS } from "../CMSContext";
import { compressImage } from "../utils/imageCompressor";
import { DEFAULT_SITE_CONTENT } from "../data";

const HERO_PRESETS = [
  { label: "Kapadokya Balonlar (Gündoğumu)", url: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=1920&auto=format&fit=crop" },
  { label: "İstanbul Boğazı & Gün Batımı", url: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1920&auto=format&fit=crop" },
  { label: "Ege & Akdeniz Turkuaz Koyları", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop" },
  { label: "Karadeniz Sisli Yaylaları", url: "https://images.unsplash.com/photo-1520114008272-38eb7636e788?q=80&w=1920&auto=format&fit=crop" },
  { label: "Balkanlar & Ohrid Gölü", url: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?q=80&w=1920&auto=format&fit=crop" },
  { label: "Tropikal Cennet & Plaj", url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1920&auto=format&fit=crop" },
  { label: "Pamukkale Beyaz Travertenleri", url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1920&auto=format&fit=crop" },
  { label: "Tarihi Safranbolu Taş Konakları", url: "https://images.unsplash.com/photo-1549419138-51829e29aeb6?q=80&w=1920&auto=format&fit=crop" },
];

export default function AdminPage() {
  const { currentLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const { 
    loginAdmin, 
    logoutAdmin, 
    isAdminLoggedIn, 
    setEditMode, 
    askConfirmation, 
    tours,
    bookings,
    siteContent,
    updateSiteContent,
    deleteTour: cmsDeleteTour,
    updateTour: cmsUpdateTour,
    addTour: cmsAddTour,
    updateBookingStatus,
    deleteBooking,
    publishChanges,
    discardChanges,
    isDraftModified,
    canUndo,
    undoLastAction,
    lastDeletedTour,
    restoreLastDeletedTour,
    setActiveEditingTour,
    setIsNewTourModalOpen,
  } = useCMS();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"tours" | "bookings" | "hero">("tours");

  // Hero management state
  const [heroDraftData, setHeroDraftData] = useState(siteContent?.hero || DEFAULT_SITE_CONTENT.hero);
  const [heroDraftImages, setHeroDraftImages] = useState<string[]>([]);
  const [newHeroImageUrl, setNewHeroImageUrl] = useState("");
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [heroActiveLang, setHeroActiveLang] = useState<"tr" | "en">("tr");
  const [isTranslatingHero, setIsTranslatingHero] = useState(false);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const [heroError, setHeroError] = useState("");

  useEffect(() => {
    if (siteContent?.hero) {
      setHeroDraftData(siteContent.hero);
      const raw = (Array.isArray(siteContent.hero.backgroundImages) && siteContent.hero.backgroundImages.length > 0)
        ? siteContent.hero.backgroundImages
        : (siteContent.hero.backgroundImage ? [siteContent.hero.backgroundImage] : DEFAULT_SITE_CONTENT.hero.backgroundImages || []);
      setHeroDraftImages(raw.filter((img) => typeof img === "string" && img.trim().length > 0));
    }
  }, [siteContent]);

  // Local form for inline add/edit within AdminPage
  const [isEditing, setIsEditing] = useState(false);
  const [editingTour, setEditingTour] = useState<Partial<Tour>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [extraUrl, setExtraUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeLangTab, setActiveLangTab] = useState<"tr" | "en">("tr");
  const [isTranslating, setIsTranslating] = useState(false);

  const isAuthenticated = isAdminLoggedIn;

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleAITranslateTour = async () => {
    if (!editingTour.title) {
      setError("Lütfen önce en azından Türkçe tur başlığını girin.");
      return;
    }
    setIsTranslating(true);
    setError("");
    try {
      const res = await fetch("/api/translate-tour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingTour.title,
          description: editingTour.description,
          location: editingTour.location,
          tag: editingTour.tag,
          duration: editingTour.duration,
        }),
      });
      if (res.ok) {
        const tr = await res.json();
        setEditingTour((prev) => ({
          ...prev,
          title_en: tr.title_en || prev.title_en || prev.title,
          description_en: tr.description_en || prev.description_en || prev.description,
          location_en: tr.location_en || prev.location_en || prev.location,
          tag_en: tr.tag_en || prev.tag_en || prev.tag,
          duration_en: tr.duration_en || prev.duration_en || prev.duration,
        }));
        setActiveLangTab("en");
        showNotification("Yapay zeka tur bilgilerini profesyonel İngilizceye çevirdi! (English sekmesinde inceleyebilirsiniz)");
      }
    } catch (err) {
      console.warn("AI translation error:", err);
      setError("Otomatik çeviri servisine ulaşılamadı. Manuel girebilirsiniz.");
    } finally {
      setIsTranslating(false);
    }
  };

  // Hero Carousel Management Handlers
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingHero(true);
      setHeroError("");
      try {
        const compressed = await compressImage(file, 1600, 900, 0.78);
        setHeroDraftImages((prev) => [...prev, compressed]);
        showNotification("Görsel başarıyla yüklendi ve optimize edildi.");
      } catch (err: any) {
        console.error("Hero upload failed:", err);
        setHeroError("Görsel optimize edilemedi. Lütfen geçerli bir JPG veya PNG dosyası seçin.");
      } finally {
        setIsUploadingHero(false);
        if (heroFileInputRef.current) heroFileInputRef.current.value = "";
      }
    }
  };

  const handleAddHeroUrl = () => {
    if (newHeroImageUrl.trim()) {
      setHeroError("");
      setHeroDraftImages((prev) => [...prev, newHeroImageUrl.trim()]);
      setNewHeroImageUrl("");
      showNotification("Görsel bağlantısı eklendi.");
    }
  };

  const handleAddHeroPreset = (url: string) => {
    setHeroError("");
    if (!heroDraftImages.includes(url)) {
      setHeroDraftImages((prev) => [...prev, url]);
      showNotification("Önerilen seyahat görseli eklendi.");
    }
  };

  const handleRemoveHeroImage = (idxToRemove: number) => {
    if (heroDraftImages.length <= 1) {
      setHeroError("Hero banner için en az 1 görsel bulunmalıdır.");
      setTimeout(() => setHeroError(""), 4000);
      return;
    }
    setHeroError("");
    setHeroDraftImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
    showNotification("Görsel rotasyondan kaldırıldı.");
  };

  const handleSetHeroCover = (idxToCover: number) => {
    const selected = heroDraftImages[idxToCover];
    const rest = heroDraftImages.filter((_, idx) => idx !== idxToCover);
    setHeroDraftImages([selected, ...rest]);
    showNotification("Seçilen görsel ana kapak (1. slayt) yapıldı.");
  };

  const handleMoveHeroImage = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= heroDraftImages.length) return;
    const updated = [...heroDraftImages];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setHeroDraftImages(updated);
  };

  const handleTranslateHeroAI = async () => {
    if (!heroDraftData.title) {
      setHeroError("Lütfen önce en azından Türkçe hero başlığını girin.");
      return;
    }
    setIsTranslatingHero(true);
    setHeroError("");
    try {
      const res = await fetch("/api/translate-site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "hero",
          data: {
            badge: heroDraftData.badge,
            title: heroDraftData.title,
            subtitle: heroDraftData.subtitle,
          },
        }),
      });
      if (res.ok) {
        const { data_en } = await res.json();
        if (data_en) {
          setHeroDraftData((prev) => ({
            ...prev,
            badge_en: data_en.badge_en || data_en.badge || prev.badge_en,
            title_en: data_en.title_en || data_en.title || prev.title_en,
            subtitle_en: data_en.subtitle_en || data_en.subtitle || prev.subtitle_en,
          }));
          setHeroActiveLang("en");
          showNotification("Hero metinleri yapay zeka ile profesyonel İngilizceye çevrildi!");
        }
      }
    } catch (err) {
      console.warn("Hero translation error:", err);
      setHeroError("Otomatik çeviri servisine ulaşılamadı. Manuel girebilirsiniz.");
    } finally {
      setIsTranslatingHero(false);
    }
  };

  const handleSaveHero = () => {
    if (heroDraftImages.length === 0) {
      setHeroError("Hero banner için en az 1 aktif görsel bulunmalıdır.");
      return;
    }
    const primaryImage = heroDraftImages[0];
    const finalHero = {
      ...heroDraftData,
      backgroundImage: primaryImage,
      backgroundImages: heroDraftImages,
      autoplayInterval: heroDraftData.autoplayInterval || 6000,
    };
    updateSiteContent("hero", finalHero);
    showNotification("Ana sayfa hero banner görselleri ve başlıkları taslağa kaydedildi. Ziyaretçilere sunmak için 'YAYINLA' butonuna tıklayın!");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = loginAdmin(username, password);
    if (success) {
      setError("");
      setUsername("");
      setPassword("");
    } else {
      setError("Giriş başarısız. Kullanıcı adı veya şifre hatalı.");
    }
  };

  const handleLogout = () => {
    if (isDraftModified) {
      askConfirmation({
        title: "Çıkış Yapmak İstiyor Musunuz?",
        message: "Yayınlanmamış değişiklikleriniz var! Çıkış yaparsanız bu değişiklikler SİTEYE UYGULANMAYACAK ve silinecektir.",
        confirmText: "Uygulamadan Çık",
        cancelText: "Vazgeç",
        isDanger: true,
        onConfirm: () => {
          logoutAdmin();
          setIsEditing(false);
        },
      });
      return;
    }
    logoutAdmin();
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour.title || !editingTour.price) return;

    try {
      let finalImages: string[] = editingTour.images && editingTour.images.length > 0 
        ? [...editingTour.images] 
        : (editingTour.image ? [editingTour.image] : ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800"]);

      if (imageFiles.length > 0) {
        const compressedList = await Promise.all(
          imageFiles.map((file) => compressImage(file, 1400, 800, 0.78))
        );
        finalImages = [...finalImages, ...compressedList];
      }

      const coverImg = editingTour.image || finalImages[0];
      const id = editingTour.id || `tour-${Date.now()}`;

      let title_en = editingTour.title_en;
      let description_en = editingTour.description_en;
      let location_en = editingTour.location_en;
      let tag_en = editingTour.tag_en;
      let duration_en = editingTour.duration_en;

      if (!title_en || !description_en) {
        try {
          const res = await fetch("/api/translate-tour", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: editingTour.title,
              description: editingTour.description,
              location: editingTour.location,
              tag: editingTour.tag,
              duration: editingTour.duration,
            }),
          });
          if (res.ok) {
            const tr = await res.json();
            title_en = tr.title_en || title_en;
            description_en = tr.description_en || description_en;
            location_en = tr.location_en || location_en;
            tag_en = tr.tag_en || tag_en;
            duration_en = tr.duration_en || duration_en;
          }
        } catch (e) {
          console.warn("AI translation skipped in AdminPage:", e);
        }
      }

      const tourToSave: Tour = {
        id,
        title: editingTour.title || "",
        title_en: title_en || editingTour.title || "",
        image: coverImg,
        images: finalImages,
        price: Number(editingTour.price) || 0,
        duration: editingTour.duration || "Günübirlik Tur",
        duration_en: duration_en || editingTour.duration || "Daily Tour",
        location: editingTour.location || "Türkiye",
        location_en: location_en || editingTour.location || "Turkey",
        tag: editingTour.tag || "Genel",
        tag_en: tag_en || editingTour.tag || "General",
        description: editingTour.description || "",
        description_en: description_en || editingTour.description || "",
        program: editingTour.program || "",
        program_en: editingTour.program_en || "",
        included: editingTour.included || "",
        included_en: editingTour.included_en || "",
        excluded: editingTour.excluded || "",
        excluded_en: editingTour.excluded_en || "",
        departurePoints: editingTour.departurePoints || "",
        departurePoints_en: editingTour.departurePoints_en || "",
        tourConditions: editingTour.tourConditions || "",
        tourConditions_en: editingTour.tourConditions_en || "",
      };

      if (editingTour.id) {
        cmsUpdateTour(id, tourToSave);
        showNotification(`"${tourToSave.title}" turu güncellendi (İngilizce çevirisi hazırlandı).`);
      } else {
        cmsAddTour(tourToSave);
        showNotification(`"${tourToSave.title}" yeni tur olarak eklendi (İngilizce çevirisi hazırlandı).`);
      }

      setIsEditing(false);
      setEditingTour({});
      setImageFiles([]);
      setExtraUrl("");
    } catch (err: any) {
      setError(err.message || "Kaydetme başarısız.");
    }
  };

  const handleDelete = (tour: Tour) => {
    askConfirmation({
      title: "Turu Silmek İstiyor Musunuz?",
      message: `"${tour.title}" turu taslaktan silinecektir. Dilediğinizde 'Geri Al' butonuna basarak geri getirebilirsiniz. Kalıcı yayından kaldırmak için 'Yayınla' butonuna basmanız gerekir.`,
      confirmText: "Evet, Sil",
      onConfirm: () => {
        cmsDeleteTour(tour.id);
        showNotification(`"${tour.title}" silindi. İptal etmek için üstteki 'Geri Al' butonuna tıklayabilirsiniz.`);
      },
    });
  };

  const handleUndo = () => {
    if (lastDeletedTour) {
      const restored = restoreLastDeletedTour();
      if (restored) {
        showNotification(`"${lastDeletedTour.title}" turu başarıyla geri getirildi!`);
      }
      return;
    }
    const success = undoLastAction();
    if (success) {
      showNotification("Son yapılan işlem başarıyla geri alındı.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Yönetici Girişi
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Cesur Akgün Travel Agency CMS Paneli
            </p>
          </div>

          {error && (
            <p className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold mb-4 text-center border border-red-100">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Kullanıcı Adı"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all cursor-pointer mt-2"
            >
              Giriş Yap & Yönetmeye Başla
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Yönetim Paneli
              </h1>
              {isDraftModified && (
                <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                  Taslak Değişiklikler Var
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verilerinizi buradan veya sitedeki tur kartlarının üzerindeki 'Düzenle' butonlarından canlı olarak yönetebilirsiniz.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* UNDO BUTTON */}
            {(canUndo || lastDeletedTour) && (
              <button
                onClick={handleUndo}
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-300 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 animate-pulse"
                title={lastDeletedTour ? `Silinen "${lastDeletedTour.title}" turunu geri getir` : "Son işlemi geri al"}
              >
                <Undo2 className="h-4 w-4" />
                <span>Geri Al</span>
              </button>
            )}

            {/* DISCARD ALL */}
            {isDraftModified && (
              <button
                onClick={() => {
                  askConfirmation({
                    title: "Taslağı Geri Al?",
                    message: "Yayınlanmamış tüm değişiklikler silinecektir.",
                    confirmText: "Evet, Taslağı Sıfırla",
                    isDanger: true,
                    onConfirm: () => {
                      discardChanges();
                      showNotification("Tüm değişiklikler geri alındı.");
                    },
                  });
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center space-x-1"
                title="Tüm taslağı sıfırla"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Taslağı İptal Et</span>
              </button>
            )}

            {/* PUBLISH */}
            <button
              onClick={() => {
                publishChanges();
                showNotification("Tüm değişiklikler başarıyla yayınlandı!");
              }}
              className={`font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5 ${
                isDraftModified
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse"
                  : "bg-emerald-800 text-emerald-100"
              }`}
            >
              <UploadCloud className="h-4 w-4" />
              <span>{isDraftModified ? "YAYINLA" : "Yayında"}</span>
            </button>

            {/* GO TO LIVE EDITOR */}
            <button
              onClick={() => {
                setEditMode(true);
                navigate(`/${currentLanguage}`);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Canlı Sitede Düzenle</span>
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-900 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>

        {/* Success toast notification */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-bold mb-6 flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
            {(canUndo || lastDeletedTour) && (
              <button
                onClick={handleUndo}
                className="bg-emerald-200/80 hover:bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-lg text-xs font-extrabold cursor-pointer transition-all"
              >
                Geri Al
              </button>
            )}
          </div>
        )}

        {/* Tabs */}
        {!isEditing && (
          <div className="flex space-x-3 border-b border-slate-200 mb-8 pb-3">
            <button
              onClick={() => setActiveTab("tours")}
              className={`px-5 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer ${
                activeTab === "tours" 
                  ? "bg-slate-900 text-white shadow" 
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Tur Paketleri ({tours.length})
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-5 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === "bookings" 
                  ? "bg-slate-900 text-white shadow" 
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>Gelen Rezervasyonlar</span>
              {bookings.filter(b => b.status === "Pending").length > 0 && (
                <span className="bg-orange-500 text-white text-[11px] font-bold rounded-full px-2 py-0.5">
                  {bookings.filter(b => b.status === "Pending").length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("hero")}
              className={`px-5 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === "hero" 
                  ? "bg-slate-900 text-white shadow" 
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Images className="h-4 w-4 text-orange-500" />
              <span>Ana Sayfa Hero Banner ({heroDraftImages.length})</span>
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* TOURS TAB */}
        {activeTab === "tours" && (
          isEditing ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingTour.id ? `Turu Düzenle: ${editingTour.title || "İsimsiz Tur"}` : "Yeni Tur Paketi Ekle"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Türkçe ve İngilizce dil içeriklerini yönetin, dilediğinizde yapay zeka ile otomatik çevirin.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingTour({});
                    setImageFiles([]);
                    setActiveLangTab("tr");
                  }}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                >
                  Vazgeç
                </button>
              </div>

              {/* Language Toolbar & AI Translate */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setActiveLangTab("tr")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeLangTab === "tr"
                        ? "bg-orange-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🇹🇷 Türkçe (Ana İçerik)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLangTab("en")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                      activeLangTab === "en"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>🇬🇧 English (İngilizce)</span>
                    {editingTour.title_en && <span className="h-2 w-2 rounded-full bg-emerald-400"></span>}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAITranslateTour}
                  disabled={isTranslating || !editingTour.title}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-all"
                  title="Türkçe yazdığınız tur detaylarını lüks turizm standartlarında akıcı İngilizceye çevirir"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${isTranslating ? "animate-spin" : "text-yellow-300"}`} />
                  <span>{isTranslating ? "Yapay Zeka Çeviriyor..." : "✨ AI ile Otomatik Çevir (Gemini)"}</span>
                </button>
              </div>

              {activeLangTab === "en" && (
                <div className="bg-blue-50/80 border border-blue-200 p-3.5 rounded-2xl text-xs text-blue-900 mb-6 flex items-start space-x-2">
                  <Globe className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>İngilizce Tur Görünümü:</strong> Ziyaretçi sitede "EN" seçtiğinde burada yer alan metinleri görecektir. Yapay zeka ile otomatik çevirebilir veya manuel revize edebilirsiniz.
                  </div>
                </div>
              )}

              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {activeLangTab === "tr" ? "Tur Başlığı *" : "Tour Title (English) *"}
                  </label>
                  <input
                    required={activeLangTab === "tr"}
                    type="text"
                    placeholder={activeLangTab === "tr" ? "Örn: Kapadokya & Balon Turu" : "E.g. Magical Cappadocia Hot Air Balloon Tour"}
                    value={(activeLangTab === "tr" ? editingTour.title : editingTour.title_en) || ""}
                    onChange={(e) =>
                      setEditingTour(
                        activeLangTab === "tr"
                          ? { ...editingTour, title: e.target.value }
                          : { ...editingTour, title_en: e.target.value }
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Fiyat ($ / €) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={editingTour.price || ""}
                    onChange={(e) => setEditingTour({ ...editingTour, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {activeLangTab === "tr" ? "Süre (Örn: 8 Günlük Tur)" : "Duration (English)"}
                  </label>
                  <input
                    type="text"
                    placeholder={activeLangTab === "tr" ? "Örn: 3 Günlük Tur" : "E.g. 3-Day Tour"}
                    value={(activeLangTab === "tr" ? editingTour.duration : editingTour.duration_en) || ""}
                    onChange={(e) =>
                      setEditingTour(
                        activeLangTab === "tr"
                          ? { ...editingTour, duration: e.target.value }
                          : { ...editingTour, duration_en: e.target.value }
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {activeLangTab === "tr" ? "Lokasyon" : "Location (English)"}
                  </label>
                  <input
                    type="text"
                    placeholder={activeLangTab === "tr" ? "Örn: Nevşehir, Türkiye" : "E.g. Cappadocia, Turkey"}
                    value={(activeLangTab === "tr" ? editingTour.location : editingTour.location_en) || ""}
                    onChange={(e) =>
                      setEditingTour(
                        activeLangTab === "tr"
                          ? { ...editingTour, location: e.target.value }
                          : { ...editingTour, location_en: e.target.value }
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {activeLangTab === "tr" ? "Kategori / Etiket" : "Category Tag (English)"}
                  </label>
                  <input
                    type="text"
                    placeholder={activeLangTab === "tr" ? "Örn: Kültür Turu" : "E.g. Cultural Expedition"}
                    value={(activeLangTab === "tr" ? editingTour.tag : editingTour.tag_en) || ""}
                    onChange={(e) =>
                      setEditingTour(
                        activeLangTab === "tr"
                          ? { ...editingTour, tag: e.target.value }
                          : { ...editingTour, tag_en: e.target.value }
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>


                {/* Multiple Images Upload & Gallery */}
                <div className="md:col-span-2 space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <Images className="h-4 w-4 text-orange-500" />
                    <span>Tur Görselleri (Birden Fazla Yüklenebilir)</span>
                  </label>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => {
                        if (e.target.files) {
                          setImageFiles(Array.from(e.target.files));
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white border border-slate-300 hover:border-orange-500 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
                    >
                      + Dosyadan Çoklu Fotoğraf Seç
                    </button>

                    <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
                      <input
                        type="url"
                        placeholder="Veya Görsel URL'si ekleyin..."
                        value={extraUrl}
                        onChange={(e) => setExtraUrl(e.target.value)}
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!extraUrl.trim()) return;
                          const currentImages = editingTour.images || (editingTour.image ? [editingTour.image] : []);
                          setEditingTour({
                            ...editingTour,
                            image: editingTour.image || extraUrl.trim(),
                            images: [...currentImages, extraUrl.trim()],
                          });
                          setExtraUrl("");
                        }}
                        className="bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Ekle
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail previews */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(editingTour.images || (editingTour.image ? [editingTour.image] : [])).map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group">
                        <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (editingTour.images || []).filter((_, i) => i !== idx);
                            setEditingTour({
                              ...editingTour,
                              image: updated[0] || "",
                              images: updated,
                            });
                          }}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {activeLangTab === "tr" ? "Tur Açıklaması" : "Tour Description (English)"}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={activeLangTab === "tr" ? "Tur programı, gezilecek noktalar ve detaylar..." : "Detailed itinerary, highlights and travel experience..."}
                    value={(activeLangTab === "tr" ? editingTour.description : editingTour.description_en) || ""}
                    onChange={(e) =>
                      setEditingTour(
                        activeLangTab === "tr"
                          ? { ...editingTour, description: e.target.value }
                          : { ...editingTour, description_en: e.target.value }
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm resize-none"
                  ></textarea>
                </div>

                <div className="md:col-span-2 flex justify-end space-x-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditingTour({});
                      setImageFiles([]);
                    }}
                    className="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md"
                  >
                    Taslağa Kaydet
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Mevcut Tur Paketleri</h3>
                  <p className="text-xs text-slate-500">Düzenlemek istediğiniz turu seçin veya yeni tur ekleyin.</p>
                </div>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditingTour({
                      id: `tour-${Date.now()}`,
                      duration: "3 Günlük Tur",
                      location: "Türkiye",
                      tag: "Kültür Turu",
                    });
                    setImageFiles([]);
                  }}
                  className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Yeni Tur Ekle</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <div
                    key={tour.id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-orange-400 font-semibold px-2 py-0.5 rounded text-[11px]">
                        {tour.tag}
                      </span>
                      {tour.images && tour.images.length > 1 && (
                        <span className="absolute bottom-3 left-3 bg-slate-950/80 text-white font-medium px-2 py-0.5 rounded text-[10px] flex items-center space-x-1">
                          <Images className="h-3 w-3 text-orange-400" />
                          <span>{tour.images.length} Fotoğraf</span>
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-base text-slate-900 line-clamp-1">
                          {tour.title}
                        </h4>
                        <span className="font-bold text-orange-600 text-sm ml-2 shrink-0">
                          ${tour.price}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mb-4 flex-1 line-clamp-2">
                        {tour.location} • {tour.duration}
                      </p>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-auto">
                        <button
                          onClick={() => navigate(`/${currentLanguage}/tour/${tour.id}`)}
                          className="text-xs font-semibold text-slate-600 hover:text-orange-600 flex items-center space-x-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Ön İzle</span>
                        </button>

                        <div className="flex space-x-1.5">
                          <button
                            onClick={() => {
                              setEditingTour(tour);
                              setIsEditing(true);
                              setImageFiles([]);
                            }}
                            className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                            title="Düzenle"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tour)}
                            className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )
        )}

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {bookings.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                Henüz kayıtlı rezervasyon bulunmuyor.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-[11px]">
                      <th className="p-4 font-bold">Müşteri</th>
                      <th className="p-4 font-bold">Tur</th>
                      <th className="p-4 font-bold">İletişim</th>
                      <th className="p-4 font-bold">Kişi</th>
                      <th className="p-4 font-bold">Tutar</th>
                      <th className="p-4 font-bold">Durum</th>
                      <th className="p-4 font-bold text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-900">
                          {booking.name}
                        </td>
                        <td className="p-4 font-medium text-slate-700">
                          {booking.itemTitle}
                        </td>
                        <td className="p-4 text-slate-600 space-y-0.5">
                          <div>{booking.phone}</div>
                          {booking.email && <div className="text-[11px] text-slate-400">{booking.email}</div>}
                        </td>
                        <td className="p-4 font-semibold text-slate-700">
                          {booking.guests} Kişi
                        </td>
                        <td className="p-4 font-bold text-orange-600">
                          ${booking.price}
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                            booking.status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {booking.status === "Confirmed" ? "Onaylandı" : "Beklemede"}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              const newStatus = booking.status === "Confirmed" ? "Pending" : "Confirmed";
                              updateBookingStatus(booking.id, newStatus);
                              showNotification(`Rezervasyon durumu "${newStatus === "Confirmed" ? "Onaylandı" : "Beklemede"}" olarak güncellendi.`);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          >
                            {booking.status === "Confirmed" ? "Beklemeye Al" : "Onayla"}
                          </button>
                          <button
                            onClick={() => {
                              askConfirmation({
                                title: "Rezervasyonu Sil?",
                                message: `"${booking.name}" adına olan rezervasyon silinecektir.`,
                                confirmText: "Evet, Sil",
                                isDanger: true,
                                onConfirm: () => {
                                  deleteBooking(booking.id);
                                  showNotification("Rezervasyon silindi.");
                                },
                              });
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* HERO BANNER & MULTI-IMAGE MANAGEMENT TAB */}
        {activeTab === "hero" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header / Actions Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                    <Images className="h-5 w-5" />
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Ana Sayfa Hero Banner & Görsel Yönetimi
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                  Ana sayfanın en üstünde ziyaretçileri karşılayan şık ve profesyonel dönen manşet görsellerini, geçiş süresini ve başlıkları yönetin.
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  type="button"
                  onClick={handleSaveHero}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2 hover:scale-102"
                >
                  <Check className="h-4 w-4" />
                  <span>Hero Değişikliklerini Taslağa Kaydet</span>
                </button>
              </div>
            </div>

            {/* Error Notification */}
            {heroError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-semibold flex items-center justify-between animate-fade-in">
                <span>{heroError}</span>
                <button type="button" onClick={() => setHeroError("")} className="text-red-500 hover:text-red-800 font-bold ml-2">✕</button>
              </div>
            )}

            {/* Live Interactive Hero Banner Preview */}
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-orange-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Canlı Görünüm Simülatörü
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                  {heroDraftImages.length} Aktif Slayt • {heroDraftData.autoplayInterval ? heroDraftData.autoplayInterval / 1000 : 6}sn Geçiş
                </span>
              </div>

              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group select-none">
                {heroDraftImages.length > 0 ? (
                  <img
                    src={heroDraftImages[0]}
                    alt="Hero Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
                    Henüz görsel eklenmedi
                  </div>
                )}
                {/* Vignette overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/60 pointer-events-none" />

                <div className="absolute inset-0 p-6 flex flex-col justify-end text-center items-center space-y-2 pointer-events-none">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/20 px-3 py-0.5 rounded-full border border-orange-500/30">
                    {heroActiveLang === "tr" ? (heroDraftData.badge || "Dünyayı Keşfedin") : (heroDraftData.badge_en || heroDraftData.badge || "Explore the World")}
                  </span>
                  <h3 className="text-lg sm:text-2xl font-black text-white line-clamp-1">
                    {heroActiveLang === "tr" ? (heroDraftData.title || "En Beğendiğiniz Yerleri Bizimle Keşfedin") : (heroDraftData.title_en || heroDraftData.title || "Discover Your Favorite Destinations With Us")}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xl line-clamp-1">
                    {heroActiveLang === "tr" ? (heroDraftData.subtitle || "Gereksiz detaylarla uğraşmadan seyahat edin.") : (heroDraftData.subtitle_en || heroDraftData.subtitle || "Travel effortlessly with us.")}
                  </p>
                </div>

                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-bold border border-white/10">
                  ★ Ana Kapak Görseli (#1)
                </div>
              </div>
            </div>

            {/* Active Rotating Slides Gallery */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <span>Sırayla Dönen Görseller</span>
                    <span className="bg-orange-100 text-orange-700 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                      {heroDraftImages.length} Adet
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Görseller ana sayfada aşağıdaki sıralamayla sinematik olarak döner. İlk görsel (#1) sitenin ana açılış kapağıdır.
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700">Geçiş Süresi:</span>
                  <select
                    value={heroDraftData.autoplayInterval || 6000}
                    onChange={(e) => setHeroDraftData({ ...heroDraftData, autoplayInterval: Number(e.target.value) })}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={4000}>4 Saniye (Hızlı)</option>
                    <option value={6000}>6 Saniye (İdeal - Önerilen)</option>
                    <option value={8000}>8 Saniye (Yavaş)</option>
                    <option value={10000}>10 Saniye (Çok Yavaş)</option>
                  </select>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {heroDraftImages.map((imgUrl, idx) => {
                  const isCover = idx === 0;
                  return (
                    <div
                      key={idx}
                      className={`relative bg-slate-50 rounded-2xl overflow-hidden border-2 transition-all group ${
                        isCover 
                          ? "border-orange-500 shadow-md ring-2 ring-orange-500/20" 
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="h-36 w-full overflow-hidden bg-slate-900 relative">
                        <img
                          src={imgUrl}
                          alt={`Hero Slide ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/20" />

                        {/* Top Badge */}
                        <div className="absolute top-2 left-2">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md ${
                            isCover 
                              ? "bg-orange-600 text-white" 
                              : "bg-slate-900/80 text-white backdrop-blur-sm"
                          }`}>
                            {isCover ? "★ Ana Kapak (#1)" : `#${idx + 1}. Slayt`}
                          </span>
                        </div>
                      </div>

                      {/* Controls Toolbar */}
                      <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-1">
                        <div className="flex items-center space-x-1">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetHeroCover(idx)}
                              className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center space-x-1"
                              title="Ana Kapak Yap (1. sıraya taşı)"
                            >
                              <Star className="h-3 w-3" />
                              <span>Kapak Yap</span>
                            </button>
                          )}
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveHeroImage(idx, "up")}
                              className="p-1 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
                              title="Önceki Sıraya Taşı"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {idx < heroDraftImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveHeroImage(idx, "down")}
                              className="p-1 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
                              title="Sonraki Sıraya Taşı"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveHeroImage(idx)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Bu Görseli Kaldır"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upload & Add Images Panel */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <Plus className="h-4 w-4 text-orange-600" />
                    <span>Yeni Hero Görseli Ekle</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Yüksek çözünürlüklü yatay (landscape) fotoğraflar önerilir
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="file"
                    ref={heroFileInputRef}
                    onChange={handleHeroFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingHero}
                    onClick={() => heroFileInputRef.current?.click()}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm disabled:opacity-50 shrink-0"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{isUploadingHero ? "Görsel Optimize Ediliyor..." : "Bilgisayardan / Telefondan Yükle"}</span>
                  </button>

                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="url"
                      placeholder="veya doğrudan görsel URL'si yapıştırın (https://...)"
                      value={newHeroImageUrl}
                      onChange={(e) => setNewHeroImageUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddHeroUrl();
                        }
                      }}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={handleAddHeroUrl}
                      disabled={!newHeroImageUrl.trim()}
                      className="bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer shrink-0"
                    >
                      + Ekle
                    </button>
                  </div>
                </div>

                {/* Preset Suggestions */}
                <div className="pt-2 border-t border-slate-200/80">
                  <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Önerilen Seçkin Seyahat Görselleri (Tek Tıkla Ekleyin):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {HERO_PRESETS.map((preset, pIdx) => {
                      const isAdded = heroDraftImages.includes(preset.url);
                      return (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleAddHeroPreset(preset.url)}
                          disabled={isAdded}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-all cursor-pointer ${
                            isAdded
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700 opacity-60 cursor-default"
                              : "bg-white border-slate-200 hover:border-orange-500 hover:text-orange-600 text-slate-700 shadow-2xs"
                          }`}
                        >
                          <span>{isAdded ? "✓" : "+"}</span>
                          <span>{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Headlines & Text Editor (TR / EN & AI Translate) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Hero Başlık ve Açıklama Metinleri
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Görsellerin üzerinde yer alan ana manşet metinlerini Türkçe ve İngilizce olarak düzenleyin.
                  </p>
                </div>

                {/* Language Switcher & AI Button */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setHeroActiveLang("tr")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        heroActiveLang === "tr"
                          ? "bg-white text-orange-600 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      🇹🇷 Türkçe
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroActiveLang("en")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        heroActiveLang === "en"
                          ? "bg-white text-blue-600 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      🇬🇧 English
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleTranslateHeroAI}
                    disabled={isTranslatingHero || !heroDraftData.title}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-all"
                  >
                    <Sparkles className={`h-3.5 w-3.5 ${isTranslatingHero ? "animate-spin" : "text-yellow-300"}`} />
                    <span>{isTranslatingHero ? "Çevriliyor..." : "✨ AI ile İngilizceye Çevir"}</span>
                  </button>
                </div>
              </div>

              {heroActiveLang === "en" && (
                <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl text-xs text-blue-900 flex items-start space-x-2">
                  <Globe className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>İngilizce Hero Görünümü:</strong> Ziyaretçi sitede dili "EN" olarak seçtiğinde bu başlık ve açıklamayı görecektir.
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {heroActiveLang === "tr" ? "Rozet Metni (Üst Küçük Başlık)" : "Hero Badge (English)"}
                  </label>
                  <input
                    type="text"
                    value={(heroActiveLang === "tr" ? heroDraftData.badge : heroDraftData.badge_en) || ""}
                    onChange={(e) =>
                      setHeroDraftData(
                        heroActiveLang === "tr"
                          ? { ...heroDraftData, badge: e.target.value }
                          : { ...heroDraftData, badge_en: e.target.value }
                      )
                    }
                    placeholder={heroActiveLang === "tr" ? "Örn: Dünyayı Keşfedin" : "E.g. Explore the World"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {heroActiveLang === "tr" ? "Ana Manşet Başlığı (H1)" : "Main Headline Title (English)"}
                  </label>
                  <input
                    type="text"
                    value={(heroActiveLang === "tr" ? heroDraftData.title : heroDraftData.title_en) || ""}
                    onChange={(e) =>
                      setHeroDraftData(
                        heroActiveLang === "tr"
                          ? { ...heroDraftData, title: e.target.value }
                          : { ...heroDraftData, title_en: e.target.value }
                      )
                    }
                    placeholder={heroActiveLang === "tr" ? "Örn: En Beğendiğiniz Yerleri Bizimle Keşfedin" : "E.g. Discover Your Favorite Destinations With Us"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {heroActiveLang === "tr" ? "Alt Açıklama Metni" : "Subtitle Description (English)"}
                  </label>
                  <textarea
                    rows={2}
                    value={(heroActiveLang === "tr" ? heroDraftData.subtitle : heroDraftData.subtitle_en) || ""}
                    onChange={(e) =>
                      setHeroDraftData(
                        heroActiveLang === "tr"
                          ? { ...heroDraftData, subtitle: e.target.value }
                          : { ...heroDraftData, subtitle_en: e.target.value }
                      )
                    }
                    placeholder={heroActiveLang === "tr" ? "Örn: Gereksiz detaylarla uğraşmadan, dünyanın her köşesine kolayca seyahat edin." : "E.g. Travel effortlessly to every corner of the world."}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-medium"
                  />
                </div>
              </div>

              {/* Bottom Save Action Bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500 text-center sm:text-left">
                  Değişiklikleri kaydettikten sonra sitenizde hemen aktif olması için üstteki <strong className="text-emerald-700">"YAYINLA"</strong> butonuna basabilirsiniz.
                </span>
                <button
                  type="button"
                  onClick={handleSaveHero}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-2 shrink-0"
                >
                  <Check className="h-4 w-4" />
                  <span>Hero Değişikliklerini Taslağa Kaydet</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
