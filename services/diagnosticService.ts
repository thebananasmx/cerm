
import { Message, TriageResult, Disease } from '../types';

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
    .map(m => m.text.toLowerCase());
  
  // Si no hay enfermedades en Firebase, usamos un fallback
  if (diseases.length === 0) {
    return {
      condition: "Evaluación General",
      summary: "No se pudieron cargar datos de referencia. Por favor, consulte a un médico.",
      urgency: "Media"
    };
  }

  // Algoritmo de Scoring
  const scores = diseases.map(disease => {
    let score = 0;
    
    // Unificar síntomas y keywords para la búsqueda
    const searchTerms = [
      ...disease.keywords.map(k => k.toLowerCase()),
      ...disease.symptoms.map(s => s.toLowerCase()),
      disease.name.toLowerCase()
    ];

    userResponses.forEach(response => {
      searchTerms.forEach(term => {
        // Coincidencia exacta o parcial
        if (response.includes(term) || term.includes(response)) {
          score += 1;
        }
      });
    });

    return { disease, score };
  });

  // Ordenar por puntuación y obtener la más alta
  const bestMatch = scores.sort((a, b) => b.score - a.score)[0];

  // Si la puntuación es 0, no hay un match claro
  if (bestMatch.score === 0) {
    return {
      condition: "Cuadro Clínico Inespecífico",
      summary: "Tus síntomas no coinciden claramente con las patologías de nuestra base de datos actual. Se recomienda valoración profesional.",
      urgency: "Media"
    };
  }

  const { disease } = bestMatch;

  return {
    condition: disease.name,
    summary: `Basado en tus respuestas sobre ${userResponses[0]} y ${userResponses[3]}, presentas indicadores compatibles con ${disease.name}. ${disease.description}`,
    urgency: disease.urgency,
    score: bestMatch.score
  };
};
