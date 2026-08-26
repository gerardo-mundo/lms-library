import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from '@core/auth/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { JwtPayload } from '@core/models/auth.model';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, ToolbarModule, ButtonModule, AvatarModule, MenuModule],
  template: `
    <p-toolbar styleClass="border-none border-bottom-1 surface-border surface-card border-round-none px-3 md:px-4 h-4rem">
      <ng-template #start>
        <p-button icon="pi pi-bars" text="true" rounded="true" severity="secondary" styleClass="md:hidden mr-2" (onClick)="toggleSidebar.emit()"></p-button>
      </ng-template>

      <ng-template #end>
        <div class="flex align-items-center gap-2">
          <p-button [icon]="isDark ? 'pi pi-sun' : 'pi pi-moon'" text="true" rounded="true" severity="secondary" (onClick)="onThemeToggle()"></p-button>
          
          <ng-container *ngIf="currentUser$ | async as user">
            <div class="flex align-items-center gap-2 cursor-pointer p-1 border-round hover:surface-hover transition-colors" (click)="userMenu.toggle($event)">
              <p-avatar [label]="getInitials(user.name)" shape="circle" styleClass="bg-primary text-white"></p-avatar>
              <div class="hidden md:flex flex-column text-sm">
                <span class="font-semibold line-height-1">{{ user.name }}</span>
                <span class="text-color-secondary text-xs">{{ formatRole(user.role) }}</span>
              </div>
              <i class="pi pi-chevron-down text-color-secondary text-xs ml-1"></i>
            </div>
            
            <p-menu #userMenu [popup]="true" [model]="userMenuItems"></p-menu>
          </ng-container>
        </div>
      </ng-template>
    </p-toolbar>
  `,
  styles: []
})
export class TopbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  currentUser$!: Observable<JwtPayload | null>;
  isDark = true;
  userMenuItems: MenuItem[] = [];

  constructor(
    private auth: AuthService,
    private theme: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.auth.currentUser$;
    this.theme.isDark$.subscribe((dark) => (this.isDark = dark));
    
    this.userMenuItems = [
      { label: 'My Profile', icon: 'pi pi-user', command: () => this.router.navigate(['/app/profile']) },
      { separator: true },
      { label: 'Logout', icon: 'pi pi-sign-out', styleClass: 'text-red-500', command: () => this.auth.logout() }
    ];
  }

  getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  }

  formatRole(role: string): string {
    return role.replace('ROLE_', '').charAt(0) + role.replace('ROLE_', '').slice(1).toLowerCase();
  }

  onThemeToggle(): void {
    this.theme.toggle();
  }
}
