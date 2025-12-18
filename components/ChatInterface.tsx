
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
        const text = response.text || '{}';
        const data = JSON.parse(text) as AIResponse;
        
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
        const modelMsg: Message = { role: 'model', text: "Analizando todos sus síntomas para generar su informe clínico..." };
        const finalMessages = [...currentMessages, modelMsg];
        setMessages(finalMessages);
        
        const summary = await getTriageSummary(finalMessages);
        onComplete(summary, finalMessages);
        return;
      }

      const response = await chatInstance.current.sendMessage({ message: option });
      const text = response.text || '{}';
      const data = JSON.parse(text) as AIResponse;

      const modelMsg: Message = { role: 'model', text: data.question || "¿Presenta algún otro síntoma como fatiga o fiebre?" };
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
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-16 min-h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-2 sm:mb-6 flex items-center text-mayo-dark font-bold uppercase text-[10px] sm:text-[12px] tracking-[0.2em] cursor-pointer group hover:text-mayo-accent" onClick={() => window.location.reload()}>
        <svg className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
        </svg>
        Diagnóstico con IA
      </div>

      <div className="bg-mayo-blue text-mayo-dark px-6 sm:px-8 py-3 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-20 shadow-lg rounded-sm">
        <h2 className="text-lg sm:text-2xl font-bold serif-font">Evaluación de síntomas</h2>
        <div className="flex items-center space-x-3 sm:space-x-4 text-mayo-dark/80 uppercase text-[9px] sm:text-[11px] font-bold tracking-[0.2em] mt-1 sm:mt-0">
          <div className="flex space-x-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-1 w-4 sm:h-1.5 sm:w-8 rounded-full transition-all duration-500 ${i <= questionCount ? 'bg-mayo-dark' : 'bg-mayo-dark/20'}`}></div>
            ))}
          </div>
          <span className="whitespace-nowrap">Pregunta {Math.min(questionCount + 1, 6)} de 6</span>
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
                      : 'text-xl sm:text-3xl text-mayo-accent font-bold italic'
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
               <div className="flex items-center space-x-2 sm:space-x-3 text-mayo-accent font-bold tracking-widest text-[10px] sm:text-[12px] uppercase bg-mayo-light px-5 sm:px-8 py-2 sm:py-4 rounded-full border border-mayo-blue/30">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-mayo-accent rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-mayo-accent rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-mayo-accent rounded-full animate-bounce [animation-delay:-0.4s]"></div>
                  </div>
                  <span className="ml-1 sm:ml-2">Analizando información médica</span>
               </div>
            </div>
          )}
        </div>

        {!isTyping && options.length > 0 && questionCount < 6 && (
          <div className="mt-auto pt-4 sm:pt-12 border-t border-slate-100">
            <h3 className="text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-3 sm:mb-10">Seleccione su respuesta clínica:</h3>
            <div className="flex flex-wrap gap-2 sm:gap-6">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(opt)}
                  className="mayo-btn-pill px-6 sm:px-12 py-3 sm:py-6 bg-white border border-mayo-blue text-mayo-dark hover:bg-mayo-blue text-base sm:text-2xl font-bold transition-all shadow-md hover:shadow-2xl active:scale-95 transform whitespace-normal text-left sm:text-center"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 sm:mt-24 pt-4 sm:pt-10 border-t border-slate-100 flex justify-between items-center text-[9px] sm:text-[11px] text-slate-300 font-bold uppercase tracking-[0.2em]">
        <span>Protocolo Reumatológico IA - CERM</span>
        <span className="hidden sm:inline">Exclusivo para Orientación Clínica</span>
      </div>
    </div>
  );
};

export default ChatInterface;
