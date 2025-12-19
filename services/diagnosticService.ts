
import { Message, TriageResult, Disease, Doctor } from '../types';

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

/**
 * Algoritmo de Triaje con Pesos
 */
export const calculateMockResult = (history: Message[], diseases: Disease[]): TriageResult => {
  const userResponses = history
    .filter(m => m.role === 'user')
    .map(m => (m.text || "").toLowerCase());
  
  if (!diseases || diseases.length === 0) {
    return {
      condition: "Evaluación General",
      summary: "No se pudieron cargar datos de referencia. Por favor, consulte a un médico.",
      urgency: "Media"
    };
  }

  const scores = diseases.map(disease => {
    let score = 0;
    const diseaseKeywords = Array.isArray(disease.keywords) ? disease.keywords : [];
    const diseaseSymptoms = Array.isArray(disease.symptoms) ? disease.symptoms : [];
    
    const keywords = diseaseKeywords.map(k => k.toLowerCase());
    const symptoms = diseaseSymptoms.map(s => s.toLowerCase());

    userResponses.forEach(response => {
      // Peso 2 para keywords (más específicas)
      keywords.forEach(kw => {
        if (response.includes(kw) || kw.includes(response)) score += 2;
      });
      // Peso 1 para síntomas (más genéricos)
      symptoms.forEach(sym => {
        if (response.includes(sym) || sym.includes(response)) score += 1;
      });
    });

    return { disease, score };
  });

  const bestMatch = scores.sort((a, b) => b.score - a.score)[0];

  if (!bestMatch || bestMatch.score <= 1) {
    return {
      condition: "Cuadro Clínico Inespecífico",
      summary: "Tus síntomas no coinciden claramente con las patologías de nuestra base de datos actual. Se recomienda valoración profesional.",
      urgency: "Media"
    };
  }

  const { disease } = bestMatch;

  return {
    condition: disease.name,
    summary: `Basado en tus respuestas, presentas indicadores compatibles con ${disease.name}. ${disease.description}`,
    urgency: disease.urgency,
    score: bestMatch.score
  };
};

/**
 * Algoritmo de Selección de Doctor Mejorado
 * Ahora utiliza el nuevo campo 'keywords' de los doctores para un matching de precisión.
 */
export const findBestDoctor = (history: Message[], doctors: Doctor[], conditionName: string): Doctor | null => {
  if (!doctors || doctors.length === 0) return null;

  const userResponses = history
    .filter(m => m.role === 'user')
    .map(m => (m.text || "").toLowerCase());
  
  const targetCondition = conditionName.toLowerCase();

  const scores = doctors.map(doc => {
    let score = 0;
    
    // Normalizar datos del doctor
    const docKeywords = (Array.isArray(doc.keywords) ? doc.keywords : []).map(k => k.toLowerCase());
    const docTags = (Array.isArray(doc.tags) ? doc.tags : []).map(t => t.toLowerCase());
    const specialty = (doc.specialty || "").toLowerCase();

    // 1. PRIORIDAD MÁXIMA: Match con el diagnóstico detectado (Peso 10)
    // Si el nombre de la enfermedad está en sus tags o keywords, es el match ideal.
    if (docTags.some(t => t.includes(targetCondition) || targetCondition.includes(t))) score += 10;
    if (docKeywords.some(k => k.includes(targetCondition) || targetCondition.includes(k))) score += 10;
    if (specialty.includes(targetCondition)) score += 5;

    // 2. PRIORIDAD MEDIA: Match con los inputs directos del usuario (Peso 2 por cada coincidencia en keywords)
    userResponses.forEach(response => {
      // Las keywords son el factor de decisión de alta precisión añadido recientemente
      docKeywords.forEach(kw => {
        if (response.includes(kw) || kw.includes(response)) {
          score += 2;
        }
      });

      // Los tags son descriptores generales
      docTags.forEach(tag => {
        if (response.includes(tag) || tag.includes(response)) {
          score += 1;
        }
      });
    });

    return { doc, score };
  });

  // Ordenar por score descendente
  const sorted = scores.sort((a, b) => b.score - a.score);
  
  // Si el mejor score es 0, devolvemos el primer doctor como fallback, 
  // pero lo ideal es que siempre haya un match por especialidad.
  return sorted[0].doc;
};
