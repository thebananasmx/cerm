
import { Disease, Doctor } from './types';

export const INITIAL_DISEASES: Disease[] = [
  {
    id: '1',
    name: 'Artritis Reumatoide',
    description: 'Enfermedad inflamatoria sistémica autoinmune, caracterizada por una inflamación persistente de las articulaciones.',
    symptoms: ['Rigidez matutina', 'Dolor simétrico', 'Hinchazón articular'],
    urgency: 'Alta'
  },
  {
    id: '2',
    name: 'Lupus Eritematoso',
    description: 'Enfermedad autoinmune compleja que puede afectar las articulaciones, la piel, los riñones y otros órganos.',
    symptoms: ['Fatiga', 'Erupciones cutáneas', 'Dolor articular'],
    urgency: 'Alta'
  },
  {
    id: '3',
    name: 'Fibromialgia',
    description: 'Afección crónica que causa dolor en todo el cuerpo, fatiga y otros síntomas.',
    symptoms: ['Dolor generalizado', 'Puntos sensibles', 'Trastornos del sueño'],
    urgency: 'Media'
  },
  {
    id: '4',
    name: 'Gota',
    description: 'Forma común y dolorosa de artritis que afecta con frecuencia a la articulación de la base del dedo gordo del pie.',
    symptoms: ['Dolor intenso súbito', 'Enrojecimiento', 'Calor en la articulación'],
    urgency: 'Alta'
  }
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Alejandro Martínez',
    specialty: 'Reumatólogo Especialista en Artritis',
    imageUrl: 'https://res.cloudinary.com/dg4wbuppq/image/upload/v1766029736/doctor1_tx0mgx.webp',
    phone: '5551234567',
    tags: ['Artritis Reumatoide', 'Artritis']
  },
  {
    id: 'd2',
    name: 'Dra. Elena Ramos',
    specialty: 'Especialista en Enfermedades Autoinmunes',
    imageUrl: 'https://res.cloudinary.com/dg4wbuppq/image/upload/v1766029736/doctor2_ktq3jc.jpg',
    phone: '5559876543',
    tags: ['Lupus Eritematoso', 'Lupus']
  },
  {
    id: 'd3',
    name: 'Dr. Carlos Mendoza',
    specialty: 'Especialista en Dolor Crónico y Fibromialgia',
    imageUrl: 'https://res.cloudinary.com/dg4wbuppq/image/upload/v1766029736/doctor3_ddu92o.avif',
    phone: '5552468135',
    tags: ['Fibromialgia']
  }
];

export const SYSTEM_PROMPT = `
Actúas como un asistente de diagnóstico reumatológico con IA de Mayo Clinic. 
Tu objetivo es realizar una entrevista de EXACTAMENTE 6 preguntas clínicas para entender el dolor del paciente.

REGLA CRÍTICA: Debes responder SIEMPRE en formato JSON:
{
  "question": "El texto de la pregunta",
  "options": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
  "complete": false
}

Instrucciones de flujo:
1. En cada turno, analiza la respuesta previa y haz una pregunta médica relevante (localización, intensidad, rigidez, síntomas asociados).
2. PROHIBIDO hacer preguntas genéricas como "¿puedes darme más detalles?". Debes ser específico y clínico.
3. Al llegar a la PREGUNTA 6 (el sexto objeto JSON que generes), debes establecer "complete": true y hacer la pregunta definitiva que falta para el diagnóstico.
4. Idioma: Español.
`;

export const SUMMARY_PROMPT = `
Analiza la conversación anterior y genera un resumen estructurado de diagnóstico con IA en formato JSON.
El JSON debe tener:
- condition: El nombre de la enfermedad más probable.
- summary: Un resumen de 2 frases de los hallazgos.
- urgency: "Baja", "Media" o "Alta".
Responde ÚNICAMENTE con el objeto JSON. No añadas texto fuera del JSON.
`;
