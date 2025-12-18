
import React, { useState, useEffect } from 'react';
import { AppView, Disease, Doctor, TriageResult, Message } from './types';
import { INITIAL_DISEASES, INITIAL_DOCTORS } from './constants';
import Hero from './components/Hero';
import ChatInterface from './components/ChatInterface';
import ResultsCard from './components/ResultsCard';
import AdminPanel from './components/AdminPanel';
import ToastContainer from './components/ToastContainer';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  useEffect(() => {
    const savedDiseases = localStorage.getItem('diseases');
    const savedDoctors = localStorage.getItem('doctors');

    if (savedDiseases) setDiseases(JSON.parse(savedDiseases));
    else {
      setDiseases(INITIAL_DISEASES);
      localStorage.setItem('diseases', JSON.stringify(INITIAL_DISEASES));
    }

    if (savedDoctors) setDoctors(JSON.parse(savedDoctors));
    else {
      setDoctors(INITIAL_DOCTORS);
      localStorage.setItem('doctors', JSON.stringify(INITIAL_DOCTORS));
    }
  }, []);

  const handleStartChat = () => setView('chat');
  
  const handleTriageComplete = (result: TriageResult, history: Message[]) => {
    setTriageResult(result);
    setChatHistory(history);
    setView('results');
  };

  return (
    <div className="min-h-screen flex flex-col bg-mayo-light selection:bg-mayo-blue selection:text-white">
      <ToastContainer />
      
      <nav className="sticky top-0 z-50 glass-effect border-b border-mayo-blue/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setView('landing')}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-mayo-dark rounded-xl flex items-center justify-center text-mayo-blue group-hover:bg-mayo-blue group-hover:text-mayo-dark transition-all duration-500 shadow-glass">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-mayo-dark font-black text-sm uppercase tracking-[0.3em]">CERM</span>
              <span className="text-mayo-blue font-bold text-[10px] uppercase tracking-[0.4em]">CHECK AI</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={() => setView('admin')} className="text-mayo-dark/40 hover:text-mayo-blue transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
            <button 
              onClick={handleStartChat}
              className="hidden sm:block mayo-btn-pill bg-mayo-dark text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-mayo-blue transition-all"
            >
              Iniciar Evaluación
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {view === 'landing' && <Hero onStart={handleStartChat} />}
        {view === 'chat' && (
          <ChatInterface onComplete={handleTriageComplete} diseases={diseases} />
        )}
        {view === 'results' && triageResult && (
          <ResultsCard result={triageResult} doctors={doctors} onRetry={() => setView('chat')} />
        )}
        {view === 'admin' && (
          <AdminPanel 
            diseases={diseases} doctors={doctors}
            onUpdateDiseases={(d) => { setDiseases(d); localStorage.setItem('diseases', JSON.stringify(d)); }}
            onUpdateDoctors={(doc) => { setDoctors(doc); localStorage.setItem('doctors', JSON.stringify(doc)); }}
          />
        )}
      </main>

      <footer className="py-20 border-t border-mayo-blue/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block p-4 bg-mayo-surface rounded-3xl mb-8">
            <svg className="w-8 h-8 text-mayo-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-mayo-dark/20">© 2025 CERM Elite Medical IA</p>
          <div className="mt-8 flex justify-center space-x-8 text-[10px] font-black uppercase tracking-[0.2em] text-mayo-slate">
            <a href="#" className="hover:text-mayo-blue">Privacidad</a>
            <a href="#" className="hover:text-mayo-blue">Términos</a>
            <a href="#" className="hover:text-mayo-blue">Soporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
