import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { AuthResponse, JwtPayload, LoginRequest } from '@core/models/auth.model';
import { ApiResponse, ok, err } from '@core/models/api-response.model';
import { environment } from '@env';

const TOKEN_KEY = 'lms_token';
const AUTH_KEY = 'lms_auth';

/** Mock credentials for dev phase */
const MOCK_CREDENTIALS = {
  email: 'admin@lms.com',
  password: 'Admin@1234',
  userId: '1b0c93c1-6c47-4625-ab98-0689bb370213',
  name: 'Admin Prueba',
  role: 'ROLE_ADMIN' as const,
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser$ = new BehaviorSubject<JwtPayload | null>(null);
  readonly currentUser$ = this._currentUser$.asObservable();

  private expirationTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private router: Router) {
    this.loadStoredSession();
  }

  /** Attempt login with email/password */
  login(req: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    // Simulate network delay
    if (req.email === MOCK_CREDENTIALS.email && req.password === MOCK_CREDENTIALS.password) {
      const now = Math.floor(Date.now() / 1000);
      const expiresInSec = Math.floor(environment.tokenDurationMs / 1000);

      // Build a mock JWT-like token (header.payload.signature)
      const header = this.base64Url({ alg: 'HS384' });
      const payload = this.base64Url({
        role: MOCK_CREDENTIALS.role,
        name: MOCK_CREDENTIALS.name,
        id: MOCK_CREDENTIALS.userId,
        sub: MOCK_CREDENTIALS.email,
        iat: now,
        exp: now + expiresInSec,
      });
      const signature = this.base64Url({ mock: true });
      const token = `${header}.${payload}.${signature}`;

      const authResponse: AuthResponse = {
        token,
        expiresIn: environment.tokenDurationMs,
        lastLogin: new Date().toISOString(),
      };

      return of(ok(authResponse)).pipe(
        delay(500),
        tap((res) => {
          if (!res.error) {
            this.storeSession(res.data);
          }
        })
      );
    }

    return of(err<AuthResponse>('Invalid credentials')).pipe(delay(500));
  }

  /** Log out and clean up */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_KEY);
    this._currentUser$.next(null);
    this.clearExpirationTimer();
    this.router.navigate(['/login']);
  }

  /** Check if user has a valid, non-expired token */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = this.decodeToken(token);
    if (!payload) return false;
    return payload.exp * 1000 > Date.now();
  }

  /** Get the stored JWT */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /** Get the current user's role */
  getCurrentUserRole(): string | null {
    return this._currentUser$.value?.role ?? null;
  }

  /** Decode a JWT token (no verification — mock) */
  decodeToken(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload as JwtPayload;
    } catch {
      return null;
    }
  }

  /** Store auth session and start expiration timer */
  private storeSession(auth: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, auth.token);
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));

    const payload = this.decodeToken(auth.token);
    if (payload) {
      this._currentUser$.next(payload);
      this.startExpirationTimer(payload.exp);
    }
  }

  /** Restore session from localStorage on app init */
  private loadStoredSession(): void {
    const token = this.getToken();
    if (!token) return;

    const payload = this.decodeToken(token);
    if (!payload) {
      this.logout();
      return;
    }

    if (payload.exp * 1000 <= Date.now()) {
      this.logout();
      return;
    }

    this._currentUser$.next(payload);
    this.startExpirationTimer(payload.exp);
  }

  /** Auto-logout when token expires */
  private startExpirationTimer(expEpochSec: number): void {
    this.clearExpirationTimer();
    const msRemaining = expEpochSec * 1000 - Date.now();
    if (msRemaining <= 0) {
      this.logout();
      return;
    }
    this.expirationTimer = setTimeout(() => this.logout(), msRemaining);
  }

  private clearExpirationTimer(): void {
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = null;
    }
  }

  /** Base64URL encode a JSON object */
  private base64Url(obj: object): string {
    return btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
