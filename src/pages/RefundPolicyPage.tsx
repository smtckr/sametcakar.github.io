import React from "react";
import { useLanguage, Translate } from "../LanguageContext";

export default function RefundPolicyPage() {
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
              {t("İptal ve İade Politikası")}
            </h1>
            <p className="text-slate-500">
              {t("Son Güncelleme: 1 Ocak 2024")}
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">{t("1. Erken İptaller")}</h3>
            <p>
              {t("Tur başlangıç tarihinden 30 gün öncesine kadar yapılan iptallerde, ödenen tutarın tamamı (varsa uçak bileti ve vize masrafları gibi iadesi mümkün olmayan giderler düşüldükten sonra) iade edilir.")}
            </p>

            <h3 className="text-xl font-bold text-slate-900">{t("2. Tur Tarihine Yakın İptaller")}</h3>
            <p>
              {t("Tur başlangıç tarihine 15-29 gün kala yapılan iptallerde, toplam tur bedelinin %50'si kesinti yapılarak kalan tutar iade edilir. Tur başlangıç tarihine 14 gün ve daha az süre kala yapılan iptallerde hiçbir ücret iadesi yapılmaz.")}
            </p>

            <h3 className="text-xl font-bold text-slate-900">{t("3. Uçak Biletleri ve Promosyonlar")}</h3>
            <p>
              {t("Promosyonlu turlarda veya erken rezervasyon kampanyalarında satın alınan paketlerde hiçbir şekilde iptal veya iade yapılamaz. Uçak biletlerinin iptal koşulları, ilgili havayolu şirketinin kurallarına tabidir.")}
            </p>

            <h3 className="text-xl font-bold text-slate-900">{t("4. İade Süreci ve Süresi")}</h3>
            <p>
              {t("Onaylanan iade işlemleri, iptal talebinin acentemize ulaştığı tarihten itibaren 14 iş günü içerisinde, ödeme yapılan kanal (kredi kartı veya banka hesabı) üzerinden gerçekleştirilir. Kredi kartı iadelerinin ekstrenize yansıması bankanızın süreçlerine bağlıdır.")}
            </p>

            <h3 className="text-xl font-bold text-slate-900">{t("5. İptal Güvence Paketi")}</h3>
            <p>
              {t("Rezervasyon anında \"İptal Güvence Paketi\" satın alan misafirlerimiz, tur başlangıcından 72 saat öncesine kadar koşulsuz şartsız iptal hakkına sahiptir. (Uçak bileti ve vize harçları kapsam dışıdır).")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
