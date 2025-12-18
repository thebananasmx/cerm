
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// NOTA: Para producción, estas credenciales deben ser variables de entorno.
// Para este PoC, se asume un proyecto Firebase activo.
const firebaseConfig = {
  apiKey: "AIzaSyCzzRBzN_1wAMeeI1aNSfURB667vhUdK3Q",
  authDomain: "cerm-check-ia.firebaseapp.com",
  projectId: "cerm-check-ia",
  storageBucket: "cerm-check-ia.firebasestorage.app",
  messagingSenderId: "901389284480",
  appId: "1:901389284480:web:b0bc51b314c604c050a265",
  measurementId: "G-4XRTQD3M5G"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const firestoreService = {
  // Patologías
  getDiseases: (callback: any) => {
    return onSnapshot(collection(db, "diseases"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  },
  // Doctores
  getDoctors: (callback: any) => {
    return onSnapshot(collection(db, "doctors"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  },
  // Operaciones genéricas
  saveItem: async (col: string, data: any) => {
    return await addDoc(collection(db, col), data);
  },
  removeItem: async (col: string, id: string) => {
    return await deleteDoc(doc(db, col, id));
  }
};
