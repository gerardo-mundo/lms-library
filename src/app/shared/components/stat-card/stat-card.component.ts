import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <p-card styleClass="shadow-1 hover:shadow-3 transition-shadow transition-duration-300 h-full border-none border-left-3" [style]="{'border-left-color': color}">
      <div class="flex align-items-center gap-3">
        <div class="flex align-items-center justify-content-center border-round w-3rem h-3rem flex-shrink-0" [ngStyle]="{'background-color': color + '20', 'color': color}">
          <i [class]="icon + ' text-2xl'"></i>
        </div>
        <div class="flex flex-column">
          <span class="text-3xl font-bold text-color line-height-1">{{ animatedValue }}</span>
          <span class="text-sm font-medium text-color-secondary mt-1">{{ label }}</span>
        </div>
      </div>
    </p-card>
  `,
  styles: [`
    /* Ensure card body removes default padding so we can control it if we wanted, but p-card default padding is fine here */
    :host ::ng-deep .p-card .p-card-body {
      padding: 1.25rem;
    }
    :host ::ng-deep .p-card .p-card-content {
      padding: 0;
    }
  `]
})
export class StatCardComponent implements OnInit {
  @Input() label = '';
  @Input() value = 0;
  @Input() icon = 'pi pi-chart-bar';
  @Input() color = 'var(--p-primary-color)';

  animatedValue = 0;

  ngOnInit(): void {
    this.animateCounter();
  }

  private animateCounter(): void {
    const duration = 600;
    const steps = 30;
    const increment = this.value / steps;
    let current = 0;
    const interval = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= this.value) {
        this.animatedValue = this.value;
        clearInterval(timer);
      } else {
        this.animatedValue = Math.floor(current);
      }
    }, interval);
  }
}
