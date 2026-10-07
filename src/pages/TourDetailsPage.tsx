import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage, useLocalized } from "../LanguageContext";
import { useCurrency } from "../CurrencyContext";
import { Tour } from "../types";
import { ArrowLeft, Clock, CalendarCheck, CreditCard, Check, X, MapPin, Edit3, ChevronLeft, ChevronRight, Images, CalendarDays, CheckCircle2, ShieldAlert, Bus, FileText, Info } from "lucide-react";
import { useCMS } from "../CMSContext";

export default function TourDetailsPage({ tours, onBook }: { tours: Tour[], onBook: (tour: Tour) => void }) {
  const { id } = useParams<{ id: string }>();
  const { t, currentLanguage } = useLanguage();
  const { getLocalized } = useLocalized();
  const { formatPrice } = useCurrency();
  const { isEditMode, setActiveEditingTour } = useCMS();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"program" | "included" | "departure" | "conditions">("program");

  useEffect(() => {
    const foundTour = tours.find(t => t.id === id);
    if (foundTour) {
      setTour(foundTour);
    }
  }, [id, tours]);

  if (!tour) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900">{t("Tur bulunamadı.")}</h2>
        <button onClick={() => navigate(`/${currentLanguage}/destination`)} className="mt-4 text-[#0071eb] font-bold hover:underline">
          {t("Tüm Tur Konumlarını Gör")}
        </button>
      </div>
    );
  }

  const displayImages = tour.images && tour.images.length > 0 
    ? tour.images 
    : [
        tour.image,
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1531572753322-ad011cbce23e?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600&auto=format&fit=crop"
      ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title and Location */}
        <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{t("Geri")}</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{getLocalized(tour, "title")}</h1>
            <div className="flex flex-wrap items-center gap-3 text-slate-600 text-sm md:text-base font-medium">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-1 text-slate-400" />
                {getLocalized(tour, "location")}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                tour.category === "yurt-disi"
                  ? "bg-sky-100 text-sky-800 border border-sky-200"
                  : "bg-orange-100 text-orange-800 border border-orange-200"
              }`}>
                <span>{tour.category === "yurt-disi" ? "🌍" : "🇹🇷"}</span>
                <span>{tour.category === "yurt-disi" ? t("Yurt Dışı Tur") : t("Yurt İçi Tur")}</span>
              </span>
            </div>
          </div>

          {isEditMode && (
            <button
              onClick={() => setActiveEditingTour(tour)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center space-x-2 transition-all cursor-pointer self-start"
            >
              <Edit3 className="h-4 w-4" />
              <span>{t("Bu Tur Detaylarını Düzenle")}</span>
            </button>
          )}
        </div>

        {/* Image Collage with Gallery Click */}
        <div className="relative mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[50vh] min-h-[400px] max-h-[500px] rounded-2xl overflow-hidden shadow-sm">
            {/* Main Cover Image */}
            <div 
              onClick={() => setActiveImageIndex(0)}
              className="md:col-span-2 md:row-span-2 h-full w-full relative cursor-pointer group overflow-hidden"
            >
              <img 
                src={displayImages[0]} 
                alt={tour.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors" />
            </div>

            {/* Other Images */}
            {displayImages.slice(1, 5).map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImageIndex(idx + 1)}
                className="hidden md:block col-span-1 row-span-1 h-full w-full relative cursor-pointer group overflow-hidden"
              >
                 <img 
                   src={img} 
                   alt={`${tour.title} ${idx + 1}`} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                 />
                 <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors" />
              </div>
            ))}
          </div>

          {/* Show All Photos Button on Collage */}
          <button
            onClick={() => setActiveImageIndex(0)}
            className="absolute bottom-4 right-4 bg-slate-950/80 hover:bg-slate-950 text-white backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center space-x-2 transition-all cursor-pointer border border-white/20"
          >
            <Images className="h-4 w-4 text-orange-400" />
            <span>{t("Tüm Fotoğrafları Gör")} ({displayImages.length})</span>
          </button>
        </div>

        {/* Thumbnail preview strip if more than 1 image */}
        {displayImages.length > 1 && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-10 scrollbar-thin">
            {displayImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className="h-16 w-24 shrink-0 rounded-lg overflow-hidden border border-slate-200 hover:border-orange-500 transition-all cursor-pointer hover:opacity-90"
              >
                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Full-screen Lightbox Modal */}
        {activeImageIndex !== null && (
          <div 
            className="fixed inset-0 z-[150] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-8 animate-fade-in"
            onClick={() => setActiveImageIndex(null)}
          >
            {/* Top header */}
            <div className="w-full max-w-6xl flex items-center justify-between text-white z-10" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-0.5">
                <h4 className="font-bold text-base sm:text-lg">{getLocalized(tour, "title")}</h4>
                <p className="text-xs text-slate-400">
                  {t("Fotoğraf")} {activeImageIndex + 1} / {displayImages.length}
                </p>
              </div>

              <button
                onClick={() => setActiveImageIndex(null)}
                className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Main Large Image with Previous / Next */}
            <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-4" onClick={(e) => e.stopPropagation()}>
              {displayImages.length > 1 && (
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : displayImages.length - 1))}
                  className="absolute left-2 sm:-left-12 bg-slate-900/80 hover:bg-orange-600 text-white p-3 rounded-full shadow-xl transition-all cursor-pointer"
                  title={t("Önceki Fotoğraf")}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              <img
                src={displayImages[activeImageIndex]}
                alt={`${tour.title} Büyük`}
                className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />

              {displayImages.length > 1 && (
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev !== null && prev < displayImages.length - 1 ? prev + 1 : 0))}
                  className="absolute right-2 sm:-right-12 bg-slate-900/80 hover:bg-orange-600 text-white p-3 rounded-full shadow-xl transition-all cursor-pointer"
                  title={t("Sonraki Fotoğraf")}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Thumbnail Bottom Row */}
            <div className="w-full max-w-3xl flex items-center justify-center space-x-2 overflow-x-auto py-2 z-10" onClick={(e) => e.stopPropagation()}>
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-12 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? "border-orange-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* About this activity */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{t("Bu etkinlik hakkında")}</h2>
              <ul className="space-y-6">
                <li className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <CalendarCheck className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">{t("Ücretsiz iptal")}</h3>
                    <p className="text-slate-600 mt-1">{t("Tam para iadesi almak için 24 saat öncesine kadar iptal edin")}</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <CreditCard className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">{t("Şimdi rezerve edin, sonra ödeyin")}</h3>
                    <p className="text-slate-600 mt-1">{t("Seyahat planlarınızı esnek tutun — yerinizi ayırtın ve bugün hiçbir şey ödemeyin.")}</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <Clock className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">{t("Süre")} {getLocalized(tour, "duration")}</h3>
                    <p className="text-slate-600 mt-1">{t("Başlangıç saatlerini görmek için müsaitlik durumunu kontrol edin.")}</p>
                  </div>
                </li>
              </ul>
            </section>

            <hr className="border-slate-200" />

            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{t("Genel Bilgi")}</h2>
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {getLocalized(tour, "description")}
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* 4 Specialized Tour Tabs */}
            <section className="space-y-6">
              <div className="border-b border-slate-200">
                <nav className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
                  <button
                    type="button"
                    onClick={() => setActiveTab("program")}
                    className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
                      activeTab === "program"
                        ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                        : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span>{t("Tur Programı") || "Tur Programı"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("included")}
                    className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
                      activeTab === "included"
                        ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                        : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{t("Dahil & Hariç") || "Dahil & Hariç"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("departure")}
                    className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
                      activeTab === "departure"
                        ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                        : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    <Bus className="h-4 w-4" />
                    <span>{t("Kalkış Noktaları") || "Kalkış Noktaları"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("conditions")}
                    className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
                      activeTab === "conditions"
                        ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                        : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    <ShieldAlert className="h-4 w-4" />
                    <span>{t("Tur Koşulları") || "Tur Koşulları"}</span>
                  </button>
                </nav>
              </div>

              {/* Tab 1: Tur Programı */}
              {activeTab === "program" && (
                <div className="bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6 animate-fade-in">
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{t("Detaylı Tur Programı")}</h3>
                      <p className="text-xs text-slate-500">{t("Adım adım gün ve ziyaret rotası")}</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                    {currentLanguage === "en" ? (tour.program_en || tour.program || tour.description_en || tour.description) : (tour.program || tour.description)}
                  </div>
                </div>
              )}

              {/* Tab 2: Dahil & Hariç */}
              {activeTab === "included" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  {/* Included */}
                  <div className="bg-emerald-50/60 rounded-3xl p-6 sm:p-7 border border-emerald-200 space-y-4">
                    <div className="flex items-center space-x-2 text-emerald-900 font-bold text-base pb-2 border-b border-emerald-200">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span>{t("Fiyata Dahil Olanlar")}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-700 space-y-3 whitespace-pre-line leading-relaxed">
                      {currentLanguage === "en" ? (tour.included_en || tour.included) : (tour.included || "• Lüks tur araçlarıyla ulaşım\n• Profesyonel Türkçe / İngilizce rehberlik hizmeti\n• Programda belirtilen tüm çevre gezileri\n• Zorunlu seyahat sigortası\n• Araç içi su ve ikramlar")}
                    </div>
                  </div>

                  {/* Excluded */}
                  <div className="bg-rose-50/60 rounded-3xl p-6 sm:p-7 border border-rose-200 space-y-4">
                    <div className="flex items-center space-x-2 text-rose-900 font-bold text-base pb-2 border-b border-rose-200">
                      <X className="h-5 w-5 text-rose-600" />
                      <span>{t("Fiyata Dahil Olmayanlar")}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-700 space-y-3 whitespace-pre-line leading-relaxed">
                      {currentLanguage === "en" ? (tour.excluded_en || tour.excluded) : (tour.excluded || "• Kişisel harcamalar ve ekstra hediyelikler\n• Öğle ve akşam yemekleri (Belirtilmedikçe)\n• Müze ve örenyeri giriş ücretleri (MüzeKart tavsiye edilir)\n• İsteğe bağlı ekstra aktiviteler")}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Kalkış Noktaları */}
              {activeTab === "departure" && (
                <div className="bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6 animate-fade-in">
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">
                      <Bus className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{t("Kalkış & Transfer Noktaları")}</h3>
                      <p className="text-xs text-slate-500">{t("Tur hareket saatleri ve buluşma lokasyonları")}</p>
                    </div>
                  </div>

                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    {currentLanguage === "en" ? (tour.departurePoints_en || tour.departurePoints) : (tour.departurePoints || "• 06:30 - Bakırköy İncirli Doğtaş Mobilya Önü\n• 07:00 - Mecidiyeköy Torun Center Önü\n• 07:30 - Kadıköy Evlendirme Dairesi Otoparkı\n• 08:00 - Kartal Köprüsü Otobüs Durağı\n• 08:30 - Çayırova McDonald's Önü")}
                  </div>

                  <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-center space-x-2">
                    <Info className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>{t("Lütfen kalkış saatinden en az 15 dakika önce seçtiğiniz buluşma noktasında hazır bulununuz.")}</span>
                  </div>
                </div>
              )}

              {/* Tab 4: Tur Koşulları */}
              {activeTab === "conditions" && (
                <div className="bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-6 animate-fade-in">
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{t("Tur Kuralları ve Rezervasyon Koşulları")}</h3>
                      <p className="text-xs text-slate-500">{t("İptal, iade, bagaj ve genel katılım şartları")}</p>
                    </div>
                  </div>

                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    {currentLanguage === "en" ? (tour.tourConditions_en || tour.tourConditions) : (tour.tourConditions || "1. Tur hareketinden 48 saat öncesine kadar kesintisiz iptal ve iade hakkı mevcuttur.\n2. Yurt dışı turlarda seyahat tarihinden itibaren en az 6 ay geçerli pasaport zorunludur.\n3. Koltuk numaralandırması rezervasyon sırasına göre otomatik yapılmaktadır.\n4. Hava şartları veya yol durumu nedeniyle rehber güzergah akışında değişiklik yapma hakkına sahiptir.\n5. 0-2 yaş çocuklar için kucakta seyahat ücretsizdir; koltuk talep edilmesi halinde çocuk ücreti uygulanır.")}
                  </div>
                </div>
              )}
            </section>

          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.15)] border border-slate-100 sticky top-28">
              <div className="mb-6">
                <span className="text-slate-900 font-extrabold text-3xl">{formatPrice(tour.price)}</span>
                <span className="text-slate-500 text-sm ml-1">/ {t("kişi")}</span>
              </div>
              <button
                onClick={() => onBook(tour)}
                className="w-full bg-[#0071eb] hover:bg-[#005bb5] text-white font-bold py-3.5 rounded-full transition-colors flex items-center justify-center space-x-2 text-lg"
              >
                <span>{t("Şimdi rezerve edin")}</span>
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-500 font-medium">{t("Bugün ayırtın, hiçbir şey ödemeyin")}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
