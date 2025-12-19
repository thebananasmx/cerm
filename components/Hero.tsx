
import React from 'react';

interface HeroProps {
  onStart: () => void;
  onViewDoctors: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onViewDoctors }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mayo-blue/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-mayo-dark/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 sm:py-32 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-mayo-blue/10 border border-mayo-blue/20 rounded-full mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mayo-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-mayo-blue"></span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mayo-accent">Nueva Generación de Diagnóstico IA</span>
        </div>

        <h1 className="text-5xl sm:text-8xl font-bold text-mayo-dark tracking-tighter mb-8 serif-font leading-[0.9] max-w-5xl mx-auto">
          El futuro de la salud <span className="italic text-mayo-blue">reumatológica</span> es ahora.
        </h1>
        
        <p className="text-lg sm:text-xl text-mayo-slate max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
          Evaluaciones instantáneas impulsadas por inteligencia artificial de grado médico para detectar condiciones autoinmunes antes que nunca.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="mayo-btn-pill w-full sm:w-auto bg-mayo-blue text-white px-12 py-5 text-lg font-bold uppercase tracking-[0.15em] hover:bg-mayo-dark hover:shadow-premium transition-all active:scale-95"
          >
            Comenzar Evaluación
          </button>
          <button 
            onClick={onViewDoctors}
            className="mayo-btn-pill w-full sm:w-auto px-12 py-5 text-lg font-bold uppercase tracking-[0.15em] border border-mayo-border bg-white hover:bg-mayo-light transition-all"
          >
            Ver Especialistas
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Diagnóstico Rápido", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            { title: "Expertos en Red", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
            { title: "Privacidad Total", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }
          ].map((feature, i) => (
            <div key={i} className="glass-effect p-8 rounded-2xl shadow-glass hover:shadow-premium transition-all duration-500">
              <div className="w-12 h-12 bg-mayo-blue/10 rounded-xl flex items-center justify-center text-mayo-blue mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-mayo-dark serif-font mb-2">{feature.title}</h3>
              <p className="text-sm text-mayo-slate">Protección y precisión de datos nivel hospitalario.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
