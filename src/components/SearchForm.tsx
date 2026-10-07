import React, { useState } from "react";
import { Search, Calendar, Sparkles, Filter } from "lucide-react";
import { useLanguage, Translate, useLocalized } from "../LanguageContext";
import { Tour } from "../types";

interface SearchFormProps {
  destinations?: string[];
  tours?: Tour[];
  hideDates?: boolean;
  initialDestination?: string;
  className?: string;
  onSearch: (filters: {
    type: "tour";
    destination: string;
    checkIn?: string;
    checkOut?: string;
  }) => void;
  onSelectTour?: (tour: Tour) => void;
}

export default function SearchForm({ 
  onSearch, 
  destinations = [], 
  tours = [], 
  hideDates = false, 
  initialDestination = "", 
  className,
  onSelectTour 
}: SearchFormProps) {
  const [destination, setDestination] = useState(initialDestination);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { t } = useLanguage();
  const { getLocalized } = useLocalized();

  const searchLower = destination.toLocaleLowerCase('tr-TR').trim();
  
  const filteredTours = tours.filter(tour => {
    if (!searchLower) return true; // Show all if empty
    return (
      tour.title.toLocaleLowerCase('tr-TR').includes(searchLower) || 
      (tour.title_en && tour.title_en.toLocaleLowerCase('en-US').includes(searchLower)) ||
      tour.location.toLocaleLowerCase('tr-TR').includes(searchLower) ||
      (tour.location_en && tour.location_en.toLocaleLowerCase('en-US').includes(searchLower))
    );
  });

  const filteredDestinations = destinations.filter(d => {
    if (!searchLower) return false;
    return d.toLocaleLowerCase('tr-TR').includes(searchLower);
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch({
      type: "tour",
      destination,
      checkIn,
      checkOut,
    });
  };

  const showToursList = tours && tours.length > 0;

  return (
    <div className={className || "w-full max-w-4xl mx-auto -mt-10 md:-mt-16 relative z-20 px-4"}>
      {/* GLOWING BORDER BEAM SEARCH BAR (Animated Rotating Glow) */}
      <div className="relative group p-[2.5px] rounded-3xl md:rounded-full transition-all duration-300">
        
        {/* Layer 1: Ambient Outer Glow (Soft neon bloom radiating around the perimeter) */}
        <div className="absolute -inset-[3px] rounded-3xl md:rounded-full overflow-hidden pointer-events-none blur-lg opacity-75 group-hover:opacity-100 transition-opacity">
          <div 
            className="absolute -inset-[200%] animate-border-beam" 
            style={{
              background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, rgba(236,72,153,0.85) 305deg, rgba(249,115,22,0.95) 335deg, rgba(251,191,36,0.95) 355deg, transparent 360deg)"
            }}
          />
        </div>

        {/* Layer 2: Sharp Traveling Laser Beam (Glides continuously along the border edge) */}
        <div className="absolute inset-0 rounded-3xl md:rounded-full overflow-hidden pointer-events-none p-[2px]">
          <div 
            className="absolute -inset-[200%] animate-border-beam" 
            style={{
              background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, #ec4899 310deg, #f97316 338deg, #fbbf24 358deg, transparent 360deg)"
            }}
          />
        </div>

        {/* Layer 3: Inner Search Container (Dark luxury slate card matching reference) */}
        <div className="relative z-10 bg-slate-950/95 hover:bg-slate-950 transition-colors backdrop-blur-xl rounded-[calc(1.5rem-2.5px)] md:rounded-full shadow-2xl p-2 border border-white/10">
          <form 
            onSubmit={handleSearchSubmit} 
            className={`flex flex-col md:flex-row items-center divide-y md:divide-y-0 ${!hideDates ? 'md:divide-x' : ''} divide-slate-800/80`}
          >
            {/* Destination / Tour Search */}
            <div className="flex-1 w-full relative px-4 md:px-6 py-3">
              <label className="block text-[11px] font-bold text-orange-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-orange-400 animate-pulse" />
                <span>{showToursList ? t("Hangi tura katılmak istersiniz?") : <Translate>Nereye gitmek istersiniz?</Translate>}</span>
              </label>
              
              <div className="relative flex items-center">
                <Search className="h-5 w-5 text-orange-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={t("Arama yapın...") || "Arama yapın..."}
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  className="w-full bg-transparent text-sm md:text-base text-white placeholder-slate-400 focus:outline-none font-medium truncate"
                />

                {/* Autocomplete Suggestions Dropdown */}
                {showSuggestions && showToursList && filteredTours.length > 0 && (
                  <ul className="absolute z-50 w-full left-0 top-12 bg-slate-900/98 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl mt-2 max-h-80 overflow-y-auto divide-y divide-slate-800">
                    {filteredTours.map((tour, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-3 hover:bg-slate-800/80 cursor-pointer text-sm text-slate-200 border-b border-slate-800/60 last:border-0 flex items-center gap-3 transition-colors"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          if (onSelectTour) {
                            onSelectTour(tour);
                          } else {
                            setDestination(tour.title);
                          }
                          setShowSuggestions(false);
                        }}
                      >
                        <img src={tour.image} alt={tour.title} className="w-10 h-10 object-cover rounded-xl flex-shrink-0 border border-slate-700" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{getLocalized(tour, "title")}</span>
                          <span className="text-xs text-orange-400/90">{getLocalized(tour, "location")}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                
                {showSuggestions && !showToursList && destination && filteredDestinations.length > 0 && (
                  <ul className="absolute z-50 w-full left-0 top-12 bg-slate-900/98 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl mt-2 max-h-60 overflow-y-auto divide-y divide-slate-800">
                    {filteredDestinations.map((dest, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-3 hover:bg-slate-800 cursor-pointer text-sm text-slate-200 transition-colors"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setDestination(dest);
                          setShowSuggestions(false);
                        }}
                      >
                        {dest}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Dates (if not hidden) */}
            {!hideDates && (
              <div className="flex-[0.8] w-full px-4 md:px-6 py-3">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {t("Tarihler")}
                </label>
                <div className="flex items-center space-x-2 text-white">
                  <Calendar className="h-5 w-5 text-orange-400 flex-shrink-0" />
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="bg-transparent text-sm text-slate-200 focus:outline-none w-full font-medium [color-scheme:dark]"
                  />
                  <span className="text-slate-500">-</span>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="bg-transparent text-sm text-slate-200 focus:outline-none w-full font-medium [color-scheme:dark]"
                  />
                </div>
              </div>
            )}

            {/* Search Action Button with Inset Styling */}
            <div className="w-full md:w-auto p-2 flex items-center justify-end">
              <button
                type="submit"
                className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 px-7 rounded-2xl md:rounded-full text-center transition-all duration-200 cursor-pointer shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 whitespace-nowrap text-sm md:text-base flex items-center justify-center space-x-2 group-hover:scale-[1.02]"
              >
                <Search className="h-4 w-4 stroke-[2.5]" />
                <span><Translate>Turları Ara</Translate></span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
