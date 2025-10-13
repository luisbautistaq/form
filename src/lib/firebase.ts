import "server-only";
import * as admin from 'firebase-admin';

// Solo inicializa la app si no hay ninguna aplicación de Firebase ya inicializada.
if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();
export const auth = admin.auth();
