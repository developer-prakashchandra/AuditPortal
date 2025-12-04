import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuditFormsRendererComponent } from '../audit-forms-renderer/audit-forms-renderer.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AUDIT_FORM_COMPONENTS } from './audit-form.registry';

@Component({
  selector: 'app-audit-form-host',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    AuditFormsRendererComponent
  ],
  templateUrl: './audit-form-host.component.html',
  styleUrls: ['./audit-form-host.component.css']
})
export class AuditFormHostComponent implements OnInit, OnDestroy {
  auditId = '';
  customComponent: Type<unknown> | null = null;
  loading = true;
  error = '';

  private paramsSub?: Subscription;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe(async params => {
      this.auditId = params['auditId'];
      await this.resolveCustomComponent();
    });
  }

  ngOnDestroy(): void {
    this.paramsSub?.unsubscribe();
  }

  private async resolveCustomComponent(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.customComponent = null;

    const normalizedId = this.auditId?.toUpperCase();
    const loader = normalizedId ? AUDIT_FORM_COMPONENTS[normalizedId] : undefined;

    if (!loader) {
      this.loading = false;
      return;
    }

    try {
      this.customComponent = await loader();
    } catch (err) {
      console.error('Failed to load custom audit form component', err);
      this.error = 'Unable to load custom audit form.';
      this.customComponent = null;
    } finally {
      this.loading = false;
    }
  }
}

