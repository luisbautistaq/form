import { ResponsesTable } from "@/components/admin/responses-table";
import { getSubmissions } from "@/lib/actions";

export default async function ResponsesPage() {
    const submissions = await getSubmissions();

    // Los campos de la tabla serán dinámicos basados en un esquema de formulario en una aplicación real.
    // Por ahora, los codificaremos basándonos en nuestros datos de envío de prueba.
    const formFields = [
        { id: 'name', label: 'Nombre Completo' },
        { id: 'email', label: 'Correo Electrónico' },
        { id: 'interest', label: 'Interés' },
    ];
    
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
