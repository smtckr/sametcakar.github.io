import React from "react";
import { useLanguage, Translate } from "../LanguageContext";

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-slate-100 shadow-sm">
          <div className="mb-10 border-b border-slate-100 pb-8">
            <span className="text-sm font-bold text-orange-600 uppercase tracking-widest block mb-4">
              {t("Yasal Bilgilendirme")}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
              {t("Rezervasyon ve Kullanım Koşulları")}
            </h1>
            <p className="text-slate-500">
              {t("Son Güncelleme: 1 Ocak 2024")}
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">{t("1. Taraflar ve Kapsam")}</h3>
            <p>
              {t("İşbu Kullanım Koşulları (Sözleşme), bir tarafta Cesur Akgün Turizm A.Ş. (Acente) ile diğer tarafta Acente'nin sunduğu hizmetleri satın alan veya rezervasyon yapan Müşteri arasında geçerlidir. Müşteri, web sitemiz üzerinden rezervasyon yaparak bu koşulları kabul etmiş sayılır.")}
            </p>

            <h3 className="text-xl font-bold text-slate-900">{t("2. Rezervasyon ve Ödeme Süreci")}</h3>
            <p>
              {t("Rezervasyonun kesinleşmesi için ön ödeme veya tam ödemenin acente hesaplarına ulaşması gereklidir. Gecikmeli ödemelerden dolayı iptal edilen rezervasyonlarda sorumluluk müşteriye aittir. Kur farkı ve vergi artışları fiyatlara yansıtılabilir.")}
            </p>

            <h3 className="text-xl font-bold text-slate-900">{t("3. Sorumlulukların Sınırlandırılması")}</h3>
            <p>
              {t("Acente, havayolları, oteller veya ulaşım firmalarından kaynaklanan rötarlar, iptaller veya hizmet kusurlarından dolayı doğrudan sorumlu tutulamaz. Mücbir sebepler (doğal afetler, grev, pandemi, savaş vb.) durumunda acente turu iptal etme veya erteleme hakkını saklı tutar.")}
            </p>

            <h3 className="text-xl font-bold text-slate-900">{t("4. Vize ve Pasaport İşlemleri")}</h3>
            <p>
              {t("Yurtdışı turlarında geçerli bir pasaport ve ilgili ülkeye ait vize bulundurmak müşterinin sorumluluğundadır. Vize reddi veya pasaport geçerlilik süresi sorunları nedeniyle tura katılamama durumunda acente iade yapmakla yükümlü değildir.")}
            </p>

            <h3 className="text-xl font-bold text-slate-900">{t("5. Müşterinin Tura Katılım Şartları")}</h3>
            <p>
              {t("Rehber, turun genel düzenini bozan, diğer katılımcıları rahatsız eden kişileri tura kabul etmeme veya turdan çıkarma hakkına sahiptir. Bu gibi durumlarda herhangi bir ücret iadesi yapılmaz.")}
            </p>

            <h3 className="text-xl font-bold text-slate-900">{t("6. Uyuşmazlıkların Çözümü")}</h3>
            <p>
              {t("İşbu sözleşmenin uygulanmasından doğacak her türlü ihtilafta Türkiye Cumhuriyeti yasaları geçerli olup, İstanbul Çağlayan Mahkemeleri ve İcra Daireleri yetkilidir.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
