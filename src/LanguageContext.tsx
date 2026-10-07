import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export type Language = "tr" | "en";

export interface LanguageOption {
  code: Language;
  name: string;
  countryCode: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "tr", name: "TR", countryCode: "tr" },
  { code: "en", name: "EN", countryCode: "us" }
];

export const STATIC_DICTIONARY: Record<Language, Record<string, string>> = {
  // ... Dictionary remains unchanged, we'll keep the import/export the same but we replace the bottom part

  tr: {
    "Ana Sayfa": "Ana Sayfa",
    "Turlar": "Turlar",
    "Oteller": "Oteller",
    "Blog": "Blog",
    "İletişim": "İletişim",
    "Rezervasyonlarım": "Rezervasyonlarım",
    "Kullanıcı Paneli": "Kullanıcı Paneli",

    "Cesur Akgün'e Hoş Geldiniz": "Cesur Akgün'e Hoş Geldiniz",
    "Hayalinizdeki Seyahat Rezervasyonlarını Güvenle Yönetiyoruz": "Hayalinizdeki Seyahat Rezervasyonlarını Güvenle Yönetiyoruz",
    "Hakkımızda": "Hakkımızda",
    "Keşfetmeye Hazır Mısınız?": "Keşfetmeye Hazır Mısınız?",
    "Doğa ve deniz turlarımızla ruhunuzu dinlendirin, her detayı sizin için planlanmış turlarımızla konforlu seyahat edin.": "Doğa ve deniz turlarımızla ruhunuzu dinlendirin, her detayı sizin için planlanmış turlarımızla konforlu seyahat edin.",
    "Rezervasyon Yap": "Rezervasyon Yap",
    "Turları İncele": "Turları İncele",

    "Tur Rotaları": "Tur Rotaları",
    "Tüm Turlar": "Tüm Turlar",
    "Kriterlerinize uygun tur bulunamadı": "Kriterlerinize uygun tur bulunamadı",
    "Filtreleri Sıfırla": "Filtreleri Sıfırla",
    "Mevcut Oteller": "Mevcut Oteller",
    "Tüm Konumlar": "Tüm Konumlar",
    "Kriterlerinize uygun otel bulunamadı": "Kriterlerinize uygun otel bulunamadı",
    "Gezi Notları": "Gezi Notları",
    "Blog ve Haberler": "Blog ve Haberler",
    "Seyahat tutkunları için hazırladığımız özel seyahat ipuçları, gezi rehberleri ve hikayeler.": "Seyahat tutkunları için hazırladığımız özel seyahat ipuçları, gezi rehberleri ve hikayeler.",
    "Yazar": "Yazar",
    "Yorum": "Yorum",
    "Yorumlar": "Yorumlar",
    "Makalenin tamamını oku": "Makalenin tamamını oku",
    "Yazı bulunamadı": "Yazı bulunamadı",
    "Yan menüdeki aramada başka anahtar kelimeler kullanmayı deneyin.": "Yan menüdeki aramada başka anahtar kelimeler kullanmayı deneyin.",
    "Dünyayı Keşfedin": "Dünyayı Keşfedin",
    "En Beğendiğiniz Yerleri Bizimle Keşfedin": "En Beğendiğiniz Yerleri Bizimle Keşfedin",
    "Gereksiz detaylarla uğraşmadan, dünyanın her köşesine kolayca seyahat edin.": "Gereksiz detaylarla uğraşmadan, dünyanın her köşesine kolayca seyahat edin.",
    "Turları İnceleyin": "Turları İnceleyin",
    "Neler Sunuyoruz": "Neler Sunuyoruz",
    "Maceranıza Başlama Zamanı": "Maceranıza Başlama Zamanı",
    "Cesur Akgün Travel olarak, hayalinizdeki tatili gerçeğe dönüştürmek ve size unutulmaz seyahat deneyimleri sunmak için buradayız.": "Cesur Akgün Travel olarak, hayalinizdeki tatili gerçeğe dönüştürmek ve size unutulmaz seyahat deneyimleri sunmak için buradayız.",
    "Aktiviteler": "Aktiviteler",
    "Seyahat Düzenlemeleri": "Seyahat Düzenlemeleri",
    "Özel Rehber": "Özel Rehber",
    "Konum Yöneticisi": "Konum Yöneticisi",
    "Doğa yürüyüşlerinden şehir turlarına, kültürel gezilerden eğlenceli grup aktivitelerine kadar her tura özel deneyimler planlıyoruz.": "Doğa yürüyüşlerinden şehir turlarına, kültürel gezilerden eğlenceli grup aktivitelerine kadar her tura özel deneyimler planlıyoruz.",
    "Önceden planlanmış konforlu lüks transferlerin, uçuş rezervasyonlarının ve hızlı geçiş imkanlarının keyfini çıkarın.": "Önceden planlanmış konforlu lüks transferlerin, uçuş rezervasyonlarının ve hızlı geçiş imkanlarının keyfini çıkarın.",
    "Yolculuğunuz boyunca derin tarihi ve kültürel bilgiye sahip, çok dilli profesyonel tur rehberleri.": "Yolculuğunuz boyunca derin tarihi ve kültürel bilgiye sahip, çok dilli profesyonel tur rehberleri.",
    "Detayları, özel yemek isteklerinizi ve konaklama tercihlerinizi yöneten özel rezervasyon koordinatörleri.": "Detayları, özel yemek isteklerinizi ve konaklama tercihlerinizi yöneten özel rezervasyon koordinatörleri.",
    "Öne Çıkan Bölgeler": "Öne Çıkan Bölgeler",
    "Rotanızı Seçin": "Rotanızı Seçin",
    "Tüm Tur Konumlarını Gör": "Tüm Tur Konumlarını Gör",
    "Yurt İçi Turlar": "Yurt İçi Turlar",
    "Yurt Dışı Turlar": "Yurt Dışı Turlar",
    "Yurt İçi Tur": "Yurt İçi Tur",
    "Yurt Dışı Tur": "Yurt Dışı Tur",
    "Yurt İçi": "Yurt İçi",
    "Yurt Dışı": "Yurt Dışı",
    "Tur Kategorileri": "Tur Kategorileri",
    "Yurt İçi Turları Keşfet": "Yurt İçi Turları Keşfet",
    "Yurt Dışı Turları Keşfet": "Yurt Dışı Turları Keşfet",
    "Tur Seçeneği": "Tur Seçeneği",
    "Türkiye'nin dört bir yanındaki eşsiz doğal ve tarihi rotaları keşfedin.": "Türkiye'nin dört bir yanındaki eşsiz doğal ve tarihi rotaları keşfedin.",
    "Balkanlardan Avrupa'ya, sınırları aşan unutulmaz macera ve kültür seyahatleri.": "Balkanlardan Avrupa'ya, sınırları aşan unutulmaz macera ve kültür seyahatleri.",
    "Türkiye": "Türkiye",
    "10 Tur Seçeneği": "10 Tur Seçeneği",
    "Balkanlar": "Balkanlar",
    "1 Tur Seçeneği": "1 Tur Seçeneği",
    "Karadeniz": "Karadeniz",
    "2 Tur Seçeneği": "2 Tur Seçeneği",
    "Kapadokya": "Kapadokya",
    "Turlarımız": "Turlarımız",
    "Popüler Tur Paketleri": "Popüler Tur Paketleri",
    "En çok tercih edilen, rehber eşliğindeki macera ve gezi programlarımıza göz atın.": "En çok tercih edilen, rehber eşliğindeki macera ve gezi programlarımıza göz atın.",
    "Tur ara...": "Tur ara...",
    "Arama yapın...": "Arama yapın...",
    "Tur Ara": "Tur Ara",
    "Nereye gitmek istersiniz?": "Nereye gitmek istersiniz?",
    "Fiyat Sınırı": "Fiyat Sınırı",
    "Limit Yok": "Limit Yok",
    "Turları Ara": "Turları Ara",
    "En fazla": "En fazla",
    "15 yılı aşkın sektör deneyimiyle Cesur Akgün Travel Agency, macera, kültürel keşif ve birinci sınıf lüks misafirperverliği birleştiren seyahat programları sunmaya kendini adamıştır.": "15 yılı aşkın sektör deneyimiyle Cesur Akgün Travel Agency, macera, kültürel keşif ve birinci sınıf lüks misafirperverliği birleştiren seyahat programları sunmaya kendini adamıştır.",
    "Profesyonel ekibimiz, ülkemizin dört bir yanındaki eşsiz güzellikleri ve seçkin yurtdışı rotalarını keşfetmeniz için kusursuz deneyimler düzenlemek üzere çalışmaktadır. Tarihi dokuya sahip kültürel gezilerden doğa ile iç içe maceralara kadar her detayı sizin için özenle planlıyoruz.": "Profesyonel ekibimiz, ülkemizin dört bir yanındaki eşsiz güzellikleri ve seçkin yurtdışı rotalarını keşfetmeniz için kusursuz deneyimler düzenlemek üzere çalışmaktadır. Tarihi dokuya sahip kültürel gezilerden doğa ile iç içe maceralara kadar her detayı sizin için özenle planlıyoruz.",
    "Mutlu Gezgin": "Mutlu Gezgin",
    "Yıllık Deneyim": "Yıllık Deneyim",
    "Başarılı Rezervasyon": "Başarılı Rezervasyon",
    "Özel Seçilmiş Rotalar": "Özel Seçilmiş Rotalar",
    "Canlı Destek Hattı": "Canlı Destek Hattı",
    "Memnuniyet Oranı": "Memnuniyet Oranı",

    "Güvenli Rezervasyon Portalı": "Güvenli Rezervasyon Portalı",
    "kişi": "kişi",
    "gece": "gece",
    "E-posta Adresi": "E-posta Adresi",
    "İletişim Numarası": "İletişim Numarası",
    "8 Günlük Tur": "8 Günlük Tur",
    "10 Günlük Tur": "10 Günlük Tur",
    "7 Günlük Tur": "7 Günlük Tur",
    "6 Günlük Tur": "6 Günlük Tur",
    "Tahmini Fiyat": "Tahmini Fiyat",
    "Süre": "Süre",
    "Duş": "Duş",
    "Tek/Çift": "Tek/Çift",
    "Bu tura birinci sınıf ulaşım, 7/24 özel koordinatör desteği ve kültürel yürüyüş izinleri dahildir. Standart paket, standart açık büfe kahvaltı seçenekleri içeren çift kişilik odaları kapsamaktadır.": "Bu tura birinci sınıf ulaşım, 7/24 özel koordinatör desteği ve kültürel yürüyüş izinleri dahildir. Standart paket, standart açık büfe kahvaltı seçenekleri içeren çift kişilik odaları kapsamaktadır.",
    "Bize Ulaşın": "Bize Ulaşın",
    "Kurumsal iletişim bilgilerimiz ve destek formumuz ile her zaman yanınızdayız. Seyahat planlarınız veya kurumsal talepleriniz için bize ulaşabilirsiniz.": "Kurumsal iletişim bilgilerimiz ve destek formumuz ile her zaman yanınızdayız. Seyahat planlarınız veya kurumsal talepleriniz için bize ulaşabilirsiniz.",
    "İletişim Bilgileri": "İletişim Bilgileri",
    "Büyük GAP Turu": "Büyük GAP Turu",
    "Doğu Turu": "Doğu Turu",
    "Doğu Ekspresi": "Doğu Ekspresi",
    "Günübirlik Eskişehir Turu": "Günübirlik Eskişehir Turu",
    "Gelibolu Şehitlik Ziyareti": "Gelibolu Şehitlik Ziyareti",
    "Günübirlik Ankara Ziyareti": "Günübirlik Ankara Ziyareti",
    "Kanyonlar Turu": "Kanyonlar Turu",
    "Kapadokya Turu": "Kapadokya Turu",
    "Karadeniz - Batum Turu": "Karadeniz - Batum Turu",
    "Üsküp, Manastır, Resne, Ohrid Turu": "Üsküp, Manastır, Resne, Ohrid Turu",
    "Kuşadası - Pamukkale Turu": "Kuşadası - Pamukkale Turu",
    "Likya Turu (Fethiye, Ölüdeniz, Dalyan) 4 Gece 5 Gün": "Likya Turu (Fethiye, Ölüdeniz, Dalyan) 4 Gece 5 Gün",
    "Güneydoğu Anadolu": "Güneydoğu Anadolu",
    "Doğu Anadolu": "Doğu Anadolu",
    "Kars, Erzurum": "Kars, Erzurum",
    "Eskişehir": "Eskişehir",
    "Çanakkale": "Çanakkale",
    "Ankara": "Ankara",
    "Kastamonu, Karabük": "Kastamonu, Karabük",
    "Nevşehir, Kapadokya": "Nevşehir, Kapadokya",
    "Doğu Karadeniz, Batum": "Doğu Karadeniz, Batum",
    "Kuzey Makedonya": "Kuzey Makedonya",
    "Aydın, Denizli": "Aydın, Denizli",
    "Muğla, Antalya": "Muğla, Antalya",
    "5 Gece 6 Gün": "5 Gece 6 Gün",
    "6 Gece 7 Gün": "6 Gece 7 Gün",
    "4 Gece 5 Gün": "4 Gece 5 Gün",
    "Günübirlik": "Günübirlik",
    "3 Gece 4 Gün": "3 Gece 4 Gün",
    "2 Gece 3 Gün": "2 Gece 3 Gün",
    "Popüler": "Popüler",
    "Keşif": "Keşif",
    "Lüks Tren": "Lüks Tren",
    "Kültür": "Kültür",
    "Tarih": "Tarih",
    "Tarih & Doğa": "Tarih & Doğa",
    "Yaz Rüyası": "Yaz Rüyası",
    "Güneydoğu Anadolu'nun büyüleyici atmosferini keşfedin. Tarihin sıfır noktası Göbeklitepe'den, sular altındaki Halfeti'ye uzanan bu eşsiz yolculukta medeniyetlerin izini süreceğiz. Bölgenin eşsiz gastronomisi ve kültürel zenginlikleri sizi bekliyor.": "Güneydoğu Anadolu'nun büyüleyici atmosferini keşfedin. Tarihin sıfır noktası Göbeklitepe'den, sular altındaki Halfeti'ye uzanan bu eşsiz yolculukta medeniyetlerin izini süreceğiz. Bölgenin eşsiz gastronomisi ve kültürel zenginlikleri sizi bekliyor.",
    "Anadolu'nun zirvesine, Doğu'nun gizemli coğrafyasına unutulmaz bir yolculuk. Erzurum'un tarihi dokusundan, Kars'ın Baltık mimarisine ve Ani Harabeleri'nin mistik havasına kadar her anı dolu dolu bir macera.": "Anadolu'nun zirvesine, Doğu'nun gizemli coğrafyasına unutulmaz bir yolculuk. Erzurum'un tarihi dokusundan, Kars'ın Baltık mimarisine ve Ani Harabeleri'nin mistik havasına kadar her anı dolu dolu bir macera.",
    "Türkiye'nin en ikonik tren yolculuğu ile masalsı bir kış rüyası. Anadolu'nun karla kaplı büyüleyici manzaraları eşliğinde Kars'a uzanan, hem nostaljik hem de konforlu eşsiz bir deneyim.": "Türkiye'nin en ikonik tren yolculuğu ile masalsı bir kış rüyası. Anadolu'nun karla kaplı büyüleyici manzaraları eşliğinde Kars'a uzanan, hem nostaljik hem de konforlu eşsiz bir deneyim.",
    "İç Anadolu'nun Venedik'i Eskişehir'i bir günde keşfedin. Porsuk Çayı'nda gondol keyfi, tarihi Odunpazarı evleri, Sazova Bilim Kültür ve Sanat Parkı ile masalsı bir gün sizi bekliyor.": "İç Anadolu'nun Venedik'i Eskişehir'i bir günde keşfedin. Porsuk Çayı'nda gondol keyfi, tarihi Odunpazarı evleri, Sazova Bilim Kültür ve Sanat Parkı ile masalsı bir gün sizi bekliyor.",
    "Tarihin yazıldığı topraklara, Çanakkale destanının kalbine duygu yüklü bir ziyaret. Uzman rehberlerimiz eşliğinde şehitliklerimizi anıyor, geçmişimize saygı duruşunda bulunuyoruz.": "Tarihin yazıldığı topraklara, Çanakkale destanının kalbine duygu yüklü bir ziyaret. Uzman rehberlerimiz eşliğinde şehitliklerimizi anıyor, geçmişimize saygı duruşunda bulunuyoruz.",
    "Cumhuriyetimizin kalbi Ankara'yı keşfedin. Anıtkabir ziyareti başta olmak üzere, I. ve II. Meclis, Anadolu Medeniyetleri Müzesi ve Ankara Kalesi ile dolu dolu bir başkent turu.": "Cumhuriyetimizin kalbi Ankara'yı keşfedin. Anıtkabir ziyareti başta olmak üzere, I. ve II. Meclis, Anadolu Medeniyetleri Müzesi ve Ankara Kalesi ile dolu dolu bir başkent turu.",
    "Doğanın muazzam gücüne tanıklık edeceğiniz büyüleyici kanyonlar! Valla, Horma ve Çatak kanyonlarının nefes kesici manzaraları eşliğinde trekking, fotoğrafçılık ve adrenalin dolu anlar.": "Doğanın muazzam gücüne tanıklık edeceğiniz büyüleyici kanyonlar! Valla, Horma ve Çatak kanyonlarının nefes kesici manzaraları eşliğinde trekking, fotoğrafçılık ve adrenalin dolu anlar.",
    "Peri bacalarının masalsı diyarı Kapadokya'da rüya gibi bir tatil. Gökyüzünü süsleyen sıcak hava balonları, yeraltı şehirleri, Göreme Açık Hava Müzesi ve eşsiz gün batımı manzaraları.": "Peri bacalarının masalsı diyarı Kapadokya'da rüya gibi bir tatil. Gökyüzünü süsleyen sıcak hava balonları, yeraltı şehirleri, Göreme Açık Hava Müzesi ve eşsiz gün batımı manzaraları.",
    "Yeşilin her tonunu barındıran Karadeniz yaylalarından, Batum'un hareketli sokaklarına uzanan bir doğa ve kültür şöleni. Fırtına Deresi, Uzungöl ve Ayder Yaylası'nın serin havasını soluyun.": "Yeşilin her tonunu barındıran Karadeniz yaylalarından, Batum'un hareketli sokaklarına uzanan bir doğa ve kültür şöleni. Fırtına Deresi, Uzungöl ve Ayder Yaylası'nın serin havasını soluyun.",
    "Balkanların incisi Kuzey Makedonya'yı adım adım geziyoruz. Tarihi Üsküp sokakları, Atatürk'ün okuduğu Manastır Askeri İdadisi ve doğa harikası Ohrid Gölü ile hafızalara kazınacak bir yurt dışı deneyimi.": "Balkanların incisi Kuzey Makedonya'yı adım adım geziyoruz. Tarihi Üsküp sokakları, Atatürk'ün okuduğu Manastır Askeri İdadisi ve doğa harikası Ohrid Gölü ile hafızalara kazınacak bir yurt dışı deneyimi.",
    "Ege'nin serin sularından, Pamukkale'nin bembeyaz travertenlerine uzanan harika bir rota. Efes Antik Kenti'nin tarihi dokusu ve Hierapolis'in şifalı suları ile yenilenin.": "Ege'nin serin sularından, Pamukkale'nin bembeyaz travertenlerine uzanan harika bir rota. Efes Antik Kenti'nin tarihi dokusu ve Hierapolis'in şifalı suları ile yenilenin.",
    "Akdeniz'in en güzel koylarında, Likya medeniyetinin izinde bir yaz rüyası. Ölüdeniz'in turkuaz suları, Dalyan'ın kaya mezarları ve Saklıkent kanyonunun serinliği sizi bekliyor.": "Akdeniz'in en güzel koylarında, Likya medeniyetinin izinde bir yaz rüyası. Ölüdeniz'in turkuaz suları, Dalyan'ın kaya mezarları ve Saklıkent kanyonunun serinliği sizi bekliyor.",

    "Sıra dışı rotaları keşfedin, hayalinizdeki tatili bizimle planlayın. Unutulmaz anılar biriktirmeniz için her detayda yanınızdayız.": "Sıra dışı rotaları keşfedin, hayalinizdeki tatili bizimle planlayın. Unutulmaz anılar biriktirmeniz için her detayda yanınızdayız.",
    "Bilgi": "Bilgi",
    "Online Talep": "Online Talep",
    "Genel Sorular": "Genel Sorular",
    "Rezervasyon Koşulları": "Rezervasyon Koşulları",
    "Gizlilik Sözleşmesi": "Gizlilik Sözleşmesi",
    "İade Politikası": "İade Politikası",
    "Bizi Arayın": "Bizi Arayın",
    "Deneyimler": "Deneyimler",
    "Macera": "Macera",
    "Otel ve Restoran": "Otel ve Restoran",
    "Plaj / Deniz": "Plaj / Deniz",
    "Doğa": "Doğa",
    "Kamp": "Kamp",
    "Eğlence": "Eğlence",
    "Sorunuz mu var?": "Sorunuz mu var?",
    "Telif Hakkı": "Telif Hakkı",
    "Tüm hakları saklıdır": "Tüm hakları saklıdır",
    "Bu site": "Bu site",
    "Cesur Akgün Travel Agency için hazırlanmıştır.": "Cesur Akgün Travel Agency için hazırlanmıştır.",
    "Kullanım Şartları": "Kullanım Şartları",
    "Gizlilik Politikası": "Gizlilik Politikası",

    "Yasal Bilgilendirme": "Yasal Bilgilendirme",
    "Gizlilik Sözleşmesi ve KVKK Metni": "Gizlilik Sözleşmesi ve KVKK Metni",
    "Son Güncelleme: 1 Ocak 2024": "Son Güncelleme: 1 Ocak 2024",
    "1. Kişisel Verilerin İşlenmesi Amacı": "1. Kişisel Verilerin İşlenmesi Amacı",
    "Cesur Akgün Turizm A.Ş. olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (\"KVKK\") ve GDPR (Genel Veri Koruma Yönetmeliği) uyarınca kişisel verileriniz; tur rezervasyonlarınızın yapılması, uçak biletlerinin kesilmesi, sigorta poliçelerinin düzenlenmesi ve müşteri hizmetlerinin eksiksiz sunulabilmesi amacıyla işlenmektedir.": "Cesur Akgün Turizm A.Ş. olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (\"KVKK\") ve GDPR (Genel Veri Koruma Yönetmeliği) uyarınca kişisel verileriniz; tur rezervasyonlarınızın yapılması, uçak biletlerinin kesilmesi, sigorta poliçelerinin düzenlenmesi ve müşteri hizmetlerinin eksiksiz sunulabilmesi amacıyla işlenmektedir.",
    "2. Toplanan Kişisel Veriler": "2. Toplanan Kişisel Veriler",
    "Hizmetlerimizi sunabilmek için ad, soyad, T.C. kimlik numarası veya pasaport bilgileri, doğum tarihi, iletişim bilgileri (telefon, e-posta, adres) ve ödeme bilgileriniz (kredi kartı verileri 3D Secure altyapısıyla şifrelenir ve tarafımızca saklanmaz) toplanmaktadır.": "Hizmetlerimizi sunabilmek için ad, soyad, T.C. kimlik numarası veya pasaport bilgileri, doğum tarihi, iletişim bilgileri (telefon, e-posta, adres) ve ödeme bilgileriniz (kredi kartı verileri 3D Secure altyapısıyla şifrelenir ve tarafımızca saklanmaz) toplanmaktadır.",
    "3. Verilerin Paylaşımı ve Aktarımı": "3. Verilerin Paylaşımı ve Aktarımı",
    "Kişisel verileriniz, yalnızca rezervasyon işleminin gerçekleştirilebilmesi için havayolu şirketleri, oteller, transfer firmaları, sigorta şirketleri ve yasal zorunluluklar gereği resmi kurumlarla (gümrük, sınır polisleri vb.) yurt içi ve yurt dışında paylaşılabilir.": "Kişisel verileriniz, yalnızca rezervasyon işleminin gerçekleştirilebilmesi için havayolu şirketleri, oteller, transfer firmaları, sigorta şirketleri ve yasal zorunluluklar gereği resmi kurumlarla (gümrük, sınır polisleri vb.) yurt içi ve yurt dışında paylaşılabilir.",
    "4. Veri Güvenliği": "4. Veri Güvenliği",
    "Kişisel verileriniz, yetkisiz erişimi, kaybolmayı veya ifşayı önlemek için en güncel şifreleme ve güvenlik önlemleri ile korunmaktadır. Sunucularımız düzenli olarak siber güvenlik denetimlerinden geçmektedir.": "Kişisel verileriniz, yetkisiz erişimi, kaybolmayı veya ifşayı önlemek için en güncel şifreleme ve güvenlik önlemleri ile korunmaktadır. Sunucularımız düzenli olarak siber güvenlik denetimlerinden geçmektedir.",
    "5. İlgili Kişinin Hakları": "5. İlgili Kişinin Hakları",
    "KVKK Madde 11 uyarınca, kişisel verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini talep etme hakkına sahipsiniz. Taleplerinizi info@cesurakguntravel.com adresine yazılı olarak iletebilirsiniz.": "KVKK Madde 11 uyarınca, kişisel verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini talep etme hakkına sahipsiniz. Taleplerinizi info@cesurakguntravel.com adresine yazılı olarak iletebilirsiniz.",

    "Rezervasyon ve Kullanım Koşulları": "Rezervasyon ve Kullanım Koşulları",
    "1. Taraflar ve Kapsam": "1. Taraflar ve Kapsam",
    "İşbu Kullanım Koşulları (Sözleşme), bir tarafta Cesur Akgün Turizm A.Ş. (Acente) ile diğer tarafta Acente'nin sunduğu hizmetleri satın alan veya rezervasyon yapan Müşteri arasında geçerlidir. Müşteri, web sitemiz üzerinden rezervasyon yaparak bu koşulları kabul etmiş sayılır.": "İşbu Kullanım Koşulları (Sözleşme), bir tarafta Cesur Akgün Turizm A.Ş. (Acente) ile diğer tarafta Acente'nin sunduğu hizmetleri satın alan veya rezervasyon yapan Müşteri arasında geçerlidir. Müşteri, web sitemiz üzerinden rezervasyon yaparak bu koşulları kabul etmiş sayılır.",
    "2. Rezervasyon ve Ödeme Süreci": "2. Rezervasyon ve Ödeme Süreci",
    "Rezervasyonun kesinleşmesi için ön ödeme veya tam ödemenin acente hesaplarına ulaşması gereklidir. Gecikmeli ödemelerden dolayı iptal edilen rezervasyonlarda sorumluluk müşteriye aittir. Kur farkı ve vergi artışları fiyatlara yansıtılabilir.": "Rezervasyonun kesinleşmesi için ön ödeme veya tam ödemenin acente hesaplarına ulaşması gereklidir. Gecikmeli ödemelerden dolayı iptal edilen rezervasyonlarda sorumluluk müşteriye aittir. Kur farkı ve vergi artışları fiyatlara yansıtılabilir.",
    "3. Sorumlulukların Sınırlandırılması": "3. Sorumlulukların Sınırlandırılması",
    "Acente, havayolları, oteller veya ulaşım firmalarından kaynaklanan rötarlar, iptaller veya hizmet kusurlarından dolayı doğrudan sorumlu tutulamaz. Mücbir sebepler (doğal afetler, grev, pandemi, savaş vb.) durumunda acente turu iptal etme veya erteleme hakkını saklı tutar.": "Acente, havayolları, oteller veya ulaşım firmalarından kaynaklanan rötarlar, iptaller veya hizmet kusurlarından dolayı doğrudan sorumlu tutulamaz. Mücbir sebepler (doğal afetler, grev, pandemi, savaş vb.) durumunda acente turu iptal etme veya erteleme hakkını saklı tutar.",
    "4. Vize ve Pasaport İşlemleri": "4. Vize ve Pasaport İşlemleri",
    "Yurtdışı turlarında geçerli bir pasaport ve ilgili ülkeye ait vize bulundurmak müşterinin sorumluluğundadır. Vize reddi veya pasaport geçerlilik süresi sorunları nedeniyle tura katılamama durumunda acente iade yapmakla yükümlü değildir.": "Yurtdışı turlarında geçerli bir pasaport ve ilgili ülkeye ait vize bulundurmak müşterinin sorumluluğundadır. Vize reddi veya pasaport geçerlilik süresi sorunları nedeniyle tura katılamama durumunda acente iade yapmakla yükümlü değildir.",
    "5. Müşterinin Tura Katılım Şartları": "5. Müşterinin Tura Katılım Şartları",
    "Rehber, turun genel düzenini bozan, diğer katılımcıları rahatsız eden kişileri tura kabul etmeme veya turdan çıkarma hakkına sahiptir. Bu gibi durumlarda herhangi bir ücret iadesi yapılmaz.": "Rehber, turun genel düzenini bozan, diğer katılımcıları rahatsız eden kişileri tura kabul etmeme veya turdan çıkarma hakkına sahiptir. Bu gibi durumlarda herhangi bir ücret iadesi yapılmaz.",
    "6. Uyuşmazlıkların Çözümü": "6. Uyuşmazlıkların Çözümü",
    "İşbu sözleşmenin uygulanmasından doğacak her türlü ihtilafta Türkiye Cumhuriyeti yasaları geçerli olup, İstanbul Çağlayan Mahkemeleri ve İcra Daireleri yetkilidir.": "İşbu sözleşmenin uygulanmasından doğacak her türlü ihtilafta Türkiye Cumhuriyeti yasaları geçerli olup, İstanbul Çağlayan Mahkemeleri ve İcra Daireleri yetkilidir.",

    "1. Erken İptaller": "1. Erken İptaller",
    "Tur başlangıç tarihinden 30 gün öncesine kadar yapılan iptallerde, ödenen tutarın tamamı (varsa uçak bileti ve vize masrafları gibi iadesi mümkün olmayan giderler düşüldükten sonra) iade edilir.": "Tur başlangıç tarihinden 30 gün öncesine kadar yapılan iptallerde, ödenen tutarın tamamı (varsa uçak bileti ve vize masrafları gibi iadesi mümkün olmayan giderler düşüldükten sonra) iade edilir.",
    "2. Tur Tarihine Yakın İptaller": "2. Tur Tarihine Yakın İptaller",
    "Tur başlangıç tarihine 15-29 gün kala yapılan iptallerde, toplam tur bedelinin %50'si kesinti yapılarak kalan tutar iade edilir. Tur başlangıç tarihine 14 gün ve daha az süre kala yapılan iptallerde hiçbir ücret iadesi yapılmaz.": "Tur başlangıç tarihine 15-29 gün kala yapılan iptallerde, toplam tur bedelinin %50'si kesinti yapılarak kalan tutar iade edilir. Tur başlangıç tarihine 14 gün ve daha az süre kala yapılan iptallerde hiçbir ücret iadesi yapılmaz.",
    "3. Uçak Biletleri ve Promosyonlar": "3. Uçak Biletleri ve Promosyonlar",
    "Promosyonlu turlarda veya erken rezervasyon kampanyalarında satın alınan paketlerde hiçbir şekilde iptal veya iade yapılamaz. Uçak biletlerinin iptal koşulları, ilgili havayolu şirketinin kurallarına tabidir.": "Promosyonlu turlarda veya erken rezervasyon kampanyalarında satın alınan paketlerde hiçbir şekilde iptal veya iade yapılamaz. Uçak biletlerinin iptal koşulları, ilgili havayolu şirketinin kurallarına tabidir.",
    "4. İade Süreci ve Süresi": "4. İade Süreci ve Süresi",
    "Onaylanan iade işlemleri, iptal talebinin acentemize ulaştığı tarihten itibaren 14 iş günü içerisinde, ödeme yapılan kanal (kredi kartı veya banka hesabı) üzerinden gerçekleştirilir. Kredi kartı iadelerinin ekstrenize yansıması bankanızın süreçlerine bağlıdır.": "Onaylanan iade işlemleri, iptal talebinin acentemize ulaştığı tarihten itibaren 14 iş günü içerisinde, ödeme yapılan kanal (kredi kartı veya banka hesabı) üzerinden gerçekleştirilir. Kredi kartı iadelerinin ekstrenize yansıması bankanızın süreçlerine bağlıdır.",
    "5. İptal Güvence Paketi": "5. İptal Güvence Paketi",
    "Rezervasyon anında \"İptal Güvence Paketi\" satın alan misafirlerimiz, tur başlangıcından 72 saat öncesine kadar koşulsuz şartsız iptal hakkına sahiptir. (Uçak bileti ve vize harçları kapsam dışıdır).": "Rezervasyon anında \"İptal Güvence Paketi\" satın alan misafirlerimiz, tur başlangıcından 72 saat öncesine kadar koşulsuz şartsız iptal hakkına sahiptir. (Uçak bileti ve vize harçları kapsam dışıdır).",

    "Yardım Merkezi": "Yardım Merkezi",
    "Sıkça Sorulan Sorular": "Sıkça Sorulan Sorular",
    "Rezervasyon süreçleri, ödeme koşulları ve turlarımızla ilgili en çok merak edilen konuları burada derledik.": "Rezervasyon süreçleri, ödeme koşulları ve turlarımızla ilgili en çok merak edilen konuları burada derledik.",
    "Rezervasyonumu nasıl iptal edebilirim?": "Rezervasyonumu nasıl iptal edebilirim?",
    "Tur başlangıç tarihinden en geç 15 gün öncesine kadar rezervasyon iptal taleplerinizi \"İletişim\" veya \"Online Talep\" formu üzerinden iletebilirsiniz. İptal koşulları hakkında daha fazla detay için lütfen \"İptal ve İade Politikası\" sayfamızı inceleyin.": "Tur başlangıç tarihinden en geç 15 gün öncesine kadar rezervasyon iptal taleplerinizi \"İletişim\" veya \"Online Talep\" formu üzerinden iletebilirsiniz. İptal koşulları hakkında daha fazla detay için lütfen \"İptal ve İade Politikası\" sayfamızı inceleyin.",
    "Ödeme seçenekleriniz nelerdir?": "Ödeme seçenekleriniz nelerdir?",
    "Kredi kartı (tek çekim ve taksitli işlemler), banka havalesi ve EFT yöntemleriyle ödemelerinizi güvenle gerçekleştirebilirsiniz. Online ödemelerimiz 3D Secure güvencesi altındadır.": "Kredi kartı (tek çekim ve taksitli işlemler), banka havalesi ve EFT yöntemleriyle ödemelerinizi güvenle gerçekleştirebilirsiniz. Online ödemelerimiz 3D Secure güvencesi altındadır.",
    "Fiyatlara neler dahildir?": "Fiyatlara neler dahildir?",
    "Turlarımız genel olarak konaklama, belirtilen transferler, profesyonel rehberlik hizmeti ve programda \"dahil\" olarak belirtilen öğünleri kapsamaktadır. Vize ücretleri, yurt dışı çıkış harcı ve kişisel harcamalar fiyata dahil değildir.": "Turlarımız genel olarak konaklama, belirtilen transferler, profesyonel rehberlik hizmeti ve programda \"dahil\" olarak belirtilen öğünleri kapsamaktadır. Vize ücretleri, yurt dışı çıkış harcı ve kişisel harcamalar fiyata dahil değildir.",
    "Çocuk indirimleri var mı?": "Çocuk indirimleri var mı?",
    "0-2 yaş bebekler genellikle ücretsizdir. 3-12 yaş arası çocuklar için tur tipine ve otel şartlarına bağlı olarak %15-30 arasında indirimler uygulanabilmektedir.": "0-2 yaş bebekler genellikle ücretsizdir. 3-12 yaş arası çocuklar için tur tipine ve otel şartlarına bağlı olarak %15-30 arasında indirimler uygulanabilmektedir.",

    "Bize Mesaj Gönderin": "Bize Mesaj Gönderin",
    "Mesaj Gönder": "Mesaj Gönder",
    "Aşağıdaki formu doldurarak bize hızlıca ulaşabilirsiniz. Müşteri temsilcilerimiz en kısa sürede size dönüş yapacaktır.": "Aşağıdaki formu doldurarak bize hızlıca ulaşabilirsiniz. Müşteri temsilcilerimiz en kısa sürede size dönüş yapacaktır.",
    "Mesajınız başarıyla gönderildi!": "Mesajınız başarıyla gönderildi!",
    "İlginiz için teşekkür ederiz. En kısa sürede sizinle iletişime geçeceğiz.": "İlginiz için teşekkür ederiz. En kısa sürede sizinle iletişime geçeceğiz.",
    "Adınız Soyadınız": "Adınız Soyadınız",
    "Konu": "Konu",
    "Mesajınız": "Mesajınız",
    "Gönder": "Gönder",
    "Kurumsal Bilgiler": "Kurumsal Bilgiler",
    "Ticaret Ünvanı": "Ticaret Ünvanı",
    "TÜRSAB Belge No": "TÜRSAB Belge No",
    "Adres": "Adres",
    "Telefon": "Telefon",
    "E-posta": "E-posta",

    "Bu etkinlik hakkında": "Bu etkinlik hakkında",
    "Ücretsiz iptal": "Ücretsiz iptal",
    "Tam para iadesi almak için 24 saat öncesine kadar iptal edin": "Tam para iadesi almak için 24 saat öncesine kadar iptal edin",
    "Şimdi rezerve edin, sonra ödeyin": "Şimdi rezerve edin, sonra ödeyin",
    "Seyahat planlarınızı esnek tutun — yerinizi ayırtın ve bugün hiçbir şey ödemeyin.": "Seyahat planlarınızı esnek tutun — yerinizi ayırtın ve bugün hiçbir şey ödemeyin.",
    "Başlangıç saatlerini görmek için müsaitlik durumunu kontrol edin.": "Başlangıç saatlerini görmek için müsaitlik durumunu kontrol edin.",
    "Tam açıklama": "Tam açıklama",
    "Dahil olanlar": "Dahil olanlar",
    "Birinci sınıf lüks ulaşım": "Birinci sınıf lüks ulaşım",
    "Profesyonel yerel rehberlik hizmeti": "Profesyonel yerel rehberlik hizmeti",
    "Belirtilen çevre gezileri ve giriş ücretleri": "Belirtilen çevre gezileri ve giriş ücretleri",
    "Araç içi ikramlar": "Araç içi ikramlar",
    "Kişisel harcamalar": "Kişisel harcamalar",
    "Öğle ve akşam yemekleri (Belirtilmedikçe)": "Öğle ve akşam yemekleri (Belirtilmedikçe)",
    "Müze girişleri için ekstra opsiyonel harcamalar": "Müze girişleri için ekstra opsiyonel harcamalar",
    "Şimdi rezerve edin": "Şimdi rezerve edin",
    "Bugün ayırtın, hiçbir şey ödemeyin": "Bugün ayırtın, hiçbir şey ödemeyin",
    "Tur bulunamadı.": "Tur bulunamadı.",
    "Geri": "Geri",

    "Ad Soyad": "Ad Soyad",
    "Tercih Edilen Tur Tarihi": "Tercih Edilen Tur Tarihi",
    "Kişi Sayısı": "Kişi Sayısı",
    "Giriş Tarihi": "Giriş Tarihi",
    "Çıkış Tarihi": "Çıkış Tarihi",
    "Toplam Tahmini Tutar": "Toplam Tahmini Tutar",
    "Rezervasyonu Tamamla": "Rezervasyonu Tamamla",
    "Bültene Abone Olun": "Bültene Abone Olun",
    "En yeni turlar ve özel fırsatlardan ilk siz haberdar olun.": "En yeni turlar ve özel fırsatlardan ilk siz haberdar olun.",
    "E-posta adresiniz": "E-posta adresiniz",
    "Abone Ol": "Abone Ol",
    "Aboneliğiniz başarıyla oluşturuldu! Teşekkür ederiz.": "Aboneliğiniz başarıyla oluşturuldu! Teşekkür ederiz.",
    "Hangi tura katılmak istersiniz?": "Hangi tura katılmak istersiniz?",
    "Tarihler": "Tarihler",
    "Farklı bir arama yapmayı deneyin veya filtreleri sıfırlayın.": "Farklı bir arama yapmayı deneyin veya filtreleri sıfırlayın.",
    "Lütfen ad ve soyadınızı giriniz.": "Lütfen ad ve soyadınızı giriniz.",
    "Lütfen e-posta adresinizi giriniz.": "Lütfen e-posta adresinizi giriniz.",
    "Lütfen geçerli bir e-posta adresi giriniz.": "Lütfen geçerli bir e-posta adresi giriniz.",
    "Lütfen geçerli bir telefon numarası giriniz (en az 10 hane).": "Lütfen geçerli bir telefon numarası giriniz (en az 10 hane).",
    "Lütfen giriş ve çıkış tarihlerini seçiniz.": "Lütfen giriş ve çıkış tarihlerini seçiniz.",
    "Talebiniz Alınmıştır. Paylaşılan bilgiler üzerinden en kısa sürede sizlerle iletişime geçilecektir.": "Talebiniz Alınmıştır. Paylaşılan bilgiler üzerinden en kısa sürede sizlerle iletişime geçilecektir.",
    "Talebiniz Alınmıştır!": "Talebiniz Alınmıştır!",
    "Rezervasyon Başarılı": "Rezervasyon Başarılı",
    "Tamam, Teşekkürler": "Tamam, Teşekkürler",
    "Diğer (Özel Grup)": "Diğer (Özel Grup)",
    "Yeni Tur Paketi Ekle": "Yeni Tur Paketi Ekle",
    "Yeni bir rota, fiyat, süre ve görsel tanımlayarak web sitenizde yayınlayın.": "Yeni bir rota, fiyat, süre ve görsel tanımlayarak web sitenizde yayınlayın.",
    "+ Tur Ekle": "+ Tur Ekle",
    "Bu Tur Detaylarını Düzenle": "Bu Tur Detaylarını Düzenle",
    "Tüm Fotoğrafları Gör": "Tüm Fotoğrafları Gör",
    "Fotoğraf": "Fotoğraf",
    "Önceki Fotoğraf": "Önceki Fotoğraf",
    "Sonraki Fotoğraf": "Sonraki Fotoğraf",
    "Tarih kriterlerine göre turlar filtreleniyor": "Tarih kriterlerine göre turlar filtreleniyor",
    "Tüm turlar listeleniyor": "Tüm turlar listeleniyor",
    "Rezervasyon oluşturulurken bir hata oluştu.": "Rezervasyon oluşturulurken bir hata oluştu.",
    "Kullanıcı adı veya şifre hatalı. Lütfen kontrol edin.": "Kullanıcı adı veya şifre hatalı. Lütfen kontrol edin.",
    "Yönetici Girişi": "Yönetici Girişi",
    "Web sitesini canlı olarak düzenlemek ve değişiklikleri anında yayınlamak için yönetici bilgilerinizi girin.": "Web sitesini canlı olarak düzenlemek ve değişiklikleri anında yayınlamak için yönetici bilgilerinizi girin.",
    "Kullanıcı Adı": "Kullanıcı Adı",
    "Şifre": "Şifre",
    "Giriş Yap & Düzenlemeye Başla": "Giriş Yap & Düzenlemeye Başla",
    "Giriş Yapılıyor...": "Giriş Yapılıyor...",
    "Otomatik Doldur": "Otomatik Doldur",
    "Düzenle": "Düzenle",
    "Turu Düzenle": "Turu Düzenle",
    "Turu Sil": "Turu Sil",
    "Fiyatı değiştirmek için tıklayın": "Fiyatı değiştirmek için tıklayın",
    "Yatak": "Yatak",
    "Banyo": "Banyo",
    "Kişi": "Kişi",
    "Ücretsiz İptal": "Ücretsiz İptal"
  },
  en: {
    "Ana Sayfa": "Home",
    "Turlar": "Tours",
    "Oteller": "Hotels",
    "Blog": "Blog",
    "İletişim": "Contact",
    "Rezervasyonlarım": "My Bookings",
    "Kullanıcı Paneli": "User Dashboard",

    "Cesur Akgün'e Hoş Geldiniz": "Welcome to Cesur Akgün",
    "Hayalinizdeki Seyahat Rezervasyonlarını Güvenle Yönetiyoruz": "We Securely Manage Your Dream Travel Bookings",
    "Hakkımızda": "About Us",
    "Keşfetmeye Hazır Mısınız?": "Ready to Explore?",
    "Doğa ve deniz turlarımızla ruhunuzu dinlendirin, her detayı sizin için planlanmış turlarımızla konforlu seyahat edin.": "Unwind your soul with our nature and sea tours, travel in comfort with our tours planned in every detail.",
    "Rezervasyon Yap": "Book Now",
    "Turları İncele": "Browse Tours",

    "Tur Rotaları": "Tour Destinations",
    "Tüm Turlar": "All Tours",
    "Kriterlerinize uygun tur bulunamadı": "No tours match your criteria",
    "Filtreleri Sıfırla": "Reset Filters",
    "Mevcut Oteller": "Available Hotels",
    "Tüm Konumlar": "All Locations",
    "Kriterlerinize uygun otel bulunamadı": "No hotels match your criteria",
    "Gezi Notları": "Travel Logs",
    "Blog ve Haberler": "Blog & News",
    "Seyahat tutkunları için hazırladığımız özel seyahat ipuçları, gezi rehberleri ve hikayeler.": "Special travel tips, guides, and stories prepared for travel enthusiasts.",
    "Yazar": "Author",
    "Yorum": "Comment",
    "Yorumlar": "Comments",
    "Makalenin tamamını oku": "Read full article",
    "Yazı bulunamadı": "No posts found",
    "Yan menüdeki aramada başka anahtar kelimeler kullanmayı deneyin.": "Try other keywords in the sidebar search.",
    "Dünyayı Keşfedin": "Discover the World",
    "En Beğendiğiniz Yerleri Bizimle Keşfedin": "Discover Your Favorite Places With Us",
    "Gereksiz detaylarla uğraşmadan, dünyanın her köşesine kolayca seyahat edin.": "Travel easily to every corner of the world without worrying about unnecessary details.",
    "Turları İnceleyin": "Browse Tours",
    "Neler Sunuyoruz": "What We Offer",
    "Maceranıza Başlama Zamanı": "Time to Start Your Adventure",
    "Cesur Akgün Travel olarak, hayalinizdeki tatili gerçeğe dönüştürmek ve size unutulmaz seyahat deneyimleri sunmak için buradayız.": "As Cesur Akgün Travel, we are here to turn your dream vacation into reality and offer you unforgettable travel experiences.",
    "Aktiviteler": "Activities",
    "Seyahat Düzenlemeleri": "Travel Arrangements",
    "Özel Rehber": "Private Guide",
    "Konum Yöneticisi": "Location Manager",
    "Doğa yürüyüşlerinden şehir turlarına, kültürel gezilerden eğlenceli grup aktivitelerine kadar her tura özel deneyimler planlıyoruz.": "We plan unique experiences for every tour, from nature hikes and city tours to cultural excursions and fun group activities.",
    "Önceden planlanmış konforlu lüks transferlerin, uçuş rezervasyonlarının ve hızlı geçiş imkanlarının keyfini çıkarın.": "Enjoy pre-planned comfortable luxury transfers, flight bookings, and fast-track facilities.",
    "Yolculuğunuz boyunca derin tarihi ve kültürel bilgiye sahip, çok dilli profesyonel tur rehberleri.": "Multilingual professional tour guides with deep historical and cultural knowledge throughout your journey.",
    "Detayları, özel yemek isteklerinizi ve konaklama tercihlerinizi yöneten özel rezervasyon koordinatörleri.": "Private reservation coordinators who manage details, special dining requests, and accommodation preferences.",
    "Öne Çıkan Bölgeler": "Featured Regions",
    "Rotanızı Seçin": "Choose Your Destination",
    "Tüm Tur Konumlarını Gör": "See All Tour Locations",
    "Yurt İçi Turlar": "Domestic Tours",
    "Yurt Dışı Turlar": "International Tours",
    "Yurt İçi Tur": "Domestic Tour",
    "Yurt Dışı Tur": "International Tour",
    "Yurt İçi": "Domestic",
    "Yurt Dışı": "International",
    "Tur Kategorileri": "Tour Categories",
    "Yurt İçi Turları Keşfet": "Explore Domestic Tours",
    "Yurt Dışı Turları Keşfet": "Explore International Tours",
    "Tur Seçeneği": "Tour Options",
    "Türkiye'nin dört bir yanındaki eşsiz doğal ve tarihi rotaları keşfedin.": "Explore unique natural wonders and historical routes across Turkey.",
    "Balkanlardan Avrupa'ya, sınırları aşan unutulmaz macera ve kültür seyahatleri.": "Unforgettable adventure and cultural travels crossing borders from the Balkans to Europe.",
    "Türkiye": "Turkey",
    "10 Tur Seçeneği": "10 Tour Options",
    "Balkanlar": "Balkans",
    "1 Tur Seçeneği": "1 Tour Option",
    "Karadeniz": "Black Sea",
    "2 Tur Seçeneği": "2 Tour Options",
    "Kapadokya": "Cappadocia",
    "Turlarımız": "Our Tours",
    "Popüler Tur Paketleri": "Popular Tour Packages",
    "En çok tercih edilen, rehber eşliğindeki macera ve gezi programlarımıza göz atın.": "Check out our most preferred guided adventure and sightseeing programs.",
    "Tur ara...": "Search tours...",
    "Arama yapın...": "Search...",
    "Tur Ara": "Search Tour",
    "Nereye gitmek istersiniz?": "Destination",
    "Fiyat Sınırı": "Price Limit",
    "Limit Yok": "No Limit",
    "Turları Ara": "Search Tours",
    "En fazla": "Up to",
    "15 yılı aşkın sektör deneyimiyle Cesur Akgün Travel Agency, macera, kültürel keşif ve birinci sınıf lüks misafirperverliği birleştiren seyahat programları sunmaya kendini adamıştır.": "With over 15 years of industry experience, Cesur Akgün Travel Agency is dedicated to offering travel programs that combine adventure, cultural exploration, and first-class luxury hospitality.",
    "Profesyonel ekibimiz, ülkemizin dört bir yanındaki eşsiz güzellikleri ve seçkin yurtdışı rotalarını keşfetmeniz için kusursuz deneyimler düzenlemek üzere çalışmaktadır. Tarihi dokuya sahip kültürel gezilerden doğa ile iç içe maceralara kadar her detayı sizin için özenle planlıyoruz.": "Our professional team works to organize flawless experiences for you to discover the unique beauties of our country and selected international routes. From cultural trips with historical texture to adventures intertwined with nature, we carefully plan every detail for you.",
    "Mutlu Gezgin": "Happy Traveler",
    "Yıllık Deneyim": "Years of Experience",
    "Başarılı Rezervasyon": "Successful Booking",
    "Özel Seçilmiş Rotalar": "Specially Selected Destination",
    "Canlı Destek Hattı": "Live Support Line",
    "Memnuniyet Oranı": "Satisfaction Rate",

    "Güvenli Rezervasyon Portalı": "Secure Booking Portal",
    "kişi": "person",
    "gece": "night",
    "E-posta Adresi": "Email Address",
    "İletişim Numarası": "Contact Number",
    "8 Günlük Tur": "8-Day Tour",
    "10 Günlük Tur": "10-Day Tour",
    "7 Günlük Tur": "7-Day Tour",
    "6 Günlük Tur": "6-Day Tour",
    "Tahmini Fiyat": "Estimated Price",
    "Süre": "Duration",
    "Duş": "Shower(s)",
    "Tek/Çift": "Single/Double",
    "Bu tura birinci sınıf ulaşım, 7/24 özel koordinatör desteği ve kültürel yürüyüş izinleri dahildir. Standart paket, standart açık büfe kahvaltı seçenekleri içeren çift kişilik odaları kapsamaktadır.": "This tour includes first-class transportation, 24/7 private coordinator support, and cultural walking permits. The standard package covers double rooms with standard buffet breakfast options.",
    "Bize Ulaşın": "Contact Us",
    "Kurumsal iletişim bilgilerimiz ve destek formumuz ile her zaman yanınızdayız. Seyahat planlarınız veya kurumsal talepleriniz için bize ulaşabilirsiniz.": "We are always with you with our corporate contact information and support form. You can contact us for your travel plans or corporate requests.",
    "İletişim Bilgileri": "Contact Information",
    "Büyük GAP Turu": "Grand GAP Tour",
    "Doğu Turu": "Eastern Turkey Tour",
    "Doğu Ekspresi": "Eastern Express",
    "Günübirlik Eskişehir Turu": "Daily Eskisehir Tour",
    "Gelibolu Şehitlik Ziyareti": "Gallipoli Memorial Visit",
    "Günübirlik Ankara Ziyareti": "Daily Ankara Visit",
    "Kanyonlar Turu": "Canyons Tour",
    "Kapadokya Turu": "Cappadocia Tour",
    "Karadeniz - Batum Turu": "Black Sea - Batumi Tour",
    "Üsküp, Manastır, Resne, Ohrid Turu": "Skopje, Bitola, Resen, Ohrid Tour",
    "Kuşadası - Pamukkale Turu": "Kusadasi - Pamukkale Tour",
    "Likya Turu (Fethiye, Ölüdeniz, Dalyan) 4 Gece 5 Gün": "Lycia Tour (Fethiye, Oludeniz, Dalyan) 4 Nights 5 Days",
    "Güneydoğu Anadolu": "Southeastern Anatolia",
    "Doğu Anadolu": "Eastern Anatolia",
    "Kars, Erzurum": "Kars, Erzurum",
    "Eskişehir": "Eskisehir",
    "Çanakkale": "Canakkale",
    "Ankara": "Ankara",
    "Kastamonu, Karabük": "Kastamonu, Karabuk",
    "Nevşehir, Kapadokya": "Nevsehir, Cappadocia",
    "Doğu Karadeniz, Batum": "Eastern Black Sea, Batumi",
    "Kuzey Makedonya": "North Macedonia",
    "Aydın, Denizli": "Aydin, Denizli",
    "Muğla, Antalya": "Mugla, Antalya",
    "5 Gece 6 Gün": "5 Nights 6 Days",
    "6 Gece 7 Gün": "6 Nights 7 Days",
    "4 Gece 5 Gün": "4 Nights 5 Days",
    "Günübirlik": "Daily",
    "3 Gece 4 Gün": "3 Nights 4 Days",
    "2 Gece 3 Gün": "2 Nights 3 Days",
    "Popüler": "Popular",
    "Keşif": "Exploration",
    "Lüks Tren": "Luxury Train",
    "Kültür": "Culture",
    "Tarih": "History",
    "Tarih & Doğa": "History & Nature",
    "Yaz Rüyası": "Summer Dream",
    "Güneydoğu Anadolu'nun büyüleyici atmosferini keşfedin. Tarihin sıfır noktası Göbeklitepe'den, sular altındaki Halfeti'ye uzanan bu eşsiz yolculukta medeniyetlerin izini süreceğiz. Bölgenin eşsiz gastronomisi ve kültürel zenginlikleri sizi bekliyor.": "Discover the enchanting atmosphere of Southeastern Anatolia. From Gobeklitepe, the zero point of history, to the submerged Halfeti, we will trace civilizations on this unique journey. The region's unique gastronomy and cultural riches await you.",
    "Anadolu'nun zirvesine, Doğu'nun gizemli coğrafyasına unutulmaz bir yolculuk. Erzurum'un tarihi dokusundan, Kars'ın Baltık mimarisine ve Ani Harabeleri'nin mistik havasına kadar her anı dolu dolu bir macera.": "An unforgettable journey to the peak of Anatolia, to the mysterious geography of the East. Every moment is an adventure full of history, from Erzurum's historical texture to Kars's Baltic architecture and the mystical atmosphere of Ani Ruins.",
    "Türkiye'nin en ikonik tren yolculuğu ile masalsı bir kış rüyası. Anadolu'nun karla kaplı büyüleyici manzaraları eşliğinde Kars'a uzanan, hem nostaljik hem de konforlu eşsiz bir deneyim.": "A fairy-tale winter dream with Turkey's most iconic train journey. A unique experience that is both nostalgic and comfortable, extending to Kars accompanied by the fascinating snow-covered landscapes of Anatolia.",
    "İç Anadolu'nun Venedik'i Eskişehir'i bir günde keşfedin. Porsuk Çayı'nda gondol keyfi, tarihi Odunpazarı evleri, Sazova Bilim Kültür ve Sanat Parkı ile masalsı bir gün sizi bekliyor.": "Discover Eskisehir, the Venice of Central Anatolia, in one day. A fairy-tale day awaits you with a gondola ride on Porsuk River, historical Odunpazari houses, and Sazova Science, Culture and Art Park.",
    "Tarihin yazıldığı topraklara, Çanakkale destanının kalbine duygu yüklü bir ziyaret. Uzman rehberlerimiz eşliğinde şehitliklerimizi anıyor, geçmişimize saygı duruşunda bulunuyoruz.": "An emotional visit to the lands where history was written, the heart of the Canakkale epic. We commemorate our martyrs and pay homage to our past accompanied by our expert guides.",
    "Cumhuriyetimizin kalbi Ankara'yı keşfedin. Anıtkabir ziyareti başta olmak üzere, I. ve II. Meclis, Anadolu Medeniyetleri Müzesi ve Ankara Kalesi ile dolu dolu bir başkent turu.": "Discover Ankara, the heart of our Republic. A full capital tour, especially visiting Anitkabir, the 1st and 2nd Parliament, the Museum of Anatolian Civilizations and Ankara Castle.",
    "Doğanın muazzam gücüne tanıklık edeceğiniz büyüleyici kanyonlar! Valla, Horma ve Çatak kanyonlarının nefes kesici manzaraları eşliğinde trekking, fotoğrafçılık ve adrenalin dolu anlar.": "Fascinating canyons where you will witness the tremendous power of nature! Trekking, photography and adrenaline-filled moments accompanied by the breathtaking views of Valla, Horma and Catak canyons.",
    "Peri bacalarının masalsı diyarı Kapadokya'da rüya gibi bir tatil. Gökyüzünü süsleyen sıcak hava balonları, yeraltı şehirleri, Göreme Açık Hava Müzesi ve eşsiz gün batımı manzaraları.": "A dream holiday in Cappadocia, the fairy-tale land of fairy chimneys. Hot air balloons decorating the sky, underground cities, Goreme Open Air Museum and unique sunset views.",
    "Yeşilin her tonunu barındıran Karadeniz yaylalarından, Batum'un hareketli sokaklarına uzanan bir doğa ve kültür şöleni. Fırtına Deresi, Uzungöl ve Ayder Yaylası'nın serin havasını soluyun.": "A nature and culture feast extending from the Black Sea plateaus containing every shade of green to the bustling streets of Batumi. Breathe the cool air of Firtina Creek, Uzungol and Ayder Plateau.",
    "Balkanların incisi Kuzey Makedonya'yı adım adım geziyoruz. Tarihi Üsküp sokakları, Atatürk'ün okuduğu Manastır Askeri İdadisi ve doğa harikası Ohrid Gölü ile hafızalara kazınacak bir yurt dışı deneyimi.": "We are touring North Macedonia, the pearl of the Balkans, step by step. An unforgettable international experience with the historical streets of Skopje, the Monastir Military High School where Ataturk studied, and the natural wonder Ohrid Lake.",
    "Ege'nin serin sularından, Pamukkale'nin bembeyaz travertenlerine uzanan harika bir rota. Efes Antik Kenti'nin tarihi dokusu ve Hierapolis'in şifalı suları ile yenilenin.": "A wonderful route extending from the cool waters of the Aegean to the white travertines of Pamukkale. Rejuvenate with the historical texture of the Ancient City of Ephesus and the healing waters of Hierapolis.",
    "Akdeniz'in en güzel koylarında, Likya medeniyetinin izinde bir yaz rüyası. Ölüdeniz'in turkuaz suları, Dalyan'ın kaya mezarları ve Saklıkent kanyonunun serinliği sizi bekliyor.": "A summer dream in the most beautiful bays of the Mediterranean, in the footsteps of the Lycian civilization. The turquoise waters of Oludeniz, the rock tombs of Dalyan and the coolness of Saklikent canyon await you.",

    "Sıra dışı rotaları keşfedin, hayalinizdeki tatili bizimle planlayın. Unutulmaz anılar biriktirmeniz için her detayda yanınızdayız.": "Discover extraordinary destinations, plan your dream vacation with us. We are with you in every detail to make unforgettable memories.",
    "Bilgi": "Information",
    "Online Talep": "Online Request",
    "Genel Sorular": "General Questions",
    "Rezervasyon Koşulları": "Booking Conditions",
    "Gizlilik Sözleşmesi": "Privacy Agreement",
    "İade Politikası": "Refund Policy",
    "Bizi Arayın": "Call Us",
    "Deneyimler": "Experiences",
    "Macera": "Adventure",
    "Otel ve Restoran": "Hotel & Restaurant",
    "Plaj / Deniz": "Beach / Sea",
    "Doğa": "Nature",
    "Kamp": "Camping",
    "Eğlence": "Entertainment",
    "Sorunuz mu var?": "Have a question?",
    "Telif Hakkı": "Copyright",
    "Tüm hakları saklıdır": "All rights reserved",
    "Bu site": "This site",
    "Cesur Akgün Travel Agency için hazırlanmıştır.": "was prepared for Cesur Akgün Travel Agency.",
    "Kullanım Şartları": "Terms of Use",
    "Gizlilik Politikası": "Privacy Policy",

    "Yasal Bilgilendirme": "Legal Notice",
    "Gizlilik Sözleşmesi ve KVKK Metni": "Privacy Agreement and GDPR Notice",
    "Son Güncelleme: 1 Ocak 2024": "Last Updated: January 1, 2024",
    "1. Kişisel Verilerin İşlenmesi Amacı": "1. Purpose of Processing Personal Data",
    "Cesur Akgün Turizm A.Ş. olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (\"KVKK\") ve GDPR (Genel Veri Koruma Yönetmeliği) uyarınca kişisel verileriniz; tur rezervasyonlarınızın yapılması, uçak biletlerinin kesilmesi, sigorta poliçelerinin düzenlenmesi ve müşteri hizmetlerinin eksiksiz sunulabilmesi amacıyla işlenmektedir.": "As Cesur Akgün Tourism Inc., in accordance with Law No. 6698 on the Protection of Personal Data (\"KVKK\") and the General Data Protection Regulation (GDPR), your personal data is processed solely for the purposes of completing tour reservations, issuing flight tickets, arranging insurance policies, and delivering seamless customer care.",
    "2. Toplanan Kişisel Veriler": "2. Personal Data Collected",
    "Hizmetlerimizi sunabilmek için ad, soyad, T.C. kimlik numarası veya pasaport bilgileri, doğum tarihi, iletişim bilgileri (telefon, e-posta, adres) ve ödeme bilgileriniz (kredi kartı verileri 3D Secure altyapısıyla şifrelenir ve tarafımızca saklanmaz) toplanmaktadır.": "In order to deliver our travel services, we collect full name, national ID or passport information, date of birth, contact details (phone number, email address, physical address), and payment details (credit card data is encrypted via 3D Secure and is never stored on our servers).",
    "3. Verilerin Paylaşımı ve Aktarımı": "3. Data Sharing and Transfer",
    "Kişisel verileriniz, yalnızca rezervasyon işleminin gerçekleştirilebilmesi için havayolu şirketleri, oteller, transfer firmaları, sigorta şirketleri ve yasal zorunluluklar gereği resmi kurumlarla (gümrük, sınır polisleri vb.) yurt içi ve yurt dışında paylaşılabilir.": "Your personal data may be shared domestically and internationally solely for the execution of reservations with airlines, hotels, transport providers, insurance agencies, and statutory authorities (customs, border control) as required by applicable laws.",
    "4. Veri Güvenliği": "4. Data Security",
    "Kişisel verileriniz, yetkisiz erişimi, kaybolmayı veya ifşayı önlemek için en güncel şifreleme ve güvenlik önlemleri ile korunmaktadır. Sunucularımız düzenli olarak siber güvenlik denetimlerinden geçmektedir.": "Your personal data is safeguarded with cutting-edge encryption and cybersecurity measures to prevent unauthorized access, loss, or disclosure. Our servers undergo periodic cybersecurity audits.",
    "5. İlgili Kişinin Hakları": "5. Rights of the Data Subject",
    "KVKK Madde 11 uyarınca, kişisel verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini talep etme hakkına sahipsiniz. Taleplerinizi info@cesurakguntravel.com adresine yazılı olarak iletebilirsiniz.": "Under Article 11 of the KVKK and GDPR regulations, you hold the right to learn whether your data is being processed, and to request correction or deletion. You may send your inquiries in writing to info@cesurakguntravel.com.",

    "Rezervasyon ve Kullanım Koşulları": "Booking and Terms of Service",
    "1. Taraflar ve Kapsam": "1. Parties and Scope",
    "İşbu Kullanım Koşulları (Sözleşme), bir tarafta Cesur Akgün Turizm A.Ş. (Acente) ile diğer tarafta Acente'nin sunduğu hizmetleri satın alan veya rezervasyon yapan Müşteri arasında geçerlidir. Müşteri, web sitemiz üzerinden rezervasyon yaparak bu koşulları kabul etmiş sayılır.": "These Terms of Service (Agreement) apply between Cesur Akgün Tourism Inc. (the Agency) and the Customer purchasing or booking travel services. By making a reservation through our website, the Customer is deemed to have accepted these terms in full.",
    "2. Rezervasyon ve Ödeme Süreci": "2. Booking and Payment Process",
    "Rezervasyonun kesinleşmesi için ön ödeme veya tam ödemenin acente hesaplarına ulaşması gereklidir. Gecikmeli ödemelerden dolayı iptal edilen rezervasyonlarda sorumluluk müşteriye aittir. Kur farkı ve vergi artışları fiyatlara yansıtılabilir.": "A booking is finalized once the advance deposit or full payment reaches the Agency's accounts. Responsibility for cancellations caused by late payments rests with the customer. Currency differences and statutory tax increases may be reflected in final amounts.",
    "3. Sorumlulukların Sınırlandırılması": "3. Limitation of Liability",
    "Acente, havayolları, oteller veya ulaşım firmalarından kaynaklanan rötarlar, iptaller veya hizmet kusurlarından dolayı doğrudan sorumlu tutulamaz. Mücbir sebepler (doğal afetler, grev, pandemi, savaş vb.) durumunda acente turu iptal etme veya erteleme hakkını saklı tutar.": "The Agency cannot be held directly liable for delays, cancellations, or service failures arising from airlines, hotels, or transport carriers. In circumstances of force majeure (natural disasters, strikes, pandemics, war), the Agency reserves the right to cancel or reschedule tours.",
    "4. Vize ve Pasaport İşlemleri": "4. Visa and Passport Formalities",
    "Yurtdışı turlarında geçerli bir pasaport ve ilgili ülkeye ait vize bulundurmak müşterinin sorumluluğundadır. Vize reddi veya pasaport geçerlilik süresi sorunları nedeniyle tura katılamama durumunda acente iade yapmakla yükümlü değildir.": "For overseas tours, obtaining a valid passport and the necessary travel visas is the sole responsibility of the customer. The Agency is under no obligation to refund payments if a guest cannot join due to visa denial or passport expiration.",
    "5. Müşterinin Tura Katılım Şartları": "5. Tour Participation Standards",
    "Rehber, turun genel düzenini bozan, diğer katılımcıları rahatsız eden kişileri tura kabul etmeme veya turdan çıkarma hakkına sahiptir. Bu gibi durumlarda herhangi bir ücret iadesi yapılmaz.": "The tour guide holds the authority to deny boarding or dismiss individuals who disrupt the general conduct of the tour or disturb fellow travelers. No fee refund is granted in such circumstances.",
    "6. Uyuşmazlıkların Çözümü": "6. Dispute Resolution",
    "İşbu sözleşmenin uygulanmasından doğacak her türlü ihtilafta Türkiye Cumhuriyeti yasaları geçerli olup, İstanbul Çağlayan Mahkemeleri ve İcra Daireleri yetkilidir.": "The laws of the Republic of Turkey shall govern any disputes arising from this agreement, and Istanbul Çağlayan Courts and Enforcement Offices shall have jurisdiction.",

    "1. Erken İptaller": "1. Early Cancellations",
    "Tur başlangıç tarihinden 30 gün öncesine kadar yapılan iptallerde, ödenen tutarın tamamı (varsa uçak bileti ve vize masrafları gibi iadesi mümkün olmayan giderler düşüldükten sonra) iade edilir.": "For cancellations made up to 30 days prior to departure date, the full amount paid will be refunded (deducting non-refundable third-party costs such as flight tickets and visa fees where applicable).",
    "2. Tur Tarihine Yakın İptaller": "2. Short-Notice Cancellations",
    "Tur başlangıç tarihine 15-29 gün kala yapılan iptallerde, toplam tur bedelinin %50'si kesinti yapılarak kalan tutar iade edilir. Tur başlangıç tarihine 14 gün ve daha az süre kala yapılan iptallerde hiçbir ücret iadesi yapılmaz.": "For cancellations made 15 to 29 days before tour departure, 50% of the total tour cost is deducted and the remainder refunded. For cancellations made 14 days or fewer prior to departure, no refund will be issued.",
    "3. Uçak Biletleri ve Promosyonlar": "3. Flight Tickets and Special Fares",
    "Promosyonlu turlarda veya erken rezervasyon kampanyalarında satın alınan paketlerde hiçbir şekilde iptal veya iade yapılamaz. Uçak biletlerinin iptal koşulları, ilgili havayolu şirketinin kurallarına tabidir.": "Tour packages purchased during special promotions or early-bird campaigns are strictly non-cancellable and non-refundable. Flight ticket refund policies are subject to individual airline tariff rules.",
    "4. İade Süreci ve Süresi": "4. Refund Timeline and Processing",
    "Onaylanan iade işlemleri, iptal talebinin acentemize ulaştığı tarihten itibaren 14 iş günü içerisinde, ödeme yapılan kanal (kredi kartı veya banka hesabı) üzerinden gerçekleştirilir. Kredi kartı iadelerinin ekstrenize yansıması bankanızın süreçlerine bağlıdır.": "Approved refund transactions are processed within 14 business days from the receipt of the cancellation notice, through the original payment channel (credit card or bank transfer). Posting to credit card statements depends on your issuing bank.",
    "5. İptal Güvence Paketi": "5. Cancellation Protection Package",
    "Rezervasyon anında \"İptal Güvence Paketi\" satın alan misafirlerimiz, tur başlangıcından 72 saat öncesine kadar koşulsuz şartsız iptal hakkına sahiptir. (Uçak bileti ve vize harçları kapsam dışıdır).": "Guests who purchase the \"Cancellation Protection Package\" during booking hold the right to unconditional cancellation up to 72 hours before departure (flight ticket and visa charges excluded).",

    "Yardım Merkezi": "Help Center",
    "Sıkça Sorulan Sorular": "Frequently Asked Questions",
    "Rezervasyon süreçleri, ödeme koşulları ve turlarımızla ilgili en çok merak edilen konuları burada derledik.": "Here you will find answers to the most common questions regarding booking procedures, payment terms, and our tour programs.",
    "Rezervasyonumu nasıl iptal edebilirim?": "How can I cancel my booking?",
    "Tur başlangıç tarihinden en geç 15 gün öncesine kadar rezervasyon iptal taleplerinizi \"İletişim\" veya \"Online Talep\" formu üzerinden iletebilirsiniz. İptal koşulları hakkında daha fazla detay için lütfen \"İptal ve İade Politikası\" sayfamızı inceleyin.": "You may submit cancellation requests at least 15 days before tour departure via our \"Contact\" or \"Online Request\" form. For comprehensive details, please review our \"Cancellation and Refund Policy\" page.",
    "Ödeme seçenekleriniz nelerdir?": "What payment options do you accept?",
    "Kredi kartı (tek çekim ve taksitli işlemler), banka havalesi ve EFT yöntemleriyle ödemelerinizi güvenle gerçekleştirebilirsiniz. Online ödemelerimiz 3D Secure güvencesi altındadır.": "You can securely complete your transactions using credit cards (single charge or installments), wire transfer, and EFT. All online checkouts are secured by 3D Secure encryption.",
    "Fiyatlara neler dahildir?": "What is included in the prices?",
    "Turlarımız genel olarak konaklama, belirtilen transferler, profesyonel rehberlik hizmeti ve programda \"dahil\" olarak belirtilen öğünleri kapsamaktadır. Vize ücretleri, yurt dışı çıkış harcı ve kişisel harcamalar fiyata dahil değildir.": "Our tour packages generally cover accommodations, scheduled transfers, professional tour guide service, and meals specified as \"included\". Visa fees, departure taxes, and personal expenses are excluded.",
    "Çocuk indirimleri var mı?": "Are there discounts for children?",
    "0-2 yaş bebekler genellikle ücretsizdir. 3-12 yaş arası çocuklar için tur tipine ve otel şartlarına bağlı olarak %15-30 arasında indirimler uygulanabilmektedir.": "Infants aged 0-2 are generally free of charge. For children aged 3-12, discounts between 15% and 30% are applied depending on tour category and hotel terms.",

    "Bize Mesaj Gönderin": "Send Us a Message",
    "Mesaj Gönder": "Send Message",
    "Aşağıdaki formu doldurarak bize hızlıca ulaşabilirsiniz. Müşteri temsilcilerimiz en kısa sürede size dönüş yapacaktır.": "Fill out the form below to reach us quickly. Our guest representatives will get back to you promptly.",
    "Mesajınız başarıyla gönderildi!": "Your message was sent successfully!",
    "İlginiz için teşekkür ederiz. En kısa sürede sizinle iletişime geçeceğiz.": "Thank you for your interest. We will get in touch with you shortly.",
    "Adınız Soyadınız": "Your Full Name",
    "Konu": "Subject",
    "Mesajınız": "Your Message",
    "Gönder": "Send Message",
    "Kurumsal Bilgiler": "Corporate Information",
    "Ticaret Ünvanı": "Trade Name",
    "TÜRSAB Belge No": "TÜRSAB License No",
    "Adres": "Address",
    "Telefon": "Phone",
    "E-posta": "Email",

    "Bu etkinlik hakkında": "About this activity",
    "Ücretsiz iptal": "Free cancellation",
    "Tam para iadesi almak için 24 saat öncesine kadar iptal edin": "Cancel up to 24 hours in advance for a full refund",
    "Şimdi rezerve edin, sonra ödeyin": "Reserve now & pay later",
    "Seyahat planlarınızı esnek tutun — yerinizi ayırtın ve bugün hiçbir şey ödemeyin.": "Keep your travel plans flexible — reserve your spot and pay nothing today.",
    "Başlangıç saatlerini görmek için müsaitlik durumunu kontrol edin.": "Check availability to see starting times.",
    "Tam açıklama": "Full description",
    "Dahil olanlar": "What's included",
    "Birinci sınıf lüks ulaşım": "First-class premium transportation",
    "Profesyonel yerel rehberlik hizmeti": "Professional local guide service",
    "Belirtilen çevre gezileri ve giriş ücretleri": "Listed sightseeing tours and entrance fees",
    "Araç içi ikramlar": "Onboard refreshments",
    "Kişisel harcamalar": "Personal expenses",
    "Öğle ve akşam yemekleri (Belirtilmedikçe)": "Lunch and dinner (Unless specified)",
    "Müze girişleri için ekstra opsiyonel harcamalar": "Optional extra expenses for museum visits",
    "Şimdi rezerve edin": "Book Now",
    "Bugün ayırtın, hiçbir şey ödemeyin": "Reserve today, pay nothing now",
    "Tur bulunamadı.": "Tour not found.",
    "Geri": "Back",

    "Ad Soyad": "Full Name",
    "Tercih Edilen Tur Tarihi": "Preferred Tour Date",
    "Kişi Sayısı": "Number of Guests",
    "Giriş Tarihi": "Check-in Date",
    "Çıkış Tarihi": "Check-out Date",
    "Toplam Tahmini Tutar": "Total Estimated Amount",
    "Rezervasyonu Tamamla": "Complete Reservation",
    "Bültene Abone Olun": "Subscribe to Newsletter",
    "En yeni turlar ve özel fırsatlardan ilk siz haberdar olun.": "Be the first to hear about new tours and exclusive offers.",
    "E-posta adresiniz": "Your email address",
    "Abone Ol": "Subscribe",
    "Aboneliğiniz başarıyla oluşturuldu! Teşekkür ederiz.": "Your subscription was created successfully! Thank you.",
    "Hangi tura katılmak istersiniz?": "Which tour would you like to join?",
    "Tarihler": "Dates",
    "Farklı bir arama yapmayı deneyin veya filtreleri sıfırlayın.": "Try another search or reset your filters.",
    "Lütfen ad ve soyadınızı giriniz.": "Please enter your full name.",
    "Lütfen e-posta adresinizi giriniz.": "Please enter your email address.",
    "Lütfen geçerli bir e-posta adresi giriniz.": "Please enter a valid email address.",
    "Lütfen geçerli bir telefon numarası giriniz (en az 10 hane).": "Please enter a valid phone number (at least 10 digits).",
    "Lütfen giriş ve çıkış tarihlerini seçiniz.": "Please select check-in and check-out dates.",
    "Talebiniz Alınmıştır. Paylaşılan bilgiler üzerinden en kısa sürede sizlerle iletişime geçilecektir.": "Your request has been received. We will contact you as soon as possible via the contact information provided.",
    "Talebiniz Alınmıştır!": "Your Request Has Been Received!",
    "Rezervasyon Başarılı": "Reservation Successful",
    "Tamam, Teşekkürler": "OK, Thank You",
    "Diğer (Özel Grup)": "Other (Custom Group)",
    "Yeni Tur Paketi Ekle": "Add New Tour Package",
    "Yeni bir rota, fiyat, süre ve görsel tanımlayarak web sitenizde yayınlayın.": "Publish on your website by defining a new itinerary, price, duration, and imagery.",
    "+ Tur Ekle": "+ Add Tour",
    "Bu Tur Detaylarını Düzenle": "Edit This Tour Details",
    "Tüm Fotoğrafları Gör": "View All Photos",
    "Fotoğraf": "Photo",
    "Önceki Fotoğraf": "Previous Photo",
    "Sonraki Fotoğraf": "Next Photo",
    "Tarih kriterlerine göre turlar filtreleniyor": "Filtering tours based on selected dates",
    "Tüm turlar listeleniyor": "Listing all tours",
    "Rezervasyon oluşturulurken bir hata oluştu.": "An error occurred while creating your reservation.",
    "Kullanıcı adı veya şifre hatalı. Lütfen kontrol edin.": "Incorrect username or password. Please check your credentials.",
    "Yönetici Girişi": "Admin Login",
    "Web sitesini canlı olarak düzenlemek ve değişiklikleri anında yayınlamak için yönetici bilgilerinizi girin.": "Enter your administrator credentials to edit the website live and publish changes immediately.",
    "Kullanıcı Adı": "Username",
    "Şifre": "Password",
    "Giriş Yap & Düzenlemeye Başla": "Log In & Start Editing",
    "Giriş Yapılıyor...": "Logging In...",
    "Otomatik Doldur": "Auto Fill",
    "Düzenle": "Edit",
    "Turu Düzenle": "Edit Tour",
    "Turu Sil": "Delete Tour",
    "Fiyatı değiştirmek için tıklayın": "Click to change price",
    "Yatak": "Beds",
    "Banyo": "Bathrooms",
    "Kişi": "Guests",
    "Ücretsiz İptal": "Free Cancellation"
  }
};

