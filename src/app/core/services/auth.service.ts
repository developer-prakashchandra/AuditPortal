import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, LoginCredentials } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null);
  private readonly STORAGE_KEY = 'audit_portal_user';

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginCredentials): Observable<boolean> {
    return new Observable(observer => {
      // Simple authentication - in production, this would call an API
      if (credentials.username && credentials.password) {
        const user: User = {
          username: credentials.username,
          email: `${credentials.username}@example.com`,
          role: 'auditor',
          token: this.generateToken()
        };

        this.setCurrentUser(user);
        observer.next(true);
        observer.complete();
      } else {
        observer.next(false);
        observer.complete();
      }
    });
  }

  logout(): void {
    this.currentUser$.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser$.value !== null;
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  getCurrentUserValue(): User | null {
    return this.currentUser$.value;
  }

  private setCurrentUser(user: User): void {
    this.currentUser$.next(user);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem(this.STORAGE_KEY);
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUser$.next(user);
      } catch (error) {
        console.error('Failed to parse user from storage:', error);
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  private generateToken(): string {
    return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

