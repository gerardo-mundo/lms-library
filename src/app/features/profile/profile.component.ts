import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/auth/auth.service';
import { JwtPayload } from '@core/models/auth.model';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, AvatarModule, TagModule, InputTextModule, PasswordModule, ButtonModule],
  template: `
    <div class="fadein animation-duration-300">
      <div class="mb-4">
        <h1 class="text-3xl font-bold text-color m-0">My Profile</h1>
        <p class="text-color-secondary mt-1 mb-0">Manage your personal information</p>
      </div>

      <div class="grid" *ngIf="user">
        <!-- User Info Card -->
        <div class="col-12 md:col-4">
          <p-card styleClass="shadow-1 text-center h-full">
            <div class="flex flex-column align-items-center gap-3">
              <p-avatar [label]="getInitials(user.name)" size="xlarge" shape="circle" styleClass="bg-primary text-white text-3xl font-bold w-6rem h-6rem"></p-avatar>
              <div>
                <h2 class="text-xl font-bold text-color m-0 mb-2">{{ user.name }}</h2>
                <p-tag [value]="formatRole(user.role)" severity="info"></p-tag>
                <p class="text-color-secondary mt-2 mb-0">{{ user.sub }}</p>
              </div>
            </div>
          </p-card>
        </div>

        <!-- Edit Info & Password -->
        <div class="col-12 md:col-8">
          <div class="flex flex-column gap-4">
            <!-- Personal Information -->
            <p-card styleClass="shadow-1">
              <h3 class="text-lg font-semibold m-0 mb-3 border-bottom-1 surface-border pb-2">Personal Information</h3>
              <form [formGroup]="profileForm" (ngSubmit)="onSaveProfile()" class="p-fluid grid">
                <div class="field col-12">
                  <label for="name" class="font-semibold">Full Name</label>
                  <input pInputText id="name" formControlName="name" placeholder="Enter your name" />
                </div>
                <div class="field col-12">
                  <label for="email" class="font-semibold">Email Address</label>
                  <input pInputText id="email" formControlName="email" placeholder="Enter your email" />
                  <small class="block mt-1 text-color-secondary">Email cannot be changed</small>
                </div>
                <div class="col-12 flex justify-content-end mt-2">
                  <p-button type="submit" label="Save Changes" icon="pi pi-check" [disabled]="profileForm.invalid || profileForm.pristine"></p-button>
                </div>
              </form>
            </p-card>

            <!-- Change Password -->
            <p-card styleClass="shadow-1">
              <h3 class="text-lg font-semibold m-0 mb-3 border-bottom-1 surface-border pb-2">Change Password</h3>
              <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" class="p-fluid grid">
                <div class="field col-12">
                  <label for="currentPassword" class="font-semibold">Current Password</label>
                  <p-password id="currentPassword" formControlName="currentPassword" [toggleMask]="true" [feedback]="false" placeholder="Enter current password"></p-password>
                </div>
                <div class="field col-12">
                  <label for="newPassword" class="font-semibold">New Password</label>
                  <p-password id="newPassword" formControlName="newPassword" [toggleMask]="true" placeholder="Enter new password"></p-password>
                </div>
                <div class="field col-12">
                  <label for="confirmPassword" class="font-semibold">Confirm Password</label>
                  <p-password id="confirmPassword" formControlName="confirmPassword" [toggleMask]="true" [feedback]="false" placeholder="Confirm new password"></p-password>
                </div>
                <div class="col-12 flex justify-content-end mt-2">
                  <p-button type="submit" label="Update Password" icon="pi pi-lock" severity="secondary" [disabled]="passwordForm.invalid || passwordForm.pristine"></p-button>
                </div>
              </form>
            </p-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProfileComponent implements OnInit {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  user: JwtPayload | null = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  ngOnInit(): void {
    this.auth.currentUser$.subscribe(u => this.user = u);
    
    this.profileForm = this.fb.group({
      name: [this.user?.name || '', Validators.required],
      email: [{ value: this.user?.sub || '', disabled: true }, [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  }

  formatRole(role: string): string {
    if (!role) return 'User';
    return role.replace('ROLE_', '').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  }

  onSaveProfile(): void {
    if (this.profileForm.valid && this.profileForm.dirty) {
      // API call placeholder
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully' });
      this.profileForm.markAsPristine();
    }
  }

  onChangePassword(): void {
    if (this.passwordForm.valid && this.passwordForm.dirty) {
      const vals = this.passwordForm.value;
      if (vals.newPassword !== vals.confirmPassword) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Passwords do not match' });
        return;
      }
      
      // API call placeholder
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password updated successfully' });
      this.passwordForm.reset();
    }
  }
}
