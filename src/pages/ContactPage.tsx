import React, { useState } from "react";
import { Mail, Phone, MapPin, Building2, Send, CheckCircle2, Edit3, KeyRound, Navigation, ExternalLink } from "lucide-react";
import { useLanguage, Translate, useLocalized } from "../LanguageContext";
import { useCMS } from "../CMSContext";

export default function ContactPage() {
  const { t } = useLanguage();
  const { getLocalized } = useLocalized();
  const { siteContent, isEditMode, openLoginModal, setIsSiteConfigModalOpen } = useCMS();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const addressText = getLocalized(siteContent.contact, "address") || siteContent.contact.address;
  const googleMapsRouteUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressText)}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(addressText)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Live edit button for contact info */}
        {isEditMode && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setIsSiteConfigModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Edit3 className="h-4 w-4" />
              <span>İletişim & Kurumsal Bilgileri Düzenle</span>
            </button>
          </div>
        )}

        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-sm font-bold text-orange-600 uppercase tracking-widest block">
            <Translate>İletişim</Translate>
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            <Translate>Bize Ulaşın</Translate>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            <Translate>Kurumsal iletişim bilgilerimiz ve destek formumuz ile her zaman yanınızdayız. Seyahat planlarınız veya kurumsal talepleriniz için bize ulaşabilirsiniz.</Translate>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Contact Information & Corporate Details */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                <Translate>İletişim Bilgileri</Translate>
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-full text-orange-600 shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900"><Translate>Adres</Translate></h4>
                    <p className="text-slate-600 mt-1 text-sm leading-relaxed">
                      {getLocalized(siteContent.contact, "address")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-full text-orange-600 shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900"><Translate>Telefon</Translate></h4>
                    <p className="text-slate-600 mt-1 text-sm">{siteContent.contact.phone1}</p>
                    {siteContent.contact.phone2 && <p className="text-slate-600 text-sm">{siteContent.contact.phone2}</p>}
                    {siteContent.contact.phone3 && <p className="text-slate-600 text-sm">{siteContent.contact.phone3}</p>}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-full text-orange-600 shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900"><Translate>E-posta</Translate></h4>
                    <p className="text-slate-600 mt-1 text-sm">{siteContent.contact.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate Details with Secret Admin Trigger */}
            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-sm text-white relative overflow-hidden group">
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <Building2 className="h-6 w-6 text-orange-500" />
                <span><Translate>Kurumsal Bilgiler</Translate></span>
              </h3>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex justify-between border-b border-slate-700 pb-2">
                  <span className="font-medium text-slate-400"><Translate>Ticaret Ünvanı</Translate>:</span>
                  <span className="text-right">{siteContent.contact.companyName}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="font-medium text-slate-400"><Translate>TÜRSAB Belge No</Translate>:</span>
                  {/* Secret click target: opens Admin Login Modal directly */}
                  <span 
                    onClick={openLoginModal}
                    title="Yönetici Girişi"
                    className="text-right font-mono font-bold hover:text-orange-400 cursor-pointer select-none py-1 px-2 rounded-md hover:bg-slate-800/80 transition-all flex items-center space-x-1"
                  >
                    <span>{siteContent.contact.tursabNo}</span>
                    <KeyRound className="h-3 w-3 text-transparent group-hover:text-slate-600 transition-colors" />
                  </span>
                </li>
              </ul>
            </div>
          </div>


          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-sm h-full">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                <Translate>Mesaj Gönder</Translate>
              </h3>
              <p className="text-slate-500 mb-8 text-sm">
                <Translate>Aşağıdaki formu doldurarak bize hızlıca ulaşabilirsiniz. Müşteri temsilcilerimiz en kısa sürede size dönüş yapacaktır.</Translate>
              </p>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-8 text-center space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                  <h4 className="text-xl font-bold"><Translate>Mesajınız başarıyla gönderildi!</Translate></h4>
                  <p className="text-sm"><Translate>İlginiz için teşekkür ederiz. En kısa sürede sizinle iletişime geçeceğiz.</Translate></p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700"><Translate>Adınız Soyadınız</Translate></label>
                      <input 
                        type="text" 
                        required
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder={t("Adınız Soyadınız")}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700"><Translate>E-posta Adresi</Translate></label>
                      <input 
                        type="email" 
                        required
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700"><Translate>Konu</Translate></label>
                    <input 
                      type="text" 
                      required
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder={t("Konu")}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700"><Translate>Mesajınız</Translate></label>
                    <textarea 
                      required
                      rows={5}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                      placeholder={t("Mesajınız")}
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center space-x-2"
                  >
                    <span><Translate>Gönder</Translate></span>
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Interactive Google Map & Route Section */}
        <div className="mt-12 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block">
                {t("Konum & Ulaşım") || "Konum & Ulaşım"}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="h-6 w-6 text-orange-500" />
                <span>{t("Ofisimizin Haritadaki Konumu") || "Ofisimizin Haritadaki Konumu"}</span>
              </h3>
              <p className="text-slate-500 text-sm">
                {addressText}
              </p>
            </div>

            <a
              href={googleMapsRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 transition-all flex items-center justify-center space-x-2 shrink-0 self-start md:self-auto cursor-pointer group"
            >
              <Navigation className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span>{t("Google Haritalar'da Aç & Rota Oluştur") || "Google Haritalar'da Aç & Rota Oluştur"}</span>
              <ExternalLink className="h-4 w-4 opacity-70" />
            </a>
          </div>

          {/* Map Frame with Interactive Click-to-Route Overlay */}
          <div className="relative w-full h-[380px] md:h-[460px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
            <iframe
              title="Cesur Akgün Travel Harita Konumu"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full filter contrast-105"
            />

            {/* Clickable Quick Route Floating Badge */}
            <a
              href={googleMapsRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 bg-slate-950/90 hover:bg-slate-950 text-white backdrop-blur-md px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl flex items-center space-x-2 border border-white/20 transition-all hover:scale-105 cursor-pointer"
            >
              <Navigation className="h-4 w-4 text-orange-400" />
              <span>{t("Yol Tarifi / Rota Al")}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
