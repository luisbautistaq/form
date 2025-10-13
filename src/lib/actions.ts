"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, orderBy, query, doc } from "firebase/firestore";
import type { FormSubmission, FormField, SiteContent } from "./types";

const FORM_ID = "main_contact_form"; // ID estático para nuestro único formulario

// Esta acción ahora se ejecuta en el cliente, por lo que necesita ser un 'use client' si usa hooks
export async function submitForm(data: unknown) {
  console.log("Formulario enviado:", data);
  try {
    // La ruta ahora es una subcolección anidada
    const submissionsCollection = collection(db, "forms", FORM_ID, "form_submissions");
    await addDoc(submissionsCollection, {
      formData: data, // Anidamos los datos del formulario en un campo
      submissionDate: new Date(),
    });
    return { success: true, message: "Formulario enviado correctamente." };
  } catch (error)
  {
    console.error("Error al guardar en Firestore:", error);
    // Devuelve el mensaje de error real para una mejor depuración en el cliente
    const errorMessage = error instanceof Error ? error.message : "Hubo un problema con tu envío.";
    return { success: false, message: errorMessage };
  }
}

export async function getSubmissions(): Promise<FormSubmission[]> {
  console.log("Obteniendo envíos desde Firestore...");
  try {
    const submissionsCollection = collection(db, "forms", FORM_ID, "form_submissions");
    const q = query(submissionsCollection, orderBy("submissionDate", "desc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }

    const submissions = snapshot.docs.map(doc => {
      const docData = doc.data();
      return {
        id: doc.id,
        createdAt: docData.submissionDate.toDate(), // Convertir Timestamp de Firestore a Date
        data: docData.formData, // Extraer los datos del formulario del campo anidado
      };
    });

    return submissions;
  } catch (error) {
    console.error("Error al obtener envíos desde Firestore:", error);
    return []; // Devolver vacío en caso de error
  }
}

export async function getFormSchema(): Promise<FormField[]> {
    console.log("Obteniendo esquema del formulario...");
    const formDoc = await db.collection('forms').doc(FORM_ID).get();
    if (!formDoc.exists) {
        return [];
    }
    const formData = formDoc.data();
    try {
        const schema = JSON.parse(formData?.schema || '[]');
        return schema.sort((a: FormField, b: FormField) => a.order - b.order);
    } catch (e) {
        console.error("Error parsing form schema:", e);
        return [];
    }
}

export async function updateFormSchema(schema: FormField[]) {
    console.log("Actualizando esquema del formulario:", schema);
    const formDocRef = doc(db, "forms", FORM_ID);
    await db.collection('forms').doc(FORM_ID).set({ 
        schema: JSON.stringify(schema)
    }, { merge: true });
    return { success: true };
}

export async function getSiteContent(): Promise<SiteContent> {
    console.log("Obteniendo contenido del sitio...");
    const contentDoc = await db.collection('landing_page_contents').doc('main').get();
    if (!contentDoc.exists) {
        return {
            headline: "Crea Formularios Atractivos, Sin Esfuerzo",
            description: "Nuestro creador de formularios dinámicos te permite crear, gestionar y desplegar formularios personalizados en minutos. Descubre cómo FormForge puede revolucionar tu recopilación de datos.",
            image: "https://picsum.photos/seed/formforge-hero/1200/800",
            formTitle: "Ponte en Contacto",
            formDescription: "Rellena el siguiente formulario y nos pondremos en contacto contigo.",
        };
    }
    return contentDoc.data() as SiteContent;
}

export async function updateSiteContent(content: SiteContent) {
    console.log("Actualizando contenido del sitio:", content);
    await db.collection('landing_page_contents').doc('main').set(content, { merge: true });
    return { success: true };
}
