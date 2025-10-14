'use client';

import { ContentEditorClient } from "@/components/admin/content-editor-client";
import { useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import type { SiteContent } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ContentEditorPage() {
    const firestore = useFirestore();
    const contentRef = useMemoFirebase(
        () => firestore ? doc(firestore, 'landing_page_contents/main') : null,
        [firestore]
    );
    const { data, isLoading } = useDoc<SiteContent>(contentRef);

    if (isLoading || !firestore) {
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

    const placeholderImage = PlaceHolderImages.find(p => p.id === 'hero-image');

    const initialContent: SiteContent = data || {
        headline: "",
        description: "",
        image: placeholderImage?.imageUrl || "",
        formTitle: "",
        formDescription: "",
    };

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
