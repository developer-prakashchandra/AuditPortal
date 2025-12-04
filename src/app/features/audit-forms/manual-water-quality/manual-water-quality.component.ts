import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { BaseAuditFormComponent } from '../base-audit-form/base-audit-form.component';

@Component({
  selector: 'app-manual-water-quality-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule
  ],
  templateUrl: './manual-water-quality.component.html',
  styleUrls: ['./manual-water-quality.component.css']
})
export class ManualWaterQualityFormComponent extends BaseAuditFormComponent {
  readonly shiftOptions = this.toDropdownOptions(['Shift A', 'Shift B', 'Shift C']);
  readonly statusOptions = this.toDropdownOptions(['Normal', 'Attention', 'Critical']);

  operatorForm: FormGroup;
  analysisForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    router: Router
  ) {
    super(router);
    this.operatorForm = this.fb.group({
      date: [new Date(), Validators.required],
      shift: ['Shift A', Validators.required],
      operator: ['John Smith', Validators.required],
      employeeId: [{ value: 'EMP-2024-015', disabled: true }],
      remarks: ['']
    });

    this.analysisForm = this.fb.group({
      conductivity: [1.5, [Validators.required, Validators.min(0)]],
      ph: [7.2, [Validators.required, Validators.min(0), Validators.max(14)]],
      silica: [0.03, [Validators.required, Validators.min(0)]],
      degasifier: ['Normal', Validators.required],
      mixedBed: ['Normal', Validators.required],
      comments: ['']
    });
  }

  submit(): void {
    // Validate all forms using base class method
    if (!this.validateForms(this.operatorForm, this.analysisForm)) {
      return;
    }

    const payload = {
      operator: this.getFormRawValue(this.operatorForm),
      analysis: this.analysisForm.value
    };

    this.logFormSubmission('Manual Water Quality Form', payload);
    this.showSuccessMessage('Manual Water Quality Snapshot submitted successfully!');
    this.goBack();
  }

  reset(): void {
    this.resetFormWithDefaults(this.operatorForm, {
      date: new Date(),
      shift: 'Shift A',
      operator: 'John Smith',
      remarks: ''
    });
    this.setFieldValue(this.operatorForm, 'employeeId', 'EMP-2024-015');
    this.disableField(this.operatorForm, 'employeeId');

    this.resetFormWithDefaults(this.analysisForm, {
      conductivity: 1.5,
      ph: 7.2,
      silica: 0.03,
      degasifier: 'Normal',
      mixedBed: 'Normal',
      comments: ''
    });
  }
}

