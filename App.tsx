
import React, { useState, useEffect } from 'react';
import { AppView, Disease, Doctor, TriageResult, Message } from './types';
import Hero from './components/Hero';
import ChatInterface from './components/ChatInterface';
import ResultsCard from './components/ResultsCard';
import AdminPanel from './components/AdminPanel';
import DoctorsList from './components/DoctorsList';
import Styleguide from './components/Styleguide';
import ToastContainer from './components/ToastContainer';
import { firestoreService } from './services/firebase';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  useEffect(() => {
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
  const handleViewDoctors = () => setView('doctors_list');
  
  const handleTriageComplete = (result: TriageResult, history: Message[]) => {
    setTriageResult(result);
    setChatHistory(history);
    setView('results');
  };

  return (
    <div className="min-h-screen flex flex-col bg-cerm-light selection:bg-cerm-green selection:text-white">
      <ToastContainer />
      
      <nav className="sticky top-0 z-50 glass-effect border-b border-cerm-green/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => setView('landing')}>
            <div className="flex items-center justify-center">
              <img 
                src="https://res.cloudinary.com/dg4wbuppq/image/upload/v1766102403/checkup_9787624_fp356g.png" 
                alt="CERM Logo" 
                className="w-10 h-10 object-contain transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-cerm-dark font-black text-sm uppercase tracking-[0.3em] leading-none mb-1">CERM</span>
              <span className="text-cerm-green font-bold text-[10px] uppercase tracking-[0.4em] leading-none">CHECK AI</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={() => setView('admin')} className="text-cerm-dark/40 hover:text-cerm-green transition-colors" title="Panel de Administración">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button onClick={handleStartChat} className="hidden sm:block cerm-btn-pill bg-cerm-dark text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-cerm-green transition-all">
              Probar Demo
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {view === 'landing' && <Hero onStart={handleStartChat} onViewDoctors={handleViewDoctors} />}
        {view === 'chat' && <ChatInterface onComplete={handleTriageComplete} diseases={diseases} />}
        {view === 'results' && triageResult && (
          <ResultsCard 
            result={triageResult} 
            history={chatHistory}
            doctors={doctors} 
            onRetry={() => setView('chat')} 
          />
        )}
        {view === 'admin' && <AdminPanel diseases={diseases} doctors={doctors} />}
        {view === 'doctors_list' && <DoctorsList doctors={doctors} onBack={() => setView('landing')} />}
        {view === 'styleguide' && <Styleguide onBack={() => setView('landing')} />}
      </main>

      <footer className="py-20 border-t border-cerm-green/5 text-center flex flex-col items-center gap-4">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-cerm-dark/20">© 2025 CERM SaaS Lead Magnet</p>
          <button 
            onClick={() => setView('styleguide')}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-cerm-green hover:text-cerm-dark transition-colors"
          >
            Brand Styleguide & UI System
          </button>
      </footer>
    </div>
  );
};

export default App;
