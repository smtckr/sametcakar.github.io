import React, { useState } from "react";
import { Lock, Key, X, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import { useCMS } from "../CMSContext";
import { useLanguage, Translate } from "../LanguageContext";

export default function AdminLoginModal() {
  const { isLoginModalOpen, closeLoginModal, loginAdmin } = useCMS();
  const { t } = useLanguage();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    setTimeout(() => {
      const success = loginAdmin(username, password);
      setIsSubmitting(false);
      if (!success) {
        setError(t("Kullanıcı adı veya şifre hatalı. Lütfen kontrol edin."));
      } else {
        setUsername("");
        setPassword("");
      }
    }, 400);
  };

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      onClick={closeLoginModal}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-scale-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header pattern */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 text-white p-6 sm:p-8 relative">
          <button
            onClick={closeLoginModal}
            className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/80 p-2 rounded-full transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="w-12 h-12 bg-orange-600/20 border border-orange-500/30 rounded-2xl flex items-center justify-center text-orange-400 mb-4 shadow-inner">
            <Lock className="h-6 w-6" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            <Translate>Yönetici Girişi</Translate>
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
            <Translate>Web sitesini canlı olarak düzenlemek ve değişiklikleri anında yayınlamak için yönetici bilgilerinizi girin.</Translate>
          </p>
        </div>

        {/* Content & Form */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm flex items-center space-x-2.5">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                <Translate>Kullanıcı Adı</Translate>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı Adı"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                <Translate>Şifre</Translate>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-orange-600/25 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              <ShieldCheck className="h-5 w-5" />
              <span>{isSubmitting ? t("Giriş Yapılıyor...") : t("Giriş Yap & Düzenlemeye Başla")}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
