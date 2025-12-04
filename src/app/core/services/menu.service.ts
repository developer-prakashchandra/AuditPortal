import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { MenuItem, MenuData } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuItems$ = new BehaviorSubject<MenuItem[]>([]);
  private menuLoaded = false;

  constructor(private http: HttpClient) {}

  async loadMenu(): Promise<void> {
    if (this.menuLoaded) {
      return;
    }

    try {
      const menuData = await firstValueFrom(
        this.http.get<MenuData>('assets/menu/menu.json')
      );
      this.menuItems$.next(menuData.items);
      this.menuLoaded = true;
    } catch (error) {
      console.error('Failed to load menu:', error);
      throw error;
    }
  }

  getMenuItems(): Observable<MenuItem[]> {
    return this.menuItems$.asObservable();
  }

  getMenuItemsValue(): MenuItem[] {
    return this.menuItems$.value;
  }

  toggleMenuItem(item: MenuItem): void {
    item.expanded = !item.expanded;
    this.menuItems$.next([...this.menuItems$.value]);
  }

  collapseAll(): void {
    this.collapseRecursive(this.menuItems$.value);
    this.menuItems$.next([...this.menuItems$.value]);
  }

  private collapseRecursive(items: MenuItem[]): void {
    items.forEach(item => {
      item.expanded = false;
      if (item.children) {
        this.collapseRecursive(item.children);
      }
    });
  }
}

