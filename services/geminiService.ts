
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT, SUMMARY_PROMPT } from "../constants";
import { Message, TriageResult } from "../types";

// Definición global para evitar errores TS2580 en el build
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
    }
  }
}

// Configuración de optimización compartida
const OPTIMIZED_CONFIG = {
  maxOutputTokens: 300, // Limita el consumo de TPM (Tokens por minuto)
  thinkingConfig: { thinkingBudget: 0 }, // Ahorra procesamiento y latencia
  temperature: 0.1, // Mayor determinación, menos tokens desperdiciados en variaciones
};

export const startTriageChat = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-2.5-flash-preview-09-2025',
    config: {
      ...OPTIMIZED_CONFIG,
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          complete: { type: Type.BOOLEAN }
        },
        required: ["question", "options", "complete"]
      }
    },
  });
};

export const getTriageSummary = async (messages: Message[]): Promise<TriageResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash-preview-09-2025';
  
  // Optimizamos el contenido enviado: solo los últimos mensajes si el historial es muy largo
  const recentMessages = messages.slice(-10); 
  
  const content = [
    { text: "Analiza este triaje médico brevemente:" },
    ...recentMessages.map(m => ({ text: `${m.role}: ${m.text}` })),
    { text: SUMMARY_PROMPT }
  ];

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: content }],
    config: {
      ...OPTIMIZED_CONFIG,
      maxOutputTokens: 200, // El resumen debe ser muy conciso
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          condition: { type: Type.STRING },
          summary: { type: Type.STRING },
          urgency: { type: Type.STRING },
        },
        required: ["condition", "summary", "urgency"],
      }
    }
  });

  try {
    const text = response.text || '{}';
    return JSON.parse(text) as TriageResult;
  } catch (e) {
    console.error("Error parsing summary JSON", e);
    return {
      condition: "Evaluación General",
      summary: "Se requiere revisión por un especialista para determinar el cuadro clínico.",
      urgency: "Media"
    };
  }
};
