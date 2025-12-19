
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
        className="mb-6 sm:mb-10 flex items-center text-mayo-slate font-bold uppercase text-[10px] tracking-[0.3em] hover:text-mayo-blue transition-all"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
        Reiniciar Proceso
      </button>

      {/* SECCIÓN 1: EL DIAGNÓSTICO (MÁXIMA RELEVANCIA) */}
      <div className="relative bg-white border border-mayo-border rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-premium mb-8 sm:mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-mayo-blue/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
        
        <div className="p-8 sm:p-24 flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-5 py-2 bg-mayo-surface rounded-full mb-8 border border-mayo-blue/10">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${result.urgency === 'Alta' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-mayo-blue shadow-[0_0_10px_rgba(0,184,164,0.5)]'}`}></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-mayo-dark">Nivel de Urgencia: {result.urgency}</span>
          </div>

          <h1 className="text-5xl sm:text-8xl font-bold serif-font text-mayo-dark tracking-tighter mb-8 leading-[0.95]">
            {result.condition}
          </h1>

          <div className="max-w-3xl">
            <p className="text-xl sm:text-3xl text-mayo-slate leading-relaxed font-medium italic mb-4">
              "{result.summary}"
            </p>
            <p className="text-sm text-mayo-blue font-bold uppercase tracking-widest opacity-60">Análisis Generado por Red Neuronal Clínica</p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: EL ESPECIALISTA (CONVERSIÓN DIRECTA) */}
      <div className="grid md:grid-cols-1 gap-8 mb-12">
        <div className="bg-mayo-dark text-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          <div className="lg:w-2/5 h-80 lg:h-auto overflow-hidden">
            <img 
              src={recommendedDoctor.imageUrl} 
              alt={recommendedDoctor.name} 
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" 
            />
          </div>
          <div className="lg:w-3/5 p-8 sm:p-16 flex flex-col justify-center">
            <div className="mb-4 inline-block">
              <span className="bg-mayo-blue text-mayo-dark px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                Especialista Recomendado
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold serif-font mb-4">{recommendedDoctor.name}</h2>
            <p className="text-mayo-blue font-bold text-sm sm:text-lg uppercase tracking-[0.2em] mb-8 border-l-2 border-mayo-blue pl-4">
              {recommendedDoctor.specialty}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="w-full bg-white text-mayo-dark py-5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-mayo-blue hover:text-white transition-all active:scale-95 shadow-xl"
              >
                Agendar Cita Presencial
              </button>
              <a 
                href={getWhatsAppLink(recommendedDoctor)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full bg-[#25D366] text-white py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-4 hover:bg-[#128C7E] active:scale-95 shadow-lg"
              >
                <svg className="w-10 h-10 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.025 3.284l-.569 2.103 2.141-.548c.95.539 1.966.826 3.171.826 3.182 0 5.768-2.586 5.768-5.766 0-3.18-2.586-5.765-5.768-5.765zm3.379 8.135c-.168.477-.974.877-1.34 1.03-.365.155-.744.15-2.129-.451-1.388-.599-2.281-2.015-2.351-2.112-.07-.097-.567-.754-.567-1.445 0-.691.352-1.031.492-1.171.14-.14.309-.175.407-.175s.196.002.275.006c.084.004.196-.032.307.235.112.267.386.941.421 1.011.035.07.056.154.014.246-.042.091-.063.147-.126.224-.063.077-.133.172-.19.231-.063.063-.129.132-.056.259.073.126.326.538.698.87.479.428.882.561 1.01.63.128.07.202.058.277-.028.075-.086.324-.38.411-.506.088-.127.175-.105.295-.06.121.045.768.363.901.429.134.067.223.1.259.16.035.06.035.348-.133.825z"/></svg>
                Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: METRICAS Y PASOS (DETALLE TÉCNICO AL FINAL) */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-mayo-border p-8 rounded-3xl shadow-sm hover:shadow-premium transition-all">
              <div className="w-10 h-10 bg-mayo-blue/10 rounded-xl flex items-center justify-center text-mayo-blue mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="text-[10px] font-black text-mayo-slate uppercase tracking-widest mb-2">Evaluación</h4>
              <p className="text-base font-bold text-mayo-dark leading-tight">Match Clínico Predictivo</p>
            </div>
            <div className="bg-white border border-mayo-border p-8 rounded-3xl shadow-sm hover:shadow-premium transition-all">
              <div className="w-10 h-10 bg-mayo-blue/10 rounded-xl flex items-center justify-center text-mayo-blue mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h4 className="text-[10px] font-black text-mayo-slate uppercase tracking-widest mb-2">Confianza IA</h4>
              <p className="text-base font-bold text-mayo-dark leading-tight">Análisis de {history.length} Variables</p>
            </div>
            <div className="bg-white border border-mayo-border p-8 rounded-3xl shadow-sm hover:shadow-premium transition-all">
              <div className="w-10 h-10 bg-mayo-blue/10 rounded-xl flex items-center justify-center text-mayo-blue mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h4 className="text-[10px] font-black text-mayo-slate uppercase tracking-widest mb-2">Compatibilidad</h4>
              <p className="text-base font-bold text-mayo-dark leading-tight">Match de Especialidad 100%</p>
            </div>
          </div>
        </div>

        <div className="bg-mayo-surface/50 border border-mayo-blue/20 p-8 rounded-[2rem] flex flex-col justify-center">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-mayo-blue mb-6">Protocolo de Atención</h4>
          <ul className="space-y-5 text-sm font-semibold text-mayo-dark">
            <li className="flex items-start gap-3">
              <span className="bg-mayo-blue text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
              <span>Confirmar cita vía WhatsApp</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-mayo-blue text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
              <span>Presentar reporte IA en consulta</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-mayo-blue text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">3</span>
              <span>Iniciar tratamiento específico</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Booking Modal (Sin cambios funcionales, solo estilo) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-mayo-dark/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-mayo-surface p-10 border-b border-mayo-border flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold text-mayo-dark serif-font mb-2">Agenda tu Consulta</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-mayo-blue">Especialista: {recommendedDoctor.name}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white rounded-full transition-colors shadow-sm">
                <svg className="w-6 h-6 text-mayo-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-10 max-h-[70vh] overflow-y-auto custom-scroll">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <div className="flex items-center justify-between mb-6 gap-2">
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="bg-white border border-mayo-border rounded-xl px-4 py-3 text-xs font-bold flex-grow shadow-sm focus:outline-none focus:border-mayo-blue">
                      {monthNames.map((name, i) => <option key={i} value={i}>{name}</option>)}
                    </select>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="bg-white border border-mayo-border rounded-xl px-4 py-3 text-xs font-bold shadow-sm focus:outline-none focus:border-mayo-blue">
                      {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {weekDays.map(wd => <div key={wd} className="text-center text-[9px] font-black text-slate-400 uppercase py-2">{wd}</div>)}
                    {Array.from({ length: calendarData.firstDayOfMonth }).map((_, i) => <div key={`e-${i}`}></div>)}
                    {Array.from({ length: calendarData.daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      return (
                        <button key={day} onClick={() => setSelectedDay(day)} className={`aspect-square flex items-center justify-center text-xs font-bold rounded-xl transition-all ${selectedDay === day ? 'bg-mayo-blue text-white shadow-premium' : 'hover:bg-mayo-surface text-mayo-dark'}`}>
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-mayo-slate mb-6">Horarios Disponibles</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map(time => (
                      <button key={time} onClick={() => setSelectedTime(time)} className={`p-4 text-sm font-bold rounded-2xl border transition-all ${selectedTime === time ? 'bg-mayo-dark text-white shadow-lg' : 'bg-white border-mayo-border hover:border-mayo-blue text-mayo-dark'}`}>
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-mayo-border">
                <a
                  href={getWhatsAppLink(recommendedDoctor)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-6 flex items-center justify-center text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl gap-4 ${selectedDay && selectedTime ? 'bg-[#25D366] text-white shadow-premium hover:bg-[#128C7E] active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                  onClick={(e) => (!selectedDay || !selectedTime) && e.preventDefault()}
                >
                  <svg className="w-12 h-12 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.025 3.284l-.569 2.103 2.141-.548c.95.539 1.966.826 3.171.826 3.182 0 5.768-2.586 5.768-5.766 0-3.18-2.586-5.765-5.768-5.765zm3.379 8.135c-.168.477-.974.877-1.34 1.03-.365.155-.744.15-2.129-.451-1.388-.599-2.281-2.015-2.351-2.112-.07-.097-.567-.754-.567-1.445 0-.691.352-1.031.492-1.171.14-.14.309-.175.407-.175s.196.002.275.006c.084.004.196-.032.307.235.112.267.386.941.421 1.011.035.07.056.154.014.246-.042.091-.063.147-.126.224-.063.077-.133.172-.19.231-.063.063-.129.132-.056.259.073.126.326.538.698.87.479.428.882.561 1.01.63.128.07.202.058.277-.028.075-.086.324-.38.411-.506.088-.127.175-.105.295-.06.121.045.768.363.901.429.134.067.223.1.259.16.035.06.035.348-.133.825z"/></svg>
                  Confirmar y Enviar a Especialista
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
