
export interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  keywords: string[]; // Palabras clave para el algoritmo de matching
  urgency: 'Baja' | 'Media' | 'Alta';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  phone: string;
  tags: string[]; 
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface TriageResult {
  condition: string;
  summary: string;
  urgency: string;
  score?: number;
}

export type AppView = 'landing' | 'chat' | 'results' | 'admin';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
