export type FormFieldType = 'text' | 'email' | 'textarea' | 'number' | 'date' | 'select';

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select type
  order: number;
}

export interface SiteContent {
  headline: string;
  description: string;
  image: string;
  formTitle: string;
  formDescription: string;
}

export interface FormSubmission {
  id: string;
  createdAt: Date;
  data: Record<string, any>;
}
