import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { Footer } from "@/components/landing/footer";
import type { SiteContent, FormField } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";

// In a real application, you would fetch this data from your database.
// For example:
// import { getSiteContent, getFormSchema } from "@/lib/actions";
// const siteContent = await getSiteContent();
// const formSchema = await getFormSchema();

const getMockSiteContent = (): SiteContent => {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');
  return {
    headline: "Crea Formularios Atractivos, Sin Esfuerzo",
    description: "Nuestro creador de formularios dinámicos te permite crear, gestionar y desplegar formularios personalizados en minutos. Descubre cómo FormForge puede revolucionar tu recopilación de datos.",
    image: heroImage?.imageUrl || "https://picsum.photos/seed/formforge-hero/1200/800",
    formTitle: "Ponte en Contacto",
    formDescription: "Rellena el siguiente formulario y nos pondremos en contacto contigo.",
  };
};

const getMockFormSchema = (): FormField[] => {
  return [
    { id: 'name', type: 'text', label: 'Nombre Completo', placeholder: 'John Doe', required: true, order: 1 },
    { id: 'email', type: 'email', label: 'Dirección de Correo Electrónico', placeholder: 'john.doe@example.com', required: true, order: 2 },
    { id: 'interest', type: 'select', label: 'Interés Principal', required: true, order: 3, options: ['Consulta de Producto', 'Soporte', 'Asociación', 'Otro'] },
    { id: 'feedback', type: 'textarea', label: 'Tu Mensaje', placeholder: 'Cuéntanos qué piensas...', required: false, order: 4 },
  ];
};

export default async function Home() {
  const siteContent = getMockSiteContent();
  const formSchema = getMockFormSchema();

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
