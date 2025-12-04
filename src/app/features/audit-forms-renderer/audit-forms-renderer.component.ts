import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { FormRendererService } from '../../core/services/form-renderer.service';
import { AuditForm, FormSection, FormField, FormFieldGroup } from '../../core/models/form.model';

@Component({
  selector: 'app-audit-forms-renderer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
    CheckboxModule,
    RadioButtonModule,
    CalendarModule,
    MessageModule,
    ProgressSpinnerModule,
    TooltipModule
  ],
  templateUrl: './audit-forms-renderer.component.html',
  styleUrls: ['./audit-forms-renderer.component.css']
})
export class AuditFormsRendererComponent implements OnInit {
  auditForm: AuditForm | null = null;
  formGroups: Map<string, FormGroup> = new Map();
  dynamicRowsCount: Map<string, number> = new Map(); // Track row count per dynamic section
  loading = true;
  error = '';
  auditId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formRendererService: FormRendererService
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async params => {
      this.auditId = params['auditId'];
      await this.loadForm();
    });
  }

  private async loadForm(): Promise<void> {
    try {
      this.loading = true;
      this.error = '';
      this.auditForm = await this.formRendererService.loadAuditForm(this.auditId);
      
      // Create form groups for each section
      if (this.auditForm) {
        this.auditForm.sections.forEach(section => {
          let formGroup: FormGroup;
          
          // Handle rows layout (merged multi-rows and shift-columns)
          if (section.layout === 'rows' && section.rowHeaders && section.fieldGroups) {
            const allFields: FormField[] = [];
            section.fieldGroups.forEach((group: FormFieldGroup) => {
              group.fields.forEach((field: FormField) => {
                // Create field for each row header
                section.rowHeaders?.forEach((header: string, index: number) => {
                  const isFirstColumn = index === 0;
                  allFields.push({
                    ...field,
                    name: header + '_' + field.name,
                    // First column (e.g., Shift-A) always required if original is required
                    // Subsequent columns conditionally required for operatorName
                    required: isFirstColumn ? field.required : 
                              (field.name === 'operatorName' ? false : field.required)
                  });
                });
              });
            });
            formGroup = this.formRendererService.createFormGroup(allFields);
          } 
          // Handle dynamic-rows layout
          else if (section.layout === 'dynamic-rows' && section.fields) {
            const initialRows = section.initialRows || section.minRows || 1;
            this.dynamicRowsCount.set(section.title, initialRows);
            
            const allFields: FormField[] = [];
            for (let i = 0; i < initialRows; i++) {
              section.fields.forEach((field: FormField) => {
                allFields.push({
                  ...field,
                  name: `row${i}_${field.name}`
                });
              });
            }
            formGroup = this.formRendererService.createFormGroup(allFields);
          }
          // Handle columns layout (default)
          else {
            formGroup = this.formRendererService.createFormGroup(section.fields || []);
          }
          
          this.formGroups.set(section.title, formGroup);
        });

        // Setup date to day auto-population
        this.setupDateToDayListener();
        
        // Setup conditional validation for Shift-B based on Shift-A
        this.setupConditionalValidation();
      }
      
      this.loading = false;
    } catch (error) {
      this.error = 'Failed to load audit form. Please try again.';
      this.loading = false;
      console.error('Error loading form:', error);
    }
  }

  getFormGroup(sectionTitle: string): FormGroup {
    return this.formGroups.get(sectionTitle) || new FormGroup({});
  }

  isFieldInvalid(section: FormSection, field: FormField): boolean {
    const formGroup = this.getFormGroup(section.title);
    const control = formGroup.get(field.name);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(section: FormSection, field: FormField): string {
    const formGroup = this.getFormGroup(section.title);
    const control = formGroup.get(field.name);
    if (control) {
      return this.formRendererService.getErrorMessage(field, control);
    }
    return '';
  }

  onSubmit(): void {
    // Validate all form groups
    let allValid = true;
    const formData: any = {};

    this.formGroups.forEach((formGroup, sectionTitle) => {
      if (formGroup.invalid) {
        allValid = false;
        Object.keys(formGroup.controls).forEach(key => {
          formGroup.controls[key].markAsTouched();
        });
      } else {
        formData[sectionTitle] = formGroup.value;
      }
    });

    if (allValid) {
      console.log('Form submitted:', formData);
      alert('Audit form submitted successfully!');
      this.goBack();
    } else {
      alert('Please fix validation errors before submitting.');
    }
  }

  goBack(): void {
    this.router.navigate(['/area']);
  }

  private setupDateToDayListener(): void {
    // Find sections with date field and day field
    this.formGroups.forEach((formGroup, sectionTitle) => {
      const dateControl = formGroup.get('date');
      const dayControl = formGroup.get('day');
      
      if (dateControl && dayControl) {
        // Listen for date changes
        dateControl.valueChanges.subscribe(dateValue => {
          if (dateValue) {
            const date = new Date(dateValue);
            const dayName = this.getDayName(date.getDay());
            dayControl.setValue(dayName, { emitEvent: false });
          } else {
            dayControl.setValue('', { emitEvent: false });
          }
        });
      }
    });
  }

  private getDayName(dayIndex: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  }

  private setupConditionalValidation(): void {
    // Find sections with rows layout that have operatorName fields
    this.auditForm?.sections.forEach(section => {
      if (section.layout === 'rows' && section.rowHeaders && section.rowHeaders.length > 1) {
        const formGroup = this.getFormGroup(section.title);
        const firstHeader = section.rowHeaders[0];
        const firstOperatorName = formGroup.get(firstHeader + '_operatorName');
        
        if (firstOperatorName) {
          // Get all subsequent column operatorName controls
          const subsequentOperatorNames = section.rowHeaders.slice(1).map(header => 
            formGroup.get(header + '_operatorName')
          ).filter(control => control !== null);
          
          // Function to check if first column is filled
          const checkFirstColumnCompletion = () => {
            const firstOperatorValue = firstOperatorName.value;
            const isFirstFilled = firstOperatorValue && firstOperatorValue.trim().length > 0;
            
            // Update subsequent columns' operatorName validators
            subsequentOperatorNames.forEach(control => {
              if (control) {
                if (isFirstFilled) {
                  control.setValidators([Validators.required]);
                } else {
                  control.clearValidators();
                }
                control.updateValueAndValidity({ emitEvent: false });
              }
            });
          };
          
          // Listen to first column operatorName changes
          firstOperatorName.valueChanges.subscribe(() => {
            checkFirstColumnCompletion();
          });
          
          // Initial check
          checkFirstColumnCompletion();
        }
      }
    });
  }

  // Dynamic Rows Methods
  getDynamicRowsCount(sectionTitle: string): number {
    return this.dynamicRowsCount.get(sectionTitle) || 0;
  }

  getDynamicRowIndices(sectionTitle: string): number[] {
    const count = this.getDynamicRowsCount(sectionTitle);
    return Array.from({ length: count }, (_, i) => i);
  }

  canAddRow(section: FormSection): boolean {
    const currentCount = this.getDynamicRowsCount(section.title);
    const maxRows = section.maxRows || 50; // Default max: 50 rows
    return currentCount < maxRows;
  }

  canRemoveRow(section: FormSection): boolean {
    const currentCount = this.getDynamicRowsCount(section.title);
    const minRows = section.minRows || 1; // Default min: 1 row
    return currentCount > minRows;
  }

  addDynamicRow(section: FormSection): void {
    if (!this.canAddRow(section)) {
      return;
    }

    const currentCount = this.getDynamicRowsCount(section.title);
    const newRowIndex = currentCount;

    // Update row count
    this.dynamicRowsCount.set(section.title, currentCount + 1);

    // Get form group for this section
    const formGroup = this.getFormGroup(section.title);

    // Add controls for new row
    section.fields?.forEach((field: FormField) => {
      const fieldName = `row${newRowIndex}_${field.name}`;
      const validators = this.formRendererService['buildValidators'](field);
      const control = new FormControl(
        { value: field.value || '', disabled: field.disabled || false },
        validators
      );
      formGroup.addControl(fieldName, control);
    });
  }

  removeDynamicRow(section: FormSection, rowIndex?: number): void {
    if (!this.canRemoveRow(section)) {
      return;
    }

    const currentCount = this.getDynamicRowsCount(section.title);
    const formGroup = this.getFormGroup(section.title);
    
    // If rowIndex is specified, remove that specific row
    if (rowIndex !== undefined && rowIndex >= 0 && rowIndex < currentCount) {
      // Get values from all rows after the removed row
      const rowsData: any[] = [];
      for (let i = 0; i < currentCount; i++) {
        const rowData: any = {};
        section.fields?.forEach((field: FormField) => {
          const fieldName = `row${i}_${field.name}`;
          rowData[field.name] = formGroup.get(fieldName)?.value;
        });
        rowsData.push(rowData);
      }
      
      // Remove the specified row from data
      rowsData.splice(rowIndex, 1);
      
      // Remove all current controls
      for (let i = 0; i < currentCount; i++) {
        section.fields?.forEach((field: FormField) => {
          const fieldName = `row${i}_${field.name}`;
          formGroup.removeControl(fieldName);
        });
      }
      
      // Re-create controls with new indices
      rowsData.forEach((rowData, newIndex) => {
        section.fields?.forEach((field: FormField) => {
          const fieldName = `row${newIndex}_${field.name}`;
          const validators = this.formRendererService['buildValidators'](field);
          const control = new FormControl(
            { value: rowData[field.name] || field.value || '', disabled: field.disabled || false },
            validators
          );
          formGroup.addControl(fieldName, control);
        });
      });
      
      // Update row count
      this.dynamicRowsCount.set(section.title, currentCount - 1);
    } else {
      // Remove last row (default behavior)
      const lastRowIndex = currentCount - 1;
      section.fields?.forEach((field: FormField) => {
        const fieldName = `row${lastRowIndex}_${field.name}`;
        formGroup.removeControl(fieldName);
      });
      this.dynamicRowsCount.set(section.title, currentCount - 1);
    }
  }

  getDynamicFieldName(rowIndex: number, fieldName: string): string {
    return `row${rowIndex}_${fieldName}`;
  }
}

