
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

// Utilidad para limpiar y parsear JSON de forma robusta
export const safeParseJSON = (text: string) => {
  if (!text) return {};
  try {
    // 1. Eliminar bloques de código markdown si existen
    let cleaned = text.replace(/```json\n?|```/g, '').trim();
    
    // 2. Intentar parseo directo
    return JSON.parse(cleaned);
  } catch (e) {
    try {
      // 3. Intento de rescate: eliminar comas finales comunes que rompen JSON.parse
      let rescued = text
        .replace(/```json\n?|```/g, '')
        .replace(/,\s*([\]}])/g, '$1') 
        .trim();
      return JSON.parse(rescued);
    } catch (e2) {
      console.error("Error crítico de parseo JSON:", text);
      throw new Error("La respuesta del asistente no tiene un formato válido.");
    }
  }
};

const OPTIMIZED_CONFIG = {
  maxOutputTokens: 500, 
  thinkingConfig: { thinkingBudget: 0 }, 
  temperature: 0.1, 
};

const handleApiError = (error: any) => {
  console.error("Gemini API Error:", error);
  const errorMessage = error?.message || "";
  
  if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("quota")) {
    toastService.error("Límite de frecuencia excedido. Por favor, espere un minuto.");
  } else if (errorMessage.includes("API_KEY_INVALID")) {
    toastService.error("Error: Clave de API inválida.");
  } else {
    toastService.error("Error de conexión con la IA.");
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
    
    const recentMessages = messages.slice(-12); 
    
    const content = [
      { text: "Genera el diagnóstico probable basado en esta conversación:" },
      ...recentMessages.map(m => ({ text: `${m.role}: ${m.text}` })),
      { text: SUMMARY_PROMPT }
    ];

    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: content }],
      config: {
        ...OPTIMIZED_CONFIG,
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

    const data = safeParseJSON(response.text);

    return {
      condition: data.condition || "Evaluación Clínica Pendiente",
      summary: data.summary || "Se requiere revisión presencial para confirmar síntomas.",
      urgency: data.urgency || "Media"
    };
  } catch (error) {
    handleApiError(error);
    return {
      condition: "Error de Evaluación",
      summary: "No se pudo generar el resumen debido a un problema de formato en la respuesta.",
      urgency: "Media"
    };
  }
};
