"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import type { SiteContent } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";


interface ContentEditorClientProps {
  initialContent: SiteContent;
}

const formSchema = z.object({
  headline: z.string().min(1, "El titular es obligatorio."),
  description: z.string().min(1, "La descripción es obligatoria."),
  image: z.string().url("Debe ser una URL válida."),
  formTitle: z.string().min(1, "El título del formulario es obligatorio."),
  formDescription: z.string().min(1, "La descripción del formulario es obligatoria."),
});

export function ContentEditorClient({ initialContent }: ContentEditorClientProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialContent,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const contentRef = doc(firestore, 'landing_page_contents/main');
    
    setDoc(contentRef, values, { merge: true })
      .then(() => {
        toast({
          title: "¡Éxito!",
          description: "El contenido del sitio ha sido actualizado.",
        });
      })
      .catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: contentRef.path,
          operation: 'update',
          requestResourceData: values,
        });
        errorEmitter.emit('permission-error', permissionError);

        toast({
          variant: "destructive",
          title: "¡Uy! Algo salió mal.",
          description: "Hubo un problema al guardar tus cambios.",
        });
      });
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Contenido de la Página de Inicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titular</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu titular llamativo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Una breve descripción de tu servicio." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de la Imagen Principal</FormLabel>
                  <FormControl>
                    <Input placeholder="https://ejemplo.com/imagen.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="formTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del Formulario</FormLabel>
                  <FormControl>
                    <Input placeholder="Título para el formulario de contacto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="formDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del Formulario</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Una breve descripción para el formulario de contacto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
