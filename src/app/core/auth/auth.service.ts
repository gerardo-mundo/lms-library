import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import {
  AuthResponse,
  JwtPayload,
  LoginRequest,
} from "@core/models/auth.model";
import { ApiResponse, err } from "@core/models/api-response.model";
import { environment } from "@env";
import { HttpClient } from "@angular/common/http";

const TOKEN_KEY = "lms_token";
const AUTH_KEY = "lms_auth";

@Injectable({ providedIn: "root" })
export class AuthService {
  private _currentUser$ = new BehaviorSubject<JwtPayload | null>(null);
  readonly currentUser$ = this._currentUser$.asObservable();

  private expirationTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    this.loadStoredSession();
  }

  /** Attempt login with email/password */
  login(req: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, req)
      .pipe(
        tap((res) => {
          if (!res.error) {
            this.storeSession(res.data);
            return res;
          }

          return of(err<AuthResponse>(res.message));
        }),
      );
  }

  /** Log out and clean up */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_KEY);
    this._currentUser$.next(null);
    this.clearExpirationTimer();
    this.router.navigate(["/login"]);
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
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
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
}
