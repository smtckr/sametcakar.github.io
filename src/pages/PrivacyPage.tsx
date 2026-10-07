import React from "react";
import { useLanguage, Translate } from "../LanguageContext";

export default function PrivacyPage() {
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
              {t("Gizlilik Sözleşmesi ve KVKK Metni")}
            </h1>
            <p className="text-slate-500">
              {t("Son Güncelleme: 1 Ocak 2024")}
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
            <h3 className="text-xl font-bold text-slate-900">{t("1. Kişisel Verilerin İşlenmesi Amacı")}</h3>
            <p>
              {t("Cesur Akgün Turizm A.Ş. olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (\"KVKK\") ve GDPR (Genel Veri Koruma Yönetmeliği) uyarınca kişisel verileriniz; tur rezervasyonlarınızın yapılması, uçak biletlerinin kesilmesi, sigorta poliçelerinin düzenlenmesi ve müşteri hizmetlerinin eksiksiz sunulabilmesi amacıyla işlenmektedir.")}
            </p>

            <h3 className="text-xl font-bold text-slate-900">{t("2. Toplanan Kişisel Veriler")}</h3>
            <p>
              {t("Hizmetlerimizi sunabilmek için ad, soyad, T.C. kimlik numarası veya pasaport bilgileri, doğum tarihi, iletişim bilgileri (telefon, e-posta, adres) ve ödeme bilgileriniz (kredi kartı verileri 3D Secure altyapısıyla şifrelenir ve tarafımızca saklanmaz) toplanmaktadır.")}
            </p>

            <h3 className="text-xl font-bold text-slate-900">{t("3. Verilerin Paylaşımı ve Aktarımı")}</h3>
            <p>
              {t("Kişisel verileriniz, yalnızca rezervasyon işleminin gerçekleştirilebilmesi için havayolu şirketleri, oteller, transfer firmaları, sigorta şirketleri ve yasal zorunluluklar gereği resmi kurumlarla (gümrük, sınır polisleri vb.) yurt içi ve yurt dışında paylaşılabilir.")}
            </p>

            <h3 className="text-xl font-bold text-slate-900">{t("4. Veri Güvenliği")}</h3>
            <p>
              {t("Kişisel verileriniz, yetkisiz erişimi, kaybolmayı veya ifşayı önlemek için en güncel şifreleme ve güvenlik önlemleri ile korunmaktadır. Sunucularımız düzenli olarak siber güvenlik denetimlerinden geçmektedir.")}
            </p>

            <h3 className="text-xl font-bold text-slate-900">{t("5. İlgili Kişinin Hakları")}</h3>
            <p>
              {t("KVKK Madde 11 uyarınca, kişisel verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini talep etme hakkına sahipsiniz. Taleplerinizi info@cesurakguntravel.com adresine yazılı olarak iletebilirsiniz.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
