import React from "react";
import { MapPin, Calendar, ArrowRight, Edit2, Trash2 } from "lucide-react";
import { Tour } from "../types";
import { useLanguage, useLocalized } from "../LanguageContext";
import { useCurrency } from "../CurrencyContext";
import { useCMS } from "../CMSContext";

interface TourCardProps {
  key?: string | number;
  tour: Tour;
  onBook: (tour: Tour) => void;
  onSelect: (tour: Tour) => void;
}

export default function TourCard({ tour, onBook, onSelect }: TourCardProps) {
  const { t, currentLanguage } = useLanguage();
  const { getLocalized } = useLocalized();
  const { formatPrice } = useCurrency();
  const { isEditMode, setActiveEditingTour, deleteTour, askConfirmation } = useCMS();

  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border flex flex-col group relative ${
      isEditMode ? "ring-2 ring-orange-400 border-orange-300" : "border-slate-100"
    }`}>
      {/* Tour Image */}
      <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => !isEditMode && onSelect(tour)}>
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Live Edit Mode Overlays */}
        {isEditMode && (
          <div className="absolute top-3 left-3 z-30 flex items-center space-x-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveEditingTour(tour);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-lg flex items-center space-x-1 transition-all cursor-pointer"
              title={t("Turu Düzenle")}
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>{t("Düzenle")}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                askConfirmation({
                  title: "Turu Silmek İstiyor Musunuz?",
                  message: `"${tour.title}" turu taslaktan silinecektir. Dilediğinizde üst bardaki 'Geri Al' butonuyla anında geri getirebilirsiniz.`,
                  confirmText: "Evet, Sil",
                  onConfirm: () => deleteTour(tour.id),
                });
              }}
              className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg shadow-lg transition-all cursor-pointer"
              title={t("Turu Sil")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Price Tag Overlay */}
        <div 
          onClick={(e) => {
            if (isEditMode) {
              e.stopPropagation();
              setActiveEditingTour(tour);
            }
          }}
          className={`absolute bottom-4 left-4 bg-orange-600 text-white font-bold px-3 py-1.5 rounded-lg shadow text-sm ${
            isEditMode ? "ring-2 ring-white cursor-pointer hover:bg-orange-700" : ""
          }`}
          title={isEditMode ? t("Fiyatı değiştirmek için tıklayın") : ""}
        >
          {formatPrice(tour.price)}
        </div>
        {/* Category Tag Overlay */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
          <div className={`backdrop-blur-md font-bold px-2.5 py-1 rounded-md text-xs shadow-md tracking-wide ${
            tour.category === "yurt-disi"
              ? "bg-slate-950/85 text-sky-300 border border-sky-400/30"
              : "bg-slate-950/85 text-orange-400 border border-orange-400/30"
          }`}>
            {tour.category === "yurt-disi"
              ? (currentLanguage === "en" ? "🌍 International" : "🌍 Yurt Dışı")
              : (currentLanguage === "en" ? "🇹🇷 Domestic" : "🇹🇷 Yurt İçi")}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mb-2">
          <Calendar className="h-4 w-4 text-orange-500" />
          <span>{getLocalized(tour, "duration")}</span>
        </div>

        <h3
          onClick={() => onSelect(tour)}
          className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors cursor-pointer mb-2 line-clamp-1"
        >
          {getLocalized(tour, "title")}
        </h3>

        <div className="flex items-start space-x-1 text-sm text-slate-500 mb-4 flex-1">
          <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{getLocalized(tour, "location")}</span>
        </div>

        <div className="border-t border-slate-100 mb-4"></div>

        {/* Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onSelect(tour)}
            className="flex-1 border border-slate-200 hover:border-orange-500 hover:text-orange-500 text-slate-700 font-semibold py-2.5 px-3 rounded-lg text-sm transition-colors cursor-pointer"
          >
            {t("Daha Fazla Bilgi")}
          </button>
          <button
            onClick={() => onBook(tour)}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-3 rounded-lg text-sm flex items-center justify-center space-x-1 shadow transition-colors cursor-pointer"
          >
            <span>{t("Hemen Rezervasyon Yap")}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
