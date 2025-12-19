
import { Disease, Doctor } from './types';

export const INITIAL_DISEASES: Disease[] = [
  {
    id: '1',
    name: 'Artritis Reumatoide',
    description: 'Enfermedad inflamatoria sistémica autoinmune.',
    symptoms: ['Rigidez matutina', 'Dolor simétrico', 'Hinchazón articular'],
    keywords: ['Manos', 'Muñecas', 'Más de 1 hora', 'Simétrico', 'Gradual'],
    urgency: 'Alta'
  },
  {
    id: '2',
    name: 'Lupus Eritematoso',
    description: 'Enfermedad autoinmune compleja que afecta múltiples órganos.',
    symptoms: ['Fatiga', 'Erupciones cutáneas', 'Dolor articular'],
    keywords: ['Piel', 'Fatiga y manchas rojas', 'Fiebre', 'Cara', 'Fotosensibilidad'],
    urgency: 'Alta'
  },
  {
    id: '3',
    name: 'Fibromialgia',
    description: 'Afección crónica que causa dolor generalizado y fatiga.',
    symptoms: ['Dolor generalizado', 'Puntos sensibles', 'Trastornos del sueño'],
    keywords: ['Dolor Generalizado', 'Todo el día', 'Sueño', 'Fatiga'],
    urgency: 'Media'
  },
  {
    id: '4',
    name: 'Gota',
    description: 'Forma dolorosa de artritis por acumulación de ácido úrico.',
    symptoms: ['Dolor intenso súbito', 'Enrojecimiento', 'Calor'],
    keywords: ['Rodillas o Tobillos', 'Súbito e intenso', 'Rojo', 'Calor'],
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
    tags: ['Artritis Reumatoide', 'Artritis'],
    // Added missing keywords to satisfy Doctor interface
    keywords: ['Artritis', 'Manos', 'Muñecas', 'Articulaciones']
  },
  {
    id: 'd2',
    name: 'Dra. Elena Ramos',
    specialty: 'Especialista en Enfermedades Autoinmunes',
    imageUrl: 'https://res.cloudinary.com/dg4wbuppq/image/upload/v1766029736/doctor2_ktq3jc.jpg',
    phone: '5559876543',
    tags: ['Lupus Eritematoso', 'Lupus'],
    // Added missing keywords to satisfy Doctor interface
    keywords: ['Lupus', 'Autoinmune', 'Inmunología', 'Piel']
  },
  {
    id: 'd3',
    name: 'Dr. Carlos Mendoza',
    specialty: 'Especialista en Dolor Crónico y Fibromialgia',
    imageUrl: 'https://res.cloudinary.com/dg4wbuppq/image/upload/v1766029736/doctor3_ddu92o.avif',
    phone: '5552468135',
    tags: ['Fibromialgia'],
    // Added missing keywords to satisfy Doctor interface
    keywords: ['Fibromialgia', 'Dolor crónico', 'Fatiga', 'Sueño']
  }
];
