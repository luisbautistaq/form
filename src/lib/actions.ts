"use server";

import { db } from "@/lib/firebase";
import { FieldValue } from 'firebase-admin/firestore';
import type { FormSubmission, FormField, SiteContent } from "./types";

const FORM_ID = "main_contact_form"; // ID estático para nuestro único formulario

export async function submitForm(data: unknown) {
  console.log("Formulario enviado:", data);
  try {
    const submissionsCollection = db.collection("forms").doc(FORM_ID).collection("form_submissions");
    await submissionsCollection.add({
      formData: data, // Anidamos los datos del formulario en un campo
      submissionDate: FieldValue.serverTimestamp(),
    });
    return { success: true, message: "Formulario enviado correctamente." };
  } catch (error)
  {
    console.error("Error al guardar en Firestore:", error);
    const errorMessage = error instanceof Error ? error.message : "Hubo un problema con tu envío.";
    return { success: false, message: errorMessage };
  }
}

export async function getSubmissions(): Promise<FormSubmission[]> {
  console.log("Obteniendo envíos desde Firestore...");
  try {
    const submissionsCollection = db.collection("forms").doc(FORM_ID).collection("form_submissions");
    const snapshot = await submissionsCollection.orderBy("submissionDate", "desc").get();
    
    if (snapshot.empty) {
      return [];
    }

    const submissions = snapshot.docs.map(doc => {
      const docData = doc.data();
      // El timestamp de Firestore necesita ser convertido a un objeto Date de JS
      const createdAt = docData.submissionDate.toDate ? docData.submissionDate.toDate() : new Date();
      return {
        id: doc.id,
        createdAt: createdAt,
        data: docData.formData,
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
    try {
        const formDoc = await db.collection('forms').doc(FORM_ID).get();
        if (!formDoc.exists) {
            return [];
        }
        const formData = formDoc.data();
        const schema = JSON.parse(formData?.schema || '[]');
        return schema.sort((a: FormField, b: FormField) => a.order - b.order);
    } catch (e) {
        console.error("Error parsing form schema:", e);
        return [];
    }
}

export async function updateFormSchema(schema: FormField[]) {
    console.log("Actualizando esquema del formulario:", schema);
    try {
        await db.collection('forms').doc(FORM_ID).set({ 
            schema: JSON.stringify(schema)
        }, { merge: true });
        return { success: true };
    } catch(error) {
        const errorMessage = error instanceof Error ? error.message : "No se pudieron guardar los cambios.";
        return { success: false, message: errorMessage };
    }
}

export async function getSiteContent(): Promise<SiteContent> {
    console.log("Obteniendo contenido del sitio...");
    try {
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
    } catch (error) {
         console.error("Error getting site content:", error);
        // Devolver contenido por defecto en caso de error para que la página no se rompa
         return {
            headline: "Crea Formularios Atractivos, Sin Esfuerzo",
            description: "Nuestro creador de formularios dinámicos te permite crear, gestionar y desplegar formularios personalizados en minutos. Descubre cómo FormForge puede revolucionar tu recopilación de datos.",
            image: "https://picsum.photos/seed/formforge-hero/1200/800",
            formTitle: "Ponte en Contacto",
            formDescription: "Rellena el siguiente formulario y nos pondremos en contacto contigo.",
        };
    }
}

export async function updateSiteContent(content: SiteContent) {
    console.log("Actualizando contenido del sitio:", content);
    try {
        await db.collection('landing_page_contents').doc('main').set(content, { merge: true });
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "No se pudieron guardar los cambios.";
        return { success: false, message: errorMessage };
    }
}
