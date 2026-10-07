import React from 'react';

interface LogoProps {
  className?: string;
  imageClassName?: string;
  withBackground?: boolean;
}

export default function Logo({ className = "", imageClassName = "", withBackground = false }: LogoProps) {
  const logoSrc = "/logo3d.png";
  
  if (withBackground) {
    return (
      <img 
        src={logoSrc} 
        alt="Cesur Akgün Travel Agency" 
        className={`bg-white rounded-lg object-contain shadow-sm transition-transform hover:scale-105 ${className}`}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  return (
    <img 
      src={logoSrc} 
      alt="Cesur Akgün Travel Agency" 
      className={`object-contain ${className}`}
      style={{ mixBlendMode: 'multiply', filter: 'contrast(1.08)' }}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}
