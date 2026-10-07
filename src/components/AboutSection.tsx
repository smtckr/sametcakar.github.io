import React from "react";
import { Translate, useLanguage, useLocalized } from "../LanguageContext";
import Logo from "./Logo";
import { useCMS } from "../CMSContext";
import { Edit3 } from "lucide-react";

export default function AboutSection() {
  const { t } = useLanguage();
  const { getLocalized } = useLocalized();
  const { siteContent, isEditMode, setIsSiteConfigModalOpen } = useCMS();

  return (
    <section id="about" className="scroll-mt-20 relative">
      {/* Edit button in live edit mode */}
      {isEditMode && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex justify-end">
          <button
            onClick={() => setIsSiteConfigModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Edit3 className="h-4 w-4" />
            <span>Hakkımızda Metin & Bilgilerini Düzenle</span>
          </button>
        </div>
      )}

      {/* Introduction block */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <Logo className="w-64 h-auto mb-2 drop-shadow-sm" />
          <span className="text-sm font-bold text-orange-600 uppercase tracking-widest block">
            {getLocalized(siteContent.about, "badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {getLocalized(siteContent.about, "title")}
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            {getLocalized(siteContent.about, "paragraph1")}
          </p>
          <p className="text-slate-600 leading-relaxed text-sm">
            {getLocalized(siteContent.about, "paragraph2")}
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4 text-center">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-3xl font-black text-orange-600 block">{siteContent.about.happyTravelers}</span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <Translate>Mutlu Gezgin</Translate>
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-3xl font-black text-orange-600 block">{siteContent.about.experienceYears}</span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <Translate>Yıllık Deneyim</Translate>
              </span>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video lg:aspect-square">
          <img
            src={siteContent.about.image}
            alt="Adventure"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/10" />
        </div>
      </div>

      {/* High-impact statistics bar */}
      <div className="bg-slate-900 text-white py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <span className="text-4xl font-black text-orange-500 block">100k+</span>
            <span className="text-xs uppercase tracking-wider text-slate-400">
              <Translate>Başarılı Rezervasyon</Translate>
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-orange-500 block">350+</span>
            <span className="text-xs uppercase tracking-wider text-slate-400">
              <Translate>Özel Seçilmiş Rotalar</Translate>
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-orange-500 block">24/7</span>
            <span className="text-xs uppercase tracking-wider text-slate-400">
              <Translate>Canlı Destek Hattı</Translate>
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-orange-500 block">99.2%</span>
            <span className="text-xs uppercase tracking-wider text-slate-400">
              <Translate>Memnuniyet Oranı</Translate>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
