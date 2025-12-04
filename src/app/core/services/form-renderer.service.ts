import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';
import { AuditForm, FormField, FormValidator } from '../models/form.model';

@Injectable({
  providedIn: 'root'
})
export class FormRendererService {
  constructor(private http: HttpClient) {}

  async loadAuditForm(auditId: string): Promise<AuditForm> {
    try {
      const form = await firstValueFrom(
        this.http.get<AuditForm>(`assets/audits/${auditId}.json`)
      );
      return form;
    } catch (error) {
      console.error(`Failed to load audit form: ${auditId}`, error);
      throw error;
    }
  }

  createFormGroup(fields: FormField[]): FormGroup {
    const group: { [key: string]: FormControl } = {};

    fields.forEach(field => {
      const validators = this.buildValidators(field);
      // Only disabled fields should be disabled (not readonly, as readonly should still submit values)
      const isDisabled = field.disabled || false;
      group[field.name] = new FormControl(
        { value: field.value || '', disabled: isDisabled },
        validators
      );
    });

    return new FormGroup(group);
  }

  private buildValidators(field: FormField): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.validators) {
      field.validators.forEach(validator => {
        switch (validator.type) {
          case 'email':
            validators.push(Validators.email);
            break;
          case 'minLength':
            validators.push(Validators.minLength(validator.value));
            break;
          case 'maxLength':
            validators.push(Validators.maxLength(validator.value));
            break;
          case 'min':
            validators.push(Validators.min(validator.value));
            break;
          case 'max':
            validators.push(Validators.max(validator.value));
            break;
          case 'pattern':
            validators.push(Validators.pattern(validator.value));
            break;
        }
      });
    }

    return validators;
  }

  getErrorMessage(field: FormField, control: AbstractControl): string {
    if (control.hasError('required')) {
      return `${field.label} is required`;
    }
    if (control.hasError('email')) {
      return 'Invalid email format';
    }
    if (control.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `Minimum length is ${minLength}`;
    }
    if (control.hasError('maxlength')) {
      const maxLength = control.getError('maxlength').requiredLength;
      return `Maximum length is ${maxLength}`;
    }
    if (control.hasError('min')) {
      const min = control.getError('min').min;
      return `Minimum value is ${min}`;
    }
    if (control.hasError('max')) {
      const max = control.getError('max').max;
      return `Maximum value is ${max}`;
    }
    if (control.hasError('pattern')) {
      return 'Invalid format';
    }
    return '';
  }
}

