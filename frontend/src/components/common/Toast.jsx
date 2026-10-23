import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    error: 'bg-rose-50 text-rose-800 border-rose-300',
    info: 'bg-blue-50 text-blue-800 border-blue-300',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all animate-slide-in max-w-sm ${styles[type]}`}
      role="alert"
    >
      {icons[type]}
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-800 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
