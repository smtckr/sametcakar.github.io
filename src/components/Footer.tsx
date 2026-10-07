import React from "react";
import { MapPin, Phone, Mail, Cookie } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage, Translate, useLocalized } from "../LanguageContext";
import Logo from "./Logo";
import { useCMS } from "../CMSContext";

export default function Footer() {
  const { t, currentLanguage } = useLanguage();
  const { getLocalized } = useLocalized();
  const { siteContent, openLoginModal } = useCMS();
  const location = useLocation();
  const isContactPage = location.pathname.endsWith("/contact");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleOpenCookiePreferences = () => {
    window.dispatchEvent(new CustomEvent("open_cookie_preferences"));
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Widget */}
          <div className="space-y-4">
            {isContactPage ? (
              <div 
                onClick={openLoginModal} 
                title="Yönetici Girişi" 
                className="cursor-pointer inline-block"
              >
                <Logo withBackground className="h-12 sm:h-14 w-auto cursor-pointer" />
              </div>
            ) : (
              <Logo withBackground className="h-12 sm:h-14 w-auto" />
            )}
            <p className="text-sm leading-relaxed text-slate-400">
              <Translate>Sıra dışı rotaları keşfedin, hayalinizdeki tatili bizimle planlayın. Unutulmaz anılar biriktirmeniz için her detayda yanınızdayız.</Translate>
            </p>
          </div>

          {/* Information Links */}
          <div>
            <h3 className="text-white font-semibold text-base uppercase tracking-wider mb-6"><Translate>Bilgi</Translate></h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to={`/${currentLanguage}/contact`} className="hover:text-orange-500 transition-colors"><Translate>Online Talep</Translate></Link>
              </li>
              <li>
                <Link to={`/${currentLanguage}/faq`} className="hover:text-orange-500 transition-colors"><Translate>Genel Sorular</Translate></Link>
              </li>
              <li>
                <Link to={`/${currentLanguage}/terms`} className="hover:text-orange-500 transition-colors"><Translate>Rezervasyon Koşulları</Translate></Link>
              </li>
              <li>
                <Link to={`/${currentLanguage}/privacy`} className="hover:text-orange-500 transition-colors"><Translate>Gizlilik Sözleşmesi</Translate></Link>
              </li>
              <li>
                <Link to={`/${currentLanguage}/cookie-policy`} className="hover:text-orange-500 transition-colors"><Translate>Çerez Politikası</Translate></Link>
              </li>
              <li>
                <Link to={`/${currentLanguage}/refund`} className="hover:text-orange-500 transition-colors"><Translate>İade Politikası</Translate></Link>
              </li>
              <li>
                <Link to={`/${currentLanguage}/contact`} className="hover:text-orange-500 transition-colors"><Translate>Bizi Arayın</Translate></Link>
              </li>
            </ul>
          </div>

          {/* Have a Question? Contact */}
          <div>
            <h3 className="text-white font-semibold text-base uppercase tracking-wider mb-6"><Translate>Sorunuz mu var?</Translate></h3>
            <ul className="space-y-4 text-sm mb-6">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-slate-400">{getLocalized(siteContent.contact, "address")}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <div className="flex flex-col space-y-1">
                  <a href={`tel:${siteContent.contact.phone1}`} className="hover:text-orange-500 transition-colors">{siteContent.contact.phone1}</a>
                  {siteContent.contact.phone2 && <a href={`tel:${siteContent.contact.phone2}`} className="hover:text-orange-500 transition-colors">{siteContent.contact.phone2}</a>}
                  {siteContent.contact.phone3 && <a href={`tel:${siteContent.contact.phone3}`} className="hover:text-orange-500 transition-colors">{siteContent.contact.phone3}</a>}
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-500 shrink-0" />
                <a href={`mailto:${siteContent.contact.email}`} className="hover:text-orange-500 transition-colors">{siteContent.contact.email}</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base uppercase tracking-wider mb-6"><Translate>Bültene Abone Olun</Translate></h3>
            <p className="text-sm leading-relaxed text-slate-400 mb-4"><Translate>En yeni turlar ve özel fırsatlardan ilk siz haberdar olun.</Translate></p>
            {subscribed ? (
              <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-xl text-xs font-semibold">
                ✓ {t("Aboneliğiniz başarıyla oluşturuldu! Teşekkür ederiz.")}
              </div>
            ) : (
              <form className="flex flex-col space-y-3" onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}>
                <input 
                  type="email" 
                  placeholder={t('E-posta adresiniz') || 'E-posta adresiniz'} 
                  className="bg-slate-900 text-white text-sm px-4 py-3 rounded-lg border border-slate-800 focus:outline-none focus:border-orange-500 w-full"
                  required
                />
                <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors text-sm w-full cursor-pointer">
                  <Translate>Abone Ol</Translate>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Copyright info */}
        <div className="pt-8 mt-12 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            {t("Telif Hakkı")} &copy; {new Date().getFullYear()} {t("Tüm hakları saklıdır")} | {t("Bu site")} {t("Cesur Akgün Travel Agency için hazırlanmıştır.")}
          </p>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleOpenCookiePreferences}
              className="inline-flex items-center space-x-1.5 text-slate-400 hover:text-orange-400 transition-colors cursor-pointer"
            >
              <Cookie className="h-3.5 w-3.5" />
              <span>{t("Çerez Tercihleri") || "Çerez Tercihleri"}</span>
            </button>
            <Link
              to={`/${currentLanguage}/cookie-policy`}
              className="text-slate-400 hover:text-orange-400 transition-colors"
            >
              <Translate>Çerez Politikası</Translate>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
