'use client';

import { ContentEditorClient } from "@/components/admin/content-editor-client";
import { useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import type { SiteContent } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContentEditorPage() {
    const firestore = useFirestore();
    const contentRef = useMemoFirebase(
        () => doc(firestore, 'landing_page_contents/main'),
        [firestore]
    );
    const { data, isLoading } = useDoc<SiteContent>(contentRef);

    const initialContent: SiteContent = data || {
        headline: "",
        description: "",
        image: "",
        formTitle: "",
        formDescription: "",
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Editor de Contenido</h1>
                    <p className="text-muted-foreground">Actualiza el texto y las imágenes de la página de inicio pública.</p>
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Editor de Contenido</h1>
                <p className="text-muted-foreground">Actualiza el texto y las imágenes de la página de inicio pública.</p>
            </div>
            <ContentEditorClient initialContent={initialContent} />
        </div>
    );
}
