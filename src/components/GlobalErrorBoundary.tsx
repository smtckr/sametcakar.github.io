import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class GlobalErrorBoundary extends Component<Props, State> {
  declare props: Props;
  public state: State = {
    hasError: false,
    errorMessage: "",
  };

  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || "Bilinmeyen bir arayüz hatası oluştu.",
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[GlobalErrorBoundary] Caught unexpected error:", error, errorInfo);
  }

  handleResetStorage = () => {
    try {
      localStorage.removeItem("site_content");
      localStorage.removeItem("tours_data");
    } catch (e) {
      console.warn("Storage reset warning:", e);
    }
    window.location.reload();
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800/90 border border-slate-700 rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center mx-auto border border-orange-500/30">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Sayfa Yüklenirken Bir Sorun Oluştu</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Görsel veya içerik verilerinde geçici bir uyumsuzluk tespit edildi. Sistem verileri koruma altına aldı.
              </p>
            </div>

            {this.state.errorMessage && (
              <div className="p-3 bg-slate-950/60 rounded-xl text-[11px] font-mono text-slate-400 text-left overflow-x-auto max-h-24">
                {this.state.errorMessage}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Sayfayı Yeniden Yükle</span>
              </button>

              <button
                onClick={this.handleResetStorage}
                className="w-full bg-slate-700/80 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs transition-all cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Önbelleği Temizle & Başlat</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
