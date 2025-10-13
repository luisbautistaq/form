import "server-only";
import * as admin from 'firebase-admin';
import { firebaseConfig } from "@/firebase/config";

if (!admin.apps.length) {
  try {
    // Intenta inicializar con las credenciales de la aplicación por defecto (para entornos de Google Cloud)
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (e) {
    console.warn("La inicialización con credenciales por defecto falló. Usando la configuración del proyecto. Error:", e);
    // Si lo anterior falla (por ejemplo, en un entorno de desarrollo local),
    // usa la configuración del proyecto y las credenciales de la cuenta de servicio si están disponibles.
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
      // Si tienes un archivo de cuenta de servicio, puedes configurarlo así:
      // credential: admin.credential.cert(require('./path/to/your/serviceAccountKey.json'))
    });
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
