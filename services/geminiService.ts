
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT, SUMMARY_PROMPT } from "../constants";
import { Message, TriageResult } from "../types";
import { toastService } from "./toastService";

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
  maxOutputTokens: 300, 
  thinkingConfig: { thinkingBudget: 0 }, 
  temperature: 0.1, 
};

const handleApiError = (error: any) => {
  console.error("Gemini API Error:", error);
  const errorMessage = error?.message || "";
  
  if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("quota")) {
    toastService.error("Límite de frecuencia excedido. Por favor, espere un minuto antes de continuar.");
  } else if (errorMessage.includes("API_KEY_INVALID")) {
    toastService.error("Error de configuración: Clave de API inválida.");
  } else {
    toastService.error("Error de conexión con el asistente de IA. Intente de nuevo.");
  }
  throw error;
};

export const startTriageChat = () => {
  try {
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
  } catch (error) {
    return handleApiError(error);
  }
};

export const getTriageSummary = async (messages: Message[]): Promise<TriageResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash-preview-09-2025';
    
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
        maxOutputTokens: 200, 
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

    const text = response.text || '{}';
    return JSON.parse(text) as TriageResult;
  } catch (error) {
    handleApiError(error);
    return {
      condition: "Error de Evaluación",
      summary: "No se pudo generar el resumen debido a un problema técnico.",
      urgency: "Desconocida"
    };
  }
};
