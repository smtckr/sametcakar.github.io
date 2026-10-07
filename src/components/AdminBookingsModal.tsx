import React, { useState } from "react";
import { X, Calendar, Phone, Mail, User, CheckCircle, Clock, Trash2, Search } from "lucide-react";
import { useCMS } from "../CMSContext";
import { useCurrency } from "../CurrencyContext";

export default function AdminBookingsModal() {
  const { isBookingsModalOpen, setIsBookingsModalOpen, bookings, updateBookingStatus, deleteBooking, askConfirmation } = useCMS();
  const { formatPrice } = useCurrency();
  const [filter, setFilter] = useState<"all" | "Pending" | "Confirmed">("all");
  const [search, setSearch] = useState("");

  if (!isBookingsModalOpen) return null;

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = filter === "all" || b.status === filter;
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.itemTitle.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div 
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
      onClick={() => setIsBookingsModalOpen(false)}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block">
              Rezervasyon Yönetimi
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Müşteri Rezervasyon Talepleri ({bookings.length})
            </h3>
          </div>
          <button
            onClick={() => setIsBookingsModalOpen(false)}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === "all" ? "bg-slate-900 text-white shadow" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              Tümü ({bookings.length})
            </button>
            <button
              onClick={() => setFilter("Pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === "Pending" ? "bg-amber-600 text-white shadow" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              Bekleyen ({bookings.filter(b => b.status === "Pending").length})
            </button>
            <button
              onClick={() => setFilter("Confirmed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === "Confirmed" ? "bg-emerald-600 text-white shadow" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              Onaylanan ({bookings.filter(b => b.status === "Confirmed").length})
            </button>
          </div>

          <div className="relative min-w-[240px] p-[1.5px] rounded-xl overflow-hidden group">
            {/* Rotating glowing border beam */}
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              <div 
                className="absolute -inset-[200%] animate-border-beam" 
                style={{
                  background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, #ec4899 310deg, #f97316 338deg, #fbbf24 358deg, transparent 360deg)"
                }}
              />
            </div>
            <div className="relative z-10 bg-slate-900 rounded-[calc(0.75rem-1.5px)] flex items-center">
              <Search className="h-4 w-4 text-orange-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Müşteri veya tur ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-400 pl-9 pr-3 py-1.5 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Kayıtlı rezervasyon talebi bulunamadı.
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1 ${
                        booking.status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {booking.status === "Confirmed" ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          <span>Onaylandı</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3" />
                          <span>Bekliyor</span>
                        </>
                      )}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">{booking.itemTitle}</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                    <div className="flex items-center space-x-1.5">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-medium text-slate-900">{booking.name}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <a href={`tel:${booking.phone}`} className="hover:text-orange-600">{booking.phone}</a>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <a href={`mailto:${booking.email}`} className="hover:text-orange-600 truncate">{booking.email}</a>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <span>Tarih: {booking.checkIn} - {booking.checkOut}</span>
                    <span>•</span>
                    <span>Kişi: {booking.guests}</span>
                    <span>•</span>
                    <span className="font-bold text-orange-600">
                      {booking.price && booking.price > 0 ? formatPrice(booking.price) : "Özel Grup Teklifi"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 self-end md:self-center">
                  {booking.status === "Pending" ? (
                    <button
                      onClick={() => updateBookingStatus(booking.id, "Confirmed")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Onayla</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => updateBookingStatus(booking.id, "Pending")}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span>Beklemeye Al</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      askConfirmation({
                        title: "Rezervasyonu Silmek İstiyor Musunuz?",
                        message: `"${booking.name}" adına kayıtlı rezervasyon silinecektir.`,
                        confirmText: "Evet, Sil",
                        onConfirm: () => deleteBooking(booking.id),
                      });
                    }}
                    className="text-slate-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
