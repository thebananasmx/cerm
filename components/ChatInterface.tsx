
import React, { useState, useEffect, useRef } from 'react';
import { Message, Disease, TriageResult } from '../types';
import { getMockChatResponse, calculateMockResult } from '../services/diagnosticService';

interface ChatInterfaceProps {
  onComplete: (result: TriageResult, history: Message[]) => void;
  diseases: Disease[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onComplete, diseases }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inicio inmediato
    const firstStep = getMockChatResponse(0);
    if (firstStep) {
      setMessages([{ role: 'model', text: firstStep.question }]);
      setOptions(firstStep.options);
    }
  }, []);

  useEffect(() => {
    // Scroll inteligente: Posiciona la última pregunta justo debajo del header
    if (lastMessageRef.current) {
      const offset = 180; // Compensación para el Nav (80px) + Header Sticky (100px)
      const elementPosition = lastMessageRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleOptionSelect = (option: string) => {
    if (isTyping) return;

    const userMsg: Message = { role: 'user', text: option };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsTyping(true);

    setTimeout(() => {
      const nextStepIndex = step + 1;
      const nextStep = getMockChatResponse(nextStepIndex);

      if (!nextStep) {
        const result = calculateMockResult(newHistory, diseases);
        onComplete(result, newHistory);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: nextStep.question }]);
        setOptions(nextStep.options);
        setStep(nextStepIndex);
      }
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 min-h-screen flex flex-col relative">
      {/* Header de Pasos Sticky */}
      <div className="sticky top-20 z-40 bg-cerm-light/95 backdrop-blur-md py-6 mb-8 border-b border-cerm-green/5 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-cerm-green mb-1">Evaluación en curso</h2>
            <p className="text-xl font-bold text-cerm-dark serif-font">Check de Salud Virtual</p>
          </div>
          <div className="flex items-center gap-4 bg-white/50 border border-cerm-border p-3 rounded-2xl shadow-sm">
            <div className="flex gap-1">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 w-6 sm:w-10 rounded-full transition-all duration-700 ${i <= step ? 'bg-cerm-green shadow-[0_0_8px_rgba(0,184,164,0.3)]' : 'bg-cerm-border'}`}
                ></div>
              ))}
            </div>
            <span className="text-[10px] font-black text-cerm-dark/60 uppercase tracking-widest">{step + 1} de 6</span>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <div className="space-y-24 mb-32 flex-grow">
          {messages.map((msg, idx) => {
            const isModel = msg.role === 'model';
            const isLastModelMessage = isModel && idx === messages.length - 1;
            
            return (
              <div 
                key={idx} 
                ref={isLastModelMessage ? lastMessageRef : null}
                className={`flex ${isModel ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-8 duration-700`}
              >
                <div className={`${isModel 
                  ? 'text-3xl sm:text-5xl font-bold serif-font text-cerm-dark leading-tight max-w-4xl' 
                  : 'text-xl sm:text-2xl text-cerm-green font-bold italic bg-cerm-surface/50 px-6 py-3 rounded-3xl border border-cerm-green/10 shadow-sm'}`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          
          {isTyping && (
            <div className="flex items-center gap-3 text-cerm-green text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-cerm-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cerm-green"></span>
              </span>
              Analizando respuesta clínica...
            </div>
          )}
        </div>

        {/* Opciones fijas abajo pero relativas al flujo */}
        {!isTyping && options.length > 0 && (
          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4 py-12 border-t border-cerm-border bg-cerm-light/50">
            {options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleOptionSelect(opt)} 
                className="group flex items-center justify-between p-7 bg-white border border-cerm-border rounded-[1.5rem] hover:border-cerm-green hover:bg-cerm-surface transition-all text-left shadow-sm hover:shadow-premium active:scale-95"
              >
                <span className="text-lg font-bold text-cerm-dark group-hover:text-cerm-green transition-colors">{opt}</span>
                <div className="w-8 h-8 rounded-full border border-cerm-border flex items-center justify-center group-hover:bg-cerm-green group-hover:border-cerm-green transition-all">
                  <svg className="w-4 h-4 text-cerm-slate group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
