import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatCardComponent } from '@shared/components/stat-card/stat-card.component';
import { BookRepository } from '@core/repositories/interfaces/book.repository';
import { ThesisRepository } from '@core/repositories/interfaces/thesis.repository';
import { PublicationRepository } from '@core/repositories/interfaces/publication.repository';
import { UserRepository } from '@core/repositories/interfaces/user.repository';
import { LoanRepository } from '@core/repositories/interfaces/loan.repository';
import { Loan } from '@core/models/loan.model';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';

interface QuickLink {
  label: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatCardComponent, CardModule, TableModule, AvatarModule, TagModule],
  template: `
    <div class="fadein animation-duration-300">
      <div class="flex flex-column mb-4">
        <h1 class="text-3xl font-bold text-color m-0">Dashboard</h1>
        <p class="text-color-secondary mt-1 mb-0">Welcome back! Here's your library overview.</p>
      </div>

      <!-- KPI Cards -->
      <div class="grid mb-4">
        <div class="col-12 sm:col-6 lg:col-4 xl:col-2">
          <app-stat-card label="Total Books" [value]="totalBooks" icon="pi pi-book" color="#6366f1" />
        </div>
        <div class="col-12 sm:col-6 lg:col-4 xl:col-2">
          <app-stat-card label="Active Loans" [value]="activeLoans" icon="pi pi-arrow-right-arrow-left" color="#22c55e" />
        </div>
        <div class="col-12 sm:col-6 lg:col-4 xl:col-2">
          <app-stat-card label="Users" [value]="totalUsers" icon="pi pi-users" color="#3b82f6" />
        </div>
        <div class="col-12 sm:col-6 lg:col-4 xl:col-3">
          <app-stat-card label="Total Thesis" [value]="totalThesis" icon="pi pi-file-edit" color="#f59e0b" />
        </div>
        <div class="col-12 sm:col-6 lg:col-4 xl:col-3">
          <app-stat-card label="Publications" [value]="totalPublications" icon="pi pi-file-pdf" color="#ec4899" />
        </div>
      </div>

      <div class="grid">
        <!-- Quick Links -->
        <div class="col-12 xl:col-4">
          <div class="flex align-items-center justify-content-between mb-3">
            <h2 class="text-xl font-bold text-color m-0">Quick Actions</h2>
          </div>
          <div class="flex flex-column gap-3">
            @for (link of quickLinks; track link.route) {
              <a [routerLink]="link.route" class="flex align-items-center p-3 surface-card border-round shadow-1 hover:shadow-3 transition-all transition-duration-200 no-underline text-color group">
                <div class="flex align-items-center justify-content-center border-round w-2rem h-2rem mr-3" [ngStyle]="{'background-color': link.color + '20', 'color': link.color}">
                  <i [class]="link.icon"></i>
                </div>
                <span class="font-semibold flex-grow-1">{{ link.label }}</span>
                <i class="pi pi-arrow-right text-color-secondary text-sm group-hover:text-primary transition-colors"></i>
              </a>
            }
          </div>
        </div>

        <!-- Recent Loans -->
        <div class="col-12 xl:col-8">
          <div class="flex align-items-center justify-content-between mb-3">
            <h2 class="text-xl font-bold text-color m-0">Recent Loans</h2>
            <a routerLink="/app/loans" class="text-primary no-underline font-medium hover:underline flex align-items-center gap-1">
              View All <i class="pi pi-arrow-right text-xs"></i>
            </a>
          </div>
          <p-card styleClass="shadow-1">
            <p-table [value]="recentLoans" [rowHover]="true" styleClass="p-datatable-sm">
              <ng-template pTemplate="empty">
                <div class="flex flex-column align-items-center justify-content-center p-4 text-color-secondary">
                  <i class="pi pi-inbox text-4xl mb-2"></i>
                  <span>No recent loans</span>
                </div>
              </ng-template>
              <ng-template pTemplate="header">
                <tr>
                  <th>Borrower</th>
                  <th>Books</th>
                  <th>Status</th>
                  <th>Borrow Date</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-loan>
                <tr>
                  <td>
                    <div class="flex align-items-center gap-2">
                      <p-avatar [label]="getInitials(loan.borrower.name)" shape="circle" styleClass="bg-primary text-white text-xs" size="normal"></p-avatar>
                      <span class="font-medium text-sm">{{ loan.borrower.name }}</span>
                    </div>
                  </td>
                  <td><span class="text-sm">{{ loan.borrowedBooks.length }} book{{ loan.borrowedBooks.length > 1 ? 's' : '' }}</span></td>
                  <td>
                    <p-tag [severity]="getStatusSeverity(loan.status)" [value]="loan.status"></p-tag>
                  </td>
                  <td class="text-sm text-color-secondary">{{ loan.borrowDate | date:'mediumDate' }}</td>
                </tr>
              </ng-template>
            </p-table>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  totalBooks = 0;
  totalThesis = 0;
  totalPublications = 0;
  totalUsers = 0;
  activeLoans = 0;

  recentLoans: Loan[] = [];

  quickLinks: QuickLink[] = [
    { label: 'Register New Loan', icon: 'pi pi-bookmark-fill', route: '/app/loans', color: '#6366f1' },
    { label: 'Add New Book', icon: 'pi pi-plus-circle', route: '/app/books', color: '#22c55e' },
    { label: 'Manage Users', icon: 'pi pi-users', route: '/app/users', color: '#3b82f6' },
  ];

  constructor(
    private bookRepo: BookRepository,
    private thesisRepo: ThesisRepository,
    private pubRepo: PublicationRepository,
    private userRepo: UserRepository,
    private loanRepo: LoanRepository
  ) {}

  ngOnInit(): void {
    this.bookRepo.getAll().subscribe((res) => {
      if (!res.error) this.totalBooks = res.data.length;
    });
    this.thesisRepo.getAll().subscribe((res) => {
      if (!res.error) this.totalThesis = res.data.length;
    });
    this.pubRepo.getAll().subscribe((res) => {
      if (!res.error) this.totalPublications = res.data.length;
    });
    this.userRepo.getAll().subscribe((res) => {
      if (!res.error) this.totalUsers = res.data.length;
    });
    this.loanRepo.getAll().subscribe((res) => {
      if (!res.error) {
        const loans = res.data;
        this.activeLoans = loans.filter((l) => l.status === 'APPROVED' || l.status === 'LAPSED').length;
        // Sort by date desc
        this.recentLoans = [...loans].sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()).slice(0, 5);
      }
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    switch (status.toUpperCase()) {
      case 'APPROVED': return 'success';
      case 'COMPLETED': return 'info';
      case 'LAPSED': return 'warning';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  }
}
