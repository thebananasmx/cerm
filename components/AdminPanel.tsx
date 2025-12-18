
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
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    extra: '', // Specialty for doctors, urgency for diseases
    phone: ''  // Only for doctors
  });

  const resetForm = () => {
    setFormData({ name: '', extra: '', phone: '' });
    setShowForm(false);
    setIsSubmitting(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toastService.error("El nombre es obligatorio.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (activeTab === 'diseases') {
        await firestoreService.saveItem("diseases", {
          name: formData.name,
          description: "Evaluación automática por árbol de decisión.",
          urgency: formData.extra || "Alta",
          symptoms: []
        });
      } else {
        await firestoreService.saveItem("doctors", {
          name: formData.name,
          specialty: formData.extra || "Reumatología Avanzada",
          imageUrl: `https://i.pravatar.cc/150?u=${Math.random()}`,
          phone: formData.phone || "34600000000",
          tags: []
        });
      }
      toastService.success("Sincronizado con Firebase correctamente.");
      resetForm();
    } catch (error) {
      console.error(error);
      toastService.error("Error al guardar en la nube.");
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id: string, col: string) => {
    if (confirm("¿Eliminar este registro de la base de datos central?")) {
      try {
        await firestoreService.removeItem(col, id);
        toastService.info("Registro eliminado de Firebase.");
      } catch (e) {
        toastService.error("No se pudo eliminar el registro.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-mayo-dark serif-font">Configuración del SaaS</h2>
          <p className="text-mayo-slate text-sm mt-1">Gestión de activos en tiempo real vía Firestore</p>
        </div>
        <div className="flex gap-4 bg-white p-1.5 rounded-2xl border border-mayo-border shadow-sm">
          <button 
            onClick={() => { setActiveTab('diseases'); setShowForm(false); }} 
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'diseases' ? 'bg-mayo-blue text-white shadow-premium' : 'text-mayo-slate hover:bg-mayo-surface'}`}
          >
            Patologías
          </button>
          <button 
            onClick={() => { setActiveTab('doctors'); setShowForm(false); }} 
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'doctors' ? 'bg-mayo-blue text-white shadow-premium' : 'text-mayo-slate hover:bg-mayo-surface'}`}
          >
            Doctores
          </button>
        </div>
      </div>

      {/* Inline Form Card */}
      {showForm && (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSave} className="bg-mayo-dark text-white p-8 rounded-[2rem] shadow-premium">
            <h3 className="text-lg font-bold serif-font mb-6">Nuevo {activeTab === 'diseases' ? 'Diagnóstico' : 'Especialista'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-mayo-blue">Nombre Completo</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Lupus Eritematoso"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mayo-blue transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-mayo-blue">
                  {activeTab === 'diseases' ? 'Urgencia' : 'Especialidad'}
                </label>
                {activeTab === 'diseases' ? (
                  <select 
                    value={formData.extra}
                    onChange={(e) => setFormData({...formData, extra: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mayo-blue text-white"
                  >
                    <option value="Baja" className="text-mayo-dark">Baja</option>
                    <option value="Media" className="text-mayo-dark">Media</option>
                    <option value="Alta" className="text-mayo-dark">Alta</option>
                  </select>
                ) : (
                  <input 
                    type="text" 
                    value={formData.extra}
                    onChange={(e) => setFormData({...formData, extra: e.target.value})}
                    placeholder="Ej: Inmunología"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mayo-blue transition-colors"
                  />
                )}
              </div>
              {activeTab === 'doctors' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mayo-blue">WhatsApp (Sin +)</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Ej: 5215551234567"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mayo-blue transition-colors"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button type="button" onClick={resetForm} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">Cancelar</button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-mayo-blue text-mayo-dark px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Sincronizando...' : 'Guardar en Firestore'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-mayo-border rounded-[2rem] overflow-hidden shadow-glass">
        <div className="p-8 border-b border-mayo-border flex justify-between items-center bg-mayo-surface/30">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs font-bold text-mayo-dark uppercase tracking-widest">Base de datos Firestore Activa</p>
          </div>
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)} 
              className="bg-mayo-dark text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-mayo-blue transition-all shadow-md"
            >
              + Nuevo Registro
            </button>
          )}
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
              {activeTab === 'diseases' ? (
                diseases.length > 0 ? diseases.map(d => (
                  <tr key={d.id} className="hover:bg-mayo-surface/50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="font-bold text-mayo-dark">{d.name}</div>
                      <div className="text-[10px] text-mayo-slate uppercase font-medium">Urgencia: {d.urgency}</div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">Sincronizado</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button onClick={() => deleteItem(d.id, "diseases")} className="text-red-400 font-black text-[10px] uppercase hover:text-red-600 transition-colors">Eliminar</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="px-10 py-20 text-center text-mayo-slate italic text-sm">No hay patologías registradas en Firestore.</td></tr>
                )
              ) : (
                doctors.length > 0 ? doctors.map(doc => (
                  <tr key={doc.id} className="hover:bg-mayo-surface/50 transition-colors group">
                    <td className="px-10 py-6 flex items-center gap-4">
                      <img src={doc.imageUrl} className="w-10 h-10 rounded-full object-cover border border-mayo-border" alt="" />
                      <div>
                        <div className="font-bold text-mayo-dark">{doc.name}</div>
                        <div className="text-[10px] text-mayo-blue uppercase font-black tracking-widest">{doc.specialty}</div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="bg-mayo-blue/10 text-mayo-accent px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">Activo</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button onClick={() => deleteItem(doc.id, "doctors")} className="text-red-400 font-black text-[10px] uppercase hover:text-red-600 transition-colors">Eliminar</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="px-10 py-20 text-center text-mayo-slate italic text-sm">No hay doctores registrados en Firestore.</td></tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
