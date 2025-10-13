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
    headline: "Build Beautiful Forms, Effortlessly",
    description: "Our dynamic form builder allows you to create, manage, and deploy custom forms in minutes. See how FormForge can revolutionize your data collection.",
    image: heroImage?.imageUrl || "https://picsum.photos/seed/formforge-hero/1200/800",
    formTitle: "Get In Touch",
    formDescription: "Fill out the form below and we'll get back to you.",
  };
};

const getMockFormSchema = (): FormField[] => {
  return [
    { id: 'name', type: 'text', label: 'Full Name', placeholder: 'John Doe', required: true, order: 1 },
    { id: 'email', type: 'email', label: 'Email Address', placeholder: 'john.doe@example.com', required: true, order: 2 },
    { id: 'interest', type: 'select', label: 'Primary Interest', required: true, order: 3, options: ['Product Inquiry', 'Support', 'Partnership', 'Other'] },
    { id: 'feedback', type: 'textarea', label: 'Your Message', placeholder: 'Tell us what you think...', required: false, order: 4 },
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
