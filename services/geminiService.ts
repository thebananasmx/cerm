
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

export const startTriageChat = () => {
  // Always create a new GoogleGenAI instance right before making an API call.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.2,
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
  // Always create a new GoogleGenAI instance right before making an API call.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const content = [
    { text: "Historial de conversación:" },
    ...messages.map(m => ({ text: `${m.role}: ${m.text}` })),
    { text: SUMMARY_PROMPT }
  ];

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: content }],
    config: {
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
    // Directly access the .text property from GenerateContentResponse
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
