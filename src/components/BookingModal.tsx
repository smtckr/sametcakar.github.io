import React, { useState, useEffect } from "react";
import { X, Calendar, Users, Mail, Phone, User, CheckCircle, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Tour, Hotel } from "../types";
import { useLanguage, Translate, useLocalized } from "../LanguageContext";
import { useCurrency } from "../CurrencyContext";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Tour | Hotel | null;
  type: "tour" | "hotel";
  onConfirm: (bookingDetails: {
    checkIn: string;
    checkOut: string;
    guests: number | string;
    name: string;
    email: string;
    phone: string;
    totalPrice: number;
  }) => void;
}

export default function BookingModal({ isOpen, onClose, item, type, onConfirm }: BookingModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState<number | "other">(1);
  const [customGroupNote, setCustomGroupNote] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();
  const { getLocalized } = useLocalized();
  const { formatPrice } = useCurrency();

  const isOtherGuests = guests === "other";

  // Set default tour date to tomorrow and reset form on open
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setErrorMessage("");
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      setTourDate(tomorrowStr);

      const savedCheckIn = sessionStorage.getItem("preselected_checkIn");
      const savedCheckOut = sessionStorage.getItem("preselected_checkOut");
      if (savedCheckIn) setCheckIn(savedCheckIn);
      if (savedCheckOut) setCheckOut(savedCheckOut);
    }
  }, [isOpen]);

  useEffect(() => {
    if (item) {
      if (isOtherGuests) {
        // If "Diğer" is selected, do NOT calculate or show fixed price
        setTotalPrice(0);
      } else {
        const guestCount = typeof guests === "number" ? guests : 1;
        if (type === "tour") {
          setTotalPrice(item.price * guestCount);
        } else {
          if (checkIn && checkOut) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
            setTotalPrice(item.price * diffDays * guestCount);
          } else {
            setTotalPrice(item.price * guestCount);
          }
        }
      }
    }
  }, [item, type, guests, isOtherGuests, checkIn, checkOut]);

  if (!isOpen || !item) return null;

  const handleCloseSuccess = () => {
    setIsSubmitted(false);
    setName("");
    setEmail("");
    setPhone("");
    setCustomGroupNote("");
    setErrorMessage("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // 1. Mandatory Name Validation
    if (!name.trim()) {
      setErrorMessage(t("Lütfen ad ve soyadınızı giriniz."));
      return;
    }

    // 2. Mandatory Email Validation
    if (!email.trim()) {
      setErrorMessage(t("Lütfen e-posta adresinizi giriniz."));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage(t("Lütfen geçerli bir e-posta adresi giriniz."));
      return;
    }

    // 3. Mandatory Phone Validation
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      setErrorMessage(t("Lütfen geçerli bir telefon numarası giriniz (en az 10 hane)."));
      return;
    }

    if (type === "hotel" && (!checkIn || !checkOut)) {
      setErrorMessage(t("Lütfen giriş ve çıkış tarihlerini seçiniz."));
      return;
    }

    const finalGuests = isOtherGuests 
      ? (customGroupNote.trim() ? `Diğer (${customGroupNote.trim()})` : "Diğer (10+ Kişi)") 
      : guests;

    onConfirm({
      checkIn: type === "hotel" ? checkIn : tourDate,
      checkOut: type === "hotel" ? checkOut : "",
      guests: finalGuests,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      totalPrice: isOtherGuests ? 0 : totalPrice,
    });

    setIsSubmitted(true);
  };

  // SUCCESS CONFIRMATION POP-UP MODAL SCREEN
  if (isSubmitted) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        onClick={handleCloseSuccess}
      >
        <div 
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 flex flex-col p-6 sm:p-8 text-center animate-scale-up relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Close 'X' Button */}
          <button
            onClick={handleCloseSuccess}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
          </div>

          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">
            {t("Rezervasyon Başarılı")}
          </span>
          <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
            {t("Talebiniz Alınmıştır!")}
          </h3>

          <div className="p-4 bg-orange-50/90 border border-orange-200/90 rounded-2xl mb-5 text-center shadow-xs">
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              “{t("Talebiniz Alınmıştır. Paylaşılan bilgiler üzerinden en kısa sürede sizlerle iletişime geçilecektir.")}”
            </p>
          </div>

          {/* Quick summary of submitted request */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 space-y-2 mb-6 text-left">
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-400 font-medium shrink-0">{t("Tur")}:</span>
              <strong className="text-slate-800 truncate text-right">{getLocalized(item, "title")}</strong>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-400 font-medium shrink-0">{t("Ad Soyad")}:</span>
              <strong className="text-slate-800 text-right">{name}</strong>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-400 font-medium shrink-0">{t("E-posta")}:</span>
              <span className="text-slate-800 font-medium text-right truncate font-mono text-[11px]">{email}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-400 font-medium shrink-0">{t("Telefon")}:</span>
              <span className="text-slate-800 font-medium text-right">{phone}</span>
            </div>
            {type === "tour" && tourDate && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-400 font-medium shrink-0">{t("Tarih")}:</span>
                <span className="text-slate-800 font-medium text-right">{tourDate}</span>
              </div>
            )}
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-400 font-medium shrink-0">{t("Kişi Sayısı")}:</span>
              <span className="text-slate-800 font-medium text-right">
                {typeof guests === "number" ? `${guests} ${t("Kişi")}` : t("Diğer (Özel Grup)")}
              </span>
            </div>
          </div>

          <button
            onClick={handleCloseSuccess}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-orange-600/25 hover:shadow-orange-600/35 transition-all cursor-pointer text-sm"
          >
            {t("Tamam, Teşekkürler")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center relative">
          <div>
            <span className="text-orange-400 text-xs font-bold uppercase tracking-wider block mb-1">
              <Translate>Güvenli Rezervasyon Portalı</Translate>
            </span>
            <h3 className="text-xl font-bold line-clamp-1">{getLocalized(item, "title")}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick info */}
          <div className="flex items-center space-x-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <img
              src={item.image}
              alt={item.title}
              className="w-16 h-16 object-cover rounded-xl shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-xs text-slate-500 font-semibold">{getLocalized(item, "location")}</p>
              <p className="text-sm font-bold text-slate-900">
                {formatPrice(item.price)} <span className="text-xs text-slate-500 font-normal">/ {type === "tour" ? t("kişi") : t("gece")}</span>
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t("Ad Soyad")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder={t("Ad Soyad") || "Ad Soyad"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Email - MANDATORY */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t("E-posta Adresi")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="isim@ornek.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Phone - MANDATORY */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t("İletişim Numarası")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="05XX XXX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Tour Date (Preferred) */}
            {type === "tour" && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t("Tercih Edilen Tur Tarihi")}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            {/* Guest selector for tours: 1-2-3-4-5-6-7-8-9-10 ve Diğer */}
            {type === "tour" && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t("Kişi Sayısı")}
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={guests}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "other") {
                        setGuests("other");
                      } else {
                        setGuests(Number(val));
                      }
                    }}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                      <option key={g} value={g}>
                        {g} {t("Kişi") || "Kişi"}
                      </option>
                    ))}
                    <option value="other">{t("Diğer") || "Diğer"}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Hotel dates & guests */}
            {type === "hotel" && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t("Giriş Tarihi")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t("Çıkış Tarihi")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t("Kişi Sayısı")}
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select
                      value={guests}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "other") {
                          setGuests("other");
                        } else {
                          setGuests(Number(val));
                        }
                      }}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer font-medium"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                        <option key={g} value={g}>
                          {g} {t("Kişi") || "Kişi"}
                        </option>
                      ))}
                      <option value="other">{t("Diğer") || "Diğer"}</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* If 'Diğer' is chosen, show optional group size and explanation */}
            {isOtherGuests && (
              <div className="sm:col-span-2 space-y-2 pt-1 animate-fade-in">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
                  <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{t("10 kişi üzeri gruplar için ücretlendirme özel olarak hazırlanacaktır. Lütfen tahmini kişi sayınızı veya talebinizi belirtiniz:")}</span>
                </div>
                <input
                  type="text"
                  placeholder={t("Örn: 15 Kişilik şirket grubu / Aile grubu") || "Tahmini kişi sayısı veya grup talebiniz"}
                  value={customGroupNote}
                  onChange={(e) => setCustomGroupNote(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-orange-500"
                />
              </div>
            )}
          </div>

          {/* Pricing Summary Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between bg-orange-50/70 p-4 rounded-2xl border border-orange-100">
            <div>
              {isOtherGuests ? (
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block">{t("Ücret Durumu")}</span>
                  <span className="text-sm sm:text-base font-bold text-slate-800">
                    {t("Talep Üzerine Fiyatlandırılır") || "Talep Üzerine Fiyatlandırılır"}
                  </span>
                  <p className="text-[10px] text-slate-500">
                    {t("Özel grup indirimi uygulanır")}
                  </p>
                </div>
              ) : (
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">{t("Toplam Tahmini Tutar")}</span>
                  <span className="text-2xl font-black text-orange-600">{formatPrice(totalPrice)}</span>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl text-sm flex items-center space-x-2 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/35 transition-all cursor-pointer shrink-0"
            >
              <CheckCircle className="h-4 w-4" />
              <span>{isOtherGuests ? (t("Teklif Talebi Gönder") || "Talep Gönder") : (t("Rezervasyonu Tamamla") || "Rezervasyonu Tamamla")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
