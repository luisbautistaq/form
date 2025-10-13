import { ResponsesTable } from "@/components/admin/responses-table";
import { getSubmissions } from "@/lib/actions";

export default async function ResponsesPage() {
    const submissions = await getSubmissions();

    // The fields for the table will be dynamic based on a form schema in a real app.
    // For now, we'll hardcode them based on our mock submission data.
    const formFields = [
        { id: 'name', label: 'Full Name' },
        { id: 'email', label: 'Email' },
        { id: 'interest', label: 'Interest' },
    ];
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Form Responses</h1>
                <p className="text-muted-foreground">View, filter, and export all form submissions.</p>
            </div>
            <ResponsesTable data={submissions} formFields={formFields} />
        </div>
    );
}
