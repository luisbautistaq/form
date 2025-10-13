import "server-only";
import * as admin from 'firebase-admin';

// Definimos la forma de la cuenta de servicio, aunque no la usemos directamente con un archivo.
// El entorno de Firebase App Hosting provee estas variables.
const serviceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Patrón Singleton para la inicialización de Firebase Admin
// Esto garantiza que initializeApp() se llame solo una vez en todo el ciclo de vida del servidor.
let app: admin.app.App;
if (!admin.apps.length) {
  // Si no hay apps inicializadas, crea una nueva.
  // En un entorno de servidor real de Firebase (como App Hosting o Cloud Functions),
  // esto debería funcionar sin argumentos.
  // Sin embargo, para cubrir todos los casos, podemos proveer las credenciales si están disponibles.
  try {
     app = admin.initializeApp();
  } catch (e) {
    // Si la inicialización automática falla, intenta con las credenciales de la cuenta de servicio si existen
    if(serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
        app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        // Si no hay credenciales, vuelve a lanzar el error.
        console.error("Firebase Admin initialization failed:", e);
        throw e;
    }
  }
} else {
  // Si ya hay una app, simplemente obtén la instancia por defecto.
  app = admin.app();
}

// Exportamos las instancias de los servicios que ya están inicializados de forma segura.
export const db = admin.firestore(app);
export const auth = admin.auth(app);