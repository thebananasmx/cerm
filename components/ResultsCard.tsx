
import React, { useState } from 'react';
import { TriageResult, Doctor } from '../types';

interface ResultsCardProps {
  result: TriageResult;
  doctors: Doctor[];
  onRetry: () => void;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ result, doctors, onRetry }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  const matchedDoctors = doctors.filter(doc => 
    doc.tags.some(tag => 
      result.condition.toLowerCase().includes(tag.toLowerCase()) ||
      tag.toLowerCase().includes(result.condition.toLowerCase())
    )
  );

  const primaryDoctor = matchedDoctors[0] || doctors[0];

  const getWhatsAppLink = (doctor: Doctor) => {
    const message = encodeURIComponent(`Hola, realicé el diagnóstico con IA. Resultados: Posible ${result.condition} (${result.urgency}). Deseo agendar cita.`);
    return `https://wa.me/${doctor.phone}?text=${message}`;
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-24 relative">
      {/* Small Header */}
      <div className="mb-4 flex items-center text-mayo-blue font-bold uppercase text-[10px] sm:text-xs tracking-[0.2em] cursor-pointer hover:underline" onClick={onRetry}>
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
        Regresar al diagnóstico
      </div>

      {/* Main Results Banner - Solid Blue */}
      <div className="bg-mayo-blue text-white px-6 py-8 sm:p-24 mb-6 shadow-2xl rounded-sm overflow-hidden">
        <div className="text-white/80 uppercase text-[10px] sm:text-xs font-bold tracking-[0.4em] mb-2 sm:mb-6">Informe de Diagnóstico</div>
        <h1 className="text-3xl sm:text-8xl font-bold serif-font mb-4 sm:mb-10 leading-[1.1] tracking-tight break-words">{result.condition}</h1>
        <div className="flex items-center space-x-10">
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center space-x-3 text-[11px] sm:text-sm font-bold uppercase tracking-[0.2em] text-white hover:text-white/80 border-b border-white pb-1 transition-all"
           >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Solicitar Consulta Experta</span>
           </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto space-x-3 mb-6 sm:mb-20 border-b border-slate-100 pb-4 sm:pb-6 scrollbar-hide -mx-4 px-4">
        <button className="mayo-btn-pill px-6 sm:px-10 py-3 sm:py-5 bg-white border border-mayo-blue text-mayo-blue text-[11px] sm:text-sm font-bold whitespace-nowrap shadow-sm">Resumen diagnóstico</button>
        <button className="mayo-btn-pill px-6 sm:px-10 py-3 sm:py-5 bg-mayo-blue text-white text-[11px] sm:text-sm font-bold whitespace-nowrap shadow-md">Especialistas</button>
        <button className="mayo-btn-pill px-6 sm:px-10 py-3 sm:py-5 bg-slate-50 text-mayo-dark/50 text-[11px] sm:text-sm font-bold whitespace-nowrap">Investigación</button>
      </div>

      {/* Content Layout */}
      <div className="grid lg:grid-cols-3 gap-6 sm:gap-24">
        <div className="lg:col-span-2">
          <section className="mb-8 sm:mb-24">
            <h2 className="text-2xl sm:text-4xl font-bold serif-font text-mayo-dark mb-4 pb-2 sm:pb-4 border-b-2 border-slate-100">Panorama general</h2>
            <div className="text-mayo-dark/90 max-w-none space-y-4 sm:space-y-10 leading-relaxed text-lg sm:text-xl">
              <p className="font-semibold text-xl sm:text-3xl text-mayo-blue serif-font italic leading-tight">{result.summary}</p>
              <p>Basado en los síntomas reportados, el sistema de IA ha detectado una correlación significativa con <span className="font-bold underline decoration-mayo-blue decoration-4 underline-offset-4">{result.condition}</span>. Esta condición requiere evaluación física por un profesional.</p>
              <div className="bg-mayo-light p-6 sm:p-10 border-l-[8px] sm:border-l-[12px] border-mayo-blue rounded-r-sm">
                <p className="text-[10px] sm:text-sm font-bold italic text-mayo-blue/80 mb-0 uppercase tracking-widest leading-relaxed">Aviso Médico: Este informe ha sido generado por sistemas de inteligencia artificial de CERM CHECK. Debe ser validado por un reumatólogo colegiado para diagnóstico final.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-4xl font-bold serif-font text-mayo-dark mb-4 sm:mb-12">Personal médico asignado</h2>
            <div className="space-y-4 sm:space-y-10">
              {matchedDoctors.map(doctor => (
                <div key={doctor.id} className="group flex flex-col sm:flex-row bg-white border border-slate-200 hover:border-mayo-blue hover:shadow-2xl transition-all p-4 sm:p-8 rounded-sm">
                  <div className="w-full sm:w-48 h-40 sm:h-48 mb-4 sm:mb-0 grayscale group-hover:grayscale-0 transition-all rounded-sm overflow-hidden border border-slate-100">
                    <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="sm:ml-10 flex-grow flex flex-col justify-center">
                    <h3 className="text-2xl sm:text-3xl font-bold text-mayo-dark mb-1 group-hover:text-mayo-blue serif-font transition-colors">{doctor.name}</h3>
                    <p className="text-[10px] sm:text-sm font-bold text-mayo-slate uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-8">{doctor.specialty}</p>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center text-mayo-blue font-extrabold uppercase text-[10px] sm:text-[12px] tracking-[0.2em] sm:tracking-[0.3em] hover:text-mayo-dark transition-all"
                    >
                      Agendar Cita Ahora →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 sm:space-y-20">
          <div className="bg-mayo-dark text-white p-6 sm:p-12 rounded-sm shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8 serif-font">Próximos Pasos</h3>
            <ul className="space-y-4 sm:space-y-8 text-base sm:text-lg font-light text-white/70">
              <li className="flex items-start">
                <span className="text-mayo-blue mr-3 font-bold text-xl">•</span>
                Documente su nivel de dolor.
              </li>
              <li className="flex items-start">
                <span className="text-mayo-blue mr-3 font-bold text-xl">•</span>
                Prepare su historial médico.
              </li>
              <li className="flex items-start">
                <span className="text-mayo-blue mr-3 font-bold text-xl">•</span>
                Agende teleconsulta.
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-mayo-dark/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl sm:my-8 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden flex flex-col rounded-sm max-h-[98vh]">
            {/* Modal Header */}
            <div className="bg-mayo-blue p-4 sm:p-8 text-white flex justify-between items-start shrink-0">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="w-12 h-12 sm:w-20 sm:h-20 bg-white/20 rounded-full overflow-hidden border-2 border-white/50 shrink-0">
                  <img src={primaryDoctor.imageUrl} alt={primaryDoctor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold serif-font leading-tight">{primaryDoctor.name}</h3>
                  <p className="text-[9px] sm:text-sm uppercase tracking-widest text-white/80">{primaryDoctor.specialty}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Scrollable content */}
            <div className="p-4 sm:p-8 overflow-y-auto">
              <div className="mb-4 flex justify-between items-center">
                <h4 className="text-base sm:text-lg font-bold text-mayo-dark serif-font">Fecha de Consulta</h4>
                <p className="text-[10px] sm:text-sm text-mayo-slate font-bold uppercase tracking-widest">Marzo 2024</p>
              </div>

              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6">
                {weekDays.map(wd => (
                  <div key={wd} className="text-center text-[8px] sm:text-[10px] font-bold text-mayo-slate uppercase py-1 sm:py-2">{wd}</div>
                ))}
                {days.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`
                      aspect-square flex items-center justify-center text-[10px] sm:text-sm font-bold transition-all border
                      ${selectedDay === day 
                        ? 'bg-mayo-blue text-white border-mayo-blue scale-105 z-10' 
                        : 'bg-white text-mayo-dark border-slate-100 hover:border-mayo-blue'}
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Time Slots (Mockup) */}
              <div className="mb-6">
                <h4 className="text-[10px] sm:text-sm font-bold text-mayo-dark uppercase tracking-widest mb-3">Horarios</h4>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {['09:00', '11:30', '16:00'].map(time => (
                    <button key={time} className="py-2 sm:py-3 border border-slate-200 text-[10px] sm:text-xs font-bold text-mayo-dark hover:bg-mayo-blue hover:text-white transition-all">
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <a
                href={getWhatsAppLink(primaryDoctor)}
                className={`
                  w-full py-4 sm:py-5 flex items-center justify-center text-[11px] sm:text-sm font-bold uppercase tracking-[0.2em] transition-all
                  ${selectedDay ? 'bg-mayo-blue text-white shadow-xl' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                `}
              >
                Confirmar Cita
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsCard;
