import { ContentEditorClient } from "@/components/admin/content-editor-client";
import { getSiteContent } from "@/lib/actions";

export default async function ContentEditorPage() {
    const content = await getSiteContent();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Editor de Contenido</h1>
                <p className="text-muted-foreground">Actualiza el texto y las imágenes de la página de inicio pública.</p>
            </div>
            <ContentEditorClient initialContent={content} />
        </div>
    );
}
