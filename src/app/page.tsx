'use client';

import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { Footer } from "@/components/landing/footer";
import type { SiteContent, FormField } from "@/lib/types";
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaceHolderImages } from "@/lib/placeholder-images";

// ID del formulario y del contenido a cargar.
const FORM_ID = "main_contact_form";
const CONTENT_ID = "main";

function isValidUrl(string: string | undefined) {
    if (!string) return false;
    try {
        new URL(string);
        return string.startsWith('http://') || string.startsWith('https://');
    } catch (_) {
        return false;  
    }
}

export default function Home() {
  const firestore = useFirestore();

  // Hook para obtener el contenido del sitio desde Firestore
  const contentRef = useMemoFirebase(
    () => (firestore ? doc(firestore, `landing_page_contents/${CONTENT_ID}`) : null),
    [firestore]
  );
  const { data: siteContentData, isLoading: isContentLoading } = useDoc<SiteContent>(contentRef);

  // Hook para obtener el esquema del formulario desde Firestore
  const formSchemaRef = useMemoFirebase(
    () => (firestore ? doc(firestore, `forms/${FORM_ID}`) : null),
    [firestore]
  );
  const { data: formSchemaData, isLoading: isSchemaLoading } = useDoc<{ schema: string }>(formSchemaRef);
  
  const formSchema: FormField[] = formSchemaData?.schema ? JSON.parse(formSchemaData.schema) : [];
  const placeholderImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  // Define el contenido del sitio con fallbacks y validación de URL
  const siteContent: SiteContent = {
      headline: siteContentData?.headline || "Crea Formularios Dinámicos Fácilmente",
      description: siteContentData?.description || "Construye, gestiona y analiza envíos de formularios con nuestra potente plataforma.",
      image: isValidUrl(siteContentData?.image) ? siteContentData!.image : placeholderImage?.imageUrl || "https://picsum.photos/seed/formforge-hero/1200/800",
      formTitle: siteContentData?.formTitle || "Contáctanos",
      formDescription: siteContentData?.formDescription || "Rellena el formulario y nos pondremos en contacto contigo.",
  };


  // Muestra un esqueleto de carga mientras se obtienen los datos.
  if (isContentLoading || isSchemaLoading) {
    return (
        <div className="flex min-h-dvh flex-col bg-background">
            <Header />
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-12 w-full max-w-2xl" />
                                    <Skeleton className="h-6 w-full max-w-lg" />
                                </div>
                                <Skeleton className="aspect-[3/2] w-full" />
                            </div>
                            <div className="flex items-center justify-center">
                                <Skeleton className="h-[550px] w-full max-w-lg" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection siteContent={siteContent} formSchema={formSchema} />
      </main>
      <Footer />
    </div>
  );
}
