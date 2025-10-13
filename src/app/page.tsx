'use client';

import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { Footer } from "@/components/landing/footer";
import type { SiteContent, FormField } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";

// Datos estáticos para desacoplar la página de inicio de Firestore y evitar errores de permisos.
const staticFormSchema: FormField[] = [
    { id: "name", label: "Nombre", type: "text", required: true, order: 0, placeholder: "Tu nombre completo" },
    { id: "email", label: "Correo Electrónico", type: "email", required: true, order: 1, placeholder: "tu@email.com" },
    { id: "message", label: "Mensaje", type: "textarea", required: false, order: 2, placeholder: "Escribe tu mensaje aquí..." }
];

export default function Home() {
  const firestore = useFirestore();

  // Obtener contenido del sitio - Mantenemos esto ya que la lectura de contenido es pública.
  const siteContentRef = useMemoFirebase(
    () => firestore ? doc(firestore, 'landing_page_contents/main') : null,
    [firestore]
  );
  const { data: siteContentData, isLoading: isContentLoading } = useDoc<Omit<SiteContent, 'image'>> (siteContentRef);
  
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');
  const siteContent: SiteContent = {
    headline: siteContentData?.headline || "Crea Formularios Atractivos, Sin Esfuerzo",
    description: siteContentData?.description || "Nuestro creador de formularios dinámicos te permite crear, gestionar y desplegar formularios personalizados en minutos.",
    image: heroImage?.imageUrl || "https://picsum.photos/seed/formforge-hero/1200/800",
    formTitle: siteContentData?.formTitle || "Ponte en Contacto",
    formDescription: siteContentData?.formDescription || "Rellena el siguiente formulario y nos pondremos en contacto contigo.",
  }

  if (isContentLoading) {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <Header />
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                  </div>
                  <Skeleton className="aspect-[3/2] w-full" />
                </div>
                <div className="flex items-center justify-center">
                  <Skeleton className="h-[580px] w-full max-w-lg" />
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection siteContent={siteContent} formSchema={staticFormSchema} />
      </main>
      <Footer />
    </div>
  );
}
