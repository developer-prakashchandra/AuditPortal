export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'url' | 'password' | 'textarea' | 'select' | 'dropdown' | 'checkbox' | 'radio' | 'date' | 'time';
  value?: any;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  validators?: FormValidator[];
  columns?: number;
  rows?: number;
  hint?: string;
  helpText?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface FormFieldOption {
  label: string;
  value: any;
}

export interface FormValidator {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern';
  value?: any;
  message?: string;
}

export interface FormFieldGroup {
  groupTitle?: string;
  fields: FormField[];
}

export interface FormSection {
  title: string;
  fields?: FormField[];
  layout?: 'columns' | 'rows' | 'dynamic-rows';
  columns?: number; // For columns layout (1, 2, 3, 4, etc.) - default: 2
  rowHeaders?: string[]; // For rows layout (column headers)
  fieldGroups?: FormFieldGroup[];
  minRows?: number; // For dynamic-rows layout (minimum rows)
  maxRows?: number; // For dynamic-rows layout (maximum rows)
  initialRows?: number; // For dynamic-rows layout (initial rows to display)
}

export interface AuditForm {
  id: string;
  title: string;
  description?: string;
  sections: FormSection[];
  layout?: string;
  nextReviewDate?: string;
  formCode?: string;
  version?: string;
  groupCode?: string;
  groupName?: string;
}

