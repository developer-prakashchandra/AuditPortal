import { Directive, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

/**
 * Base class for all physical audit form components.
 * 
 * This abstract class provides common functionality like navigation, validation helpers,
 * form management, and utility methods to reduce code duplication across audit forms.
 * 
 * @example
 * // How to use in a new physical audit form:
 * 
 * export class MyAuditFormComponent extends BaseAuditFormComponent implements OnInit {
 *   myForm: FormGroup;
 * 
 *   constructor(
 *     private fb: FormBuilder,
 *     router: Router  // Don't use 'private' - pass to super
 *   ) {
 *     super(router);  // Always call super(router)
 *     this.myForm = this.fb.group({ ... });
 *   }
 * 
 *   ngOnInit(): void {
 *     // Use base class utilities
 *     const dateControl = this.myForm.get('date');
 *     const dayControl = this.myForm.get('day');
 *     if (dateControl && dayControl) {
 *       this.setupDateToDayListener(dateControl, dayControl);
 *     }
 *   }
 * 
 *   submit(): void {
 *     if (!this.validateForms(this.myForm)) return;
 *     
 *     const payload = this.getFormRawValue(this.myForm);
 *     this.logFormSubmission('My Audit Form', payload);
 *     this.showSuccessMessage('Form submitted!');
 *     this.goBack();
 *   }
 * 
 *   reset(): void {
 *     this.resetFormWithDefaults(this.myForm, { field: 'default' });
 *   }
 * }
 * 
 * @remarks
 * - Always call super(router) in your constructor
 * - Implement abstract methods: submit() and reset()
 * - Use provided utility methods to reduce boilerplate
 * - Subscriptions are automatically cleaned up in ngOnDestroy
 * - Router is available as protected property
 */
@Directive()
export abstract class BaseAuditFormComponent implements OnDestroy {
  protected subscriptions: Subscription[] = [];

  constructor(protected router: Router) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Navigate back to location listing
   */
  goBack(): void {
    this.router.navigate(['/area']);
  }

  /**
   * Cancel form and navigate back
   */
  cancel(): void {
    if (this.hasUnsavedChanges()) {
      const confirmCancel = confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (confirmCancel) {
        this.goBack();
      }
    } else {
      this.goBack();
    }
  }

  /**
   * Submit form - to be implemented by child classes
   */
  abstract submit(): void;

  /**
   * Reset form - to be implemented by child classes
   */
  abstract reset(): void;

  /**
   * Check if form has unsaved changes - can be overridden by child classes
   */
  protected hasUnsavedChanges(): boolean {
    return false;
  }

  /**
   * Check if a specific field in a form is invalid
   */
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const control = form.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Check if entire form is invalid
   */
  isFormInvalid(form: FormGroup): boolean {
    return form.invalid;
  }

  /**
   * Mark all fields in a form as touched (for validation display)
   */
  markFormAsTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();
      
      // If control is a FormGroup, recursively mark its children
      if (control instanceof FormGroup) {
        this.markFormAsTouched(control);
      }
    });
  }

  /**
   * Convert day index to day name
   */
  getDayName(dayIndex: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex] || '';
  }

  /**
   * Convert dropdown option values array to PrimeNG dropdown format
   */
  toDropdownOptions(values: string[]): { label: string; value: string }[] {
    return values.map(value => ({ label: value, value }));
  }

  /**
   * Convert key-value object to PrimeNG dropdown format
   */
  toDropdownOptionsFromObject(obj: { [key: string]: string }): { label: string; value: string }[] {
    return Object.entries(obj).map(([value, label]) => ({ label, value }));
  }

  /**
   * Show success message after form submission
   */
  protected showSuccessMessage(message: string): void {
    alert(message);
  }

  /**
   * Show error message
   */
  protected showErrorMessage(message: string): void {
    alert(message);
  }

  /**
   * Validate all forms and show error if any is invalid
   */
  protected validateForms(...forms: FormGroup[]): boolean {
    let allValid = true;

    forms.forEach(form => {
      if (form.invalid) {
        allValid = false;
        this.markFormAsTouched(form);
      }
    });

    if (!allValid) {
      this.showErrorMessage('Please fill all required fields before submitting.');
    }

    return allValid;
  }

  /**
   * Setup date to day auto-population
   */
  protected setupDateToDayListener(dateControl: any, dayControl: any): void {
    const sub = dateControl.valueChanges.subscribe((dateValue: Date) => {
      if (dateValue) {
        const date = new Date(dateValue);
        const dayName = this.getDayName(date.getDay());
        dayControl.setValue(dayName, { emitEvent: false });
      } else {
        dayControl.setValue('', { emitEvent: false });
      }
    });
    this.subscriptions.push(sub);
  }

  /**
   * Log form submission data (can be replaced with actual API call)
   */
  protected logFormSubmission(formName: string, data: any): void {
    console.log(`Submitting ${formName}:`, data);
  }

  /**
   * Get form raw value (including disabled fields)
   */
  protected getFormRawValue(form: FormGroup): any {
    return form.getRawValue();
  }

  /**
   * Reset form with default values
   */
  protected resetFormWithDefaults(form: FormGroup, defaults: any): void {
    form.reset(defaults);
  }

  /**
   * Disable form field
   */
  protected disableField(form: FormGroup, fieldName: string): void {
    form.get(fieldName)?.disable();
  }

  /**
   * Enable form field
   */
  protected enableField(form: FormGroup, fieldName: string): void {
    form.get(fieldName)?.enable();
  }

  /**
   * Set field value
   */
  protected setFieldValue(form: FormGroup, fieldName: string, value: any): void {
    form.get(fieldName)?.setValue(value);
  }

  /**
   * Get field value
   */
  protected getFieldValue(form: FormGroup, fieldName: string): any {
    return form.get(fieldName)?.value;
  }
}

