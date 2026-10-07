import React, { createContext, useContext, useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";

export type Currency = "USD" | "TRY";

export interface CurrencyOption {
  code: Currency;
  symbol: string;
  rate: number; // Base is USD
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "TRY", symbol: "₺", rate: 32.5 },
];

interface CurrencyContextProps {
  currentCurrency: CurrencyOption;
  setCurrency: (currencyCode: Currency) => void;
  formatPrice: (usdPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentLanguage } = useLanguage();

  const [currentCurrencyCode, setCurrentCurrencyCode] = useState<Currency>(() => {
    const saved = localStorage.getItem("selected_currency");
    return (saved as Currency) || "USD";
  });

  useEffect(() => {
    // Auto-update currency based on language
    let newCurrency: Currency = "USD";
    
    switch (currentLanguage) {
      case "tr":
        newCurrency = "TRY";
        break;
      case "en":
        newCurrency = "USD";
        break;
      default:
        newCurrency = "USD";
    }
    
    if (newCurrency !== currentCurrencyCode) {
      setCurrentCurrencyCode(newCurrency);
      localStorage.setItem("selected_currency", newCurrency);
    }
  }, [currentLanguage]);

  const currentCurrency = CURRENCY_OPTIONS.find(c => c.code === currentCurrencyCode) || CURRENCY_OPTIONS[0];

  const setCurrency = (code: Currency) => {
    setCurrentCurrencyCode(code);
    localStorage.setItem("selected_currency", code);
  };

  const formatPrice = (usdPrice: number): string => {
    const convertedPrice = usdPrice * currentCurrency.rate;
    
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currentCurrency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(convertedPrice);
  };

  return (
    <CurrencyContext.Provider value={{ currentCurrency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
