import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { User, CreateUserDto, UserRole } from "@core/models/user.model";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { DropdownModule } from "primeng/dropdown";
import { Select, SelectChangeEvent } from "primeng/select";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-users-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    PasswordModule,
    DropdownModule,
    ButtonModule,
    Select,
  ],
  template: `
    <p-dialog
      [header]="editItem ? 'Edit User' : 'Add New User'"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '40vw' }"
      [breakpoints]="{ '960px': '75vw', '640px': '90vw' }"
      (onHide)="onCancel()"
      styleClass="p-fluid"
    >
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="formgrid grid">
          <div class="field col-12 md:col-6">
            <label for="name" class="font-semibold"
              >Full Name <span class="text-red-500">*</span></label
            >
            <input
              class="w-full"
              pInputText
              id="name"
              formControlName="name"
              placeholder="Full name"
              autofocus
            />
          </div>
          <div class="field col-12 md:col-6">
            <label for="email" class="font-semibold"
              >Email <span class="text-red-500">*</span></label
            >
            <input
              class="w-full"
              pInputText
              id="email"
              type="email"
              formControlName="email"
              placeholder="user@email.com"
            />
          </div>
          <div class="field col-12 md:col-6" *ngIf="!editItem">
            <label for="password" class="font-semibold"
              >Password <span class="text-red-500">*</span></label
            >
            <p-password
              class="w-full"
              id="password"
              formControlName="password"
              [toggleMask]="true"
              [feedback]="false"
              placeholder="Min 8 characters"
              autocomplete="current-password"
              fluid="true"
            ></p-password>
          </div>
          <div class="field col-12 md:col-6">
            <label for="role" class="font-semibold"
              >Role <span class="text-red-500">*</span></label
            >
            <p-select
              class="w-full p-1"
              id="role"
              formControlName="role"
              [options]="roleOptions"
              [editable]="true"
              appendTo="body"
              (onChange)="onChangeSelectedValue($event)"
            ></p-select>
          </div>
          <div class="field col">
            @if (role === "ROLE_STUDENT") {
              <label for="enrollmentId" class="font-semibold"
                >Enrollment ID</label
              >
              <input
                class="w-full"
                pInputText
                id="enrollmentId"
                formControlName="enrollmentId"
                placeholder="Student ID (if applicable)"
              />
            } @else {
              <label for="employeeKey" class="font-semibold"
                >Employee Key</label
              >
              <input
                class="w-full"
                pInputText
                id="employeeKey"
                formControlName="employeeKey"
                placeholder="Employee key (if applicable)"
              />
            }
          </div>
        </div>
        <div class="flex justify-content-end gap-2 mt-4">
          <p-button
            label="Cancel"
            icon="pi pi-times"
            severity="secondary"
            text="true"
            (onClick)="onCancel()"
          ></p-button>
          <p-button
            label="{{ editItem ? 'Update' : 'Create' }}"
            icon="pi pi-check"
            type="submit"
            [disabled]="form.invalid"
          ></p-button>
        </div>
      </form>
    </p-dialog>
  `,
  styles: [],
})
export class UsersFormComponent implements OnChanges {
  @Input() visible = false;
  @Input() editItem: User | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateUserDto>();
  form!: FormGroup;

  roleOptions = [
    { label: "Administrator", value: "ROLE_ADMIN" },
    { label: "Librarian", value: "ROLE_LIBRARIAN" },
    { label: "Professor", value: "ROLE_PROFESSOR" },
    { label: "Student", value: "ROLE_STUDENT" },
    { label: "Administrative", value: "ROLE_ADMINISTRATIVE" },
  ];

  get role(): UserRole {
    return this.form.get("role")?.value;
  }

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnChanges(c: SimpleChanges): void {
    if (c["editItem"] || c["visible"]) {
      if (this.visible) {
        if (this.editItem) {
          // Remove password requirement when editing
          this.form.get("password")?.clearValidators();
          this.form.get("password")?.updateValueAndValidity();
          this.form.patchValue({ ...this.editItem, password: "" });
        } else {
          this.initForm();
        }
      }
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      role: ["ROLE_STUDENT" as UserRole, Validators.required],
      enrollmentId: [""],
      employeeKey: [""],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value);
      this.onCancel();
    }
  }
  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.initForm();
  }

  onChangeSelectedValue(e: SelectChangeEvent) {
    this.form.patchValue({ enrollmentId: "", employeeKey: "", ...this.form });
  }
}
