import React, { useState, useEffect, useRef } from "react";
import { X, Upload, Image, DollarSign, MapPin, Clock, Tag, FileText, Check, Trash2, Plus, Star, Images, Sparkles, Globe } from "lucide-react";
import { Tour } from "../types";
import { useCMS } from "../CMSContext";
import { useLanguage, Translate } from "../LanguageContext";
import { compressImage } from "../utils/imageCompressor";

const PRESET_IMAGES = [
  { label: "Balkanlar & Ohrid", url: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?q=80&w=800&auto=format&fit=crop" },
  { label: "Kapadokya", url: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=800&auto=format&fit=crop" },
  { label: "Karadeniz & Yayla", url: "https://images.unsplash.com/photo-1520114008272-38eb7636e788?q=80&w=800&auto=format&fit=crop" },
  { label: "Safranbolu & Amasra", url: "https://images.unsplash.com/photo-1549419138-51829e29aeb6?q=80&w=800&auto=format&fit=crop" },
  { label: "Ege & Akdeniz", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop" },
  { label: "Ankara Kültür", url: "https://images.unsplash.com/photo-1588725845946-b2dcb4a9eb4c?q=80&w=800&auto=format&fit=crop" },
];

export default function TourEditorModal() {
  const {
    activeEditingTour,
    setActiveEditingTour,
    isNewTourModalOpen,
    setIsNewTourModalOpen,
    updateTour,
    addTour,
    deleteTour,
    askConfirmation,
  } = useCMS();
  const { t } = useLanguage();

  const isOpen = !!activeEditingTour || isNewTourModalOpen;
  const isEditing = !!activeEditingTour;

  const [activeLangTab, setActiveLangTab] = useState<"tr" | "en">("tr");
  const [isTranslating, setIsTranslating] = useState(false);

  const [formData, setFormData] = useState<Partial<Tour>>({
    title: "",
    title_en: "",
    price: 150,
    duration: "3 Günlük Tur",
    duration_en: "3-Day Tour",
    location: "Türkiye",
    location_en: "Turkey",
    category: "yurt-ici",
    tag: "Kültür Turu",
    tag_en: "Cultural Tour",
    description: "",
    description_en: "",
    program: "",
    program_en: "",
    included: "",
    included_en: "",
    excluded: "",
    excluded_en: "",
    departurePoints: "",
    departurePoints_en: "",
    tourConditions: "",
    tourConditions_en: "",
    image: PRESET_IMAGES[0].url,
    images: [PRESET_IMAGES[0].url],
  });

  const [extraUrl, setExtraUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeEditingTour) {
      const initialImages = activeEditingTour.images && activeEditingTour.images.length > 0
        ? activeEditingTour.images
        : (activeEditingTour.image ? [activeEditingTour.image] : [PRESET_IMAGES[0].url]);

      setFormData({
        ...activeEditingTour,
        images: initialImages,
        image: activeEditingTour.image || initialImages[0],
      });
    } else if (isNewTourModalOpen) {
      setFormData({
        id: `tour-${Date.now()}`,
        title: "",
        title_en: "",
        price: 200,
        duration: "3 Günlük Tur",
        duration_en: "3-Day Tour",
        location: "İstanbul, Türkiye",
        location_en: "Istanbul, Turkey",
        category: "yurt-ici",
        tag: "Popüler",
        tag_en: "Popular",
        description: "",
        description_en: "",
        program: "",
        program_en: "",
        included: "",
        included_en: "",
        excluded: "",
        excluded_en: "",
        departurePoints: "",
        departurePoints_en: "",
        tourConditions: "",
        tourConditions_en: "",
        image: PRESET_IMAGES[0].url,
        images: [PRESET_IMAGES[0].url],
      });
    }
    setActiveLangTab("tr");
    setExtraUrl("");
  }, [activeEditingTour, isNewTourModalOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setActiveEditingTour(null);
    setIsNewTourModalOpen(false);
  };

  // AI Translation Handler
  const handleAITranslate = async () => {
    if (!formData.title) return;
    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate-tour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          tag: formData.tag,
          duration: formData.duration,
          program: formData.program,
          included: formData.included,
          excluded: formData.excluded,
          departurePoints: formData.departurePoints,
          tourConditions: formData.tourConditions,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          title_en: data.title_en || prev.title_en || prev.title,
          description_en: data.description_en || prev.description_en || prev.description,
          location_en: data.location_en || prev.location_en || prev.location,
          tag_en: data.tag_en || prev.tag_en || prev.tag,
          duration_en: data.duration_en || prev.duration_en || prev.duration,
          program_en: data.program_en || prev.program_en || prev.program,
          included_en: data.included_en || prev.included_en || prev.included,
          excluded_en: data.excluded_en || prev.excluded_en || prev.excluded,
          departurePoints_en: data.departurePoints_en || prev.departurePoints_en || prev.departurePoints,
          tourConditions_en: data.tourConditions_en || prev.tourConditions_en || prev.tourConditions,
        }));
        setActiveLangTab("en");
      }
    } catch (e) {
      console.warn("AI translation service error:", e);
    } finally {
      setIsTranslating(false);
    }
  };

  // Multiple file upload handler
  const handleMultipleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files) as File[];
    try {
      const compressedList = await Promise.all(
        fileList.map((file: File) => compressImage(file, 1400, 800, 0.78))
      );
      setFormData((prev) => {
        const existingImages = prev.images || (prev.image ? [prev.image] : []);
        const combined = [...existingImages, ...compressedList];
        return {
          ...prev,
          image: prev.image || combined[0],
          images: combined,
        };
      });
    } catch (err) {
      console.warn("Tour images compression warning:", err);
    }

    if (e.target) e.target.value = "";
  };

  // Add individual URL to gallery
  const handleAddUrl = () => {
    if (!extraUrl.trim()) return;
    const url = extraUrl.trim();
    setFormData((prev) => {
      const existing = prev.images || (prev.image ? [prev.image] : []);
      return {
        ...prev,
        image: prev.image || url,
        images: [...existing, url],
      };
    });
    setExtraUrl("");
  };

  // Set as primary cover image
  const handleSetCover = (imgUrl: string) => {
    setFormData((prev) => {
      const existing = prev.images || [];
      const reordered = [imgUrl, ...existing.filter((i) => i !== imgUrl)];
      return {
        ...prev,
        image: imgUrl,
        images: reordered,
      };
    });
  };

  // Delete an image from gallery
  const handleDeleteImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const existing = prev.images || [];
      const updated = existing.filter((_, idx) => idx !== indexToRemove);
      const newCover = updated.length > 0 ? (prev.image === existing[indexToRemove] ? updated[0] : prev.image) : PRESET_IMAGES[0].url;
      return {
        ...prev,
        image: newCover,
        images: updated.length > 0 ? updated : [newCover],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;

    let title_en = formData.title_en;
    let description_en = formData.description_en;
    let location_en = formData.location_en;
    let tag_en = formData.tag_en;
    let duration_en = formData.duration_en;

    // If English fields are not filled yet, trigger auto AI translation in background before saving
    if (!title_en || !description_en) {
      try {
        const res = await fetch("/api/translate-tour", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            location: formData.location,
            tag: formData.tag,
            duration: formData.duration,
          }),
        });
        if (res.ok) {
          const trans = await res.json();
          title_en = trans.title_en || title_en;
          description_en = trans.description_en || description_en;
          location_en = trans.location_en || location_en;
          tag_en = trans.tag_en || tag_en;
          duration_en = trans.duration_en || duration_en;
        }
      } catch (err) {
        console.warn("Background translation skipped:", err);
      }
    }

    const allImages = formData.images && formData.images.length > 0
      ? formData.images
      : [formData.image || PRESET_IMAGES[0].url];
    const coverImage = formData.image || allImages[0];

    const tourDataToSave: Tour = {
      id: formData.id || `tour-${Date.now()}`,
      title: formData.title || "",
      title_en: title_en || formData.title || "",
      price: Number(formData.price) || 0,
      duration: formData.duration || "Günübirlik Tur",
      duration_en: duration_en || formData.duration || "Daily Tour",
      location: formData.location || "Türkiye",
      location_en: location_en || formData.location || "Turkey",
      tag: formData.tag || "Genel",
      tag_en: tag_en || formData.tag || "General",
      description: formData.description || "",
      description_en: description_en || formData.description || "",
      program: formData.program || "",
      program_en: (formData as any).program_en || "",
      included: formData.included || "",
      included_en: (formData as any).included_en || "",
      excluded: formData.excluded || "",
      excluded_en: (formData as any).excluded_en || "",
      departurePoints: formData.departurePoints || "",
      departurePoints_en: (formData as any).departurePoints_en || "",
      tourConditions: formData.tourConditions || "",
      tourConditions_en: (formData as any).tourConditions_en || "",
      image: coverImage,
      images: allImages,
    };

    if (isEditing && activeEditingTour) {
      updateTour(activeEditingTour.id, tourDataToSave);
    } else {
      addTour(tourDataToSave);
    }

    handleClose();
  };

  const handleDelete = () => {
    if (activeEditingTour) {
      askConfirmation({
        title: "Turu Silmek İstiyor Musunuz?",
        message: `"${formData.title || activeEditingTour.title}" turu taslaktan silinecektir. Dilediğinizde üst bardaki 'Geri Al' butonuyla anında geri getirebilirsiniz.`,
        confirmText: "Evet, Sil",
        onConfirm: () => {
          deleteTour(activeEditingTour.id);
          handleClose();
        },
      });
    }
  };

  const currentGallery = formData.images && formData.images.length > 0
    ? formData.images
    : (formData.image ? [formData.image] : [PRESET_IMAGES[0].url]);

  return (
    <div 
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block">
              {isEditing ? "Turu Düzenle" : "Yeni Tur Oluştur"}
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              {isEditing ? formData.title || "Tur Düzenleme" : "Yeni Tur Paketi Bilgileri"}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* AI Translation and Language Switcher Toolbar */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Tab Switcher */}
          <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveLangTab("tr")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLangTab === "tr"
                  ? "bg-orange-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🇹🇷 Türkçe (Ana Metin)
            </button>
            <button
              type="button"
              onClick={() => setActiveLangTab("en")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                activeLangTab === "en"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🇬🇧 English (İngilizce)</span>
              {formData.title_en && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>}
            </button>
          </div>

          {/* AI Auto Translate Trigger */}
          <button
            type="button"
            onClick={handleAITranslate}
            disabled={isTranslating || !formData.title}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-all"
            title="Türkçe girdiğiniz metinleri profesyonel turizm İngilizcesine otomatik çevirir"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isTranslating ? "animate-spin" : "text-yellow-300"}`} />
            <span>{isTranslating ? "Yapay Zeka Çeviriyor..." : "✨ AI ile Otomatik İngilizceye Çevir"}</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* Language specific field notices */}
          {activeLangTab === "en" && (
            <div className="bg-blue-50/80 border border-blue-200 p-3.5 rounded-2xl text-xs text-blue-900 flex items-start space-x-2">
              <Globe className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>İngilizce Görünüm:</strong> Ziyaretçi sağ üstten "EN" dilini seçtiğinde bu alandaki metinler görünecektir. Dilerseniz yapay zekanın çevirisini burada manuel olarak düzenleyebilirsiniz.
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {activeLangTab === "tr" ? "Tur Başlığı *" : "Tour Title (English) *"}
            </label>
            <input
              type="text"
              required={activeLangTab === "tr"}
              value={(activeLangTab === "tr" ? formData.title : formData.title_en) || ""}
              onChange={(e) =>
                setFormData(
                  activeLangTab === "tr"
                    ? { ...formData, title: e.target.value }
                    : { ...formData, title_en: e.target.value }
                )
              }
              placeholder={activeLangTab === "tr" ? "Örn: Kapadokya & Balon Turu" : "E.g. Magical Cappadocia Hot Air Balloon Tour"}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium text-slate-900"
            />
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Fiyat (€) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                {activeLangTab === "tr" ? "Tur Süresi" : "Duration (English)"}
              </label>
              <input
                type="text"
                value={(activeLangTab === "tr" ? formData.duration : formData.duration_en) || ""}
                onChange={(e) =>
                  setFormData(
                    activeLangTab === "tr"
                      ? { ...formData, duration: e.target.value }
                      : { ...formData, duration_en: e.target.value }
                  )
                }
                placeholder={activeLangTab === "tr" ? "Örn: 4 Günlük Tur" : "E.g. 4-Day Tour"}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
              />
            </div>
          </div>

          {/* Tour Category (Yurt İçi vs Yurt Dışı) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              {activeLangTab === "tr" ? "Tur Kategorisi *" : "Tour Category *"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, category: "yurt-ici" }))}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
                  (formData.category || "yurt-ici") === "yurt-ici"
                    ? "bg-orange-600 text-white border-orange-600 shadow-md ring-2 ring-orange-500/30"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>🇹🇷</span>
                <span>{activeLangTab === "tr" ? "Yurt İçi Tur" : "Domestic Tour"}</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, category: "yurt-disi" }))}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 border transition-all cursor-pointer ${
                  formData.category === "yurt-disi"
                    ? "bg-orange-600 text-white border-orange-600 shadow-md ring-2 ring-orange-500/30"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>🌍</span>
                <span>{activeLangTab === "tr" ? "Yurt Dışı Tur" : "International Tour"}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              {activeLangTab === "tr"
                ? "Turun web sitesinde Yurt İçi veya Yurt Dışı kategorisinde doğru listelenmesi için seçiniz."
                : "Select whether this tour is Domestic (Turkey) or International (Abroad)."}
            </p>
          </div>

          {/* Location & Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                {activeLangTab === "tr" ? "Konum / Güzergah" : "Location (English)"}
              </label>
              <input
                type="text"
                value={(activeLangTab === "tr" ? formData.location : formData.location_en) || ""}
                onChange={(e) =>
                  setFormData(
                    activeLangTab === "tr"
                      ? { ...formData, location: e.target.value }
                      : { ...formData, location_en: e.target.value }
                  )
                }
                placeholder={activeLangTab === "tr" ? "Örn: Nevşehir, Türkiye" : "E.g. Cappadocia, Turkey"}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                {activeLangTab === "tr" ? "Kategori / Rozet (Tag)" : "Category Tag (English)"}
              </label>
              <input
                type="text"
                value={(activeLangTab === "tr" ? formData.tag : formData.tag_en) || ""}
                onChange={(e) =>
                  setFormData(
                    activeLangTab === "tr"
                      ? { ...formData, tag: e.target.value }
                      : { ...formData, tag_en: e.target.value }
                  )
                }
                placeholder={activeLangTab === "tr" ? "Örn: Kültür Turu, Doğa Turu" : "E.g. Cultural Tour, Adventure"}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {activeLangTab === "tr" ? "Tur Genel Tanıtımı" : "Tour Overview (English)"}
            </label>
            <textarea
              rows={2}
              value={(activeLangTab === "tr" ? formData.description : formData.description_en) || ""}
              onChange={(e) =>
                setFormData(
                  activeLangTab === "tr"
                    ? { ...formData, description: e.target.value }
                    : { ...formData, description_en: e.target.value }
                )
              }
              placeholder={activeLangTab === "tr" ? "Kısa genel özet..." : "Short general summary in English..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-slate-900"
            ></textarea>
          </div>

          {/* 4 Specialized Tabs Fields */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>📋 Tur Sekmeleri Detayları (Program, Dahil/Hariç, Kalkış, Koşullar)</span>
            </h4>

            {/* Program / Itinerary */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {activeLangTab === "tr" ? "1. Tur Programı (Gün Gün / Saat Saat)" : "1. Tour Program / Itinerary (English)"}
              </label>
              <textarea
                rows={3}
                value={(activeLangTab === "tr" ? formData.program : formData.program_en) || ""}
                onChange={(e) =>
                  setFormData(
                    activeLangTab === "tr"
                      ? { ...formData, program: e.target.value }
                      : { ...formData, program_en: e.target.value }
                  )
                }
                placeholder={activeLangTab === "tr" ? "1. Gün: Şehir turu...\n2. Gün: Vadi gezisi..." : "Day 1: City exploration...\nDay 2: Valley hike..."}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-mono"
              ></textarea>
            </div>

            {/* Included & Excluded */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                  {activeLangTab === "tr" ? "2. Fiyata Dahil Olanlar" : "2. Included Services (English)"}
                </label>
                <textarea
                  rows={3}
                  value={(activeLangTab === "tr" ? formData.included : formData.included_en) || ""}
                  onChange={(e) =>
                    setFormData(
                      activeLangTab === "tr"
                        ? { ...formData, included: e.target.value }
                        : { ...formData, included_en: e.target.value }
                    )
                  }
                  placeholder="• Lüks ulaşım&#10;• Rehberlik&#10;• Kahvaltı"
                  className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-mono"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
                  {activeLangTab === "tr" ? "2. Fiyata Dahil Olmayanlar" : "2. Excluded Services (English)"}
                </label>
                <textarea
                  rows={3}
                  value={(activeLangTab === "tr" ? formData.excluded : formData.excluded_en) || ""}
                  onChange={(e) =>
                    setFormData(
                      activeLangTab === "tr"
                        ? { ...formData, excluded: e.target.value }
                        : { ...formData, excluded_en: e.target.value }
                    )
                  }
                  placeholder="• Kişisel harcamalar&#10;• Öğle yemekleri&#10;• Ekstra turlar"
                  className="w-full bg-rose-50/40 border border-rose-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 font-mono"
                ></textarea>
              </div>
            </div>

            {/* Departure Points */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {activeLangTab === "tr" ? "3. Kalkış ve Buluşma Noktaları" : "3. Departure Points (English)"}
              </label>
              <textarea
                rows={2}
                value={(activeLangTab === "tr" ? formData.departurePoints : formData.departurePoints_en) || ""}
                onChange={(e) =>
                  setFormData(
                    activeLangTab === "tr"
                      ? { ...formData, departurePoints: e.target.value }
                      : { ...formData, departurePoints_en: e.target.value }
                  )
                }
                placeholder="• 06:30 - Bakırköy İncirli&#10;• 07:00 - Mecidiyeköy&#10;• 07:30 - Kadıköy"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-mono"
              ></textarea>
            </div>

            {/* Tour Conditions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {activeLangTab === "tr" ? "4. Tur Koşulları & İptal Kuralları" : "4. Tour Terms & Conditions (English)"}
              </label>
              <textarea
                rows={2}
                value={(activeLangTab === "tr" ? formData.tourConditions : formData.tourConditions_en) || ""}
                onChange={(e) =>
                  setFormData(
                    activeLangTab === "tr"
                      ? { ...formData, tourConditions: e.target.value }
                      : { ...formData, tourConditions_en: e.target.value }
                  )
                }
                placeholder="1. 48 saat öncesine kadar kesintisiz iptal&#10;2. Pasaport zorunludur"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-mono"
              ></textarea>
            </div>
          </div>

          {/* MULTI-IMAGE GALLERY UPLOADER SECTION */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Tur Fotoğraf Galerisi ({currentGallery.length} Görsel)
                </label>
                <p className="text-xs text-slate-500">
                  Birden fazla görsel yükleyebilirsiniz. İlk görsel kapak fotoğrafı olur.
                </p>
              </div>

              {/* Multi file upload button */}
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleMultipleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>+ Çoklu Fotoğraf Yükle</span>
                </button>
              </div>
            </div>

            {/* URL Adding */}
            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={extraUrl}
                onChange={(e) => setExtraUrl(e.target.value)}
                placeholder="Veya web üzerinden görsel URL'si ekleyin (https://...)"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                disabled={!extraUrl.trim()}
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                URL Ekle
              </button>
            </div>

            {/* Gallery Image Grid with Cover and Delete Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
              {currentGallery.map((imgUrl, idx) => {
                const isCover = imgUrl === formData.image || idx === 0;
                return (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border-2 aspect-square group shadow-sm bg-slate-100 ${
                      isCover ? "border-orange-500 ring-2 ring-orange-400/30" : "border-slate-200"
                    }`}
                  >
                    <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />

                    {/* Cover badge */}
                    {isCover && (
                      <span className="absolute top-1 left-1 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                        Kapak
                      </span>
                    )}

                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(imgUrl)}
                          className="bg-white/90 hover:bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow cursor-pointer w-full text-center"
                        >
                          Kapak Yap
                        </button>
                      )}
                      {currentGallery.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(idx)}
                          className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-md shadow cursor-pointer"
                          title="Görseli Sil"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 font-semibold text-xs flex items-center space-x-1 p-2 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Bu Turu Sil</span>
              </button>
            ) : <div />}

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>{isEditing ? "Değişiklikleri Taslağa Kaydet" : "Turu Taslağa Ekle"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
