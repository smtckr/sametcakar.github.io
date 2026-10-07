import React from "react";
import { Cookie, ShieldCheck, Check, Settings } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function CookiePolicyPage() {
  const { t } = useLanguage();

  const handleOpenPreferences = () => {
    window.dispatchEvent(new CustomEvent("open_cookie_preferences"));
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm space-y-8">
          {/* Header */}
          <div className="border-b border-slate-100 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-2">
                {t("Yasal Bilgilendirme") || "Yasal Bilgilendirme"}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-3">
                <Cookie className="h-8 w-8 text-orange-500 shrink-0" />
                <span>{t("Çerez Politikası (Cookie Policy)") || "Çerez Politikası"}</span>
              </h1>
              <p className="text-slate-500 text-xs mt-2">
                {t("Son Güncelleme: 1 Ocak 2024") || "Son Güncelleme: 1 Ocak 2024"} • Cesur Akgün Travel Agency
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenPreferences}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3 px-5 rounded-2xl shadow-md transition-all cursor-pointer flex items-center space-x-2 shrink-0 self-start md:self-auto hover:scale-102"
            >
              <Settings className="h-4 w-4" />
              <span>{t("Çerez Tercihlerini Yönet") || "Çerez Tercihlerini Yönet"}</span>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">
                {t("1. Çerez (Cookie) Nedir?") || "1. Çerez (Cookie) Nedir?"}
              </h2>
              <p>
                {t("Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla bilgisayarınıza veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler, web sitesinin daha verimli çalışmasını sağlamak, kullanıcı deneyimini geliştirmek ve site yöneticilerine analitik bilgiler sunmak amacıyla yaygın olarak kullanılmaktadır.") ||
                  "Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla bilgisayarınıza veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır."}
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">
                {t("2. Web Sitemizde Kullanılan Çerez Türleri") || "2. Web Sitemizde Kullanılan Çerez Türleri"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>{t("Zorunlu Çerezler") || "Zorunlu Çerezler"}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {t("Web sitesinin düzgün çalışması, güvenli rezervasyon oturumunun korunması ve temel işlevlerin yürütülmesi için kesinlikle gereklidir. Bu çerezler kapatılamaz.") ||
                      "Web sitesinin düzgün çalışması ve temel işlevlerin yürütülmesi için gereklidir."}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                    <Check className="h-4 w-4 text-blue-600" />
                    <span>{t("İşlevsellik ve Tercih Çerezleri") || "İşlevsellik ve Tercih Çerezleri"}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {t("Dil seçiminiz (Türkçe / İngilizce), para birimi tercihiniz (USD / EUR / TRY) gibi kullanıcı tercihlerinizi hatırlamamıza yardımcı olur.") ||
                      "Dil ve para birimi gibi kullanıcı tercihlerinizi hatırlamamıza yardımcı olur."}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                    <Check className="h-4 w-4 text-purple-600" />
                    <span>{t("Performans ve Analitik Çerezleri") || "Performans ve Analitik Çerezleri"}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {t("Sitemizin hangi sayfalarının daha çok ziyaret edildiğini, ziyaret sürelerini ve olası sayfa hatalarını anonim olarak anlamamıza destek verir.") ||
                      "Sayfa ziyaretlerini ve performansını anonim olarak ölçümlememize yarar."}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                    <Check className="h-4 w-4 text-orange-600" />
                    <span>{t("Rezervasyon Güvenliği Çerezleri") || "Rezervasyon Güvenliği Çerezleri"}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {t("Tur ve otel rezervasyonu adımlarında form verilerinizin güvenli şekilde doğrulanmasını ve iletilmesini sağlar.") ||
                      "Rezervasyon işlemlerinizin güvenliğini sağlar."}
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">
                {t("3. Çerezlerin Kullanım Amaçları") || "3. Çerezlerin Kullanım Amaçları"}
              </h2>
              <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2">
                <li>{t("Web sitesinin temel işlevlerini güvenli şekilde yerine getirmek.") || "Web sitesinin temel işlevlerini yerine getirmek."}</li>
                <li>{t("Seçtiğiniz dil ve para birimini sonraki ziyaretlerinizde hatırlamak.") || "Seçtiğiniz dil ve para birimini hatırlamak."}</li>
                <li>{t("Rezervasyon formlarının güvenliğini sağlamak ve mükerrer talepleri engellemek.") || "Rezervasyon formlarının güvenliğini sağlamak."}</li>
                <li>{t("Hizmet kalitemizi ve tur paketlerimizin sunumunu optimize etmek.") || "Hizmet kalitemizi optimize etmek."}</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900">
                {t("4. Çerez Tercihlerinizi Nasıl Değiştirebilirsiniz?") || "4. Çerez Tercihlerinizi Nasıl Değiştirebilirsiniz?"}
              </h2>
              <p>
                {t("Web sitemizi ilk ziyaret ettiğinizde ekranın alt kısmında beliren Çerez Bildirimi üzerinden tercihlerinizi \"Tümünü Kabul Et\" veya \"Reddet\" seçenekleriyle belirleyebilirsiniz. Ayrıca sayfa başındaki butona tıklayarak dilediğiniz an tercihlerinizi güncelleyebilirsiniz.") ||
                  "Çerez tercihlerinizi dilediğiniz an güncelleyebilirsiniz."}
              </p>
              <p>
                {t("Buna ek olarak, tarayıcınızın ayarlarından (Chrome, Safari, Firefox, Edge vb.) tüm çerezleri engelleyebilir veya mevcut çerezleri silebilirsiniz.") ||
                  "Tarayıcınızın ayarlarından da çerezleri yönetebilirsiniz."}
              </p>
            </section>

            <section className="space-y-2 border-t border-slate-100 pt-6">
              <h2 className="text-lg font-bold text-slate-900">
                {t("5. İletişim") || "5. İletişim"}
              </h2>
              <p>
                {t("Çerez politikamız ve kişisel verilerinizin korunması hakkında her türlü sorunuz için bizimle iletişime geçebilirsiniz:") ||
                  "Çerez politikamız hakkında sorularınız için bize ulaşabilirsiniz:"}
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-1 text-slate-700 font-medium">
                <div><strong>{t("Firma") || "Firma"}:</strong> Cesur Temur Akgün Seyahat Acentası Tic. Ltd. Şti (TÜRSAB No: 13732)</div>
                <div><strong>{t("E-posta") || "E-posta"}:</strong> info@cesurakguntravel.com</div>
                <div><strong>{t("Telefon") || "Telefon"}:</strong> 0544 950 84 85 / 0850 259 41 42</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
