
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
        className="mb-6 sm:mb-10 flex items-center text-cerm-slate font-bold uppercase text-[10px] tracking-[0.3em] hover:text-cerm-green transition-all"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
        Reiniciar Proceso
      </button>

      {/* SECCIÓN 1: EL DIAGNÓSTICO (MÁXIMA RELEVANCIA) */}
      <div className="relative bg-white border border-cerm-border rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-premium mb-8 sm:mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cerm-green/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
        
        <div className="p-8 sm:p-24 flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-5 py-2 bg-cerm-surface rounded-full mb-8 border border-cerm-green/10">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${result.urgency === 'Alta' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-cerm-green shadow-[0_0_10px_rgba(0,184,164,0.5)]'}`}></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cerm-dark">Nivel de Urgencia: {result.urgency}</span>
          </div>

          <h1 className="text-5xl sm:text-8xl font-bold serif-font text-cerm-dark tracking-tighter mb-8 leading-[0.95]">
            {result.condition}
          </h1>

          <div className="max-w-3xl">
            <p className="text-xl sm:text-3xl text-cerm-slate leading-relaxed font-medium italic mb-4">
              "{result.summary}"
            </p>
            <p className="text-sm text-cerm-green font-bold uppercase tracking-widest opacity-60">Análisis Generado por Red Neuronal Clínica</p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: EL ESPECIALISTA (CONVERSIÓN DIRECTA) */}
      <div className="grid md:grid-cols-1 gap-8 mb-12">
        <div className="bg-cerm-dark text-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          <div className="lg:w-2/5 h-80 lg:h-auto overflow-hidden">
            <img 
              src={recommendedDoctor.imageUrl} 
              alt={recommendedDoctor.name} 
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" 
            />
          </div>
          <div className="lg:w-3/5 p-8 sm:p-16 flex flex-col justify-center">
            <div className="mb-4 inline-block">
              <span className="bg-cerm-green text-cerm-dark px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                Especialista Recomendado
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold serif-font mb-4">{recommendedDoctor.name}</h2>
            <p className="text-cerm-green font-bold text-sm sm:text-lg uppercase tracking-[0.2em] mb-8 border-l-2 border-cerm-green pl-4">
              {recommendedDoctor.specialty}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="w-full bg-white text-cerm-dark py-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-cerm-green hover:text-white transition-all active:scale-95 shadow-xl"
              >
                Agendar Cita Presencial
              </button>
              <a 
                href={getWhatsAppLink(recommendedDoctor)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full bg-[#25D366] text-white py-4 rounded-2xl transition-all flex items-center justify-center gap-4 hover:bg-[#128C7E] active:scale-95 shadow-lg group"
              >
                <svg className="h-10 w-10 flex-shrink-0" fill="white" viewBox="0 0 448 512">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.3 106.2 27.3 122.4 0 222-99.6 222-222 0-59.3-23.2-115-65.1-157.3zM223.9 446.3c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 365.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 54 81.2 54 130.5 0 101.7-82.8 184.7-184.6 184.7zm100.6-137.4c-5.5-2.8-32.6-16.1-37.7-17.9-5.1-1.8-8.8-2.8-12.4 2.8-3.7 5.5-14.3 17.9-17.5 21.5-3.2 3.7-6.5 4.1-12 1.4-5.5-2.8-23.2-8.5-44.2-27.2-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.5-.3-8.5 2.5-11.2 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.5-9.2 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.4-29.9-17-41.1-4.5-10.9-9.1-9.4-12.4-9.6-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.7 6.9-5 5.5-19.3 18.8-19.3 45.9 0 27.1 19.7 53.3 22.6 57 2.8 3.7 38.8 59.2 94 83 13.1 5.6 23.4 9 31.4 11.6 13.2 4.2 25.2 3.6 34.8 2.2 10.7-1.6 32.6-13.3 37.2-26.2 4.6-12.8 4.6-23.9 3.2-26.2-1.4-2.2-5-3.6-10.5-6.4z"/>
                </svg>
                <span className="text-xl sm:text-2xl font-bold tracking-tight">Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: METRICAS Y PASOS (DETALLE TÉCNICO AL FINAL) */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-cerm-border p-8 rounded-3xl shadow-sm hover:shadow-premium transition-all">
              <div className="w-10 h-10 bg-cerm-green/10 rounded-xl flex items-center justify-center text-cerm-green mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="text-[10px] font-black text-cerm-slate uppercase tracking-widest mb-2">Evaluación</h4>
              <p className="text-base font-bold text-cerm-dark leading-tight">Match Clínico Predictivo</p>
            </div>
            <div className="bg-white border border-cerm-border p-8 rounded-3xl shadow-sm hover:shadow-premium transition-all">
              <div className="w-10 h-10 bg-cerm-green/10 rounded-xl flex items-center justify-center text-cerm-green mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h4 className="text-[10px] font-black text-cerm-slate uppercase tracking-widest mb-2">Confianza IA</h4>
              <p className="text-base font-bold text-cerm-dark leading-tight">Análisis de {history.length} Variables</p>
            </div>
            <div className="bg-white border border-cerm-border p-8 rounded-3xl shadow-sm hover:shadow-premium transition-all">
              <div className="w-10 h-10 bg-cerm-green/10 rounded-xl flex items-center justify-center text-cerm-green mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h4 className="text-[10px] font-black text-cerm-slate uppercase tracking-widest mb-2">Compatibilidad</h4>
              <p className="text-base font-bold text-cerm-dark leading-tight">Match de Especialidad 100%</p>
            </div>
          </div>
        </div>

        <div className="bg-cerm-surface/50 border border-cerm-green/20 p-8 rounded-[2rem] flex flex-col justify-center">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cerm-green mb-6">Protocolo de Atención</h4>
          <ul className="space-y-5 text-sm font-semibold text-cerm-dark">
            <li className="flex items-start gap-3">
              <span className="bg-cerm-green text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
              <span>Confirmar cita vía WhatsApp</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-cerm-green text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
              <span>Presentar reporte IA en consulta</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-cerm-green text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">3</span>
              <span>Iniciar tratamiento específico</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-cerm-dark/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-cerm-surface p-10 border-b border-cerm-border flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold text-cerm-dark serif-font mb-2">Agenda tu Consulta</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-cerm-green">Especialista: {recommendedDoctor.name}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white rounded-full transition-colors shadow-sm">
                <svg className="w-6 h-6 text-cerm-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-10 max-h-[70vh] overflow-y-auto custom-scroll">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <div className="flex items-center justify-between mb-6 gap-2">
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="bg-white border border-cerm-border rounded-xl px-4 py-3 text-xs font-bold flex-grow shadow-sm focus:outline-none focus:border-cerm-green">
                      {monthNames.map((name, i) => <option key={i} value={i}>{name}</option>)}
                    </select>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="bg-white border border-cerm-border rounded-xl px-4 py-3 text-xs font-bold shadow-sm focus:outline-none focus:border-cerm-green">
                      {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {weekDays.map(wd => <div key={wd} className="text-center text-[9px] font-black text-slate-400 uppercase py-2">{wd}</div>)}
                    {Array.from({ length: calendarData.firstDayOfMonth }).map((_, i) => <div key={`e-${i}`}></div>)}
                    {Array.from({ length: calendarData.daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      return (
                        <button key={day} onClick={() => setSelectedDay(day)} className={`aspect-square flex items-center justify-center text-xs font-bold rounded-xl transition-all ${selectedDay === day ? 'bg-cerm-green text-white shadow-premium' : 'hover:bg-cerm-surface text-cerm-dark'}`}>
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cerm-slate mb-6">Horarios Disponibles</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map(time => (
                      <button key={time} onClick={() => setSelectedTime(time)} className={`p-4 text-sm font-bold rounded-2xl border transition-all ${selectedTime === time ? 'bg-cerm-dark text-white shadow-lg' : 'bg-white border-cerm-border hover:border-cerm-green text-cerm-dark'}`}>
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-cerm-border">
                <a
                  href={getWhatsAppLink(recommendedDoctor)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-5 flex items-center justify-center text-white rounded-2xl transition-all shadow-xl gap-4 ${selectedDay && selectedTime ? 'bg-[#25D366] shadow-premium hover:bg-[#128C7E] active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                  onClick={(e) => (!selectedDay || !selectedTime) && e.preventDefault()}
                >
                  <svg className="h-12 w-12 flex-shrink-0" fill="white" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.3 106.2 27.3 122.4 0 222-99.6 222-222 0-59.3-23.2-115-65.1-157.3zM223.9 446.3c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 365.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 54 81.2 54 130.5 0 101.7-82.8 184.7-184.6 184.7zm100.6-137.4c-5.5-2.8-32.6-16.1-37.7-17.9-5.1-1.8-8.8-2.8-12.4 2.8-3.7 5.5-14.3 17.9-17.5 21.5-3.2 3.7-6.5 4.1-12 1.4-5.5-2.8-23.2-8.5-44.2-27.2-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.5-.3-8.5 2.5-11.2 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.5-9.2 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.4-29.9-17-41.1-4.5-10.9-9.1-9.4-12.4-9.6-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.7 6.9-5 5.5-19.3 18.8-19.3 45.9 0 27.1 19.7 53.3 22.6 57 2.8 3.7 38.8 59.2 94 83 13.1 5.6 23.4 9 31.4 11.6 13.2 4.2 25.2 3.6 34.8 2.2 10.7-1.6 32.6-13.3 37.2-26.2 4.6-12.8 4.6-23.9 3.2-26.2-1.4-2.2-5-3.6-10.5-6.4z"/>
                  </svg>
                  <span className="text-xl sm:text-2xl font-bold tracking-tight">Chat on WhatsApp</span>
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
