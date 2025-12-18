
import React, { useState, useEffect } from 'react';
import { TriageResult, Doctor } from '../types';

interface ResultsCardProps {
  result: TriageResult;
  doctors: Doctor[];
  onRetry: () => void;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ result, doctors, onRetry }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const matchedDoctors = (doctors || []).filter(doc => {
    if (!doc.tags || !Array.isArray(doc.tags)) return false;
    const cond = (result?.condition || "").toLowerCase();
    
    return doc.tags.some(tag => {
      if (!tag) return false;
      const t = tag.toLowerCase();
      return cond.includes(t) || t.includes(cond);
    });
  });

  const recommendedDoctor = matchedDoctors.length > 0 ? matchedDoctors[0] : (doctors[0] || {
    name: "Especialista de Guardia",
    specialty: "Reumatología General",
    imageUrl: "https://via.placeholder.com/400?text=Doctor",
    phone: "0000000000"
  });

  const getWhatsAppLink = (doctor: Doctor) => {
    const condName = result?.condition || "Consulta";
    const urg = result?.urgency || "Media";
    const message = encodeURIComponent(`Hola, realicé el diagnóstico con IA en CERM CHECK. Resultados: Posible ${condName} (${urg}). Deseo agendar cita con el ${doctor.name}.`);
    return `https://wa.me/${doctor.phone}?text=${message}`;
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16">
      <button 
        onClick={onRetry}
        className="mb-6 flex items-center text-mayo-accent font-bold uppercase text-[10px] sm:text-xs tracking-[0.2em] hover:opacity-70 transition-opacity"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
        Nueva Evaluación
      </button>

      {/* 1. SECCIÓN DE DIAGNÓSTICO PRINCIPAL */}
      <div className="bg-mayo-blue text-mayo-dark rounded-sm shadow-xl overflow-hidden mb-8">
        <div className="p-6 sm:p-12">
          <div className="flex items-center space-x-2 mb-4">
             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
               result.urgency === 'Alta' ? 'bg-red-600 text-white' : 'bg-mayo-dark/10 text-mayo-dark'
             }`}>
               Prioridad {result.urgency || "Media"}
             </span>
             <span className="text-mayo-dark/60 text-[10px] font-bold uppercase tracking-[0.3em]">Resultado IA</span>
          </div>
          <h1 className="text-4xl sm:text-7xl font-bold serif-font mb-6 leading-tight tracking-tight">
            {result.condition || "Evaluación Clínica"}
          </h1>
          <p className="text-lg sm:text-2xl font-medium text-mayo-dark/90 serif-font italic leading-relaxed border-l-4 border-mayo-dark/30 pl-6">
            "{result.summary || "No se pudo generar un resumen detallado."}"
          </p>
        </div>
      </div>

      {/* 2. ESPECIALISTA RECOMENDADO */}
      <div className="bg-white border-2 border-mayo-blue/40 rounded-sm shadow-2xl overflow-hidden mb-12 transform hover:scale-[1.01] transition-transform">
        <div className="bg-mayo-light px-6 py-3 border-b border-mayo-blue/20">
          <h2 className="text-mayo-dark font-bold uppercase text-[11px] tracking-[0.4em]">Especialista Recomendado para su Caso</h2>
        </div>
        <div className="p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 sm:gap-12">
          <div className="w-40 h-40 sm:w-56 sm:h-56 shrink-0 rounded-sm overflow-hidden shadow-lg border-4 border-white">
            <img 
              src={recommendedDoctor.imageUrl} 
              alt={recommendedDoctor.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/400?text=Doctor";
              }}
            />
          </div>

          <div className="flex-grow text-center md:text-left">
            <h3 className="text-3xl sm:text-4xl font-bold text-mayo-dark serif-font mb-2">{recommendedDoctor.name}</h3>
            <p className="text-mayo-accent font-bold uppercase tracking-widest text-xs sm:text-sm mb-6">{recommendedDoctor.specialty}</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex-grow bg-mayo-blue text-mayo-dark font-bold uppercase tracking-[0.2em] py-4 px-8 rounded-sm hover:bg-mayo-accent transition-all shadow-lg flex items-center justify-center space-x-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Agendar Cita Ahora</span>
              </button>
              
              <a 
                href={getWhatsAppLink(recommendedDoctor)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-mayo-dark font-bold uppercase tracking-[0.1em] py-4 px-6 rounded-sm hover:bg-green-600 transition-all flex items-center justify-center"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-mayo-light p-6 sm:p-8 rounded-sm border border-mayo-blue/20">
          <h4 className="font-bold text-mayo-dark uppercase text-xs tracking-widest mb-4">Aviso de Seguridad</h4>
          <p className="text-sm text-mayo-dark/70 leading-relaxed italic">
            Este informe ha sido generado por el sistema CERM CHECK IA basado exclusivamente en sus respuestas. 
            <strong> No sustituye una consulta médica presencial.</strong> El {recommendedDoctor.name} validará estos hallazgos durante su cita.
          </p>
        </div>
        
        <div className="bg-mayo-dark text-white p-6 sm:p-8 rounded-sm">
          <h4 className="font-bold uppercase text-xs tracking-widest mb-4">¿Qué traer a su cita?</h4>
          <ul className="text-sm space-y-2 text-white/80">
            <li>• Lista de medicamentos actuales.</li>
            <li>• Estudios de laboratorio previos (si existen).</li>
            <li>• Registro de cuándo es más intenso el dolor.</li>
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
          <div className="fixed inset-0 bg-mayo-dark/95 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col rounded-sm">
            <div className="bg-mayo-blue p-6 sm:p-8 text-mayo-dark">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-mayo-dark/20 bg-white/30 shrink-0">
                    <img src={recommendedDoctor.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold serif-font">Cita con {recommendedDoctor.name}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-mayo-dark/70">Seleccione su fecha preferida</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-mayo-dark hover:text-mayo-accent">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-4 flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="text-sm font-bold text-mayo-dark uppercase tracking-widest">Marzo 2024</h4>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-6">
                {weekDays.map(wd => (
                  <div key={wd} className="text-center text-[9px] font-bold text-slate-400 uppercase py-2">{wd}</div>
                ))}
                {days.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`
                      aspect-square flex items-center justify-center text-xs font-bold transition-all border
                      ${selectedDay === day 
                        ? 'bg-mayo-blue text-mayo-dark border-mayo-blue' 
                        : 'bg-white text-mayo-dark border-slate-50 hover:border-mayo-blue'}
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="mb-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Horarios Disponibles</p>
                <div className="grid grid-cols-3 gap-2">
                  {['09:00', '11:30', '16:00'].map(time => (
                    <button key={time} className="py-2 border border-slate-200 text-[10px] font-bold text-mayo-dark hover:bg-mayo-blue hover:text-mayo-dark transition-all">
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <a
                href={getWhatsAppLink(recommendedDoctor)}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  w-full py-4 flex items-center justify-center text-xs font-bold uppercase tracking-[0.2em] transition-all
                  ${selectedDay ? 'bg-mayo-blue text-mayo-dark shadow-xl cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                `}
                onClick={(e) => !selectedDay && e.preventDefault()}
              >
                Confirmar y enviar vía WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsCard;
