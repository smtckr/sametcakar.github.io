import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage, LANGUAGE_OPTIONS } from "../LanguageContext";
import { useCurrency } from "../CurrencyContext";
import Logo from "./Logo";

interface NavbarProps {
  bookingCount?: number;
}

export default function Navbar({ bookingCount = 0 }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { currentCurrency } = useCurrency();
  const location = useLocation();

  const currentOption = LANGUAGE_OPTIONS.find((o) => o.code === currentLanguage) || LANGUAGE_OPTIONS[0];

  const navItems = [
    { id: "", label: "Ana Sayfa" },
    { id: "about", label: "Hakkımızda" },
    { id: "destination", label: "Turlar" },
    { id: "contact", label: "İletişim" },
  ];

  return (
    <nav id="ftco-navbar" className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link
              to={`/${currentLanguage}`}
              className="flex items-center focus:outline-none cursor-pointer group"
              id="brand-logo"
            >
              <Logo withBackground className="h-12 sm:h-14 w-auto" />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const path = item.id ? `/${currentLanguage}/${item.id}` : `/${currentLanguage}`;
              const isActive = location.pathname === path || location.pathname === path + "/";
              return (
                <Link
                  key={item.id}
                  to={path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "text-orange-500 bg-orange-500/10"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                  id={`nav-${item.id || 'home'}`}
                >
                  {t(item.label)}
                </Link>
              );
            })}

            {/* Desktop Language Selector Dropdown */}
            <div className="relative ml-2">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center space-x-2 border border-slate-700 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer bg-slate-800/40"
                id="lang-selector-desktop"
              >
                <img 
                  src={`https://flagcdn.com/w20/${currentOption.countryCode}.png`} 
                  srcSet={`https://flagcdn.com/w40/${currentOption.countryCode}.png 2x`}
                  width="20" 
                  alt={currentOption.name} 
                  className="rounded-sm"
                />
                <span className="uppercase">{currentOption.code}</span>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1.5 z-50">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <button
                      key={option.code}
                      onClick={() => {
                        setLanguage(option.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center space-x-2.5 transition-colors hover:bg-slate-800 hover:text-orange-500 ${
                        currentLanguage === option.code ? "text-orange-500 bg-orange-500/5" : "text-slate-300"
                      }`}
                    >
                      <img 
                        src={`https://flagcdn.com/w20/${option.countryCode}.png`} 
                        srcSet={`https://flagcdn.com/w40/${option.countryCode}.png 2x`}
                        width="20" 
                        alt={option.name} 
                        className="rounded-sm"
                      />
                      <span>{option.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-300 hover:text-white focus:outline-none"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const path = item.id ? `/${currentLanguage}/${item.id}` : `/${currentLanguage}`;
              const isActive = location.pathname === path || location.pathname === path + "/";
              return (
                <Link
                  key={item.id}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-all ${
                    isActive
                      ? "text-orange-500 bg-orange-500/10 font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {t(item.label)}
                </Link>
              );
            })}

            {/* Mobile Language Selector */}
            <div className="border-t border-slate-800 mt-4 pt-4 px-3 flex flex-wrap gap-2 items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Language / Dil</span>
              <div className="flex space-x-2">
                {LANGUAGE_OPTIONS.map((option) => (
                  <button
                    key={option.code}
                    onClick={() => {
                      setLanguage(option.code);
                      setIsOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 border transition-all ${
                      currentLanguage === option.code
                        ? "bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-600/10"
                        : "border-slate-800 bg-slate-800/50 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <img 
                      src={`https://flagcdn.com/w20/${option.countryCode}.png`} 
                      srcSet={`https://flagcdn.com/w40/${option.countryCode}.png 2x`}
                      width="16" 
                      alt={option.name} 
                      className="rounded-sm"
                    />
                    <span>{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
