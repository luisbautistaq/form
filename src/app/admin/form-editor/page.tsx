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
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }
    
    const schema: FormField[] = data ? JSON.parse(data.schema || '[]') : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Editor de Formularios</h1>
                <p className="text-muted-foreground">Añade, edita, reordena y elimina campos del formulario.</p>
            </div>
            <FormEditorClient initialSchema={schema} formId={FORM_ID}/>
        </div>
    );
}
