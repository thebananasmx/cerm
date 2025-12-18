
import React, { useState } from 'react';
import { Disease, Doctor } from '../types';
import { toastService } from '../services/toastService';
import { firestoreService } from '../services/firebase';

interface AdminPanelProps {
  diseases: Disease[];
  doctors: Doctor[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ diseases, doctors }) => {
  const [activeTab, setActiveTab] = useState<'diseases' | 'doctors'>('diseases');

  const addDisease = async () => {
    const name = prompt("Nombre de la patología:");
    if (!name) return;
    try {
      await firestoreService.saveItem("diseases", {
        name,
        description: "Evaluación automática por árbol de decisión.",
        urgency: "Alta",
        symptoms: []
      });
      toastService.success("Sincronizado con la nube.");
    } catch (e) { toastService.error("Error al conectar con Firebase."); }
  };

  const addDoctor = async () => {
    const name = prompt("Nombre del Especialista:");
    if (!name) return;
    try {
      await firestoreService.saveItem("doctors", {
        name,
        specialty: "Reumatología Avanzada",
        imageUrl: `https://i.pravatar.cc/150?u=${Math.random()}`,
        phone: "34600000000",
        tags: []
      });
      toastService.success("Doctor añadido globalmente.");
    } catch (e) { toastService.error("Error de red."); }
  };

  const deleteItem = async (id: string, col: string) => {
    if (confirm("¿Eliminar este registro de la base de datos central?")) {
      await firestoreService.removeItem(col, id);
      toastService.info("Registro eliminado de Firebase.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-bold text-mayo-dark serif-font">Configuración del SaaS</h2>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('diseases')} className={`px-6 py-2 rounded-full text-xs font-bold uppercase transition-all ${activeTab === 'diseases' ? 'bg-mayo-blue text-white' : 'bg-white text-mayo-slate border border-mayo-border'}`}>Patologías</button>
          <button onClick={() => setActiveTab('doctors')} className={`px-6 py-2 rounded-full text-xs font-bold uppercase transition-all ${activeTab === 'doctors' ? 'bg-mayo-blue text-white' : 'bg-white text-mayo-slate border border-mayo-border'}`}>Doctores</button>
        </div>
      </div>

      <div className="bg-white border border-mayo-border rounded-[2rem] overflow-hidden shadow-glass">
        <div className="p-8 border-b border-mayo-border flex justify-between items-center bg-mayo-surface/30">
          <p className="text-xs font-bold text-mayo-blue uppercase tracking-widest">Base de datos Firestore Activa</p>
          <button onClick={activeTab === 'diseases' ? addDisease : addDoctor} className="bg-mayo-dark text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-mayo-blue transition-all">+ Nuevo Registro</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-mayo-light text-mayo-slate text-[10px] font-black uppercase tracking-widest">
                <th className="px-10 py-5">Nombre / Registro</th>
                <th className="px-10 py-5">Estado Cloud</th>
                <th className="px-10 py-5 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mayo-border">
              {activeTab === 'diseases' ? diseases.map(d => (
                <tr key={d.id} className="hover:bg-mayo-surface/50 transition-colors">
                  <td className="px-10 py-6 font-bold text-mayo-dark">{d.name}</td>
                  <td className="px-10 py-6">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase">Sincronizado</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button onClick={() => deleteItem(d.id, "diseases")} className="text-red-500 font-black text-[10px] uppercase hover:underline">Borrar</button>
                  </td>
                </tr>
              )) : doctors.map(doc => (
                <tr key={doc.id} className="hover:bg-mayo-surface/50 transition-colors">
                  <td className="px-10 py-6 flex items-center gap-4">
                    <img src={doc.imageUrl} className="w-10 h-10 rounded-full object-cover" alt="" />
                    <span className="font-bold text-mayo-dark">{doc.name}</span>
                  </td>
                  <td className="px-10 py-6 font-medium text-mayo-slate text-sm">{doc.specialty}</td>
                  <td className="px-10 py-6 text-right">
                    <button onClick={() => deleteItem(doc.id, "doctors")} className="text-red-500 font-black text-[10px] uppercase hover:underline">Borrar</button>
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
