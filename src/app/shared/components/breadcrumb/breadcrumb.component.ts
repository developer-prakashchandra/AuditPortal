import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, RouterModule, HttpClientModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/dashboard', label: 'Home' };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
    ,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      });

    // Initial breadcrumbs
    this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: MenuItem[] = [],
    allSegments: string[] = []
  ): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const segments = child.snapshot.url.map(segment => segment.path);

      if (segments.length > 0) {
        // Track all segments for context
        const startIndex = allSegments.length;
        allSegments.push(...segments);
        
        // Determine if we're in area routes
        const isLocationRoute = allSegments.includes('area');
        const locationIndex = allSegments.indexOf('area');
        
        if (isLocationRoute && startIndex > locationIndex) {
          // We're processing segments after 'area'
          const segmentsAfterLocation = allSegments.slice(locationIndex + 1);

          if (segmentsAfterLocation.length === 2) {
            // Pattern could be: /area/:block/:group  OR  /area/:block/:auditId
            const [blockSeg, secondSeg] = segmentsAfterLocation;
            const blockUrl = `${url}/${blockSeg}`;
            const secondUrl = `${url}/${blockSeg}/${secondSeg}`;

            // Add block breadcrumb (links to block list)
            breadcrumbs.push({
              label: this.generateLabel([blockSeg]),
              routerLink: `/area/${blockSeg}`
            });

            // Detect if secondSeg looks like an audit id (uppercase and/or contains underscore)
            const isAuditId = /[A-Z_]/.test(secondSeg) && secondSeg !== secondSeg.toLowerCase();

            if (isAuditId) {
              // Add audit breadcrumb and attempt to fetch the audit asset to show its formCode
              const auditIndex = breadcrumbs.length;
              breadcrumbs.push({
                label: this.generateLabel([secondSeg]),
                routerLink: secondUrl
              });

              // Try to fetch asset JSON to replace label with formCode (if available)
              this.http.get(`/assets/audits/${secondSeg}.json`).subscribe((data: any) => {
                if (data && data.formCode) {
                  breadcrumbs[auditIndex].label = data.formCode;
                }
              }, () => {
                // ignore errors; keep generated label
              });

              url = secondUrl;
            } else {
              // Treat as block/group
              breadcrumbs.push({
                label: this.generateLabel([secondSeg]),
                routerLink: secondUrl
              });

              url = secondUrl;
            }
          } else {
            // Handle remaining segments (including legacy 'form' segment)
            segments.forEach((segment, index) => {
              url += `/${segment}`;

              // Skip "form" segment as it has no standalone route
              if (segment !== 'form') {
                breadcrumbs.push({
                  label: this.generateLabel([segment]),
                  routerLink: url
                });
              }
            });
          }
        } else {
          // Handle all other routes normally (non-location routes)
          segments.forEach(segment => {
            url += `/${segment}`;
            
            // Skip "form" segment as it has no standalone route
            if (segment !== 'form') {
              breadcrumbs.push({
                label: this.generateLabel([segment]),
                routerLink: url
              });
            }
          });
        }
      }

      return this.createBreadcrumbs(child, url, breadcrumbs, allSegments);
    }

    return breadcrumbs;
  }

  private generateLabel(segments: string[]): string {
    if (segments.length === 0) return '';

    // Map route segments to readable labels
    const labelMap: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'area': 'Area',
      'reports': 'Reports',
      'help': 'Help',
      'daily': 'Daily Report',
      'monthly': 'Monthly Report',
      'CCPP22': 'CCPP22',
      'h-block': 'H Block',
      'example': 'Example Location',
      'examples': 'Example Forms',
      'gt': 'Gas Turbine',
      'st': 'Steam Turbine',
      'hrsg': 'Heat Recovery Steam Generator'
    };

    const lastSegment = segments[segments.length - 1];
    
    // Check if it's a standard audit form ID (GT21, ST22, HRSG21, etc.)
    if (/^(GT|ST|HRSG)\d+$/i.test(lastSegment)) {
      return `${lastSegment.toUpperCase()} Form`;
    }
    
    // Check if it's a special form ID (POGEN01F171, CONTROLS_EXAMPLE, etc.)
    if (lastSegment.includes('POGEN') || lastSegment.includes('EXAMPLE') || lastSegment.includes('CUSTOM')) {
      // Special form names - use formatted version
      return this.formatLabel(lastSegment);
    }

    return labelMap[lastSegment] || this.formatLabel(lastSegment);
  }

  private formatLabel(segment: string): string {
    // Handle underscore-separated names (e.g., CONTROLS_EXAMPLE)
    if (segment.includes('_')) {
      return segment
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    
    // Handle hyphen-separated names (e.g., a-block)
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}

