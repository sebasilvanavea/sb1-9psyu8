import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  Timestamp,
  DocumentData 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyApn6e4AxDyTRdKuWM_3FqjB6vDqZF3uGQ",
  authDomain: "botilleria-88142.firebaseapp.com",
  projectId: "botilleria-88142",
  storageBucket: "botilleria-88142.appspot.com",
  messagingSenderId: "214663424819",
  appId: "1:214663424819:web:41b5d6d9085e9788336c46"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Configurar persistencia
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting auth persistence:', error);
});

// Configurar proveedor de Google
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

interface OrderData extends DocumentData {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  userEmail: string;
  customerInfo?: {
    nombre: string;
    rut: string;
    email: string;
    telefono: string;
    direccion: string;
  };
  date?: string;
}

export const createOrder = async (orderData: OrderData) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      date: orderData.date || Timestamp.now(),
      status: 'pendiente'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error al crear la orden:', error);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<void> => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    throw error;
  }
};

export { auth, app, db };