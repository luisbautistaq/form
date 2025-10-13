import { ContentEditorClient } from "@/components/admin/content-editor-client";
import { getSiteContent } from "@/lib/actions";

export default async function ContentEditorPage() {
    const content = await getSiteContent();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Content Editor</h1>
                <p className="text-muted-foreground">Update the text and images on the public landing page.</p>
            </div>
            <ContentEditorClient initialContent={content} />
        </div>
    );
}
