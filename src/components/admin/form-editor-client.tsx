"use client";

import { useState, useEffect } from 'react';
import type { FormField, FormFieldType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, GripVertical, FileText, Mail, MessageSquare, Hash, Calendar, ChevronDown, CheckSquare, Pencil, XCircle } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface FormEditorClientProps {
  initialSchema: FormField[];
  formId: string;
}

const fieldIcons: Record<FormFieldType, React.ElementType> = {
    text: FileText,
    email: Mail,
    textarea: MessageSquare,
    number: Hash,
    date: Calendar,
    select: ChevronDown,
    checkbox: CheckSquare,
};


export function FormEditorClient({ initialSchema, formId }: FormEditorClientProps) {
  const firestore = useFirestore();
  const [schema, setSchema] = useState<FormField[]>(initialSchema.sort((a,b) => a.order - b.order));
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(initialSchema[0]?.id || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const selectedField = schema.find(f => f.id === selectedFieldId);

  const handleAddField = () => {
    const newField: FormField = {
        id: 'new_field_' + Date.now(),
        label: 'Nuevo Campo',
        type: 'text',
        required: false,
        order: schema.length > 0 ? Math.max(...schema.map(f => f.order)) + 1 : 0,
    };
    setSchema([...schema, newField]);
    setSelectedFieldId(newField.id);
  };

  const handleUpdateField = (updatedField: FormField) => {
    setSchema(schema.map(f => f.id === updatedField.id ? updatedField : f));
  };

  const handleDeleteField = (fieldId: string) => {
    const newSchema = schema.filter(f => f.id !== fieldId).map((f, index) => ({...f, order: index}));
    setSchema(newSchema);
    if (selectedFieldId === fieldId) {
        setSelectedFieldId(newSchema[0]?.id || null);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(schema);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedSchema = items.map((item, index) => ({ ...item, order: index }));
    setSchema(updatedSchema);
  };
  
  const handleSaveChanges = async () => {
    setIsSaving(true);
    if (!firestore) {
        toast({ variant: "destructive", title: "Error", description: "No se pudo conectar a la base de datos." });
        setIsSaving(false);
        return;
    }
    const formDocRef = doc(firestore, `forms/${formId}`);
    const payload = { 
        schema: JSON.stringify(schema)
    };

    setDoc(formDocRef, payload, { merge: true })
      .then(() => {
        toast({ title: "Éxito", description: "El esquema del formulario se actualizó correctamente." });
      })
      .catch((serverError) => {
          const permissionError = new FirestorePermissionError({
            path: formDocRef.path,
            operation: 'update',
            requestResourceData: payload,
          });
          errorEmitter.emit('permission-error', permissionError);
          toast({ variant: "destructive", title: "Error", description: "No se pudieron guardar los cambios." });
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">Editor de Formularios</h1>
                <p className="text-muted-foreground">Añade, edita, reordena y elimina campos del formulario.</p>
            </div>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
        </div>
       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Left Panel: Field List */}
            <div className="md:col-span-1 space-y-2">
                 <Button onClick={handleAddField} className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Añadir Campo
                </Button>
                {isClient && (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="fields">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-2'>
                                    {schema.map((field, index) => {
                                        const Icon = fieldIcons[field.type] || FileText;
                                        return (
                                            <Draggable key={field.id} draggableId={field.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <Card 
                                                            onClick={() => setSelectedFieldId(field.id)}
                                                            className={`p-3 cursor-pointer flex items-center gap-3 transition-all ${selectedFieldId === field.id ? 'border-primary shadow-lg' : 'hover:bg-muted/50'} ${snapshot.isDragging ? 'shadow-xl' : ''}`}
                                                        >
                                                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                            <Icon className="h-5 w-5 text-primary" />
                                                            <div className='flex-1'>
                                                                <p className="font-medium text-sm">{field.label}</p>
                                                                <p className="text-xs text-muted-foreground">{field.type}</p>
                                                            </div>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => {e.stopPropagation(); handleDeleteField(field.id)}}>
                                                                <Trash2 className="h-4 w-4 text-destructive"/>
                                                            </Button>
                                                        </Card>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
                 {schema.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Aún no hay campos.</p>
                        <p className="text-sm text-muted-foreground">Añade uno para empezar.</p>
                    </div>
                )}
            </div>

            {/* Right Panel: Field Editor */}
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {selectedField ? <><Pencil className="h-5 w-5"/> Editar Campo</> : <><XCircle className="h-5 w-5"/> Ningún Campo Seleccionado</>}
                        </CardTitle>
                         <CardDescription>
                            {selectedField ? 'Modifica las propiedades del campo seleccionado.' : 'Selecciona un campo de la izquierda o añade uno nuevo.'}
                        </CardDescription>
                    </CardHeader>
                   {selectedField ? (
                     <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="label">Etiqueta</Label>
                                <Input 
                                    id="label"
                                    value={selectedField.label}
                                    onChange={e => handleUpdateField({...selectedField, label: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Tipo</Label>
                                <Select value={selectedField.type} onValueChange={(v: FormFieldType) => handleUpdateField({...selectedField, type: v})}>
                                    <SelectTrigger id="type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="text">Texto</SelectItem>
                                        <SelectItem value="email">Correo Electrónico</SelectItem>
                                        <SelectItem value="textarea">Área de texto</SelectItem>
                                        <SelectItem value="number">Número</SelectItem>
                                        <SelectItem value="date">Fecha</SelectItem>
                                        <SelectItem value="select">Selección</SelectItem>
                                        <SelectItem value="checkbox">Caja de verificación</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="placeholder">Marcador de posición (Placeholder)</Label>
                            <Input 
                                id="placeholder"
                                value={selectedField.placeholder || ''}
                                onChange={e => handleUpdateField({...selectedField, placeholder: e.target.value})}
                            />
                        </div>
                         {selectedField.type === 'select' && (
                             <div className="space-y-2">
                                <Label htmlFor="options">Opciones (separadas por comas)</Label>
                                <Input 
                                    id="options"
                                    placeholder="Opción 1, Opción 2, Opción 3"
                                    value={selectedField.options?.join(', ') || ''}
                                    onChange={e => handleUpdateField({...selectedField, options: e.target.value.split(',').map(s => s.trim())})}
                                />
                            </div>
                         )}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="required"
                                checked={selectedField.required}
                                onCheckedChange={c => handleUpdateField({...selectedField, required: !!c})}
                            />
                            <Label htmlFor="required" className="cursor-pointer">Este campo es obligatorio</Label>
                        </div>
                     </CardContent>
                   ) : (
                    <CardContent>
                        <div className="flex flex-col items-center justify-center text-center h-60 border-2 border-dashed rounded-lg">
                           <p className="text-muted-foreground font-medium">Selecciona un campo para editarlo</p>
                           <p className="text-sm text-muted-foreground">O haz clic en "Añadir Campo" para empezar a construir tu formulario.</p>
                        </div>
                    </CardContent>
                   )}
                </Card>
            </div>
        </div>
    </div>
  );
}

    