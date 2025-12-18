
import React, { useState, useEffect } from 'react';
import { AppView, Disease, Doctor, TriageResult, Message } from './types';
import Hero from './components/Hero';
import ChatInterface from './components/ChatInterface';
import ResultsCard from './components/ResultsCard';
import AdminPanel from './components/AdminPanel';
import ToastContainer from './components/ToastContainer';
import { firestoreService } from './services/firebase';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);

  useEffect(() => {
    // Escucha en tiempo real de Firebase
    const unsubDiseases = firestoreService.getDiseases((data: Disease[]) => {
      setDiseases(data.length > 0 ? data : []);
    });
    const unsubDoctors = firestoreService.getDoctors((data: Doctor[]) => {
      setDoctors(data.length > 0 ? data : []);
    });

    return () => {
      unsubDiseases();
      unsubDoctors();
    };
  }, []);

  const handleStartChat = () => setView('chat');
  
  const handleTriageComplete = (result: TriageResult, history: Message[]) => {
    setTriageResult(result);
    setView('results');
  };

  return (
    <div className="min-h-screen flex flex-col bg-mayo-light selection:bg-mayo-blue selection:text-white">
      <ToastContainer />
      
      <nav className="sticky top-0 z-50 glass-effect border-b border-mayo-blue/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setView('landing')}>
            <div className="w-10 h-10 bg-mayo-dark rounded-xl flex items-center justify-center text-mayo-blue shadow-glass">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-mayo-dark font-black text-sm uppercase tracking-[0.3em]">CERM</span>
              <span className="text-mayo-blue font-bold text-[10px] uppercase tracking-[0.4em]">CHECK AI</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={() => setView('admin')} className="text-mayo-dark/40 hover:text-mayo-blue transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button onClick={handleStartChat} className="hidden sm:block mayo-btn-pill bg-mayo-dark text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-mayo-blue transition-all">
              Probar Demo
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {view === 'landing' && <Hero onStart={handleStartChat} />}
        {view === 'chat' && <ChatInterface onComplete={handleTriageComplete} diseases={diseases} />}
        {view === 'results' && triageResult && (
          <ResultsCard result={triageResult} doctors={doctors} onRetry={() => setView('chat')} />
        )}
        {view === 'admin' && <AdminPanel diseases={diseases} doctors={doctors} />}
      </main>

      <footer className="py-20 border-t border-mayo-blue/5 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-mayo-dark/20">© 2025 CERM SaaS Lead Magnet</p>
      </footer>
    </div>
  );
};

export default App;
