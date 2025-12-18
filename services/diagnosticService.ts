
import { Message, TriageResult, Disease } from '../types';

// Preguntas predefinidas para el flujo médico
const CLINICAL_STEPS = [
  {
    question: "¿En qué zona siente el mayor malestar articular actualmente?",
    options: ["Manos y Muñecas", "Rodillas o Tobillos", "Columna/Espalda", "Dolor Generalizado"]
  },
  {
    question: "¿Cuánto tiempo dura la rigidez articular al despertar por la mañana?",
    options: ["Menos de 30 min", "Más de 1 hora", "No presento rigidez", "Todo el día"]
  },
  {
    question: "¿Ha notado inflamación visible (hinchazón) o calor en las articulaciones?",
    options: ["Sí, frecuentemente", "Ocasionalmente", "Solo tras ejercicio", "Nunca"]
  },
  {
    question: "¿Presenta otros síntomas como fatiga extrema o erupciones en la piel?",
    options: ["Fatiga y manchas rojas", "Solo fatiga", "Fiebre recurrente", "Ninguno"]
  },
  {
    question: "¿Cómo describiría la aparición del dolor?",
    options: ["Súbito e intenso", "Gradual (meses)", "Intermitente", "Constante"]
  },
  {
    question: "Finalmente, ¿existen antecedentes familiares de enfermedades autoinmunes?",
    options: ["Sí, directos", "No lo sé", "Ninguno", "Enfermedades óseas"]
  }
];

export const getMockChatResponse = (step: number) => {
  if (step >= CLINICAL_STEPS.length) return null;
  return {
    ...CLINICAL_STEPS[step],
    complete: step === CLINICAL_STEPS.length - 1
  };
};

export const calculateMockResult = (history: Message[], diseases: Disease[]): TriageResult => {
  // Lógica de "Scoring" simple para el Lead Magnet
  // En un PoC real, esto analizaría las keywords de 'history'
  const userResponses = history.filter(m => m.role === 'user').map(m => m.text);
  
  // Simulamos que el diagnóstico depende de la primera respuesta (Localización)
  const mainComplaint = userResponses[0];
  
  let match = diseases[0]; // Default: Artritis
  
  if (mainComplaint.includes("Generalizado")) match = diseases.find(d => d.name.includes("Fibro")) || diseases[2];
  if (mainComplaint.includes("Piel") || userResponses[3]?.includes("manchas")) match = diseases.find(d => d.name.includes("Lupus")) || diseases[1];
  if (userResponses[4]?.includes("Súbito")) match = diseases.find(d => d.name.includes("Gota")) || diseases[3];

  return {
    condition: match?.name || "Evaluación Clínica Requerida",
    summary: `Basado en la rigidez reportada (${userResponses[1]}) y la localización en ${userResponses[0]}, existe una probabilidad clínica de cuadro inflamatorio activo.`,
    urgency: match?.urgency || "Media"
  };
};
