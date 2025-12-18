
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

    if (savedDiseases) {
      setDiseases(JSON.parse(savedDiseases));
    } else {
      setDiseases(INITIAL_DISEASES);
      localStorage.setItem('diseases', JSON.stringify(INITIAL_DISEASES));
    }

    if (savedDoctors) {
      setDoctors(JSON.parse(savedDoctors));
    } else {
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

  const handleUpdateDiseases = (newDiseases: Disease[]) => {
    setDiseases(newDiseases);
    localStorage.setItem('diseases', JSON.stringify(newDiseases));
  };

  const handleUpdateDoctors = (newDoctors: Doctor[]) => {
    setDoctors(newDoctors);
    localStorage.setItem('doctors', JSON.stringify(newDoctors));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ToastContainer />
      
      {/* Global Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group" 
            onClick={() => setView('landing')}
          >
            <div className="flex flex-col border-r border-mayo-blue pr-3 leading-none">
              <span className="text-mayo-blue font-bold text-lg sm:text-xl uppercase tracking-tighter">CERM</span>
              <span className="text-mayo-blue font-light text-lg sm:text-xl uppercase tracking-tighter">CHECK</span>
            </div>
            <div className="w-8 h-8 flex items-center justify-center text-mayo-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          {/* Nav Icons */}
          <div className="flex items-center space-x-4 sm:space-x-8">
            <button className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-mayo-blue transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline">Iniciar la sesión</span>
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-700 hover:text-mayo-blue">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button onClick={() => setView('admin')} className="p-2 text-slate-700 hover:text-mayo-blue">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {view === 'landing' && <Hero onStart={handleStartChat} />}
        {view === 'chat' && (
          <ChatInterface 
            onComplete={handleTriageComplete} 
            diseases={diseases}
          />
        )}
        {view === 'results' && triageResult && (
          <ResultsCard 
            result={triageResult} 
            doctors={doctors} 
            onRetry={() => setView('chat')}
          />
        )}
        {view === 'admin' && (
          <AdminPanel 
            diseases={diseases} 
            doctors={doctors}
            onUpdateDiseases={handleUpdateDiseases}
            onUpdateDoctors={handleUpdateDoctors}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">© 1998-2024 CERM CHECK para la Educación e Investigación Médica.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
