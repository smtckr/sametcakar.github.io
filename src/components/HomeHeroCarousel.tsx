import React, { useState, useEffect, useCallback } from "react";
import { Edit3, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage, useLocalized } from "../LanguageContext";
import { useCMS } from "../CMSContext";
import { DEFAULT_SITE_CONTENT } from "../data";

const FALLBACK_HERO_IMAGES = DEFAULT_SITE_CONTENT.hero.backgroundImages || [
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1920&auto=format&fit=crop"
];

export default function HomeHeroCarousel() {
  const { t, currentLanguage } = useLanguage();
  const { getLocalized } = useLocalized();
  const { siteContent, isEditMode, setIsSiteConfigModalOpen } = useCMS();
  const navigate = useNavigate();

  // Safely extract background images with defensive fallbacks
  const heroData = siteContent?.hero || DEFAULT_SITE_CONTENT.hero;
  const rawImages: string[] = (Array.isArray(heroData.backgroundImages) && heroData.backgroundImages.length > 0)
    ? heroData.backgroundImages
    : (heroData.backgroundImage ? [heroData.backgroundImage] : FALLBACK_HERO_IMAGES);

  // Filter out any empty/broken strings
  const validImages = rawImages.filter(img => typeof img === "string" && img.trim().length > 0);
  const activeImages = validImages.length > 0 ? validImages : FALLBACK_HERO_IMAGES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

  const autoplayInterval = Math.max(heroData.autoplayInterval || 6000, 3000);

  // Keep index within bounds if images array changes
  useEffect(() => {
    if (currentIndex >= activeImages.length) {
      setCurrentIndex(0);
    }
  }, [activeImages.length, currentIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeImages.length);
  }, [activeImages.length]);

  // Completely automatic, uninterrupted rotation
  useEffect(() => {
    if (activeImages.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      goToNext();
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [autoplayInterval, activeImages.length, goToNext]);

  return (
    <div className="relative h-[650px] w-full overflow-hidden select-none bg-slate-950">
      {/* Background Layers with Cinematic Ken Burns Effect & Smooth Crossfade */}
      {activeImages.map((imgUrl, idx) => {
        const isActive = idx === currentIndex;
        const isBroken = brokenImages[idx];
        const effectiveUrl = isBroken
          ? FALLBACK_HERO_IMAGES[idx % FALLBACK_HERO_IMAGES.length]
          : imgUrl;

        // Alternating subtle cinematic zoom direction for each slide
        const zoomStyle = idx % 2 === 0
          ? (isActive ? "scale-108 transition-transform duration-[8000ms] ease-out" : "scale-100")
          : (isActive ? "scale-103 transition-transform duration-[8000ms] ease-out translate-x-1" : "scale-110");

        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={effectiveUrl}
              alt={`Hero slide ${idx + 1}`}
              onError={() => {
                setBrokenImages((prev) => ({ ...prev, [idx]: true }));
              }}
              className={`w-full h-full object-cover object-center ${zoomStyle}`}
            />
          </div>
        );
      })}

      {/* Luxury Cinematic Multi-Stop Vignette Gradient & Subtle Contrast Mask */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/60 pointer-events-none" />
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/60 pointer-events-none" />
      <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.5)_100%)] pointer-events-none" />

      {/* Admin Live Edit Trigger */}
      {isEditMode && (
        <div className="absolute top-6 right-6 z-40">
          <button
            onClick={() => setIsSiteConfigModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-2xl flex items-center space-x-2 transition-all cursor-pointer ring-2 ring-white/60 hover:scale-105"
            title="Hero Görselleri ve Başlığı Düzenle"
          >
            <Edit3 className="h-4 w-4" />
            <span>{t("Hero Görselleri & Başlığı Düzenle") || "Hero Görselleri & Başlığı Düzenle"}</span>
          </button>
        </div>
      )}

      {/* Hero Central Content */}
      <div className="relative z-30 h-full max-w-4xl mx-auto px-4 flex flex-col justify-center items-center text-center space-y-6">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-orange-400 bg-orange-500/15 border border-orange-500/30 px-4 py-1.5 rounded-full inline-flex items-center space-x-1.5 backdrop-blur-md shadow-lg">
          <Sparkles className="h-3.5 w-3.5 text-orange-400" />
          <span>{getLocalized(heroData, "badge")}</span>
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white font-sans drop-shadow-md leading-tight">
          {getLocalized(heroData, "title")}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-200 font-medium max-w-3xl mx-auto drop-shadow leading-relaxed">
          {getLocalized(heroData, "subtitle")}
        </p>

        <div className="flex items-center justify-center space-x-4 pt-4">
          <button
            onClick={() => navigate(`/${currentLanguage}/destination`)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-105 transition-all cursor-pointer text-xs sm:text-sm uppercase tracking-wider"
          >
            {t("Turları İnceleyin")}
          </button>
          <button
            onClick={() => navigate(`/${currentLanguage}/about`)}
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-3.5 px-8 rounded-xl transition-all cursor-pointer text-xs sm:text-sm uppercase tracking-wider backdrop-blur-md hover:scale-105"
          >
            {t("Daha Fazla Bilgi")}
          </button>
        </div>
      </div>
    </div>
  );
}
