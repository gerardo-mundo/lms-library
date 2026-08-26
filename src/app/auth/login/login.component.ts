import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "@core/auth/auth.service";
import { ThemeService } from "@core/services/theme.service";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { Fluid } from "primeng/fluid";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    Fluid,
  ],
  template: `
    <div
      class="min-h-screen flex align-items-center justify-content-center relative overflow-hidden bg-ground"
    >
      <div
        class="absolute inset-0 z-0"
        style="background: radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(129, 140, 248, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(99, 102, 241, 0.04) 0%, transparent 50%);"
      ></div>

      <div class="z-1 w-full max-w-26rem p-3">
        <div
          class="surface-card border-1 surface-border border-round-2xl p-5 shadow-6 fadeinup animation-duration-500"
        >
          <div class="text-center mb-5">
            <div
              class="inline-flex align-items-center justify-content-center w-4rem h-4rem border-round-xl mb-3 shadow-3"
              style="background: linear-gradient(135deg, var(--primary-500), var(--primary-400))"
            >
              <i
                class="pi pi-book text-3xl"
                style="color: var(--p-emerald-500)"
              ></i>
            </div>
            <h1 class="text-3xl font-extrabold text-color m-0">LMS</h1>
            <p class="text-color-secondary mt-1">Library Management System</p>
          </div>

          <form
            [formGroup]="loginForm"
            (ngSubmit)="onSubmit()"
            class="flex flex-column gap-3"
          >
            <p-fluid>
              <div class="flex flex-column gap-2">
                <label for="email" class="font-semibold text-sm"
                  >Email Address</label
                >
                <input
                  pInputText
                  class="{{
                    showFieldError('email') ? 'ng-invalid ng-dirty' : ''
                  }}"
                  id="email"
                  type="email"
                  formControlName="email"
                  placeholder="Enter your email"
                  autocomplete="email"
                />
                <small class="text-red-500" *ngIf="showFieldError('email')"
                  >Please enter a valid email address</small
                >
              </div>

              <div class="flex flex-column gap-2 mt-5">
                <label for="password" class="font-semibold text-sm"
                  >Password</label
                >
                <p-password
                  class="{{
                    showFieldError('password') ? 'ng-invalid ng-dirty' : ''
                  }}"
                  id="password"
                  formControlName="password"
                  [toggleMask]="true"
                  [feedback]="false"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                ></p-password>
                <small class="text-red-500" *ngIf="showFieldError('password')"
                  >Password is required</small
                >
              </div>

              <div
                *ngIf="errorMessage"
                class="flex align-items-center gap-2 p-3 border-round-sm text-sm"
                style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: var(--danger-color);"
              >
                <i class="pi pi-exclamation-triangle"></i>
                <span>{{ errorMessage }}</span>
              </div>

              <p-button
                [label]="loading ? 'Signing in...' : 'Sign In'"
                [icon]="loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
                type="submit"
                [disabled]="loading"
                styleClass="w-full mt-5"
              ></p-button>
            </p-fluid>
          </form>

          <div
            class="mt-4 p-3 border-round-sm text-center"
            style="background: var(--highlight-bg);"
          >
            <div
              class="flex align-items-center justify-content-center gap-2 text-xs font-semibold mb-1"
              style="color: var(--highlight-text);"
            >
              <i class="pi pi-info-circle"></i>
              <span>Demo Credentials</span>
            </div>
            <div class="text-sm text-color-secondary">
              <code
                class="surface-ground p-1 border-round text-color font-family-code"
                >admin&#64;lms.com</code
              >
              /
              <code
                class="surface-ground p-1 border-round text-color font-family-code"
                >Admin&#64;1234</code
              >
            </div>
          </div>
        </div>

        <button
          (click)="onThemeToggle()"
          class="fixed top-0 right-0 m-4 w-3rem h-3rem border-circle surface-card border-1 surface-border text-color-secondary hover:text-color hover:border-primary transition-colors cursor-pointer flex align-items-center justify-content-center shadow-1 z-5"
        >
          <i [class]="isDark ? 'pi pi-sun' : 'pi pi-moon'"></i>
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = "";
  isDark = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private theme: ThemeService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });

    this.theme.isDark$.subscribe((dark) => (this.isDark = dark));

    if (this.auth.isAuthenticated()) {
      this.router.navigate(["/app/dashboard"]);
    }
  }

  showFieldError(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = "";

    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.error) {
          this.errorMessage = res.message;
        } else {
          this.router.navigate(["/app/dashboard"]);
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = "An unexpected error occurred";
      },
    });
  }

  onThemeToggle(): void {
    this.theme.toggle();
  }
}
