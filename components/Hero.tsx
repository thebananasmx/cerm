
import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="bg-white">
      {/* Top Banner Area */}
      <div className="bg-white border-b border-slate-100 py-8 sm:py-28 text-center px-6">
        <h1 className="text-4xl sm:text-7xl font-bold text-mayo-dark tracking-tight mb-3 sm:mb-6 serif-font leading-tight">
          Respuestas para su salud <span className="text-mayo-blue">reumatológica</span>
        </h1>
        <p className="text-lg sm:text-2xl text-mayo-dark/80 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-10 font-light">
          Obtenga claridad clínica hoy mismo. Nuestra evaluación inteligente analiza sus síntomas articulares y le conecta con el cuidado experto de forma inmediata.
        </p>
        <button
          onClick={onStart}
          className="mayo-btn-pill w-full sm:w-auto bg-mayo-blue text-white px-10 sm:px-14 py-4 sm:py-5 text-lg sm:text-xl font-bold uppercase tracking-[0.2em] hover:bg-mayo-dark transition-all shadow-lg"
        >
          Iniciar Evaluación de IA
        </button>
      </div>

      {/* Grid Menu - Solid Mayo Blue */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 bg-slate-100 border border-slate-100">
          <button onClick={onStart} className="bg-mayo-blue hover:bg-mayo-dark text-white p-8 sm:p-12 text-left flex flex-col justify-between h-56 sm:h-80 transition-all cursor-pointer group">
            <svg className="w-8 h-8 sm:w-12 sm:h-12 mb-2 sm:mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xl sm:text-2xl font-bold leading-tight serif-font">Pedir una consulta IA</span>
          </button>
          
          <div className="bg-mayo-blue hover:bg-mayo-dark text-white p-8 sm:p-12 text-left flex flex-col justify-between h-56 sm:h-80 transition-all cursor-pointer group opacity-95">
            <svg className="w-8 h-8 sm:w-12 sm:h-12 mb-2 sm:mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xl sm:text-2xl font-bold leading-tight serif-font">Para donar e investigación</span>
          </div>
          
          <div className="bg-mayo-blue hover:bg-mayo-dark text-white p-8 sm:p-12 text-left flex flex-col justify-between h-56 sm:h-80 transition-all cursor-pointer group opacity-90">
            <svg className="w-8 h-8 sm:w-12 sm:h-12 mb-2 sm:mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96.808l-.583.777a2 2 0 01-2.455.514l-4.788-2.394a2 2 0 01-.514-2.455l.777-.583a2 2 0 00.808-1.96l-.477-2.387a2 2 0 00-.547-1.022L7.428 5.428a2 2 0 00-2.828 0L3.428 6.6a2 2 0 00-.547 1.022l-.477 2.387a2 2 0 00.808 1.96l.777.583a2 2 0 01.514 2.455l-2.394 4.788a2 2 0 01-2.455.514l-.583-.777a2 2 0 00-1.96-.808l-2.387.477a2 2 0 00-1.022.547l-1.172 1.172a2 2 0 000 2.828l1.172 1.172a2 2 0 002.828 0l1.172-1.172z" />
            </svg>
            <span className="text-xl sm:text-2xl font-bold leading-tight serif-font">Enfermedades y condiciones</span>
          </div>
          
          <div className="bg-mayo-blue hover:bg-mayo-dark text-white p-8 sm:p-12 text-left flex flex-col justify-between h-56 sm:h-80 transition-all cursor-pointer group opacity-85">
            <svg className="w-8 h-8 sm:w-12 sm:h-12 mb-2 sm:mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xl sm:text-2xl font-bold leading-tight serif-font">Encontrar un especialista</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
