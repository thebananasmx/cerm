
import React, { useState, useEffect, useRef } from 'react';
import { Message, Disease, TriageResult } from '../types';
import { startTriageChat, getTriageSummary, safeParseJSON } from '../services/geminiService';

interface ChatInterfaceProps {
  onComplete: (result: TriageResult, history: Message[]) => void;
  diseases: Disease[];
}

interface AIResponse {
  question: string;
  options: string[];
  complete: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onComplete, diseases }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const chatInstance = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      setIsTyping(true);
      chatInstance.current = startTriageChat();
      try {
        const response = await chatInstance.current.sendMessage({ message: "Iniciando diagnóstico médico asistido por IA." });
        const data = safeParseJSON(response.text) as AIResponse;
        
        setOptions(data.options || []);
        const initialMsg: Message = { role: 'model', text: data.question || "Para comenzar, ¿en qué zona específica siente mayor malestar articular?" };
        setMessages([initialMsg]);
      } catch (err) {
        console.error("Error initializing chat:", err);
      } finally {
        setIsTyping(false);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleOptionSelect = async (option: string) => {
    if (isTyping) return;

    const userMsg: Message = { role: 'user', text: option };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setIsTyping(true);

    try {
      if (questionCount >= 5) {
        const modelMsg: Message = { role: 'model', text: "Generando informe reumatológico final..." };
        const finalMessages = [...currentMessages, modelMsg];
        setMessages(finalMessages);
        
        const summary = await getTriageSummary(finalMessages);
        onComplete(summary, finalMessages);
        return;
      }

      const response = await chatInstance.current.sendMessage({ message: option });
      const data = safeParseJSON(response.text) as AIResponse;

      const modelMsg: Message = { role: 'model', text: data.question || "¿Presenta rigidez persistente al despertar?" };
      setMessages(prev => [...prev, modelMsg]);
      setOptions(data.options || []);
      setQuestionCount(prev => prev + 1);

      if (data.complete) {
        setQuestionCount(5);
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 min-h-[calc(100vh-120px)] flex flex-col">
      {/* Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 sm:mb-20">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-mayo-blue mb-1">Entrevista Clínica</h2>
          <p className="text-2xl font-bold text-mayo-dark serif-font">Asistente IA CERM</p>
        </div>
        <div className="flex items-center gap-4 bg-white/50 border border-mayo-border p-4 rounded-2xl">
          <div className="flex gap-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-1.5 w-6 sm:w-10 rounded-full transition-all duration-700 ${i <= questionCount ? 'bg-mayo-blue' : 'bg-mayo-border'}`}></div>
            ))}
          </div>
          <span className="text-[10px] font-black text-mayo-dark/40 uppercase">{Math.min(questionCount + 1, 6)}/6</span>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <div ref={scrollRef} className="space-y-12 sm:space-y-24 mb-12 flex-grow overflow-y-auto pr-2 custom-scroll">
          {messages.map((msg, idx) => {
            const isLast = idx === messages.length - 1;
            const isModel = msg.role === 'model';
            
            return (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <div className={`
                  ${isLast && isModel 
                    ? 'text-3xl sm:text-6xl font-bold serif-font text-mayo-dark leading-tight max-w-4xl tracking-tighter' 
                    : isModel 
                      ? 'text-lg sm:text-xl text-mayo-slate font-medium max-w-2xl' 
                      : 'text-2xl sm:text-4xl text-mayo-blue font-bold italic serif-font'
                  } 
                  transition-all duration-300
                `}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          
          {isTyping && (
            <div className="flex items-center space-x-3 text-mayo-blue">
              <span className="text-xs font-bold uppercase tracking-[0.3em] animate-pulse">Procesando</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-mayo-blue rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-mayo-blue rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1 h-1 bg-mayo-blue rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {!isTyping && options.length > 0 && questionCount < 6 && (
          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 border-t border-mayo-border">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionSelect(opt)}
                className="group flex items-center justify-between p-6 bg-white border border-mayo-border rounded-2xl hover:border-mayo-blue hover:shadow-premium transition-all text-left"
              >
                <span className="text-lg font-bold text-mayo-dark group-hover:text-mayo-blue transition-colors">{opt}</span>
                <svg className="w-5 h-5 text-mayo-blue opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
