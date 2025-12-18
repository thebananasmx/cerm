
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
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
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
    const detail = selectedDay && selectedTime ? ` para el día ${selectedDay} a las ${selectedTime}` : "";
    const message = encodeURIComponent(`Hola, solicito cita${detail} tras mi evaluación IA: ${result.condition}.`);
    return `https://wa.me/${doctor.phone}?text=${message}`;
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const timeSlots = ['09:00', '10:30', '12:00', '15:30', '17:00'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <button 
        onClick={onRetry}
        className="mb-6 sm:mb-10 flex items-center text-mayo-slate font-bold uppercase text-[10px] tracking-[0.3em] hover:text-mayo-blue transition-all"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
        Reiniciar Proceso
      </button>

      {/* Main Result Card */}
      <div className="bg-white border border-mayo-border rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-glass mb-8 sm:mb-12">
        <div className="p-6 sm:p-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-mayo-surface rounded-full mb-6 sm:mb-8">
            <span className={`w-2 h-2 rounded-full ${result.urgency === 'Alta' ? 'bg-red-500' : 'bg-mayo-blue'}`}></span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-mayo-dark">Prioridad {result.urgency}</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-bold serif-font text-mayo-dark tracking-tighter mb-6 sm:mb-8 leading-[1.1]">
            {result.condition}
          </h1>

          <p className="text-lg sm:text-2xl text-mayo-slate max-w-3xl leading-relaxed italic">
            "{result.summary}"
          </p>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-mayo-border to-transparent my-8 sm:my-12"></div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full text-left">
            <div className="bg-mayo-surface/30 p-4 sm:bg-transparent sm:p-0 rounded-xl">
              <h4 className="text-[9px] sm:text-[10px] font-bold text-mayo-blue uppercase tracking-widest mb-1 sm:mb-2">Evaluación</h4>
              <p className="text-sm font-semibold text-mayo-dark">Algoritmo Médico v2.5</p>
            </div>
            <div className="bg-mayo-surface/30 p-4 sm:bg-transparent sm:p-0 rounded-xl">
              <h4 className="text-[9px] sm:text-[10px] font-bold text-mayo-blue uppercase tracking-widest mb-1 sm:mb-2">Confianza</h4>
              <p className="text-sm font-semibold text-mayo-dark">Alta Precisión Basada en Datos</p>
            </div>
            <div className="bg-mayo-surface/30 p-4 sm:bg-transparent sm:p-0 rounded-xl">
              <h4 className="text-[9px] sm:text-[10px] font-bold text-mayo-blue uppercase tracking-widest mb-1 sm:mb-2">Estado</h4>
              <p className="text-sm font-semibold text-mayo-dark">Requiere Validación</p>
            </div>
          </div>
        </div>
      </div>

      {/* Specialist Recommendation */}
      <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
        <div className="md:col-span-2 glass-effect p-6 sm:p-12 rounded-[1.5rem] sm:rounded-[2rem] shadow-glass flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <div className="w-28 h-28 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-premium flex-shrink-0">
            <img src={recommendedDoctor.imageUrl} alt={recommendedDoctor.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-mayo-dark serif-font mb-1">{recommendedDoctor.name}</h3>
            <p className="text-mayo-blue font-bold text-[11px] sm:text-sm uppercase tracking-widest mb-6">{recommendedDoctor.specialty}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setIsModalOpen(true)} className="mayo-btn-pill w-full sm:w-auto bg-mayo-dark text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-mayo-blue transition-all">
                Agendar Cita
              </button>
              <a 
                href={getWhatsAppLink(recommendedDoctor)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mayo-btn-pill w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="bg-mayo-dark text-white p-8 sm:p-12 rounded-[1.5rem] sm:rounded-[2rem] shadow-premium flex flex-col justify-center">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-mayo-blue mb-6">Próximos Pasos</h4>
          <ul className="space-y-4 text-sm font-medium text-mayo-light/70">
            <li className="flex items-start gap-3">
              <span className="text-mayo-blue font-bold">01.</span> Agendar con el especialista recomendado.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-mayo-blue font-bold">02.</span> Recolectar análisis clínicos previos.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-mayo-blue font-bold">03.</span> Monitorear intensidad del dolor.
            </li>
          </ul>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-mayo-dark/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-mayo-surface p-6 sm:p-10 border-b border-mayo-border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-mayo-dark serif-font mb-2">Agendar Consulta</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-mayo-blue">Seleccione fecha y hora</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                  <svg className="w-6 h-6 text-mayo-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-10 max-h-[70vh] overflow-y-auto custom-scroll">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                {/* Calendar Side */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-mayo-slate mb-4">Marzo 2024</h4>
                  <div className="grid grid-cols-7 gap-1">
                    {weekDays.map(wd => (
                      <div key={wd} className="text-center text-[8px] font-bold text-slate-400 uppercase py-2">{wd}</div>
                    ))}
                    {days.map(day => (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`
                          aspect-square flex items-center justify-center text-xs font-bold rounded-xl transition-all
                          ${selectedDay === day 
                            ? 'bg-mayo-blue text-white shadow-premium scale-110' 
                            : 'hover:bg-mayo-surface text-mayo-dark'}
                        `}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slot Side */}
                <div className="flex flex-col">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-mayo-slate mb-4">Horarios Disponibles</h4>
                  <div className="space-y-2 flex-grow">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`
                          w-full p-4 text-sm font-bold rounded-2xl border transition-all flex items-center justify-between
                          ${selectedTime === time 
                            ? 'bg-mayo-dark text-white border-mayo-dark' 
                            : 'bg-white border-mayo-border text-mayo-dark hover:border-mayo-blue'}
                        `}
                      >
                        <span>{time}</span>
                        {selectedTime === time && (
                          <svg className="w-4 h-4 text-mayo-blue" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <div className="mt-8 pt-6 border-t border-mayo-border">
                <a
                  href={getWhatsAppLink(recommendedDoctor)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    w-full py-5 flex items-center justify-center text-sm font-bold uppercase tracking-[0.2em] rounded-2xl transition-all gap-3
                    ${selectedDay && selectedTime 
                      ? 'bg-[#25D366] text-white shadow-premium cursor-pointer hover:-translate-y-1' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                  `}
                  onClick={(e) => (!selectedDay || !selectedTime) && e.preventDefault()}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Confirmar vía WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsCard;
