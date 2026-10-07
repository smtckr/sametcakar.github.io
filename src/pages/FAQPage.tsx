import React from "react";
import { useLanguage, Translate } from "../LanguageContext";

export default function FAQPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="text-sm font-bold text-orange-600 uppercase tracking-widest block">
            {t("Yardım Merkezi")}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            {t("Sıkça Sorulan Sorular")}
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            {t("Rezervasyon süreçleri, ödeme koşulları ve turlarımızla ilgili en çok merak edilen konuları burada derledik.")}
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {t("Rezervasyonumu nasıl iptal edebilirim?")}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t("Tur başlangıç tarihinden en geç 15 gün öncesine kadar rezervasyon iptal taleplerinizi \"İletişim\" veya \"Online Talep\" formu üzerinden iletebilirsiniz. İptal koşulları hakkında daha fazla detay için lütfen \"İptal ve İade Politikası\" sayfamızı inceleyin.")}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {t("Ödeme seçenekleriniz nelerdir?")}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t("Kredi kartı (tek çekim ve taksitli işlemler), banka havalesi ve EFT yöntemleriyle ödemelerinizi güvenle gerçekleştirebilirsiniz. Online ödemelerimiz 3D Secure güvencesi altındadır.")}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {t("Fiyatlara neler dahildir?")}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t("Turlarımız genel olarak konaklama, belirtilen transferler, profesyonel rehberlik hizmeti ve programda \"dahil\" olarak belirtilen öğünleri kapsamaktadır. Vize ücretleri, yurt dışı çıkış harcı ve kişisel harcamalar fiyata dahil değildir.")}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {t("Çocuk indirimleri var mı?")}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t("0-2 yaş bebekler genellikle ücretsizdir. 3-12 yaş arası çocuklar için tur tipine ve otel şartlarına bağlı olarak %15-30 arasında indirimler uygulanabilmektedir.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
