
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

  useEffect(() => {
    // Inicio inmediato
    const firstStep = getMockChatResponse(0);
    if (firstStep) {
      setMessages([{ role: 'model', text: firstStep.question }]);
      setOptions(firstStep.options);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleOptionSelect = (option: string) => {
    if (isTyping) return;

    const userMsg: Message = { role: 'user', text: option };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsTyping(true);

    // Simular "procesamiento" para realismo (500ms)
    setTimeout(() => {
      const nextStepIndex = step + 1;
      const nextStep = getMockChatResponse(nextStepIndex);

      if (!nextStep) {
        // Fin del árbol de decisión
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
    <div className="max-w-5xl mx-auto px-6 py-8 min-h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 sm:mb-20">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-mayo-blue mb-1">Lead Magnet IA</h2>
          <p className="text-2xl font-bold text-mayo-dark serif-font">Check de Salud Virtual</p>
        </div>
        <div className="flex items-center gap-4 bg-white/50 border border-mayo-border p-4 rounded-2xl">
          <div className="flex gap-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-1.5 w-6 sm:w-10 rounded-full transition-all duration-700 ${i <= step ? 'bg-mayo-blue' : 'bg-mayo-border'}`}></div>
            ))}
          </div>
          <span className="text-[10px] font-black text-mayo-dark/40 uppercase">{step + 1}/6</span>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <div ref={scrollRef} className="space-y-12 mb-12 flex-grow overflow-y-auto pr-2 custom-scroll">
          {messages.map((msg, idx) => {
            const isModel = msg.role === 'model';
            return (
              <div key={idx} className={`flex ${isModel ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <div className={`${isModel ? 'text-2xl sm:text-4xl font-bold serif-font text-mayo-dark' : 'text-xl sm:text-2xl text-mayo-blue font-bold italic'}`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          {isTyping && <div className="text-mayo-blue text-xs font-black uppercase tracking-widest animate-pulse">Analizando respuesta...</div>}
        </div>

        {!isTyping && options.length > 0 && (
          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 border-t border-mayo-border">
            {options.map((opt, i) => (
              <button key={i} onClick={() => handleOptionSelect(opt)} className="group flex items-center justify-between p-6 bg-white border border-mayo-border rounded-2xl hover:border-mayo-blue transition-all text-left shadow-sm hover:shadow-premium">
                <span className="text-lg font-bold text-mayo-dark group-hover:text-mayo-blue">{opt}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
