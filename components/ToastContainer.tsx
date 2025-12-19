
import React, { useState, useEffect } from 'react';
import { Toast } from '../types';

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (e: any) => {
      const newToast = e.detail as Toast;
      setToasts(prev => [...prev, newToast]);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 5000);
    };

    window.addEventListener('app-toast', handleToast);
    return () => window.removeEventListener('app-toast', handleToast);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-md w-full px-4 sm:px-0">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto flex items-start gap-4 p-4 rounded-sm shadow-2xl border-l-4 animate-in slide-in-from-right-full duration-300
            ${toast.type === 'error' ? 'bg-white border-red-600' : 
              toast.type === 'success' ? 'bg-white border-green-600' : 
              'bg-white border-cerm-green'}
          `}
        >
          <div className={`mt-0.5 ${
            toast.type === 'error' ? 'text-red-600' : 
            toast.type === 'success' ? 'text-green-600' : 
            'text-cerm-green'
          }`}>
            {toast.type === 'error' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {(toast.type === 'info' || toast.type === 'success') && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="flex-grow">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              {toast.type === 'error' ? 'Error del Sistema' : 'Notificación'}
            </h4>
            <p className="text-sm text-cerm-dark font-medium leading-snug">
              {toast.message}
            </p>
          </div>
          <button 
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            className="text-slate-300 hover:text-slate-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
