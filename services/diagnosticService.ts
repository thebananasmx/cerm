
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
    
    const searchTerms = [
      ...diseaseKeywords.map(k => k.toLowerCase()),
      ...diseaseSymptoms.map(s => s.toLowerCase()),
      (disease.name || "").toLowerCase()
    ].filter(term => term !== "");

    userResponses.forEach(response => {
      searchTerms.forEach(term => {
        if (response.includes(term) || term.includes(response)) {
          score += 1;
        }
      });
    });

    return { disease, score };
  });

  const bestMatch = scores.sort((a, b) => b.score - a.score)[0];

  if (!bestMatch || bestMatch.score === 0) {
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
 * Encuentra al doctor más compatible basándose en el historial de chat y el diagnóstico.
 */
export const findBestDoctor = (history: Message[], doctors: Doctor[], conditionName: string): Doctor | null => {
  if (!doctors || doctors.length === 0) return null;

  const userResponses = history
    .filter(m => m.role === 'user')
    .map(m => (m.text || "").toLowerCase());
  
  const searchSpace = [...userResponses, conditionName.toLowerCase()];

  const scores = doctors.map(doc => {
    let score = 0;
    const docKeywords = Array.isArray(doc.keywords) ? doc.keywords : [];
    const docTags = Array.isArray(doc.tags) ? doc.tags : [];
    
    const docTraits = [
      ...docKeywords.map(k => k.toLowerCase()),
      ...docTags.map(t => t.toLowerCase()),
      (doc.specialty || "").toLowerCase()
    ];

    searchSpace.forEach(input => {
      docTraits.forEach(trait => {
        if (input.includes(trait) || trait.includes(input)) {
          score += 1;
        }
      });
    });

    return { doc, score };
  });

  // Devolver el que tenga mayor puntuación, o el primero si todos son 0
  return scores.sort((a, b) => b.score - a.score)[0].doc;
};
