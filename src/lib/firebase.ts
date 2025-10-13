import "server-only";
import * as admin from 'firebase-admin';

let app: admin.app.App;

if (!admin.apps.length) {
  app = admin.initializeApp();
} else {
  app = admin.app();
}

export const db = admin.firestore(app);
export const auth = admin.auth(app);
