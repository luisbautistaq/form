'use client';

import { FormEditorClient } from "@/components/admin/form-editor-client";
import { useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import type { FormField } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const FORM_ID = "main_contact_form";

export default function FormEditorPage() {
    const firestore = useFirestore();
    const formSchemaRef = useMemoFirebase(
        () => firestore ? doc(firestore, `forms/${FORM_ID}`) : null,
        [firestore]
    );
    const { data, isLoading } = useDoc<{schema: string}>(formSchemaRef);

    if (isLoading || !firestore) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Editor de Formularios</h1>
                    <p className="text-muted-foreground">Añade, edita, reordena y elimina campos del formulario.</p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                    <div className="md:col-span-2">
                         <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </div>
        );
    }
    
    const schema: FormField[] = data?.schema ? JSON.parse(data.schema) : [];

    return (
        <FormEditorClient initialSchema={schema} formId={FORM_ID}/>
    );
}
