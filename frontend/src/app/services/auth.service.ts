import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface User {
  id?: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'http://localhost:8080/auth';

  register(userData: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap((res) => {
        if (res && res.token) {
          this.saveAuthData(res);
        }
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res && res.token) {
          this.saveAuthData(res);
        }
      })
    );
  }

  saveAuthData(data: AuthResponse): void {
    localStorage.setItem('rims_token', data.token);
    const user: User = {
      id: data.id,
      name: data.name,
      email: data.email
    };
    localStorage.setItem('rims_user', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('rims_token');
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('rims_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('rims_token');
    localStorage.removeItem('rims_user');
    this.router.navigate(['/login']);
  }
}
