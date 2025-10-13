"use client";

import { useState } from 'react';
import type { FormField, FormFieldType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { updateFormSchema } from '@/lib/actions';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface FormEditorClientProps {
  initialSchema: FormField[];
}

export function FormEditorClient({ initialSchema }: FormEditorClientProps) {
  const [schema, setSchema] = useState<FormField[]>(initialSchema.sort((a,b) => a.order - b.order));
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleAddField = (field: Omit<FormField, 'id' | 'order'>) => {
    const newField: FormField = {
        ...field,
        id: field.label.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now(),
        order: schema.length > 0 ? Math.max(...schema.map(f => f.order)) + 1 : 0,
    };
    setSchema([...schema, newField]);
  };

  const handleEditField = (updatedField: FormField) => {
    setSchema(schema.map(f => f.id === updatedField.id ? updatedField : f));
  };

  const handleDeleteField = (fieldId: string) => {
    setSchema(schema.filter(f => f.id !== fieldId));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newSchema = [...schema];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSchema.length) return;

    // Swap orders
    [newSchema[index].order, newSchema[targetIndex].order] = [newSchema[targetIndex].order, newSchema[index].order];
    
    setSchema(newSchema.sort((a,b) => a.order - b.order));
  };
  
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
        await updateFormSchema(schema);
        toast({ title: "Success", description: "Form schema updated successfully." });
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to save changes." });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Form Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {schema.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 rounded-md border p-4">
                        <div className="flex-1">
                            <p className="font-medium">{field.label} <span className="text-sm text-muted-foreground">({field.type})</span></p>
                            <p className="text-xs text-muted-foreground">ID: {field.id} {field.required && " | Required"}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => moveField(index, 'up')} disabled={index === 0}>
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                             <Button variant="ghost" size="icon" onClick={() => moveField(index, 'down')} disabled={index === schema.length - 1}>
                                <ArrowDown className="h-4 w-4" />
                            </Button>
                            <FieldEditorDialog field={field} onSave={handleEditField}>
                                <Button variant="outline" size="icon"><Edit className="h-4 w-4"/></Button>
                            </FieldEditorDialog>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteField(field.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                {schema.length === 0 && <p className="text-center text-muted-foreground">No fields yet. Add one to get started.</p>}
            </CardContent>
        </Card>
        
        <div className="flex justify-between">
            <FieldEditorDialog onSave={handleAddField}>
                <Button><Plus className="mr-2 h-4 w-4" /> Add Field</Button>
            </FieldEditorDialog>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
            </Button>
        </div>
    </div>
  );
}


function FieldEditorDialog({
    children,
    field,
    onSave,
}: {
    children: React.ReactNode;
    field?: FormField;
    onSave: (data: any) => void;
}) {
    const [open, setOpen] = useState(false);
    const [label, setLabel] = useState(field?.label || '');
    const [placeholder, setPlaceholder] = useState(field?.placeholder || '');
    const [type, setType] = useState<FormFieldType>(field?.type || 'text');
    const [required, setRequired] = useState(field?.required || false);
    const [options, setOptions] = useState(field?.options?.join(', ') || '');

    const handleSave = () => {
        const fieldData = {
            ...field,
            label,
            placeholder,
            type,
            required,
            options: type === 'select' ? options.split(',').map(o => o.trim()) : undefined,
        };
        onSave(fieldData);
        setOpen(false);
        // Reset form for "Add" case
        if (!field) {
            setLabel(''); setPlaceholder(''); setType('text'); setRequired(false); setOptions('');
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{field ? 'Edit Field' : 'Add New Field'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <Select value={type} onValueChange={(v: FormFieldType) => setType(v)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select field type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="textarea">Textarea</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="select">Select</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="label" className="text-right">Label</Label>
                        <Input id="label" value={label} onChange={e => setLabel(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="placeholder" className="text-right">Placeholder</Label>
                        <Input id="placeholder" value={placeholder} onChange={e => setPlaceholder(e.target.value)} className="col-span-3" />
                    </div>
                    {type === 'select' && <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="options" className="text-right">Options</Label>
                        <Input id="options" placeholder="Option1, Option2" value={options} onChange={e => setOptions(e.target.value)} className="col-span-3" />
                    </div>}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Required</Label>
                        <Checkbox checked={required} onCheckedChange={(c) => setRequired(!!c)} className="col-span-3 justify-self-start" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
