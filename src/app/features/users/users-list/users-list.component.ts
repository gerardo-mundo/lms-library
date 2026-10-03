import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UsersService } from "../users.service";
import { UsersFormComponent } from "../users-form/users-form.component";
import { User, CreateUserDto } from "@core/models/user.model";
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
  selector: "app-users-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UsersFormComponent,
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
          <h1 class="text-3xl font-bold text-color m-0">Users</h1>
          <p class="text-color-secondary mt-1 mb-0">Manage system users</p>
        </div>
        <p-button
          label="Add User"
          icon="pi pi-plus"
          (onClick)="openForm()"
        ></p-button>
      </div>

      <p-card styleClass="shadow-1">
        <p-table
          #dt
          [value]="items"
          [paginator]="true"
          [rows]="10"
          [loading]="(loading$ | async) ?? false"
          [globalFilterFields]="['name', 'email']"
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
                  placeholder="Search users..."
                />
              </p-iconField>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="name">
                Name <p-sortIcon field="name"></p-sortIcon>
              </th>
              <th pSortableColumn="email">
                Email <p-sortIcon field="email"></p-sortIcon>
              </th>
              <th pSortableColumn="isActive">
                Status <p-sortIcon field="isActive"></p-sortIcon>
              </th>
              <th pSortableColumn="lastLogin">
                Last Login <p-sortIcon field="lastLogin"></p-sortIcon>
              </th>
              <th class="w-8rem text-center">Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-item>
            <tr>
              <td>
                <div class="flex align-items-center gap-2">
                  <p-avatar
                    [label]="getInitials(item.name)"
                    shape="circle"
                    styleClass="bg-primary text-white text-xs"
                    size="normal"
                  ></p-avatar>
                  <span class="font-medium">{{ item.name }}</span>
                </div>
              </td>
              <td>{{ item.email }}</td>
              <td>
                <p-tag
                  [severity]="item.isActive ? 'success' : 'danger'"
                  [value]="item.isActive ? 'Active' : 'Inactive'"
                ></p-tag>
              </td>
              <td class="text-sm text-color-secondary">
                {{ item.lastLogin | date: "medium" }}
              </td>
              <td class="text-center">
                <div class="flex justify-content-center gap-2">
                  <p-button
                    icon="pi pi-pencil"
                    [rounded]="true"
                    [text]="true"
                    severity="info"
                    (onClick)="openForm(item)"
                  ></p-button>
                  <p-button
                    icon="pi pi-trash"
                    [rounded]="true"
                    [text]="true"
                    severity="danger"
                    (onClick)="confirmDelete(item)"
                  ></p-button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="empty">
            <div
              class="flex flex-column align-items-center justify-content-center p-5 text-color-secondary"
            >
              <i class="pi pi-users text-4xl mb-3"></i>
              <span class="text-lg">No users found.</span>
            </div>
          </ng-template>
        </p-table>
      </p-card>

      <app-users-form
        [(visible)]="formVisible"
        [editItem]="selectedItem"
        (save)="onSave($event)"
      />
    </div>
  `,
  styles: [],
})
export class UsersListComponent implements OnInit {
  private svc = inject(UsersService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  loading$ = this.svc.loading$;
  items: User[] = [];

  formVisible = false;
  selectedItem: User | null = null;

  ngOnInit(): void {
    this.svc.loadAll();
    this.svc.items$.subscribe((d) => (this.items = d));
  }

  getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  openForm(item?: User): void {
    this.selectedItem = item ?? null;
    this.formVisible = true;
  }

  onSave(dto: CreateUserDto): void {
    if (this.selectedItem) {
      this.svc.update(this.selectedItem.id, dto).subscribe((r) => {
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
            detail: "User updated",
          });
      });
    } else {
      this.svc.create(dto).subscribe((r) => {
        if (r.error)
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: r.message,
          });
        else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "User created",
          });

          this.svc.loadAll();
        }
      });
    }
  }

  confirmDelete(item: User): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete <strong>${item.name}</strong>?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.svc.delete(item.id).subscribe((r) => {
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
              detail: "User deleted",
            });
        });
      },
    });
  }
}
