import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LoansService } from "../loans.service";
import { LoansFormComponent } from "../loans-form/loans-form.component";
import { Loan, CreateLoanDto } from "@core/models/loan.model";
import { User } from "@core/models/user.model";
import { Book } from "@core/models/book.model";
import { UserRepository } from "@core/repositories/interfaces/user.repository";
import { BookRepository } from "@core/repositories/interfaces/book.repository";
import { ConfirmationService, MessageService } from "primeng/api";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag";
import { CardModule } from "primeng/card";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { AvatarModule } from "primeng/avatar";

@Component({
  selector: "app-loans-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoansFormComponent,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    CardModule,
    IconFieldModule,
    InputIconModule,
    AvatarModule,
  ],
  template: `
    <div class="fadein animation-duration-300">
      <div
        class="flex align-items-center justify-content-between mb-4 flex-wrap gap-3"
      >
        <div>
          <h1 class="text-3xl font-bold text-color m-0">Loans</h1>
          <p class="text-color-secondary mt-1 mb-0">
            Manage book loans and returns
          </p>
        </div>
        <p-button
          label="New Loan"
          icon="pi pi-plus"
          (onClick)="formVisible = true"
        ></p-button>
      </div>

      <p-card styleClass="shadow-1">
        <p-table
          #dt
          [value]="loans"
          [paginator]="true"
          [rows]="10"
          [loading]="(loading$ | async) ?? false"
          [globalFilterFields]="['borrower.name', 'approver.name', 'status']"
          [rowHover]="true"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="caption">
            <div class="flex justify-content-end">
              <p-iconField iconPosition="left">
                <p-inputIcon styleClass="pi pi-search" />
                <input
                  pInputText
                  type="text"
                  (input)="
                    dt.filterGlobal($any($event.target).value, 'contains')
                  "
                  placeholder="Search loans..."
                />
              </p-iconField>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="borrower.name">
                Borrower <p-sortIcon field="borrower.name"></p-sortIcon>
              </th>
              <th pSortableColumn="approver.name">
                Approver <p-sortIcon field="approver.name"></p-sortIcon>
              </th>
              <th>Books</th>
              <th pSortableColumn="status">
                Status <p-sortIcon field="status"></p-sortIcon>
              </th>
              <th pSortableColumn="borrowDate">
                Borrow Date <p-sortIcon field="borrowDate"></p-sortIcon>
              </th>
              <th pSortableColumn="returnDate">
                Return Date <p-sortIcon field="returnDate"></p-sortIcon>
              </th>
              <th class="text-center w-10rem">Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-loan>
            <tr>
              <td>
                <div class="flex align-items-center gap-2">
                  <p-avatar
                    [label]="getInitials(loan.borrower.name)"
                    shape="circle"
                    styleClass="bg-primary text-white text-xs"
                    size="normal"
                  ></p-avatar>
                  <span class="font-medium">{{ loan.borrower.name }}</span>
                </div>
              </td>
              <td>{{ loan.approver.name }}</td>
              <td>
                <div class="flex flex-wrap gap-1">
                  <span
                    *ngFor="let b of loan.borrowedBooks"
                    class="text-xs surface-ground p-1 border-round white-space-nowrap"
                    [title]="b.title"
                  >
                    {{ b.title | slice: 0 : 20
                    }}{{ b.title.length > 20 ? "..." : "" }}
                  </span>
                </div>
              </td>
              <td>
                <p-tag
                  [severity]="getStatusSeverity(loan.status)"
                  [value]="loan.status"
                ></p-tag>
              </td>
              <td class="text-sm text-color-secondary">
                {{ loan.borrowDate | date: "mediumDate" }}
              </td>
              <td class="text-sm text-color-secondary">
                {{ loan.returnDate | date: "mediumDate" }}
              </td>
              <td class="text-center">
                <div class="flex justify-content-center gap-1">
                  <ng-container *ngIf="loan.active">
                    <p-button
                      icon="pi pi-check-circle"
                      [rounded]="true"
                      [text]="true"
                      severity="success"
                      (onClick)="onReturn(loan)"
                      pTooltip="Return"
                      tooltipPosition="top"
                    ></p-button>
                    <p-button
                      icon="pi pi-times-circle"
                      [rounded]="true"
                      [text]="true"
                      severity="secondary"
                      (onClick)="onCancelLoan(loan)"
                      pTooltip="Cancel"
                      tooltipPosition="top"
                    ></p-button>
                  </ng-container>
                  <p-button
                    icon="pi pi-trash"
                    [rounded]="true"
                    [text]="true"
                    severity="danger"
                    (onClick)="confirmDelete(loan)"
                    pTooltip="Delete"
                    tooltipPosition="top"
                  ></p-button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="empty">
            <div
              class="flex flex-column align-items-center justify-content-center p-5 text-color-secondary"
            >
              <i class="pi pi-arrow-right-arrow-left text-4xl mb-3"></i>
              <span class="text-lg">No loans found.</span>
            </div>
          </ng-template>
        </p-table>
      </p-card>

      <app-loans-form
        [(visible)]="formVisible"
        [users]="allUsers"
        [books]="allBooks"
        (save)="onCreate($event)"
      />
    </div>
  `,
  styles: [],
})
export class LoansListComponent implements OnInit {
  private svc = inject(LoansService);
  private userRepo = inject(UserRepository);
  private bookRepo = inject(BookRepository);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  loading$ = this.svc.loading$;
  loans: Loan[] = [];
  allUsers: User[] = [];
  allBooks: Book[] = [];
  formVisible = false;

  ngOnInit(): void {
    this.svc.loadAll();
    this.svc.items$.subscribe((d) => (this.loans = d));
    this.userRepo.getAll().subscribe((r) => {
      if (!r.error) this.allUsers = r.data.content;
    });
    this.bookRepo.getAll().subscribe((r) => {
      if (!r.error) this.allBooks = r.data;
    });
  }

  getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  getStatusSeverity(
    status: string,
  ): "success" | "info" | "warning" | "danger" | "secondary" {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "success";
      case "COMPLETED":
        return "info";
      case "LAPSED":
        return "warning";
      case "CANCELLED":
        return "danger";
      default:
        return "secondary";
    }
  }

  onCreate(dto: CreateLoanDto): void {
    this.svc.create(dto).subscribe((r) => {
      if (r.error)
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: r.message,
        });
      else
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Loan created successfully",
        });
    });
  }

  onReturn(loan: Loan): void {
    this.svc.returnLoan(loan.id).subscribe((r) => {
      if (r.error)
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: r.message,
        });
      else
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Loan completed successfully",
        });
    });
  }

  onCancelLoan(loan: Loan): void {
    this.svc.cancelLoan(loan.id).subscribe((r) => {
      if (r.error)
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: r.message,
        });
      else
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Loan cancelled successfully",
        });
    });
  }

  confirmDelete(loan: Loan): void {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete this loan record?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.svc.delete(loan.id).subscribe((r) => {
          if (r.error)
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: r.message,
            });
          else
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Loan deleted successfully",
            });
        });
      },
    });
  }
}
