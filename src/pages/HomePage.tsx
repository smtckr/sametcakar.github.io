import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage, Translate, useLocalized } from "../LanguageContext";
import SearchForm from "../components/SearchForm";
import HomeHeroCarousel from "../components/HomeHeroCarousel";
import { Tour } from "../types";
import { useCMS } from "../CMSContext";

interface HomePageProps {
  destinations?: string[];
  tours?: Tour[];
  onSearch: (filters: { type: "tour"; destination: string; checkIn?: string; checkOut?: string }) => void;
  setSearchQuery: (query: string) => void;
  setTourFilter?: (filter: string) => void;
}

export default function HomePage({ onSearch, setSearchQuery, setTourFilter, destinations = [], tours = [] }: HomePageProps) {
  const { t, currentLanguage } = useLanguage();
  const { getLocalized } = useLocalized();
  const navigate = useNavigate();

  const yurtIciTours = tours.filter(t => t.category === "yurt-ici" || (!t.category && !t.location.includes("Balkan") && !t.location.includes("Makedonya") && !t.location.includes("İtalya") && !t.location.includes("Gürcistan")));
  const yurtDisiTours = tours.filter(t => t.category === "yurt-disi" || (t.location && (t.location.includes("Balkan") || t.location.includes("Makedonya") || t.location.includes("İtalya") || t.location.includes("Gürcistan"))));

  return (
    <div className="w-full">
      {/* Cinematic Multi-Image Hero Carousel with Ken Burns & Smooth Crossfade */}
      <HomeHeroCarousel />

      {/* Interactive Search Panel */}
      <SearchForm 
        onSearch={onSearch} 
        destinations={destinations} 
        tours={tours} 
        hideDates={true}
        onSelectTour={(tour) => navigate(`/${currentLanguage}/tour/${tour.id}`)}
      />

      {/* Services / Welcome section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-sm font-bold text-orange-600 uppercase tracking-widest block">
            {t("Neler Sunuyoruz")}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            {t("Maceranıza Başlama Zamanı")}
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            {t("Cesur Akgün Travel olarak, hayalinizdeki tatili gerçeğe dönüştürmek ve size unutulmaz seyahat deneyimleri sunmak için buradayız.")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: "Activities",
              title: t("Aktiviteler"),
              desc: t("Doğa yürüyüşlerinden şehir turlarına, kültürel gezilerden eğlenceli grup aktivitelerine kadar her tura özel deneyimler planlıyoruz."),
              img: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=300&auto=format&fit=crop",
            },
            {
              icon: "Travel arrangements",
              title: t("Seyahat Düzenlemeleri"),
              desc: t("Önceden planlanmış konforlu lüks transferlerin, uçuş rezervasyonlarının ve hızlı geçiş imkanlarının keyfini çıkarın."),
              img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=300&auto=format&fit=crop",
            },
            {
              icon: "Private Guide",
              title: t("Özel Rehber"),
              desc: t("Yolculuğunuz boyunca derin tarihi ve kültürel bilgiye sahip, çok dilli profesyonel tur rehberleri."),
              img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=300&auto=format&fit=crop",
            },
            {
              icon: "Location Manager",
              title: t("Konum Yöneticisi"),
              desc: t("Detayları, özel yemek isteklerinizi ve konaklama tercihlerinizi yöneten özel rezervasyon koordinatörleri."),
              img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=300&auto=format&fit=crop",
            },
          ].map((serv, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-5"
            >
              <div className="h-44 w-full rounded-xl overflow-hidden relative">
                <img src={serv.img} alt={serv.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">{serv.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{serv.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two Main Tour Categories: Yurt İçi Turlar and Yurt Dışı Turlar */}
      <section className="py-20 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="space-y-2">
              <span className="text-sm font-bold text-orange-600 uppercase tracking-widest block">
                {t("Tur Kategorileri")}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                {t("Rotanızı Seçin")}
              </h2>
            </div>
            <button
              onClick={() => {
                setTourFilter?.("All");
                setSearchQuery("");
                navigate(`/${currentLanguage}/destination`);
              }}
              className="text-orange-600 hover:text-orange-700 font-bold flex items-center space-x-1.5 mt-4 md:mt-0 transition-colors cursor-pointer text-sm"
            >
              <span>{t("Tüm Tur Konumlarını Gör")}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. YURT İÇİ TURLAR */}
            <div
              onClick={() => {
                setTourFilter?.("yurt-ici");
                setSearchQuery("");
                navigate(`/${currentLanguage}/destination?category=yurt-ici`);
              }}
              className="relative h-96 md:h-[420px] rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200/50 flex flex-col justify-end p-8"
            >
              <img
                src="https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=900&auto=format&fit=crop"
                alt="Yurt İçi Turlar"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
              
              {/* Category pill badge on top */}
              <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                <span className="bg-white/95 backdrop-blur-md text-slate-900 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md flex items-center gap-1.5">
                  <span>🇹🇷</span>
                  <span>{t("Yurt İçi")}</span>
                </span>
                <span className="bg-orange-600/90 backdrop-blur-md text-white font-semibold px-3 py-1.5 rounded-xl text-xs shadow-md">
                  {yurtIciTours.length} {t("Tur Seçeneği")}
                </span>
              </div>

              {/* Card Content at bottom */}
              <div className="relative z-10 space-y-3">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-orange-400 transition-colors">
                  {t("Yurt İçi Turlar")}
                </h3>
                <p className="text-slate-300 text-sm max-w-lg line-clamp-2 leading-relaxed">
                  {t("Türkiye'nin dört bir yanındaki eşsiz doğal ve tarihi rotaları keşfedin.")}
                </p>
                <div className="pt-2 flex items-center text-orange-400 font-bold text-sm space-x-2 group-hover:translate-x-1 transition-transform">
                  <span>{t("Yurt İçi Turları Keşfet")}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* 2. YURT DIŞI TURLAR */}
            <div
              onClick={() => {
                setTourFilter?.("yurt-disi");
                setSearchQuery("");
                navigate(`/${currentLanguage}/destination?category=yurt-disi`);
              }}
              className="relative h-96 md:h-[420px] rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200/50 flex flex-col justify-end p-8"
            >
              <img
                src="https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?q=80&w=900&auto=format&fit=crop"
                alt="Yurt Dışı Turlar"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
              
              {/* Category pill badge on top */}
              <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                <span className="bg-white/95 backdrop-blur-md text-slate-900 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md flex items-center gap-1.5">
                  <span>🌍</span>
                  <span>{t("Yurt Dışı")}</span>
                </span>
                <span className="bg-orange-600/90 backdrop-blur-md text-white font-semibold px-3 py-1.5 rounded-xl text-xs shadow-md">
                  {yurtDisiTours.length} {t("Tur Seçeneği")}
                </span>
              </div>

              {/* Card Content at bottom */}
              <div className="relative z-10 space-y-3">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-orange-400 transition-colors">
                  {t("Yurt Dışı Turlar")}
                </h3>
                <p className="text-slate-300 text-sm max-w-lg line-clamp-2 leading-relaxed">
                  {t("Balkanlardan Avrupa'ya, sınırları aşan unutulmaz macera ve kültür seyahatleri.")}
                </p>
                <div className="pt-2 flex items-center text-orange-400 font-bold text-sm space-x-2 group-hover:translate-x-1 transition-transform">
                  <span>{t("Yurt Dışı Turları Keşfet")}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
