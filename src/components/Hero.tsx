import React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage, Translate } from "../LanguageContext";

interface HeroProps {
  title: string;
  subheading?: string;
  backgroundImage: string;
  breadcrumbs: { label: string; active?: boolean; action?: () => void }[];
}

export default function Hero({ title, subheading, backgroundImage, breadcrumbs }: HeroProps) {
  const { t } = useLanguage();

  return (
    <div
      className="relative h-[450px] w-full flex items-end justify-center pb-20 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-950/50" />

      {/* Hero Content */}
      <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center space-x-1.5 text-sm font-medium text-slate-200 mb-2">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="h-4 w-4 text-slate-400" />}
                {crumb.active ? (
                  <span className="text-orange-400 font-semibold">{t(crumb.label)}</span>
                ) : (
                  <button
                    onClick={crumb.action}
                    className="hover:text-orange-400 transition-colors focus:outline-none cursor-pointer"
                  >
                    {t(crumb.label)}
                  </button>
                )}
              </React.Fragment>
            ))}
          </nav>

          {subheading && (
            <span className="text-2xl font-semibold text-orange-400 font-serif italic block">
              <Translate>{subheading}</Translate>
            </span>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-2">
            <Translate>{title}</Translate>
          </h1>
        </motion.div>
      </div>
    </div>
  );
}
