import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

interface AuditFile {
  id: string;
  name: string;
  formCode: string;
  groupCode: string;
  groupName: string;
}

interface GroupAudits {
  code: string;
  label: string;
  audits: AuditFile[];
}

interface BlockConfig {
  label: string;
  groups: GroupAudits[];
}

const createBaseAudits = (groupCode: string, groupName: string): AuditFile[] => {
  const upper = groupCode.toUpperCase();
  return [
    { id: `${upper}21`, name: `${groupName} Audit 21`, formCode: `${upper}-21`, groupCode, groupName },
    { id: `${upper}22`, name: `${groupName} Audit 22`, formCode: `${upper}-22`, groupCode, groupName }
  ];
};

const appendGroupMetadata = (audits: AuditFile[], groupCode: string, groupName: string): AuditFile[] =>
  audits.map(audit => ({
    ...audit,
    groupCode: audit.groupCode || groupCode,
    groupName: audit.groupName || groupName
  }));

const buildGroupAudits = (
  code: string,
  label: string,
  extras: AuditFile[] = [],
  includeDefaults = false
): GroupAudits => ({
  code,
  label,
  audits: appendGroupMetadata(
    [
      ...(includeDefaults ? createBaseAudits(code, label) : []),
      ...extras
    ],
    code,
    label
  )
});

const BLOCK_CONFIGS: Record<string, BlockConfig> = {
  'ccpp22': {
    label: 'CCPP22',
    groups: [
      buildGroupAudits('DEMIN_PLANT', 'DEMIN Plant', [
        // {
        //   id: 'CCPP22_DEMIN_PLANT',
        //   name: 'CCPP-22 DEMIN Plant Local Log Sheet (JSON)',
        //   formCode: 'PO/GEN.01.F171',
        //   groupCode: 'DEMIN_PLANT',
        //   groupName: 'DEMIN Plant'
        // },
        {
          id: 'CCPP22_DEMIN_PLANT',
          name: 'CCPP-22 DEMIN Plant Local Log Sheet (file)',
          formCode: 'PO/GEN.01.F171',
          groupCode: 'DEMIN_PLANT',
          groupName: 'DEMIN Plant'
        }
      ]),
      buildGroupAudits('gt', 'Gas Turbine', [
        {
          id: 'GT21',
          name: 'GT21',
          formCode: 'GT21',
          groupCode: 'gt',
          groupName: 'Gas Turbine'
        },
        {
          id: 'GT22',
          name: 'GT22',
          formCode: 'GT22',
          groupCode: 'gt',
          groupName: 'Gas Turbine'
        }
      ]),
      buildGroupAudits('st', 'Steam Turbine',
        [
          {
            id: 'ST22',
            name: 'ST22',
            formCode: 'ST22',
            groupCode: 'st',
            groupName: 'Steam Turbine'
          }
        ]),
      buildGroupAudits('hrsg', 'Heat Recovery Steam Generator',
        [
          {
            id: 'HRSG21',
            name: 'HRSG21',
            formCode: 'HRSG21',
            groupCode: 'hrsg',
            groupName: 'Heat Recovery Steam Generator'
          },
          {
            id: 'HRSG22',
            name: 'HRSG22',
            formCode: 'HRSG22',
            groupCode: 'hrsg',
            groupName: 'Heat Recovery Steam Generator'
          }
        ]
      ),
      buildGroupAudits('gs', 'Gas Skid',
        [
          {
            id: 'GasSkid',
            name: 'Gas Skid',
            formCode: 'GasSkid',
            groupCode: 'gs',
            groupName: 'Gas Skid'
          }
        ]),
    ]
  },
  'h-block': {
    label: 'H Block',
    groups: [
      buildGroupAudits('gt', 'Gas Turbine',
        [
          {
            id: 'GT24',
            name: 'GT24',
            formCode: 'GT24',
            groupCode: 'gt',
            groupName: 'Gas Turbine'
          }
        ]
      ),
      buildGroupAudits('st', 'Steam Turbine',
        [
          {
            id: 'ST24',
            name: 'ST24',
            formCode: 'ST24',
            groupCode: 'st',
            groupName: 'Steam Turbine'
          }
        ]
      ),
      buildGroupAudits('hrsg', 'Heat Recovery Steam Generator',
        [
          {
            id: 'HRSG24',
            name: 'HRSG24',
            formCode: 'HRSG24',
            groupCode: 'hrsg',
            groupName: 'Heat Recovery Steam Generator'
          }
        ]
      )
    ]
  }
};

@Component({
  selector: 'app-audit-list',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.css']
})
export class AuditListComponent implements OnInit {
  block = '';
  group?: string;
  auditFiles: AuditFile[] = [];
  auditGroups: GroupAudits[] = [];
  blockDisplayName = '';
  groupDisplayName = '';
  isBlockLevelView = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.block = params['block'];
      this.group = params['group'];
      this.loadAuditFiles();
    });
  }

  private flattenGroups(groups: GroupAudits[]): AuditFile[] {
    return groups.flatMap(group =>
      group.audits.map(audit => ({
        ...audit,
        groupCode: audit.groupCode || group.code,
        groupName: audit.groupName || group.label
      }))
    );
  }

  private loadAuditFiles(): void {
    const config = BLOCK_CONFIGS[this.block?.toLowerCase()];
    this.auditFiles = [];
    this.auditGroups = [];

    if (!config) {
      this.blockDisplayName = this.formatLabel(this.block);
      this.groupDisplayName = this.group ? this.formatLabel(this.group) : '';
      this.isBlockLevelView = !this.group;
      return;
    }

    this.blockDisplayName = config.label;

    if (this.group) {
      const groupConfig = config.groups.find(s => s.code === this.group);
      this.auditGroups = groupConfig ? [groupConfig] : [];
      this.auditFiles = this.flattenGroups(this.auditGroups);
      this.groupDisplayName = groupConfig?.label ?? this.formatLabel(this.group);
      this.isBlockLevelView = false;
    } else {
      this.auditGroups = config.groups;
      this.auditFiles = this.flattenGroups(this.auditGroups);
      this.groupDisplayName = '';
      this.isBlockLevelView = true;
    }
  }

  viewAuditForm(auditFile: AuditFile, groupOverride?: string): void {
    // New route pattern: /area/:block/:auditId (remove group and 'form' segment)
    this.router.navigate(['/area', this.block, auditFile.id]);
  }

  goBack(): void {
    this.router.navigate(['/area']);
  }

  private formatLabel(value: string): string {
    if (!value) {
      return '';
    }

    return value
      .split(/[-_]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }
}

