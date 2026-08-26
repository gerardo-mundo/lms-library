import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="flex h-screen surface-ground overflow-hidden w-full">
      <!-- Sidebar -->
      <app-sidebar [(visible)]="sidebarVisible" />

      <!-- Main Content Area -->
      <div class="flex-grow-1 flex flex-column min-w-0 layout-main">
        <!-- Topbar inside the column -->
        <app-topbar (toggleSidebar)="sidebarVisible = true" />
        
        <!-- Scrollable main area -->
        <main class="flex-grow-1 p-3 md:p-5 overflow-y-auto w-full">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    @media (min-width: 768px) {
      .layout-main {
        margin-left: 15rem;
      }
    }
  `]
})
export class ShellComponent {
  sidebarVisible = false;
}
