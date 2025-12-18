
import React, { useState } from 'react';
import { Disease, Doctor } from '../types';
import { toastService } from '../services/toastService';

interface AdminPanelProps {
  diseases: Disease[];
  doctors: Doctor[];
  onUpdateDiseases: (diseases: Disease[]) => void;
  onUpdateDoctors: (doctors: Doctor[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ diseases, doctors, onUpdateDiseases, onUpdateDoctors }) => {
  const [activeTab, setActiveTab] = useState<'diseases' | 'doctors'>('diseases');

  const addDisease = () => {
    const name = prompt("Nombre de la enfermedad:");
    if (!name) return;
    const newDisease: Disease = {
      id: Date.now().toString(),
      name,
      description: "Descripción diagnóstica",
      symptoms: [],
      urgency: 'Media'
    };
    onUpdateDiseases([...diseases, newDisease]);
    toastService.success("Enfermedad añadida correctamente.");
  };

  const addDoctor = () => {
    const name = prompt("Nombre del facultativo:");
    if (!name) return;
    const newDoctor: Doctor = {
      id: Date.now().toString(),
      name,
      specialty: "Médico Especialista",
      imageUrl: "https://picsum.photos/seed/newdoc/400/400",
      phone: "0000000000",
      tags: []
    };
    onUpdateDoctors([...doctors, newDoctor]);
    toastService.success("Doctor añadido al directorio.");
  };

  const deleteItem = (id: string, type: 'disease' | 'doctor') => {
    if (confirm(`¿Confirma que desea eliminar este registro de ${type === 'disease' ? 'enfermedad' : 'doctor'}?`)) {
      if (type === 'disease') onUpdateDiseases(diseases.filter(d => d.id !== id));
      else onUpdateDoctors(doctors.filter(d => d.id !== id));
      toastService.info("Registro eliminado.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-16">
      <div className="mb-4 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-mayo-blue uppercase tracking-tight">Administración</h2>
        <div className="h-1 w-16 sm:w-24 bg-mayo-accent mt-1 sm:mt-2"></div>
      </div>

      <div className="flex border-b border-slate-200 mb-4 sm:mb-8 overflow-x-auto -mx-4 px-4 scrollbar-hide">
        <button 
          onClick={() => setActiveTab('diseases')}
          className={`px-4 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-sm font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${activeTab === 'diseases' ? 'border-mayo-blue text-mayo-blue bg-mayo-light' : 'border-transparent text-mayo-slate'}`}
        >
          Conocimientos
        </button>
        <button 
          onClick={() => setActiveTab('doctors')}
          className={`px-4 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-sm font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${activeTab === 'doctors' ? 'border-mayo-blue text-mayo-blue bg-mayo-light' : 'border-transparent text-mayo-slate'}`}
        >
          Directorio
        </button>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-sm">
        <div className="p-4 sm:p-6 bg-[#fcfcfc] border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
          <h3 className="font-bold text-mayo-blue uppercase text-[11px] sm:text-sm tracking-widest">
            {activeTab === 'diseases' ? 'Patologías' : 'Sanitarios'}
          </h3>
          <button 
            onClick={activeTab === 'diseases' ? addDisease : addDoctor} 
            className="w-full sm:w-auto bg-mayo-blue text-white px-5 py-2 rounded-sm text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-mayo-dark shadow-sm transition-colors"
          >
            {activeTab === 'diseases' ? '+ Patología' : '+ Doctor'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px] sm:min-w-0">
            <thead className="bg-[#f7f8f9] text-mayo-slate text-[9px] sm:text-[11px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-4 sm:px-8 py-3 sm:py-4">{activeTab === 'diseases' ? 'Nombre' : 'Facultativo'}</th>
                <th className="px-4 sm:px-8 py-3 sm:py-4">{activeTab === 'diseases' ? 'Urgencia' : 'Especialidad'}</th>
                <th className="px-4 sm:px-8 py-3 sm:py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeTab === 'diseases' ? diseases.map(d => (
                <tr key={d.id} className="hover:bg-mayo-light/30 transition-colors">
                  <td className="px-4 sm:px-8 py-3 font-semibold text-slate-800 text-sm sm:text-base">{d.name}</td>
                  <td className="px-4 sm:px-8 py-3">
                    <span className={`px-2 py-0.5 text-[8px] sm:text-[10px] font-bold uppercase rounded-sm ${d.urgency === 'Alta' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {d.urgency}
                    </span>
                  </td>
                  <td className="px-4 sm:px-8 py-3 text-right">
                    <button onClick={() => deleteItem(d.id, 'disease')} className="text-red-600 hover:text-red-800 text-[10px] sm:text-xs font-bold uppercase underline">Eliminar</button>
                  </td>
                </tr>
              )) : doctors.map(doc => (
                <tr key={doc.id} className="hover:bg-mayo-light/30 transition-colors">
                  <td className="px-4 sm:px-8 py-3 flex items-center space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 rounded-sm overflow-hidden border border-slate-200 shrink-0">
                      <img src={doc.imageUrl} className="w-full h-full object-cover" alt="" />
                    </div>
                    <span className="font-semibold text-slate-800 text-sm sm:text-base truncate">{doc.name}</span>
                  </td>
                  <td className="px-4 sm:px-8 py-3 text-mayo-slate text-[10px] sm:text-sm font-medium">{doc.specialty}</td>
                  <td className="px-4 sm:px-8 py-3 text-right">
                    <button onClick={() => deleteItem(doc.id, 'doctor')} className="text-red-600 hover:text-red-800 text-[10px] sm:text-xs font-bold uppercase underline">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
