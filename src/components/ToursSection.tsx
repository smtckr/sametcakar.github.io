import React from "react";
import { Compass, Search, PlusCircle } from "lucide-react";
import { Tour } from "../types";
import TourCard from "./TourCard";
import { Translate, useLanguage } from "../LanguageContext";
import SearchForm from "./SearchForm";
import { useCMS } from "../CMSContext";

interface ToursSectionProps {
  filteredTours: Tour[];
  tourFilter: string;
  setTourFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  destinations: string[];
  tours?: Tour[];
  onSearch: (filters: { type: "tour"; destination: string; checkIn?: string; checkOut?: string }) => void;
  onBook: (item: Tour) => void;
  onSelect: (item: Tour) => void;
}

export default function ToursSection({
  filteredTours,
  tourFilter,
  setTourFilter,
  searchQuery,
  setSearchQuery,
  destinations,
  tours = [],
  onSearch,
  onBook,
  onSelect,
}: ToursSectionProps) {
  const { t } = useLanguage();
  const { isEditMode, setIsNewTourModalOpen } = useCMS();

  const domesticCount = tours.filter(t => t.category === "yurt-ici" || (!t.category && !t.location.toLowerCase().includes("balkan") && !t.location.toLowerCase().includes("makedonya") && !t.location.toLowerCase().includes("gürcistan") && !t.location.toLowerCase().includes("italya"))).length;
  const internationalCount = tours.filter(t => t.category === "yurt-disi" || (t.location && (t.location.toLowerCase().includes("balkan") || t.location.toLowerCase().includes("makedonya") || t.location.toLowerCase().includes("gürcistan") || t.location.toLowerCase().includes("italya")))).length;

  return (
    <section id="destination" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200 scroll-mt-20">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="text-sm font-bold text-orange-600 uppercase tracking-widest block">
          <Translate>Turlarımız</Translate>
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
          <Translate>Popüler Tur Paketleri</Translate>
        </h2>
        <p className="text-slate-500 text-sm">
          <Translate>En çok tercih edilen, rehber eşliğindeki macera ve gezi programlarımıza göz atın.</Translate>
        </p>
      </div>

      {/* Filter Tabs & Search Info */}
      <div className="mb-8 mt-4 relative z-20">
        <SearchForm 
          onSearch={onSearch} 
          destinations={destinations} 
          tours={tours}
          hideDates={true}
          initialDestination={searchQuery}
          className="w-full max-w-4xl mx-auto"
          onSelectTour={onSelect}
        />
      </div>

      {/* Category Tabs: Tümü / Yurt İçi Turlar / Yurt Dışı Turlar */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <button
          onClick={() => {
            setTourFilter("All");
          }}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center space-x-2 cursor-pointer ${
            tourFilter === "All" || tourFilter === "Tümü"
              ? "bg-orange-600 text-white shadow-orange-600/30 ring-2 ring-orange-600 ring-offset-2"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>{t("Tüm Turlar")}</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
            tourFilter === "All" || tourFilter === "Tümü" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
          }`}>
            {tours.length}
          </span>
        </button>

        <button
          onClick={() => {
            setTourFilter("yurt-ici");
          }}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center space-x-2 cursor-pointer ${
            tourFilter === "yurt-ici"
              ? "bg-orange-600 text-white shadow-orange-600/30 ring-2 ring-orange-600 ring-offset-2"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>🇹🇷 {t("Yurt İçi Turlar")}</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
            tourFilter === "yurt-ici" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
          }`}>
            {domesticCount}
          </span>
        </button>

        <button
          onClick={() => {
            setTourFilter("yurt-disi");
          }}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center space-x-2 cursor-pointer ${
            tourFilter === "yurt-disi"
              ? "bg-orange-600 text-white shadow-orange-600/30 ring-2 ring-orange-600 ring-offset-2"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>🌍 {t("Yurt Dışı Turlar")}</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
            tourFilter === "yurt-disi" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
          }`}>
            {internationalCount}
          </span>
        </button>
      </div>

      {searchQuery && (
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-xs text-slate-500 font-medium">
            {t("Arama")}: <strong className="text-slate-800">"{searchQuery}"</strong>
          </span>
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-orange-600 hover:text-orange-700 font-bold hover:underline cursor-pointer"
          >
            ({t("Temizle")})
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* If in edit mode, show an Add Tour Card at the start */}
        {isEditMode && (
          <div
            onClick={() => setIsNewTourModalOpen(true)}
            className="border-2 border-dashed border-orange-400 bg-orange-50/50 hover:bg-orange-50 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[380px] transition-all hover:scale-[1.01] group shadow-sm"
          >
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-md">
              <PlusCircle className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
              {t("Yeni Tur Paketi Ekle")}
            </h4>
            <p className="text-slate-500 text-xs mt-2 max-w-xs">
              {t("Yeni bir rota, fiyat, süre ve görsel tanımlayarak web sitenizde yayınlayın.")}
            </p>
            <span className="mt-4 inline-flex items-center text-xs font-bold text-orange-600 bg-white px-3 py-1.5 rounded-lg border border-orange-200 shadow-sm">
              {t("+ Tur Ekle")}
            </span>
          </div>
        )}

        {filteredTours.map((tour) => (
          <TourCard
            key={tour.id}
            tour={tour}
            onBook={onBook}
            onSelect={onSelect}
          />
        ))}
      </div>

      {filteredTours.length === 0 && !isEditMode && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-lg mx-auto">
          <Compass className="h-12 w-12 text-slate-300 mx-auto mb-4 animate-spin-slow" />
          <h3 className="text-lg font-bold text-slate-900">
            <Translate>Kriterlerinize uygun tur bulunamadı</Translate>
          </h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">
            <Translate>Farklı bir arama yapmayı deneyin veya filtreleri sıfırlayın.</Translate>
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setTourFilter("All");
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg text-xs cursor-pointer"
          >
            <Translate>Filtreleri Sıfırla</Translate>
          </button>
        </div>
      )}
    </section>
  );
}

