"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, orderBy, query } from "firebase/firestore";
import type { FormSubmission } from "./types";


export async function submitForm(data: unknown) {
  console.log("Formulario enviado:", data);
  try {
    const submissionsCollection = collection(db, "submissions");
    await addDoc(submissionsCollection, {
      ...data,
      createdAt: new Date(),
    });
    return { success: true, message: "Formulario enviado correctamente." };
  } catch (error) {
    console.error("Error al guardar en Firestore:", error);
    return { success: false, message: "Hubo un problema con tu envío." };
  }
}

export async function adminLogin(data: unknown) {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: "Entrada no válida." };
  }
  
  console.log("Intento de inicio de sesión de administrador:", parsed.data.email);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: "Inicio de sesión exitoso. Redirigiendo..." };
}

export async function adminLogout() {
  console.log("Cierre de sesión de administrador");
  return { success: true };
}

// --- Placeholder actions for admin functionality ---

export async function getSubmissions(): Promise<FormSubmission[]> {
  console.log("Obteniendo envíos desde Firestore...");
  try {
    const submissionsCollection = collection(db, "submissions");
    const q = query(submissionsCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }

    const submissions = snapshot.docs.map(doc => {
      const docData = doc.data();
      return {
        id: doc.id,
        createdAt: docData.createdAt.toDate(), // Convert Firestore Timestamp to Date
        data: docData,
      };
    });

    return submissions;
  } catch (error) {
    console.error("Error al obtener envíos desde Firestore:", error);
    return []; // Return empty on error
  }
}

export async function getFormSchema() {
    console.log("Obteniendo esquema del formulario...");
    // Example: const doc = await db.collection('config').doc('formSchema').get();
    // return doc.data()?.fields || [];
    return [
        { id: 'name', type: 'text', label: 'Nombre Completo', placeholder: 'John Doe', required: true, order: 1 },
        { id: 'email', type: 'email', label: 'Dirección de Correo Electrónico', placeholder: 'john.doe@example.com', required: true, order: 2 },
        { id: 'interest', type: 'select', label: 'Interés Principal', required: true, order: 3, options: ['Consulta de Producto', 'Soporte', 'Asociación', 'Otro'] },
        { id: 'feedback', type: 'textarea', label: 'Tu Mensaje', placeholder: 'Cuéntanos qué piensas...', required: false, order: 4 },
    ];
}

export async function updateFormSchema(schema: any) {
    console.log("Actualizando esquema del formulario:", schema);
    // Example: await db.collection('config').doc('formSchema').set({ fields: schema });
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}

export async function getSiteContent() {
    console.log("Obteniendo contenido del sitio...");
    // Example: const doc = await db.collection('config').doc('siteContent').get();
    // return doc.data();
    return {
        headline: "Crea Formularios Atractivos, Sin Esfuerzo",
        description: "Nuestro creador de formularios dinámicos te permite crear, gestionar y desplegar formularios personalizados en minutos. Descubre cómo FormForge puede revolucionar tu recopilación de datos.",
        image: "https://picsum.photos/seed/formforge-hero/1200/800",
        formTitle: "Ponte en Contacto",
        formDescription: "Rellena el siguiente formulario y nos pondremos en contacto contigo.",
    };
}

export async function updateSiteContent(content: any) {
    console.log("Actualizando contenido del sitio:", content);
    // Example: await db.collection('config').doc('siteContent').set(content);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
}
