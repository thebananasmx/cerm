
import React from 'react';
import { Doctor } from '../types';

interface DoctorsListProps {
  doctors: Doctor[];
  onBack: () => void;
}

const DoctorsList: React.FC<DoctorsListProps> = ({ doctors, onBack }) => {
  const getWhatsAppLink = (doctor: Doctor) => {
    const message = encodeURIComponent(`Hola ${doctor.name}, vengo desde CERM CHECK y me gustaría agendar una consulta de especialidad.`);
    return `https://wa.me/${doctor.phone}?text=${message}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center text-cerm-slate font-bold uppercase text-[10px] tracking-[0.3em] hover:text-cerm-green transition-all mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </button>
          <h2 className="text-3xl sm:text-5xl font-bold text-cerm-dark serif-font tracking-tight">Especialistas Elite</h2>
          <p className="text-cerm-slate text-sm sm:text-lg mt-2 font-medium">Red médica de alta especialización en reumatología.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-cerm-border">
            <p className="text-cerm-slate font-bold uppercase tracking-widest text-xs">No hay especialistas registrados actualmente.</p>
          </div>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor.id} className="group bg-white border border-cerm-border rounded-[2.5rem] overflow-hidden shadow-glass hover:shadow-premium transition-all duration-500">
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <img 
                  src={doctor.imageUrl} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cerm-dark/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                <div className="absolute bottom-6 left-8 right-8">
                  <span className="bg-cerm-green text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                    Disponible hoy
                  </span>
                </div>
              </div>
              
              <div className="p-8 sm:p-10">
                <h3 className="text-2xl font-bold text-cerm-dark serif-font mb-2">{doctor.name}</h3>
                <p className="text-cerm-green font-bold text-xs uppercase tracking-widest mb-6 h-10 line-clamp-2">
                  {doctor.specialty}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {doctor.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="bg-cerm-surface text-cerm-accent px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wide border border-cerm-green/10">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-3">
                  <a 
                    href={getWhatsAppLink(doctor)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-4 w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-2xl transition-all shadow-lg active:scale-95 group"
                  >
                    <svg className="h-8 w-8 flex-shrink-0" fill="white" viewBox="0 0 448 512">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.3 106.2 27.3 122.4 0 222-99.6 222-222 0-59.3-23.2-115-65.1-157.3zM223.9 446.3c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 365.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 54 81.2 54 130.5 0 101.7-82.8 184.7-184.6 184.7zm100.6-137.4c-5.5-2.8-32.6-16.1-37.7-17.9-5.1-1.8-8.8-2.8-12.4 2.8-3.7 5.5-14.3 17.9-17.5 21.5-3.2 3.7-6.5 4.1-12 1.4-5.5-2.8-23.2-8.5-44.2-27.2-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.5-.3-8.5 2.5-11.2 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.5-9.2 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.4-29.9-17-41.1-4.5-10.9-9.1-9.4-12.4-9.6-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.7 6.9-5 5.5-19.3 18.8-19.3 45.9 0 27.1 19.7 53.3 22.6 57 2.8 3.7 38.8 59.2 94 83 13.1 5.6 23.4 9 31.4 11.6 13.2 4.2 25.2 3.6 34.8 2.2 10.7-1.6 32.6-13.3 37.2-26.2 4.6-12.8 4.6-23.9 3.2-26.2-1.4-2.2-5-3.6-10.5-6.4z"/>
                    </svg>
                    <span className="text-lg font-bold tracking-tight">Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-20 p-12 bg-cerm-dark rounded-[3rem] text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cerm-green/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]"></div>
        <h4 className="text-2xl sm:text-3xl font-bold serif-font mb-4 italic">¿No sabes con quién agendar?</h4>
        <p className="text-white/60 mb-8 max-w-xl mx-auto">Nuestra inteligencia artificial puede sugerirte al especialista más compatible según tus síntomas específicos.</p>
        <button 
          onClick={onBack}
          className="bg-cerm-green text-cerm-dark px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
        >
          Hacer Evaluación Gratuita
        </button>
      </div>
    </div>
  );
};

export default DoctorsList;
