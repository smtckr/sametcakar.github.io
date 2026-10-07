import React, { useEffect, useState } from 'react';
import Logo from './Logo';

// Site her yenilendiğinde (F5) çıkması ama sekme içinde gezinirken çıkmaması için:
let hasShownInThisLoad = false;

export default function SplashScreen() {
  const [visible, setVisible] = useState(() => !hasShownInThisLoad);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    
    hasShownInThisLoad = true;

    // 2.8 saniye ekranda kalsın, sonra yavaşça solarak kaybolmaya başlasın
    const timer1 = setTimeout(() => {
      setFading(true);
    }, 2800);

    // 3.8 saniye sonra DOM'dan tamamen kaldırılsın
    const timer2 = setTimeout(() => {
      setVisible(false);
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-[100] bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center p-6 transition-opacity duration-1000 select-none ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="w-[90vw] max-w-4xl md:max-w-5xl transform transition-transform duration-1000 scale-100 animate-pulse-slow flex items-center justify-center">
        {/* withBackground olmaksızın direkt çağırıyoruz ki mixBlendMode: 'multiply' arka plandaki beyazla bütünleşip dekupe etkisi versin */}
        <Logo className="w-full h-auto max-h-[75vh] drop-shadow-2xl" />
      </div>
      
      {/* Zarif yükleme göstergesi */}
      <div className="mt-8 flex items-center space-x-2">
        <div className="w-2.5 h-2.5 bg-orange-600 rounded-full animate-bounce"></div>
        <div className="w-2.5 h-2.5 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        <div className="w-2.5 h-2.5 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
      </div>
    </div>
  );
}
