
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
            className="flex items-center text-mayo-slate font-bold uppercase text-[10px] tracking-[0.3em] hover:text-mayo-blue transition-all mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </button>
          <h2 className="text-3xl sm:text-5xl font-bold text-mayo-dark serif-font tracking-tight">Especialistas Elite</h2>
          <p className="text-mayo-slate text-sm sm:text-lg mt-2 font-medium">Red médica de alta especialización en reumatología.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-mayo-border">
            <p className="text-mayo-slate font-bold uppercase tracking-widest text-xs">No hay especialistas registrados actualmente.</p>
          </div>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor.id} className="group bg-white border border-mayo-border rounded-[2.5rem] overflow-hidden shadow-glass hover:shadow-premium transition-all duration-500">
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <img 
                  src={doctor.imageUrl} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mayo-dark/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                <div className="absolute bottom-6 left-8 right-8">
                  <span className="bg-mayo-blue text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                    Disponible hoy
                  </span>
                </div>
              </div>
              
              <div className="p-8 sm:p-10">
                <h3 className="text-2xl font-bold text-mayo-dark serif-font mb-2">{doctor.name}</h3>
                <p className="text-mayo-blue font-bold text-xs uppercase tracking-widest mb-6 h-10 line-clamp-2">
                  {doctor.specialty}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {doctor.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="bg-mayo-surface text-mayo-accent px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wide border border-mayo-blue/10">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-3">
                  <a 
                    href={getWhatsAppLink(doctor)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-4 w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                  >
                    <svg className="w-8 h-8 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.025 3.284l-.569 2.103 2.141-.548c.95.539 1.966.826 3.171.826 3.182 0 5.768-2.586 5.768-5.766 0-3.18-2.586-5.765-5.768-5.765zm3.379 8.135c-.168.477-.974.877-1.34 1.03-.365.155-.744.15-2.129-.451-1.388-.599-2.281-2.015-2.351-2.112-.07-.097-.567-.754-.567-1.445 0-.691.352-1.031.492-1.171.14-.14.309-.175.407-.175s.196.002.275.006c.084.004.196-.032.307.235.112.267.386.941.421 1.011.035.07.056.154.014.246-.042.091-.063.147-.126.224-.063.077-.133.172-.19.231-.063.063-.129.132-.056.259.073.126.326.538.698.87.479.428.882.561 1.01.63.128.07.202.058.277-.028.075-.086.324-.38.411-.506.088-.127.175-.105.295-.06.121.045.768.363.901.429.134.067.223.1.259.16.035.06.035.348-.133.825z" />
                    </svg>
                    Contactar por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-20 p-12 bg-mayo-dark rounded-[3rem] text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-mayo-blue/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]"></div>
        <h4 className="text-2xl sm:text-3xl font-bold serif-font mb-4 italic">¿No sabes con quién agendar?</h4>
        <p className="text-white/60 mb-8 max-w-xl mx-auto">Nuestra inteligencia artificial puede sugerirte al especialista más compatible según tus síntomas específicos.</p>
        <button 
          onClick={onBack}
          className="bg-mayo-blue text-mayo-dark px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
        >
          Hacer Evaluación Gratuita
        </button>
      </div>
    </div>
  );
};

export default DoctorsList;
