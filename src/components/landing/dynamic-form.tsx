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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FormField as FormFieldType } from "@/lib/types";
import { submitForm } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

interface DynamicFormProps {
  formSchema: FormFieldType[];
  formTitle: string;
  formDescription: string;
}

export function DynamicForm({ formSchema, formTitle, formDescription }: DynamicFormProps) {
  const { toast } = useToast();

  const generateSchema = (fields: FormFieldType[]) => {
    const schema: { [key: string]: z.ZodType<any, any> } = {};
    fields.forEach((field) => {
      let zodField: z.ZodType<any, any>;
      switch (field.type) {
        case "email":
          zodField = z.string().email({ message: "Dirección de correo electrónico no válida." });
          break;
        case "number":
          zodField = z.coerce.number();
          break;
        case "date":
          zodField = z.date();
          break;
        default:
          zodField = z.string();
      }
      if (field.required) {
        zodField = zodField.min(1, { message: `${field.label} es obligatorio.` });
      } else {
        zodField = zodField.optional();
      }
      schema[field.id] = zodField;
    });
    return z.object(schema);
  };
  
  const formZodSchema = generateSchema(formSchema);
  type FormValues = z.infer<typeof formZodSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formZodSchema),
    defaultValues: formSchema.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {}),
  });

  async function onSubmit(data: FormValues) {
    try {
      await submitForm(data);
      toast({
        title: "¡Éxito!",
        description: "Tu formulario ha sido enviado.",
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "¡Uy! Algo salió mal.",
        description: "Hubo un problema con tu envío.",
      });
    }
  }

  const renderField = (fieldConfig: FormFieldType, formField: any) => {
    const commonProps = { ...formField, placeholder: fieldConfig.placeholder };
    switch (fieldConfig.type) {
      case "textarea":
        return <Textarea {...commonProps} />;
      case "select":
        return (
          <Select onValueChange={formField.onChange} defaultValue={formField.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={fieldConfig.placeholder || "Selecciona una opción"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {fieldConfig.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return <Input type={fieldConfig.type} {...commonProps} />;
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{formTitle}</CardTitle>
        <CardDescription>{formDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {formSchema.sort((a,b) => a.order - b.order).map((fieldConfig) => (
              <FormField
                key={fieldConfig.id}
                control={form.control}
                name={fieldConfig.id as keyof FormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fieldConfig.label}</FormLabel>
                    <FormControl>
                      {renderField(fieldConfig, field)}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Formulario'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
