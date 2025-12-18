
import React, { useState, useEffect } from 'react';
import { TriageResult, Doctor } from '../types';

interface ResultsCardProps {
  result: TriageResult;
  doctors: Doctor[];
  onRetry: () => void;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ result, doctors, onRetry }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const recommendedDoctor = doctors[0] || {
    name: "Especialista Reumatólogo",
    specialty: "Inmunología Clínica",
    imageUrl: "https://via.placeholder.com/400",
    phone: "0000000000"
  };

  const getWhatsAppLink = (doctor: Doctor) => {
    const message = encodeURIComponent(`Hola, solicito cita tras evaluación IA: ${result.condition}.`);
    return `https://wa.me/${doctor.phone}?text=${message}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <button 
        onClick={onRetry}
        className="mb-10 flex items-center text-mayo-slate font-bold uppercase text-[10px] tracking-[0.3em] hover:text-mayo-blue transition-all"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
        Reiniciar Proceso
      </button>

      {/* Main Result Card */}
      <div className="bg-white border border-mayo-border rounded-[2rem] overflow-hidden shadow-glass mb-12">
        <div className="p-8 sm:p-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-mayo-surface rounded-full mb-8">
            <span className={`w-2 h-2 rounded-full ${result.urgency === 'Alta' ? 'bg-red-500' : 'bg-mayo-blue'}`}></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-mayo-dark">Prioridad {result.urgency}</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold serif-font text-mayo-dark tracking-tighter mb-8 leading-tight">
            {result.condition}
          </h1>

          <p className="text-xl sm:text-2xl text-mayo-slate max-w-3xl leading-relaxed italic">
            "{result.summary}"
          </p>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-mayo-border to-transparent my-12"></div>

          <div className="grid sm:grid-cols-3 gap-8 w-full text-left">
            <div>
              <h4 className="text-[10px] font-bold text-mayo-blue uppercase tracking-widest mb-2">Evaluación</h4>
              <p className="text-sm font-medium text-mayo-dark">Algoritmo Médico v2.5</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-mayo-blue uppercase tracking-widest mb-2">Confianza</h4>
              <p className="text-sm font-medium text-mayo-dark">Alta Precisión Basada en Datos</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-mayo-blue uppercase tracking-widest mb-2">Estado</h4>
              <p className="text-sm font-medium text-mayo-dark">Requiere Validación Médica</p>
            </div>
          </div>
        </div>
      </div>

      {/* Specialist Recommendation */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 glass-effect p-8 sm:p-12 rounded-[2rem] shadow-glass flex flex-col sm:flex-row items-center gap-8">
          <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-premium">
            <img src={recommendedDoctor.imageUrl} alt={recommendedDoctor.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="text-3xl font-bold text-mayo-dark serif-font mb-1">{recommendedDoctor.name}</h3>
            <p className="text-mayo-blue font-bold text-sm uppercase tracking-widest mb-6">{recommendedDoctor.specialty}</p>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <button onClick={() => setIsModalOpen(true)} className="mayo-btn-pill bg-mayo-dark text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-mayo-blue transition-all">
                Agendar Cita
              </button>
              <a href={getWhatsAppLink(recommendedDoctor)} target="_blank" className="mayo-btn-pill border border-mayo-border bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-mayo-light transition-all">
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="bg-mayo-dark text-white p-12 rounded-[2rem] shadow-premium flex flex-col justify-center">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-mayo-blue mb-6">Próximos Pasos</h4>
          <ul className="space-y-4 text-sm font-medium text-mayo-light/70">
            <li className="flex items-start gap-3">
              <span className="text-mayo-blue">01.</span> Agendar con el especialista recomendado.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-mayo-blue">02.</span> Recolectar análisis clínicos previos.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-mayo-blue">03.</span> Monitorear intensidad del dolor.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;
