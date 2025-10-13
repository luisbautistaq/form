'use client';

import { ResponsesTable } from "@/components/admin/responses-table";
import { useCollection, useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { FormField, FormSubmission as FormSubmissionType } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Timestamp } from "firebase/firestore";

const FORM_ID = "main_contact_form";

export default function ResponsesPage() {
    const firestore = useFirestore();
    
    const formSchemaRef = useMemoFirebase(
        () => firestore ? doc(firestore, `forms/${FORM_ID}`) : null,
        [firestore]
    );
    const { data: formSchemaData, isLoading: schemaLoading } = useDoc<{schema: string}>(formSchemaRef);

    const submissionsQuery = useMemoFirebase(
        () => firestore ? collection(firestore, `forms/${FORM_ID}/form_submissions`) : null,
        [firestore]
    );
    const { data: submissionsData, isLoading: submissionsLoading } = useCollection<FormSubmissionType>(submissionsQuery);

    const isLoading = schemaLoading || submissionsLoading;

    if (isLoading) {
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

    const formFields: FormField[] = formSchemaData?.schema ? JSON.parse(formSchemaData.schema) : [];

    const submissions = submissionsData?.map(s => {
        const formData = s.formData || {};
        const submissionDate = s.submissionDate;
        
        let createdAt: Date;
        if (submissionDate instanceof Timestamp) {
            createdAt = submissionDate.toDate();
        } else if (typeof submissionDate === 'string') {
            createdAt = new Date(submissionDate);
        } else {
            createdAt = new Date(); // Fallback
        }

        return {
            id: s.id,
            createdAt: createdAt,
            data: formData,
        };
    }) || [];
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Respuestas del Formulario</h1>
                <p className="text-muted-foreground">Ve, filtra y exporta todos los envíos de formularios.</p>
            </div>
            <ResponsesTable data={submissions} formFields={formFields} />
        </div>
    );
}
