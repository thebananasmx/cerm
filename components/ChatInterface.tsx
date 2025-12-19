
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
    // Scroll inteligente con detección de dispositivo optimizada
    if (lastMessageRef.current) {
      // Usamos un timeout para asegurar que el DOM se ha actualizado y calculado dimensiones
      const timer = setTimeout(() => {
        const isMobile = window.innerWidth < 640;
        // Offset de 280px en mobile para cubrir Nav (80px) + Header Steps (~100px) + Gap de seguridad
        const offset = isMobile ? 280 : 200; 
        
        const elementPosition = lastMessageRef.current!.getBoundingClientRect().top + window.pageYOffset;
        
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
      }, 100);
      return () => clearTimeout(timer);
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
    <div className="max-w-5xl mx-auto px-6 py-4 sm:py-8 min-h-screen flex flex-col relative">
      {/* Header de Pasos Sticky - Optimizado para visibilidad */}
      <div className="sticky top-20 z-40 bg-cerm-light/95 backdrop-blur-md py-4 sm:py-6 mb-4 sm:mb-8 border-b border-cerm-green/10 animate-in fade-in duration-500 shadow-sm sm:shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div>
            <h2 className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-cerm-green mb-0.5">Evaluación en curso</h2>
            <p className="text-base sm:text-xl font-bold text-cerm-dark serif-font leading-tight">Check de Salud Virtual</p>
          </div>
          <div className="flex items-center gap-4 bg-white/70 border border-cerm-border p-2 sm:p-3 rounded-2xl shadow-sm">
            <div className="flex gap-1">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 w-5 sm:w-10 rounded-full transition-all duration-700 ${i <= step ? 'bg-cerm-green shadow-[0_0_8px_rgba(0,184,164,0.3)]' : 'bg-cerm-border'}`}
                ></div>
              ))}
            </div>
            <span className="text-[8px] sm:text-[10px] font-black text-cerm-dark/60 uppercase tracking-widest whitespace-nowrap">{step + 1} de 6</span>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        {/* Espaciado vertical mejorado para lectura en mobile */}
        <div className="space-y-16 sm:space-y-24 mb-16 sm:mb-32 flex-grow">
          {messages.map((msg, idx) => {
            const isModel = msg.role === 'model';
            const isLastModelMessage = isModel && idx === messages.length - 1;
            
            return (
              <div 
                key={idx} 
                ref={isLastModelMessage ? lastMessageRef : null}
                // scroll-mt-[300px] asegura que el scroll no "tape" la pregunta con el header
                className={`flex ${isModel ? 'justify-start scroll-mt-[300px] sm:scroll-mt-48' : 'justify-end'} animate-in fade-in slide-in-from-bottom-6 duration-700`}
              >
                <div className={`${isModel 
                  ? 'text-2xl sm:text-5xl font-bold serif-font text-cerm-dark leading-tight max-w-4xl' 
                  : 'text-base sm:text-2xl text-cerm-green font-bold italic bg-cerm-surface/50 px-4 sm:px-6 py-2 sm:py-3 rounded-3xl border border-cerm-green/10 shadow-sm'}`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          
          {isTyping && (
            <div className="flex items-center gap-3 text-cerm-green text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] animate-pulse py-4">
              <span className="flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-cerm-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cerm-green"></span>
              </span>
              Analizando...
            </div>
          )}
        </div>

        {/* Opciones con margen superior generoso en mobile */}
        {!isTyping && options.length > 0 && (
          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3 py-8 sm:py-12 border-t border-cerm-border bg-cerm-light/50">
            {options.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleOptionSelect(opt)} 
                className="group flex items-center justify-between p-5 sm:p-7 bg-white border border-cerm-border rounded-[1rem] sm:rounded-[1.5rem] hover:border-cerm-green hover:bg-cerm-surface transition-all text-left shadow-sm hover:shadow-premium active:scale-95"
              >
                <span className="text-sm sm:text-lg font-bold text-cerm-dark group-hover:text-cerm-green transition-colors">{opt}</span>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-cerm-border flex items-center justify-center group-hover:bg-cerm-green group-hover:border-cerm-green transition-all shrink-0 ml-3">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-cerm-slate group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
