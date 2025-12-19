
import React from 'react';

interface StyleguideProps {
  onBack: () => void;
}

const Styleguide: React.FC<StyleguideProps> = ({ onBack }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24 animate-in fade-in duration-700">
      <div className="mb-16">
        <button 
          onClick={onBack}
          className="flex items-center text-cerm-slate font-bold uppercase text-[10px] tracking-[0.3em] hover:text-cerm-green transition-all mb-8"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a la App
        </button>
        <h1 className="text-5xl sm:text-7xl font-bold text-cerm-dark serif-font tracking-tight mb-4">Design System</h1>
        <p className="text-lg text-cerm-slate max-w-2xl font-medium">Guía visual y técnica de CERM CHECK. El lenguaje de diseño que combina la precisión médica con la elegancia tecnológica.</p>
      </div>

      {/* SECCIÓN 1: IDENTIDAD */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <span className="text-[10px] font-black text-cerm-green uppercase tracking-widest bg-cerm-green/10 px-3 py-1 rounded">01</span>
          <h2 className="text-2xl font-bold serif-font text-cerm-dark">Identidad de Marca</h2>
        </div>
        <div className="bg-white border border-cerm-border rounded-[3rem] p-12 shadow-glass grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center justify-center p-12 bg-cerm-surface rounded-[2rem] border border-cerm-green/10">
            <img src="https://res.cloudinary.com/dg4wbuppq/image/upload/v1766102403/checkup_9787624_fp356g.png" className="w-32 h-32 mb-6" alt="Logo Icon" />
            <div className="text-center">
              <span className="text-cerm-dark font-black text-2xl uppercase tracking-[0.3em] leading-none mb-2 block">CERM</span>
              <span className="text-cerm-green font-bold text-sm uppercase tracking-[0.4em] leading-none">CHECK AI</span>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-cerm-dark serif-font">Uso del Logotipo</h3>
            <p className="text-cerm-slate text-sm leading-relaxed">El logotipo de CERM CHECK representa la intersección entre la salud (icono de estetoscopio/checkup) y la tecnología (tipografía técnica y espaciada).</p>
            <div className="bg-cerm-dark text-white p-4 rounded-xl">
              <code className="text-[10px] font-mono opacity-70">Clases: .uppercase .tracking-[0.3em] .font-black</code>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: COLORES */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <span className="text-[10px] font-black text-cerm-green uppercase tracking-widest bg-cerm-green/10 px-3 py-1 rounded">02</span>
          <h2 className="text-2xl font-bold serif-font text-cerm-dark">Paleta de Colores</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { name: "Cerm Green", hex: "#00b8a4", class: "bg-cerm-green", usage: "Primario / Acciones" },
            { name: "Cerm Dark", hex: "#0a1120", class: "bg-cerm-dark", usage: "Textos / Contrastes" },
            { name: "Cerm Surface", hex: "#f0fdfa", class: "bg-cerm-surface", usage: "Fondos Suaves" },
            { name: "Cerm Light", hex: "#f8fafc", class: "bg-cerm-light", usage: "Fondo General" },
            { name: "WhatsApp", hex: "#25D366", class: "bg-[#25D366]", usage: "Conversión WhatsApp" }
          ].map((color, i) => (
            <div key={i} className="group">
              <div className={`h-40 ${color.class} rounded-3xl mb-4 shadow-sm border border-cerm-border group-hover:scale-105 transition-transform duration-500`}></div>
              <h4 className="font-bold text-cerm-dark text-sm">{color.name}</h4>
              <p className="text-[10px] font-mono text-cerm-slate uppercase mb-1">{color.hex}</p>
              <p className="text-[10px] font-bold text-cerm-green uppercase tracking-tighter">{color.usage}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN 3: TIPOGRAFÍA */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <span className="text-[10px] font-black text-cerm-green uppercase tracking-widest bg-cerm-green/10 px-3 py-1 rounded">03</span>
          <h2 className="text-2xl font-bold serif-font text-cerm-dark">Tipografía</h2>
        </div>
        <div className="space-y-12 bg-white border border-cerm-border rounded-[3rem] p-12 shadow-glass">
          <div className="border-b border-cerm-border pb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cerm-green mb-6">Serif Font: Playfair Display</h3>
            <p className="text-6xl sm:text-8xl serif-font text-cerm-dark italic tracking-tighter leading-none">The Future of Health</p>
            <p className="mt-4 text-cerm-slate text-sm">Uso: Títulos H1, H2 y citas de diagnóstico. Aporta autoridad y sofisticación médica.</p>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cerm-green mb-6">Sans Font: Inter</h3>
            <p className="text-4xl font-bold text-cerm-dark mb-4 tracking-tight">Inter Bold 700 - UI Elements</p>
            <p className="text-lg text-cerm-slate leading-relaxed">Inter Regular 400 - Textos de lectura prolongada y descripciones clínicas. Optimizado para legibilidad en pantallas digitales.</p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: COMPONENTES UI */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <span className="text-[10px] font-black text-cerm-green uppercase tracking-widest bg-cerm-green/10 px-3 py-1 rounded">04</span>
          <h2 className="text-2xl font-bold serif-font text-cerm-dark">Componentes UI</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Botones */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cerm-green">Botones Principales</h4>
            <div className="space-y-4">
              <div>
                <button className="cerm-btn-pill bg-cerm-green text-white px-8 py-3 text-xs font-bold uppercase tracking-widest">Botón Primario</button>
                <div className="mt-2 text-[10px] font-mono text-cerm-slate">.bg-cerm-green .cerm-btn-pill</div>
              </div>
              <div>
                <button className="cerm-btn-pill bg-cerm-dark text-white px-8 py-3 text-xs font-bold uppercase tracking-widest">Botón Oscuro</button>
                <div className="mt-2 text-[10px] font-mono text-cerm-slate">.bg-cerm-dark .cerm-btn-pill</div>
              </div>
              <div>
                <button className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-2xl group shadow-premium transition-all">
                  <svg className="h-5 w-5 flex-shrink-0" fill="white" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.3 106.2 27.3 122.4 0 222-99.6 222-222 0-59.3-23.2-115-65.1-157.3zM223.9 446.3c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 365.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 54 81.2 54 130.5 0 101.7-82.8 184.7-184.6 184.7zm100.6-137.4c-5.5-2.8-32.6-16.1-37.7-17.9-5.1-1.8-8.8-2.8-12.4 2.8-3.7 5.5-14.3 17.9-17.5 21.5-3.2 3.7-6.5 4.1-12 1.4-5.5-2.8-23.2-8.5-44.2-27.2-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.5-.3-8.5 2.5-11.2 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.5-9.2 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.4-29.9-17-41.1-4.5-10.9-9.1-9.4-12.4-9.6-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.7 6.9-5 5.5-19.3 18.8-19.3 45.9 0 27.1 19.7 53.3 22.6 57 2.8 3.7 38.8 59.2 94 83 13.1 5.6 23.4 9 31.4 11.6 13.2 4.2 25.2 3.6 34.8 2.2 10.7-1.6 32.6-13.3 37.2-26.2 4.6-12.8 4.6-23.9 3.2-26.2-1.4-2.2-5-3.6-10.5-6.4z"/>
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">Contactar Especialista</span>
                </button>
                <div className="mt-2 text-[10px] font-mono text-cerm-slate">Botón Nativo de WhatsApp (Contextualizado)</div>
              </div>
            </div>
          </div>

          {/* Cards & Badges */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cerm-green">Contenedores y Estados</h4>
            <div className="space-y-6">
              <div className="glass-effect p-8 rounded-3xl border border-cerm-border shadow-glass">
                <p className="text-sm font-bold text-cerm-dark">Glass Effect Container</p>
                <code className="text-[10px] opacity-50 block mt-2">.glass-effect .shadow-glass</code>
              </div>
              <div className="flex gap-4">
                <span className="bg-cerm-green/10 text-cerm-accent px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Urgencia Alta</span>
                <span className="bg-cerm-dark text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Especialista Elite</span>
              </div>
            </div>
          </div>
        </div>

        {/* NUEVOS COMPONENTES: PROGRESO Y RESPUESTAS */}
        <div className="grid md:grid-cols-1 gap-12 mt-12">
            <div className="space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cerm-green">Sistema de Triaje (Pasos y Respuestas)</h4>
                
                {/* Ejemplo de Header de Pasos */}
                <div className="bg-white/50 border border-cerm-border p-8 rounded-[2rem] shadow-glass">
                    <p className="text-[9px] font-black text-cerm-slate uppercase tracking-widest mb-4">Muestra de Indicador de Progreso</p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cerm-light p-4 rounded-2xl border border-cerm-border/50">
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-cerm-green mb-1">Evaluación en curso</h2>
                            <p className="text-xl font-bold text-cerm-dark serif-font">Check de Salud Virtual</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white border border-cerm-border p-3 rounded-2xl">
                            <div className="flex gap-1">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className={`h-1.5 w-6 rounded-full ${i <= 1 ? 'bg-cerm-green shadow-[0_0_8px_rgba(0,184,164,0.3)]' : 'bg-cerm-border'}`}></div>
                                ))}
                            </div>
                            <span className="text-[10px] font-black text-cerm-dark/60 uppercase tracking-widest">2 de 6</span>
                        </div>
                    </div>
                </div>

                {/* Ejemplo de Botón de Respuesta */}
                <div className="bg-white/50 border border-cerm-border p-8 rounded-[2rem] shadow-glass">
                    <p className="text-[9px] font-black text-cerm-slate uppercase tracking-widest mb-4">Muestra de Botón de Respuesta del Chat</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="group flex items-center justify-between p-6 bg-white border border-cerm-green rounded-[1.5rem] shadow-premium">
                            <span className="text-lg font-bold text-cerm-green">Opción Seleccionada</span>
                            <div className="w-8 h-8 rounded-full bg-cerm-green flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-6 bg-white border border-cerm-border rounded-[1.5rem] opacity-60">
                            <span className="text-lg font-bold text-cerm-dark">Opción Default</span>
                            <div className="w-8 h-8 rounded-full border border-cerm-border flex items-center justify-center">
                                <svg className="w-4 h-4 text-cerm-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 text-[10px] font-mono text-cerm-slate">.shadow-premium al seleccionar | Animación active:scale-95</div>
                </div>
            </div>
        </div>
      </section>

      {/* SECCIÓN 5: RESUMEN TÉCNICO HTML/CSS */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-10">
          <span className="text-[10px] font-black text-cerm-green uppercase tracking-widest bg-cerm-green/10 px-3 py-1 rounded">05</span>
          <h2 className="text-2xl font-bold serif-font text-cerm-dark">Resumen de Código</h2>
        </div>
        <div className="bg-cerm-dark text-white rounded-[2rem] p-8 sm:p-12 overflow-x-auto shadow-2xl">
          <pre className="text-xs sm:text-sm font-mono leading-relaxed opacity-80">
{`<!-- Estructura Base de una Card Cerm UI -->
<div class="glass-effect border border-cerm-border rounded-[2.5rem] shadow-glass p-8">
  <span class="text-[10px] font-black text-cerm-green uppercase tracking-[0.2em]">Categoría</span>
  <h3 class="serif-font text-3xl font-bold text-cerm-dark mt-2 mb-4">Título Elegante</h3>
  <p class="text-cerm-slate text-sm">Descripción con tipografía Inter...</p>
  <button class="cerm-btn-pill bg-cerm-green text-white px-8 py-3 mt-6">
    Acción
  </button>
</div>

/* Definiciones Clave en tailwind.config.js */
colors: {
  'cerm-green': '#00b8a4',
  'cerm-dark': '#0a1120',
  'cerm-surface': '#f0fdfa'
}
boxShadow: {
  'premium': '0 10px 30px -10px rgba(0, 184, 164, 0.15)',
  'glass': '0 8px 32px 0 rgba(10, 17, 32, 0.05)'
}`}
          </pre>
        </div>
      </section>
      
      <div className="text-center pt-12 border-t border-cerm-border">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cerm-slate">CERM CHECK IA • DOCUMENTACIÓN DE DISEÑO V1.0</p>
      </div>
    </div>
  );
};

export default Styleguide;
