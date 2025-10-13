import type { SiteContent, FormField } from "@/lib/types";
import Image from "next/image";
import { DynamicForm } from "./dynamic-form";

interface HeroSectionProps {
  siteContent: SiteContent;
  formSchema: FormField[];
}

export function HeroSection({ siteContent, formSchema }: HeroSectionProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                {siteContent.headline}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {siteContent.description}
              </p>
            </div>
            <div className="relative mt-6 aspect-[3/2] w-full overflow-hidden rounded-xl">
               <Image
                    src={siteContent.image}
                    alt="Hero Image"
                    fill
                    className="object-cover"
                    data-ai-hint="abstract tech"
                />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <DynamicForm 
              formSchema={formSchema} 
              formTitle={siteContent.formTitle}
              formDescription={siteContent.formDescription}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
