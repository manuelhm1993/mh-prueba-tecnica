import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, LocalProfile } from '../models/auth.model';

const TOKEN_KEY = 'auth_token';
const PROFILE_KEY = 'demo_profile';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(this.readToken());
  private readonly profileSignal = signal<LocalProfile | null>(this.readProfile());

  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly displayName = computed(
    () => this.profileSignal()?.displayName ?? 'Invitado',
  );

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(tap((res) => this.setSession(res.token)));
  }

  registerLocal(profile: LocalProfile): void {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    this.profileSignal.set(profile);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
    this.tokenSignal.set(null);
    this.profileSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private setSession(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.tokenSignal.set(token);
  }

  private readToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private readProfile(): LocalProfile | null {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}