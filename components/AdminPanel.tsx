
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
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    extra: '', 
    phone: '',
    keywords: '' 
  });

  const resetForm = () => {
    setFormData({ name: '', extra: '', phone: '', keywords: '' });
    setShowForm(false);
    setIsSubmitting(false);
    setEditingId(null);
  };

  const startEdit = (item: any) => {
    if (activeTab === 'diseases') {
      const d = item as Disease;
      setFormData({
        name: d.name,
        extra: d.urgency,
        phone: '',
        keywords: (d.keywords || []).join(', ')
      });
    } else {
      const doc = item as Doctor;
      setFormData({
        name: doc.name,
        extra: doc.specialty,
        phone: doc.phone,
        keywords: (doc.keywords || []).join(', ')
      });
    }
    setEditingId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toastService.error("El nombre es obligatorio.");
      return;
    }

    setIsSubmitting(true);
    try {
      const keywordsArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k !== '');

      if (activeTab === 'diseases') {
        const diseaseData = {
          name: formData.name,
          description: "Información clínica gestionada desde el panel.",
          urgency: formData.extra || "Alta",
          symptoms: keywordsArray,
          keywords: keywordsArray
        };

        if (editingId) {
          await firestoreService.updateItem("diseases", editingId, diseaseData);
          toastService.success("Patología actualizada.");
        } else {
          await firestoreService.saveItem("diseases", diseaseData);
          toastService.success("Nueva patología registrada.");
        }
      } else {
        const doctorData = {
          name: formData.name,
          specialty: formData.extra || "Reumatología Avanzada",
          phone: formData.phone || "5550000000",
          tags: [formData.extra],
          keywords: keywordsArray
        };

        if (editingId) {
          await firestoreService.updateItem("doctors", editingId, doctorData);
          toastService.success("Especialista actualizado.");
        } else {
          await firestoreService.saveItem("doctors", {
            ...doctorData,
            imageUrl: `https://i.pravatar.cc/150?u=${Math.random()}`,
          });
          toastService.success("Nuevo especialista añadido.");
        }
      }
      resetForm();
    } catch (error) {
      console.error(error);
      toastService.error("Error al sincronizar con Firebase.");
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id: string, col: string) => {
    if (confirm("¿Eliminar permanentemente?")) {
      try {
        await firestoreService.removeItem(col, id);
        toastService.info("Registro eliminado.");
      } catch (e) {
        toastService.error("Error al eliminar.");
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
            onClick={() => { setActiveTab('diseases'); resetForm(); }} 
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'diseases' ? 'bg-mayo-blue text-white shadow-premium' : 'text-mayo-slate hover:bg-mayo-surface'}`}
          >
            Patologías
          </button>
          <button 
            onClick={() => { setActiveTab('doctors'); resetForm(); }} 
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'doctors' ? 'bg-mayo-blue text-white shadow-premium' : 'text-mayo-slate hover:bg-mayo-surface'}`}
          >
            Doctores
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSave} className="relative bg-mayo-dark text-white p-8 rounded-[2rem] shadow-premium border-l-4 border-mayo-blue">
            {editingId && (
              <div className="absolute top-6 right-8 flex flex-col items-end">
                <span className="text-[8px] font-black text-mayo-blue uppercase tracking-widest mb-1 opacity-50">Firebase ID</span>
                <span className="text-[10px] font-mono bg-white/5 px-3 py-1 rounded-lg border border-white/10 text-white/70 select-all" title={editingId}>
                  {editingId.substring(0, 5)}...
                </span>
              </div>
            )}
            
            <h3 className="text-lg font-bold serif-font mb-6 italic pr-32">
              {editingId ? 'Editar Registro' : `Nuevo ${activeTab === 'diseases' ? 'Diagnóstico' : 'Especialista'}`}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-mayo-blue">Nombre Completo</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-mayo-blue"
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
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none text-white"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                ) : (
                  <input 
                    type="text" 
                    value={formData.extra}
                    onChange={(e) => setFormData({...formData, extra: e.target.value})}
                    placeholder="Ej: Reumatología"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                )}
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-mayo-blue">Keywords para Matching IA (Separadas por coma)</label>
                <textarea 
                  value={formData.keywords}
                  onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                  placeholder="Ej: manos, inflamación, joven, severo"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none h-24"
                />
              </div>

              {activeTab === 'doctors' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-mayo-blue">WhatsApp</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-4 mt-8">
              <button type="button" onClick={resetForm} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/50">Cancelar</button>
              <button type="submit" disabled={isSubmitting} className="bg-mayo-blue text-mayo-dark px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                {isSubmitting ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-mayo-border rounded-[2rem] overflow-hidden shadow-glass">
        <div className="p-8 border-b border-mayo-border flex justify-between items-center bg-mayo-surface/30">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-xs font-bold text-mayo-dark uppercase tracking-widest">Base de datos Activa</p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="bg-mayo-dark text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">
              + Nuevo Registro
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-mayo-light text-mayo-slate text-[10px] font-black uppercase tracking-widest">
                <th className="px-10 py-5">Nombre / Registro</th>
                <th className="px-10 py-5">Keywords IA</th>
                <th className="px-10 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mayo-border">
              {activeTab === 'diseases' ? (
                diseases.map(d => (
                  <tr key={d.id} className="hover:bg-mayo-surface/50 transition-colors">
                    <td className="px-10 py-6 font-bold text-mayo-dark">{d.name}</td>
                    <td className="px-10 py-6">
                      <div className="flex flex-wrap gap-1">
                        {(d.keywords || []).slice(0, 3).map((k, i) => (
                          <span key={i} className="bg-mayo-blue/10 text-mayo-accent px-2 py-0.5 rounded text-[8px] font-bold uppercase">{k}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button onClick={() => startEdit(d)} className="text-mayo-blue mr-4 font-black text-[10px] uppercase">Editar</button>
                      <button onClick={() => deleteItem(d.id, "diseases")} className="text-red-400 font-black text-[10px] uppercase">Borrar</button>
                    </td>
                  </tr>
                ))
              ) : (
                doctors.map(doc => (
                  <tr key={doc.id} className="hover:bg-mayo-surface/50 transition-colors">
                    <td className="px-10 py-6 flex items-center gap-4">
                      <img src={doc.imageUrl} className="w-8 h-8 rounded-full object-cover" alt="" />
                      <div className="font-bold text-mayo-dark">{doc.name}</div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-wrap gap-1">
                        {(doc.keywords || []).slice(0, 3).map((k, i) => (
                          <span key={i} className="bg-mayo-blue/10 text-mayo-accent px-2 py-0.5 rounded text-[8px] font-bold uppercase">{k}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button onClick={() => startEdit(doc)} className="text-mayo-blue mr-4 font-black text-[10px] uppercase">Editar</button>
                      <button onClick={() => deleteItem(doc.id, "doctors")} className="text-red-400 font-black text-[10px] uppercase">Borrar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
