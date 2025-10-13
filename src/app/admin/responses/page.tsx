'use client';

import { ResponsesTable } from "@/components/admin/responses-table";
import { useCollection, useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import { collection, doc, Timestamp } from "firebase/firestore";
import type { FormField } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const FORM_ID = "main_contact_form";

export default function ResponsesPage() {
    const firestore = useFirestore();

    const submissionsQuery = useMemoFirebase(
        () => collection(firestore, `forms/${FORM_ID}/form_submissions`),
        [firestore]
    );
    const { data: submissionsData, isLoading: submissionsLoading } = useCollection(submissionsQuery);
    
    const formSchemaRef = useMemoFirebase(
        () => doc(firestore, `forms/${FORM_ID}`),
        [firestore]
    );
    const { data: formSchemaData, isLoading: schemaLoading } = useDoc<{schema: string}>(formSchemaRef);

    const submissions = submissionsData?.map(s => ({
        id: s.id,
        // Convertir Timestamp de Firestore a Date
        createdAt: s.submissionDate instanceof Timestamp ? s.submissionDate.toDate() : new Date(),
        data: s.formData,
    })) || [];

    const formFields: FormField[] = formSchemaData ? JSON.parse(formSchemaData.schema || '[]') : [];

    const tableFields = formFields.map(f => ({ id: f.id, label: f.label, type: f.type }));

    if (submissionsLoading || schemaLoading) {
        return (
             <div className="space-y-6">
                <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Respuestas del Formulario</h1>
                    <p className="text-muted-foreground">Ve, filtra y exporta todos los envíos de formularios.</p>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </div>
        )
    }
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Respuestas del Formulario</h1>
                <p className="text-muted-foreground">Ve, filtra y exporta todos los envíos de formularios.</p>
            </div>
            <ResponsesTable data={submissions} formFields={tableFields} />
        </div>
    );
}
