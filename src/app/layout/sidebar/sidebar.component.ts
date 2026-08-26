import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MenuModule, SidebarModule],
  template: `
    <!-- Mobile Sidebar -->
    <p-sidebar [(visible)]="visible" (visibleChange)="visibleChange.emit($event)" [showCloseIcon]="false">
      <ng-container *ngTemplateOutlet="sidebarContent"></ng-container>
    </p-sidebar>

    <!-- Desktop Sidebar (Fixed) -->
    <div class="hidden md:flex flex-column w-15rem border-right-1 surface-border h-screen surface-card fixed top-0 left-0 z-5">
      <ng-container *ngTemplateOutlet="sidebarContent"></ng-container>
    </div>

    <ng-template #sidebarContent>
      <!-- Brand -->
      <div class="flex align-items-center gap-3 p-3 border-bottom-1 surface-border">
        <div class="flex align-items-center justify-content-center bg-primary text-white border-round w-2rem h-2rem">
          <i class="pi pi-book"></i>
        </div>
        <div class="flex flex-column">
          <span class="font-bold text-xl line-height-1">LMS</span>
          <span class="text-sm text-color-secondary">Library System</span>
        </div>
      </div>

      <!-- Navigation -->
      <div class="p-2 flex-grow-1 overflow-y-auto">
        <p-menu [model]="menuItems" styleClass="w-full border-none bg-transparent"></p-menu>
      </div>

      <!-- Footer -->
      <div class="p-3 border-top-1 surface-border flex align-items-center gap-2 text-color-secondary text-sm">
        <i class="pi pi-code"></i>
        <span>v1.0.0 — Mock</span>
      </div>
    </ng-template>
  `,
  styles: []
})
export class SidebarComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  
  menuItems: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.menuItems = [
      { label: 'Dashboard', icon: 'pi pi-home', command: () => this.navigate('/app/dashboard') },
      { label: 'Books', icon: 'pi pi-book', command: () => this.navigate('/app/books') },
      { label: 'Loans', icon: 'pi pi-bookmark', command: () => this.navigate('/app/loans') },
      { label: 'Publications', icon: 'pi pi-file-pdf', command: () => this.navigate('/app/publications') },
      { label: 'Thesis', icon: 'pi pi-file-edit', command: () => this.navigate('/app/thesis') },
      { label: 'Users', icon: 'pi pi-users', command: () => this.navigate('/app/users') }
    ];
  }

  navigate(path: string) {
    this.router.navigate([path]);
    this.visibleChange.emit(false);
  }
}
