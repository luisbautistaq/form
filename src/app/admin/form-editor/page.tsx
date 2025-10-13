import { FormEditorClient } from "@/components/admin/form-editor-client";
import { getFormSchema } from "@/lib/actions";

export default async function FormEditorPage() {
    const schema = await getFormSchema();
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Form Editor</h1>
                <p className="text-muted-foreground">Add, edit, reorder, and delete form fields.</p>
            </div>
            <FormEditorClient initialSchema={schema} />
        </div>
    );
}