interface LanguageContextProps {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t: i18nT, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLanguage = (i18n.resolvedLanguage || i18n.language || "tr") as Language;

  // Resilient, deterministic translation resolver
  const t = (key: string): string => {
    if (!key) return "";

    // Turkish mode
    if (currentLanguage === "tr") {
      return STATIC_DICTIONARY.tr[key] || key;
    }

    // English mode: 1. Exact dictionary match
    if (STATIC_DICTIONARY.en[key]) {
      return STATIC_DICTIONARY.en[key];
    }

    // 2. Trimmed dictionary match
    const trimmed = key.trim();
    if (STATIC_DICTIONARY.en[trimmed]) {
      return STATIC_DICTIONARY.en[trimmed];
    }

    // 3. Normalized quotes match (handles curvy quotation marks)
    const normalized = key.replace(/[\u201C\u201D\u201E\u201F]/g, '"').replace(/[\u2018\u2019]/g, "'");
    if (STATIC_DICTIONARY.en[normalized]) {
      return STATIC_DICTIONARY.en[normalized];
    }

    // 4. i18next engine fallback
    try {
      const res = i18nT(key);
      if (res && res !== key) {
        return res;
      }
    } catch {
      // ignore
    }

    return key;
  };

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    
    // Switch URL prefix
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0 && LANGUAGE_OPTIONS.some(o => o.code === pathParts[0])) {
      pathParts[0] = lang;
      navigate(`/${pathParts.join('/')}${location.search}${location.hash}`);
    } else {
      navigate(`/${lang}${location.pathname}${location.search}${location.hash}`);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const Translate: React.FC<{ children: string }> = ({ children }) => {
  const { t } = useLanguage();
  return <>{t(children)}</>;
};

export const useLocalized = () => {
  const { currentLanguage, t } = useLanguage();

  const getLocalized = (item: any, field: string): string => {
    if (!item) return "";
    if (currentLanguage === "en" && item[`${field}_en`]) {
      return item[`${field}_en`];
    }
    const val = item[field];
    if (typeof val === "string") {
      const translated = t(val);
      if (translated && translated !== val) return translated;
      return val;
    }
    return String(val || "");
  };

  return { currentLanguage, t, getLocalized };
};
