
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  Firestore
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzzRBzN_1wAMeeI1aNSfURB667vhUdK3Q",
  authDomain: "cerm-check-ia.firebaseapp.com",
  projectId: "cerm-check-ia",
  storageBucket: "cerm-check-ia.firebasestorage.app",
  messagingSenderId: "901389284480",
  appId: "1:901389284480:web:b0bc51b314c604c050a265",
  measurementId: "G-4XRTQD3M5G"
};

// Inicialización segura de Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Inicialización de Firestore
export const db: Firestore = getFirestore(app);

export const firestoreService = {
  getDiseases: (callback: (data: any[]) => void) => {
    return onSnapshot(collection(db, "diseases"), (snapshot: QuerySnapshot<DocumentData>) => {
      const data = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      callback(data);
    });
  },
  getDoctors: (callback: (data: any[]) => void) => {
    return onSnapshot(collection(db, "doctors"), (snapshot: QuerySnapshot<DocumentData>) => {
      const data = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      callback(data);
    });
  },
  saveItem: async (col: string, data: any) => {
    return await addDoc(collection(db, col), data);
  },
  removeItem: async (col: string, id: string) => {
    return await deleteDoc(doc(db, col, id));
  }
};
