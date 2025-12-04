import { Type } from '@angular/core';

export type AuditFormComponentLoader = () => Promise<Type<any>>;

/**
 * Registry of audit IDs that should be rendered with dedicated components
 * instead of the JSON-driven form renderer.
 *
 * Keys should be uppercase to simplify lookups.
 */
export const AUDIT_FORM_COMPONENTS: Record<string, AuditFormComponentLoader> = {
  // 'MANUAL-WATER-QUALITY': () =>
  //   import('./manual-water-quality/manual-water-quality.component').then(
  //     m => m.ManualWaterQualityFormComponent
  //   ),
  'CCPP22_DEMIN_PLANT-CUSTOM': () =>
    import('./demin-plant-log-custom/demin-plant-log-custom.component').then(
      m => m.DeminPlantLogCustomComponent
    )
};

export const hasPhysicalAuditForm = (auditId: string | null | undefined): boolean => {
  if (!auditId) {
    return false;
  }
  return Boolean(AUDIT_FORM_COMPONENTS[auditId.toUpperCase()]);
};

