import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { useCMS } from "../CMSContext";

export default function GlobalConfirmModal() {
  const { confirmModalState, closeConfirmation } = useCMS();

  if (!confirmModalState) return null;

  const { title, message, confirmText = "Evet, Sil", cancelText = "Vazgeç", isDanger = true, onConfirm } = confirmModalState;

  const handleConfirm = () => {
    onConfirm();
    closeConfirmation();
  };

  return (
    <div 
      className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in"
      onClick={closeConfirmation}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8 space-y-5 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            {isDanger ? <Trash2 className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            <button
              type="button"
              onClick={closeConfirmation}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`w-full text-white font-bold py-3 px-4 rounded-xl text-xs shadow-lg transition-all cursor-pointer ${
                isDanger
                  ? "bg-red-600 hover:bg-red-700 shadow-red-600/30"
                  : "bg-orange-600 hover:bg-orange-700 shadow-orange-600/30"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
