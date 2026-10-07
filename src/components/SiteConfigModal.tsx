import React, { useState, useRef, useEffect } from "react";
import { X, Check, Upload, Image, Phone, Mail, MapPin, Building, Sparkles, Plus, Trash2, Star, Images, Clock, ArrowUpDown } from "lucide-react";
import { useCMS } from "../CMSContext";
import { SiteContent } from "../types";
import { compressImage } from "../utils/imageCompressor";
import { DEFAULT_SITE_CONTENT } from "../data";

const HERO_PRESETS = [
  { label: "Kapadokya Balonlar (Gündoğumu)", url: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=1920&auto=format&fit=crop" },
  { label: "İstanbul Boğazı & Gün Batımı", url: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1920&auto=format&fit=crop" },
  { label: "Ege & Akdeniz Turkuaz Koyları", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop" },
  { label: "Karadeniz Sisli Yaylaları", url: "https://images.unsplash.com/photo-1520114008272-38eb7636e788?q=80&w=1920&auto=format&fit=crop" },
  { label: "Balkanlar & Ohrid Gölü", url: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?q=80&w=1920&auto=format&fit=crop" },
  { label: "Tropikal Cennet & Plaj", url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1920&auto=format&fit=crop" },
  { label: "Valla & Kanyon Vadileri", url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1920&auto=format&fit=crop" },
  { label: "Tarihi Safranbolu Taş Konakları", url: "https://images.unsplash.com/photo-1549419138-51829e29aeb6?q=80&w=1920&auto=format&fit=crop" },
];

export default function SiteConfigModal() {
  const { isSiteConfigModalOpen, setIsSiteConfigModalOpen, siteContent, updateSiteContent } = useCMS();
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "contact">("hero");

  const [heroData, setHeroData] = useState(siteContent.hero);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isProcessingHeroImage, setIsProcessingHeroImage] = useState(false);
  const [imageError, setImageError] = useState("");

  const [aboutData, setAboutData] = useState(siteContent.about);
  const [contactData, setContactData] = useState(siteContent.contact);
  const [isSaving, setIsSaving] = useState(false);

  const heroFileRef = useRef<HTMLInputElement>(null);
  const aboutFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSiteConfigModalOpen) {
      setHeroData(siteContent.hero);
      const initialHeroImages = (siteContent.hero.backgroundImages && siteContent.hero.backgroundImages.length > 0)
        ? siteContent.hero.backgroundImages
        : (siteContent.hero.backgroundImage ? [siteContent.hero.backgroundImage] : DEFAULT_SITE_CONTENT.hero.backgroundImages || []);
      setHeroImages(initialHeroImages);
      setNewImageUrl("");
      setImageError("");

      setAboutData(siteContent.about);
      setContactData(siteContent.contact);
    }
  }, [isSiteConfigModalOpen, siteContent]);

  if (!isSiteConfigModalOpen) return null;

  // Safe file upload with client-side canvas compression to avoid localStorage quota crashes
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingHeroImage(true);
      setImageError("");
      try {
        const compressed = await compressImage(file, 1600, 900, 0.78);
        setHeroImages((prev) => [...prev, compressed]);
      } catch (err: any) {
        console.error("Hero image compression failed:", err);
        setImageError("Görsel optimize edilemedi. Lütfen geçerli bir JPG veya PNG dosyası seçin.");
      } finally {
        setIsProcessingHeroImage(false);
        if (heroFileRef.current) heroFileRef.current.value = "";
      }
    }
  };

  const handleAddHeroImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageError("");
      setHeroImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleAddPresetImage = (url: string) => {
    setImageError("");
    if (!heroImages.includes(url)) {
      setHeroImages((prev) => [...prev, url]);
    }
  };

  const handleRemoveHeroImage = (idxToRemove: number) => {
    if (heroImages.length <= 1) {
      setImageError("Hero banner için en az 1 aktif görsel bulunmalıdır.");
      setTimeout(() => setImageError(""), 4000);
      return;
    }
    setImageError("");
    setHeroImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSetCoverHeroImage = (idxToCover: number) => {
    const selected = heroImages[idxToCover];
    const rest = heroImages.filter((_, idx) => idx !== idxToCover);
    setHeroImages([selected, ...rest]);
  };

  const handleAboutFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 1200, 800, 0.82);
        setAboutData((prev) => ({ ...prev, image: compressed }));
      } catch (err) {
        console.error("About image compression failed:", err);
      } finally {
        if (aboutFileRef.current) aboutFileRef.current.value = "";
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const primaryImage = heroImages[0] || DEFAULT_SITE_CONTENT.hero.backgroundImage;
      const finalHero = {
        ...heroData,
        backgroundImage: primaryImage,
        backgroundImages: heroImages.length > 0 ? heroImages : [primaryImage],
        autoplayInterval: heroData.autoplayInterval || 6000,
      };

      // Auto translate hero and about with Gemini in background (ONLY text fields to avoid payload bloat)
      const [heroRes, aboutRes] = await Promise.all([
        fetch("/api/translate-site-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: "hero",
            data: {
              badge: finalHero.badge,
              title: finalHero.title,
              subtitle: finalHero.subtitle,
            }
          })
        }),
        fetch("/api/translate-site-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: "about",
            data: {
              badge: aboutData.badge,
              title: aboutData.title,
              paragraph1: aboutData.paragraph1,
              paragraph2: aboutData.paragraph2,
            }
          })
        })
      ]);

      let translatedHero = { ...finalHero };
      let translatedAbout = { ...aboutData };

      if (heroRes.ok) {
        const { data_en } = await heroRes.json();
        if (data_en) {
          translatedHero = {
            ...translatedHero,
            badge_en: data_en.badge_en || data_en.badge || translatedHero.badge_en,
            title_en: data_en.title_en || data_en.title || translatedHero.title_en,
            subtitle_en: data_en.subtitle_en || data_en.subtitle || translatedHero.subtitle_en,
          };
        }
      }

      if (aboutRes.ok) {
        const { data_en } = await aboutRes.json();
        if (data_en) {
          translatedAbout = {
            ...translatedAbout,
            badge_en: data_en.badge_en || data_en.badge || translatedAbout.badge_en,
            title_en: data_en.title_en || data_en.title || translatedAbout.title_en,
            paragraph1_en: data_en.paragraph1_en || data_en.paragraph1 || translatedAbout.paragraph1_en,
            paragraph2_en: data_en.paragraph2_en || data_en.paragraph2 || translatedAbout.paragraph2_en,
          };
        }
      }

      updateSiteContent("hero", translatedHero);
      updateSiteContent("about", translatedAbout);
      updateSiteContent("contact", contactData);
    } catch (err) {
      console.warn("Save completed with fallback:", err);
      const primaryImage = heroImages[0] || DEFAULT_SITE_CONTENT.hero.backgroundImage;
      updateSiteContent("hero", {
        ...heroData,
        backgroundImage: primaryImage,
        backgroundImages: heroImages.length > 0 ? heroImages : [primaryImage],
      });
      updateSiteContent("about", aboutData);
      updateSiteContent("contact", contactData);
    } finally {
      setIsSaving(false);
      setIsSiteConfigModalOpen(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
      onClick={() => setIsSiteConfigModalOpen(false)}
    >
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block">
              Genel Site Yönetimi
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Metinleri ve Görselleri Düzenle
            </h3>
          </div>
          <button
            onClick={() => setIsSiteConfigModalOpen(false)}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab("hero")}
            className={`py-3 px-4 font-bold text-xs uppercase tracking-wider rounded-t-xl transition-all cursor-pointer ${
              activeTab === "hero"
                ? "bg-white text-orange-600 border-t-2 border-orange-500 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Ana Sayfa Hero Banner
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("about")}
            className={`py-3 px-4 font-bold text-xs uppercase tracking-wider rounded-t-xl transition-all cursor-pointer ${
              activeTab === "about"
                ? "bg-white text-orange-600 border-t-2 border-orange-500 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Hakkımızda Bölümü
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className={`py-3 px-4 font-bold text-xs uppercase tracking-wider rounded-t-xl transition-all cursor-pointer ${
              activeTab === "contact"
                ? "bg-white text-orange-600 border-t-2 border-orange-500 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            İletişim & Kurumsal Bilgiler
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {activeTab === "hero" && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Hero Rozet Metni (Üst Küçük Başlık)
                </label>
                <input
                  type="text"
                  value={heroData.badge}
                  onChange={(e) => setHeroData({ ...heroData, badge: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Ana Manşet Başlığı (H1)
                </label>
                <input
                  type="text"
                  value={heroData.title}
                  onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Alt Açıklama Metni
                </label>
                <textarea
                  rows={2}
                  value={heroData.subtitle}
                  onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 resize-none"
                />
              </div>

              {imageError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center justify-between">
                  <span>{imageError}</span>
                  <button type="button" onClick={() => setImageError("")} className="text-red-500 hover:text-red-700 ml-2 font-bold">✕</button>
                </div>
              )}

              {/* Multi-Image Hero Carousel Manager */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Dönen Hero Görselleri ({heroImages.length})
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ana sayfada ziyaretçilere sırayla, sinematik yumuşak geçişle sunulacak görseller.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs text-slate-500 font-semibold">Geçiş Süresi:</span>
                    <select
                      value={heroData.autoplayInterval || 6000}
                      onChange={(e) => setHeroData({ ...heroData, autoplayInterval: Number(e.target.value) })}
                      className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      <option value={4000}>4 Saniye (Hızlı)</option>
                      <option value={6000}>6 Saniye (İdeal)</option>
                      <option value={8000}>8 Saniye (Yavaş)</option>
                      <option value={10000}>10 Saniye (Çok Yavaş)</option>
                    </select>
                  </div>
                </div>

                {/* Active Image Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {heroImages.map((imgUrl, idx) => {
                    const isCover = idx === 0;
                    return (
                      <div
                        key={idx}
                        className={`group relative rounded-xl overflow-hidden border-2 transition-all ${
                          isCover ? "border-orange-500 shadow-md ring-2 ring-orange-500/20" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="h-28 w-full bg-slate-100">
                          <img src={imgUrl} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>

                        {/* Top Badges */}
                        <div className="absolute top-1.5 left-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm ${
                            isCover ? "bg-orange-600 text-white" : "bg-slate-900/80 text-white backdrop-blur-sm"
                          }`}>
                            {isCover ? "★ Ana Kapak" : `#${idx + 1}`}
                          </span>
                        </div>

                        {/* Action buttons on hover */}
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 p-2">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetCoverHeroImage(idx)}
                              className="bg-orange-600 hover:bg-orange-700 text-white p-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
                              title="Ana Kapak Yap (1. sıraya al)"
                            >
                              <Star className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveHeroImage(idx)}
                            className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
                            title="Bu Görseli Kaldır"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Upload & URL Input Controls */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <input
                      type="file"
                      ref={heroFileRef}
                      onChange={handleHeroFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isProcessingHeroImage}
                      onClick={() => heroFileRef.current?.click()}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm disabled:opacity-50 shrink-0"
                    >
                      <Upload className="h-4 w-4" />
                      <span>{isProcessingHeroImage ? "Görsel Optimize Ediliyor..." : "Bilgisayardan / Telefondan Yükle"}</span>
                    </button>

                    <div className="flex flex-1 items-center gap-2">
                      <input
                        type="url"
                        placeholder="veya görsel bağlantı linki (URL) yapıştırın..."
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddHeroImageUrl();
                          }
                        }}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={handleAddHeroImageUrl}
                        disabled={!newImageUrl.trim()}
                        className="bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white text-xs font-bold py-2 px-3.5 rounded-xl transition-all cursor-pointer shrink-0"
                      >
                        + Ekle
                      </button>
                    </div>
                  </div>

                  {/* Preset Luxury Travel Inspirations */}
                  <div className="pt-2">
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Önerilen Seçkin Seyahat Görselleri (Tek tıkla ekleyin):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {HERO_PRESETS.map((preset, pIdx) => {
                        const isAdded = heroImages.includes(preset.url);
                        return (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => handleAddPresetImage(preset.url)}
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
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Hakkımızda Başlığı
                </label>
                <input
                  type="text"
                  value={aboutData.title}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Birinci Paragraf
                </label>
                <textarea
                  rows={3}
                  value={aboutData.paragraph1}
                  onChange={(e) => setAboutData({ ...aboutData, paragraph1: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  İkinci Paragraf
                </label>
                <textarea
                  rows={3}
                  value={aboutData.paragraph2}
                  onChange={(e) => setAboutData({ ...aboutData, paragraph2: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Mutlu Gezgin Sayısı
                  </label>
                  <input
                    type="text"
                    value={aboutData.happyTravelers}
                    onChange={(e) => setAboutData({ ...aboutData, happyTravelers: e.target.value })}
                    placeholder="Örn: 3.200+"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Yıllık Deneyim
                  </label>
                  <input
                    type="text"
                    value={aboutData.experienceYears}
                    onChange={(e) => setAboutData({ ...aboutData, experienceYears: e.target.value })}
                    placeholder="Örn: 15+"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-bold"
                  />
                </div>
              </div>

              {/* About image */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Hakkımızda Fotoğrafı
                </label>
                <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={aboutData.image}
                    alt="About Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={aboutFileRef}
                    onChange={handleAboutFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => aboutFileRef.current?.click()}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Fotoğraf Değiştir</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Telefon 1
                  </label>
                  <input
                    type="text"
                    value={contactData.phone1}
                    onChange={(e) => setContactData({ ...contactData, phone1: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Telefon 2
                  </label>
                  <input
                    type="text"
                    value={contactData.phone2}
                    onChange={(e) => setContactData({ ...contactData, phone2: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Telefon 3
                  </label>
                  <input
                    type="text"
                    value={contactData.phone3}
                    onChange={(e) => setContactData({ ...contactData, phone3: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Ofis Adresi
                </label>
                <textarea
                  rows={2}
                  value={contactData.address}
                  onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    TÜRSAB Belge Numarası
                  </label>
                  <input
                    type="text"
                    value={contactData.tursabNo}
                    onChange={(e) => setContactData({ ...contactData, tursabNo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Ticaret Ünvanı
                  </label>
                  <input
                    type="text"
                    value={contactData.companyName}
                    onChange={(e) => setContactData({ ...contactData, companyName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsSiteConfigModalOpen(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white py-3 px-6 rounded-xl text-xs font-bold shadow-lg shadow-orange-600/30 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>{isSaving ? "Yapay Zeka ile Çevriliyor ve Kaydediliyor..." : "Değişiklikleri Kaydet (Taslak)"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
