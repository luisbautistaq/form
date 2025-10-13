'use client';

import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { Footer } from "@/components/landing/footer";
import type { SiteContent, FormField } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Skeleton } from "@/components/ui/skeleton";

// Datos estáticos para desacoplar la página de inicio de Firestore y evitar errores de permisos.
const staticFormSchema: FormField[] = [
    { id: "name", label: "Nombre", type: "text", required: true, order: 0, placeholder: "Tu nombre completo" },
    { id: "email", label: "Correo Electrónico", type: "email", required: true, order: 1, placeholder: "tu@email.com" },
    { id: "message", label: "Mensaje", type: "textarea", required: false, order: 2, placeholder: "Escribe tu mensaje aquí..." }
];

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

const staticSiteContent: SiteContent = {
  headline: "Crea Formularios Atractivos, Sin Esfuerzo",
  description: "Nuestro creador de formularios dinámicos te permite crear, gestionar y desplegar formularios personalizados en minutos.",
  image: heroImage?.imageUrl || "https://picsum.photos/seed/formforge-hero/1200/800",
  formTitle: "Ponte en Contacto",
  formDescription: "Rellena el siguiente formulario y nos pondremos en contacto contigo.",
}

export default function Home() {
  // No se realiza ninguna llamada a Firestore aquí para evitar errores de permisos en la página pública.
  // El contenido se carga de forma estática.
  
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection siteContent={staticSiteContent} formSchema={staticFormSchema} />
      </main>
      <Footer />
    </div>
  );
}
