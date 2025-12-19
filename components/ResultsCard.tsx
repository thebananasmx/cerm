
import React, { useState, useEffect, useMemo } from 'react';
import { TriageResult, Doctor, Message } from '../types';
import { findBestDoctor } from '../services/diagnosticService';

interface ResultsCardProps {
  result: TriageResult;
  history: Message[];
  doctors: Doctor[];
  onRetry: () => void;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ result, history, doctors, onRetry }) => {
  const now = new Date();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(now.getDate());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear + 1];
  }, []);

  const calendarData = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  }, [selectedMonth, selectedYear]);

  // RECOMENDACIÓN DINÁMICA DE DOCTOR
  const recommendedDoctor = useMemo(() => {
    const best = findBestDoctor(history, doctors, result.condition);
    return best || {
      id: 'default-doc',
      name: "Especialista Reumatólogo",
      specialty: "Inmunología Clínica",
      imageUrl: "https://via.placeholder.com/400",
      phone: "5215550000000",
      tags: [],
      keywords: []
    } as Doctor;
  }, [history, doctors, result.condition]);

  const getWhatsAppLink = (doctor: Doctor) => {
    const dateStr = `${selectedDay}/${selectedMonth + 1}/${selectedYear}`;
    const detail = selectedTime ? ` para el día ${dateStr} a las ${selectedTime}` : ` para el día ${dateStr}`;
    const message = encodeURIComponent(`Hola ${doctor.name}, solicito cita${detail} tras mi evaluación IA: ${result.condition}.`);
    return `https://wa.me/${doctor.phone}?text=${message}`;
  };

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
            <div className="bg-mayo-surface/30 p-4 rounded-xl">
              <h4 className="text-[9px] font-bold text-mayo-blue uppercase tracking-widest mb-1">Evaluación</h4>
              <p className="text-sm font-semibold text-mayo-dark">Algoritmo Medical IA</p>
            </div>
            <div className="bg-mayo-surface/30 p-4 rounded-xl">
              <h4 className="text-[9px] font-bold text-mayo-blue uppercase tracking-widest mb-1">Confianza</h4>
              <p className="text-sm font-semibold text-mayo-dark">Análisis Basado en {history.length} inputs</p>
            </div>
            <div className="bg-mayo-surface/30 p-4 rounded-xl">
              <h4 className="text-[9px] font-bold text-mayo-blue uppercase tracking-widest mb-1">Compatibilidad</h4>
              <p className="text-sm font-semibold text-mayo-dark">Especialista Recomendado</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
        <div className="md:col-span-2 glass-effect p-6 sm:p-12 rounded-[1.5rem] sm:rounded-[2rem] shadow-glass flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <div className="w-28 h-28 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-premium flex-shrink-0">
            <img src={recommendedDoctor.imageUrl} alt={recommendedDoctor.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-grow text-center sm:text-left">
            <div className="mb-2 bg-mayo-blue/10 text-mayo-accent px-3 py-1 rounded-full text-[8px] font-black uppercase inline-block">Sugerido por Compatibilidad Clínica</div>
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
                className="mayo-btn-pill w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="bg-mayo-dark text-white p-8 rounded-[1.5rem] shadow-premium flex flex-col justify-center">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-mayo-blue mb-6">Próximos Pasos</h4>
          <ul className="space-y-4 text-sm font-medium text-mayo-light/70">
            <li className="flex items-start gap-3">
              <span className="text-mayo-blue font-bold">01.</span> Agendar con {recommendedDoctor.name.split(' ')[1]}.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-mayo-blue font-bold">02.</span> Reportar el cuadro clínico de "{result.condition}".
            </li>
            <li className="flex items-start gap-3">
              <span className="text-mayo-blue font-bold">03.</span> Preparar historial de dolor.
            </li>
          </ul>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-mayo-dark/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-mayo-surface p-8 border-b border-mayo-border flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-mayo-dark serif-font mb-1">Cita con Especialista</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-mayo-blue">Disponibilidad para {recommendedDoctor.name}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                <svg className="w-6 h-6 text-mayo-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center justify-between mb-6 gap-2">
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="bg-white border border-mayo-border rounded-xl px-3 py-2 text-xs font-bold flex-grow">
                      {monthNames.map((name, i) => <option key={i} value={i}>{name}</option>)}
                    </select>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="bg-white border border-mayo-border rounded-xl px-3 py-2 text-xs font-bold">
                      {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {weekDays.map(wd => <div key={wd} className="text-center text-[8px] font-bold text-slate-400 uppercase py-2">{wd}</div>)}
                    {Array.from({ length: calendarData.firstDayOfMonth }).map((_, i) => <div key={`e-${i}`}></div>)}
                    {Array.from({ length: calendarData.daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      return (
                        <button key={day} onClick={() => setSelectedDay(day)} className={`aspect-square flex items-center justify-center text-xs font-bold rounded-xl ${selectedDay === day ? 'bg-mayo-blue text-white' : 'hover:bg-mayo-surface'}`}>
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-mayo-slate mb-4">Seleccione Horario</h4>
                  <div className="space-y-2">
                    {timeSlots.map(time => (
                      <button key={time} onClick={() => setSelectedTime(time)} className={`w-full p-4 text-sm font-bold rounded-2xl border transition-all ${selectedTime === time ? 'bg-mayo-dark text-white' : 'bg-white hover:border-mayo-blue'}`}>
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-mayo-border">
                <a
                  href={getWhatsAppLink(recommendedDoctor)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-5 flex items-center justify-center text-sm font-bold uppercase tracking-[0.2em] rounded-2xl transition-all ${selectedDay && selectedTime ? 'bg-[#25D366] text-white shadow-premium' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                  onClick={(e) => (!selectedDay || !selectedTime) && e.preventDefault()}
                >
                  Confirmar cita por WhatsApp
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
