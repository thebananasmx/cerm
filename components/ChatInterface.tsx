
import React, { useState, useEffect, useRef } from 'react';
import { Message, Disease, TriageResult } from '../types';
import { startTriageChat, getTriageSummary } from '../services/geminiService';

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
        // The text property returns the string output. Do not use response.text()
        const text = response.text || '{}';
        const data = JSON.parse(text) as AIResponse;
        
        setOptions(data.options || []);
        const initialMsg: Message = { role: 'model', text: data.question || "Hola, soy tu asistente médico de IA. ¿Cómo puedo ayudarte hoy?" };
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
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await chatInstance.current.sendMessage({ message: option });
      // The text property returns the string output. Do not use response.text()
      const text = response.text || '{}';
      const data = JSON.parse(text) as AIResponse;

      if (data.complete || questionCount >= 6) {
        const modelMsg: Message = { role: 'model', text: data.question || "Finalizando entrevista..." };
        const allMessages: Message[] = [...messages, userMsg, modelMsg];
        const summary = await getTriageSummary(allMessages);
        onComplete(summary, allMessages);
      } else {
        const modelMsg: Message = { role: 'model', text: data.question || "¿Puede darme más detalles?" };
        setMessages(prev => [...prev, modelMsg]);
        setOptions(data.options || []);
        setQuestionCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-16 min-h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-2 sm:mb-6 flex items-center text-mayo-dark font-bold uppercase text-[10px] sm:text-[12px] tracking-[0.2em] cursor-pointer group hover:text-mayo-blue" onClick={() => window.location.reload()}>
        <svg className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
        </svg>
        Diagnóstico con IA
      </div>

      <div className="bg-mayo-blue text-white px-6 sm:px-8 py-3 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-20 shadow-lg rounded-sm">
        <h2 className="text-lg sm:text-2xl font-bold serif-font">Evaluación de síntomas</h2>
        <div className="flex items-center space-x-3 sm:space-x-4 text-white/90 uppercase text-[9px] sm:text-[11px] font-bold tracking-[0.2em] mt-1 sm:mt-0">
          <div className="flex space-x-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-1 w-4 sm:h-1.5 sm:w-8 rounded-full transition-all duration-500 ${i <= questionCount ? 'bg-white' : 'bg-white/30'}`}></div>
            ))}
          </div>
          <span className="whitespace-nowrap">Pregunta {questionCount + 1} de 6</span>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <div ref={scrollRef} className="space-y-6 sm:space-y-16 mb-8 sm:mb-20 flex-grow">
          {messages.map((msg, idx) => {
            const isLast = idx === messages.length - 1;
            const isModel = msg.role === 'model';
            
            return (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  ${isLast && isModel 
                    ? 'text-2xl sm:text-5xl serif-font text-mayo-dark border-l-[8px] sm:border-l-[12px] border-mayo-blue pl-4 sm:pl-8 py-2 sm:py-3' 
                    : isModel 
                      ? 'text-lg sm:text-xl text-slate-400 font-medium' 
                      : 'text-xl sm:text-3xl text-mayo-blue font-bold italic'
                  } 
                  max-w-full sm:max-w-[90%] leading-[1.2] transition-all duration-300
                `}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          
          {isTyping && (
            <div className="flex justify-start">
               <div className="flex items-center space-x-2 sm:space-x-3 text-mayo-blue font-bold tracking-widest text-[10px] sm:text-[12px] uppercase bg-mayo-light px-5 sm:px-8 py-2 sm:py-4 rounded-full border border-mayo-blue/10">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-mayo-blue rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-mayo-blue rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-mayo-blue rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                  </div>
                  <span className="ml-1 sm:ml-2">Analizando síntomas</span>
               </div>
            </div>
          )}
        </div>

        {!isTyping && options.length > 0 && (
          <div className="mt-auto pt-4 sm:pt-12 border-t border-slate-100">
            <h3 className="text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-3 sm:mb-10">Seleccione su respuesta:</h3>
            <div className="flex flex-wrap gap-2 sm:gap-6">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(opt)}
                  className="mayo-btn-pill px-6 sm:px-12 py-3 sm:py-6 bg-white border border-mayo-blue text-mayo-blue hover:bg-mayo-blue hover:text-white text-base sm:text-2xl font-bold transition-all shadow-md hover:shadow-2xl active:scale-95 transform whitespace-normal text-left sm:text-center"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 sm:mt-24 pt-4 sm:pt-10 border-t border-slate-100 flex justify-between items-center text-[9px] sm:text-[11px] text-slate-300 font-bold uppercase tracking-[0.2em]">
        <span>Diagnóstico con IA - CERM CHECK</span>
        <span className="hidden sm:inline">Protocolo de Privacidad Certificado</span>
      </div>
    </div>
  );
};

export default ChatInterface;
