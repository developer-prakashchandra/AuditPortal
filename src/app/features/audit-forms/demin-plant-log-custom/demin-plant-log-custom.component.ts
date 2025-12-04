import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-demin-plant-log-custom',
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
  templateUrl: './demin-plant-log-custom.component.html',
  styleUrls: ['./demin-plant-log-custom.component.css']
})
export class DeminPlantLogCustomComponent extends BaseAuditFormComponent implements OnInit {
  // Dropdown options
  readonly statusOptions: DropdownOption[] = [
    { label: 'In Service', value: 'IS' },
    { label: 'Standby', value: 'SB' }
  ];

  readonly pumpStatusOptions: DropdownOption[] = [
    { label: 'In Service', value: 'IS' },
    { label: 'Out of Service', value: 'OOS' }
  ];

  readonly filterStatusOptions: DropdownOption[] = [
    { label: 'Filter 1', value: '1_IS' },
    { label: 'Filter 2', value: '2_IS' },
    { label: 'Both', value: 'BOTH_IS' }
  ];

  generalForm: FormGroup;
  shiftAForm: FormGroup;
  shiftBForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    router: Router
  ) {
    super(router);
    // General Information Form
    this.generalForm = this.fb.group({
      date: [new Date(), Validators.required],
      day: [{ value: this.getDayName(new Date().getDay()), disabled: true }]
    });

    // Shift A Form
    this.shiftAForm = this.createShiftForm();

    // Shift B Form
    this.shiftBForm = this.createShiftForm();
  }

  ngOnInit(): void {
    // Setup date to day auto-population using base class method
    const dateControl = this.generalForm.get('date');
    const dayControl = this.generalForm.get('day');
    if (dateControl && dayControl) {
      this.setupDateToDayListener(dateControl, dayControl);
    }

    // Setup conditional validation: Shift-B operatorName required if Shift-A operatorName is filled
    const sub = this.shiftAForm.get('operatorName')?.valueChanges.subscribe(() => {
      const shiftAOperatorName = this.shiftAForm.get('operatorName')?.value;
      const isShiftAFilled = shiftAOperatorName && shiftAOperatorName.trim().length > 0;

      const shiftBOperatorName = this.shiftBForm.get('operatorName');
      if (isShiftAFilled) {
        shiftBOperatorName?.setValidators([Validators.required]);
      } else {
        shiftBOperatorName?.clearValidators();
      }
      shiftBOperatorName?.updateValueAndValidity({ emitEvent: false });
    });
    
    if (sub) {
      this.subscriptions.push(sub);
    }
  }

  private createShiftForm(): FormGroup {
    return this.fb.group({
      // Time
      time: ['', Validators.required],

      // MIXED BED-1
      mixedBed1Status: ['', Validators.required],
      mixedBed1OutletFlow: [null, Validators.required],
      mixedBed1OutletConductivity: [null, Validators.required],
      mixedBed1OutletSilica: [null, Validators.required],

      // MIXED BED-2
      mixedBed2Status: ['', Validators.required],
      mixedBed2OutletFlow: [null, Validators.required],
      mixedBed2OutletConductivity: [null, Validators.required],
      mixedBed2OutletSilica: [null, Validators.required],

      // RAW WATER PUMP
      rawWaterPumpStatus: ['', Validators.required],
      rawWaterSuctionPressure: [null, Validators.required],
      rawWaterDischPressure: [null, Validators.required],

      // DEMIN WATER PUMP
      deminWaterPumpStatus: ['', Validators.required],
      deminWaterSuctionPressure: [null, Validators.required],
      deminWaterDischPressure: [null, Validators.required],

      // CARTRIDGE FILTER
      cartridgeFilterStatus: ['', Validators.required],
      pressureBeforeFilter: [null, Validators.required],
      pressureAfterFilter: [null, Validators.required],
      filterDP: [null, Validators.required],

      // STORAGE TANK LEVELS
      rawWaterTankLevel: [null, Validators.required],
      deminWaterTankLevel: [null, Validators.required],
      hclTankLevel: [null, Validators.required],
      naohTankLevel: [null, Validators.required],
      neutralisingTankLevel: [null, Validators.required],

      // General Remarks
      generalRemarks: [''],

      // Operator Signature
      operatorName: ['John Smith', Validators.required],
      operatorId: [{ value: 'EMP-2024-001', disabled: true }]
    });
  }

  submit(): void {
    // Validate all forms using base class method
    if (!this.validateForms(this.generalForm, this.shiftAForm, this.shiftBForm)) {
      return;
    }

    const payload = {
      general: this.getFormRawValue(this.generalForm),
      shiftA: this.getFormRawValue(this.shiftAForm),
      shiftB: this.getFormRawValue(this.shiftBForm)
    };

    this.logFormSubmission('DEMIN Plant Log (Custom Component)', payload);
    this.showSuccessMessage('CCPP-22 DEMIN Plant Log Sheet (Custom) submitted successfully!');
    this.goBack();
  }

  reset(): void {
    this.resetFormWithDefaults(this.generalForm, {
      date: new Date(),
      day: this.getDayName(new Date().getDay())
    });

    this.resetFormWithDefaults(this.shiftAForm, {
      operatorName: 'John Smith'
    });
    this.setFieldValue(this.shiftAForm, 'operatorId', 'EMP-2024-001');

    this.resetFormWithDefaults(this.shiftBForm, {
      operatorName: 'John Smith'
    });
    this.setFieldValue(this.shiftBForm, 'operatorId', 'EMP-2024-001');
  }
}

