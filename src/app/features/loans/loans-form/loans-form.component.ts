import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateLoanDto } from '@core/models/loan.model';
import { User } from '@core/models/user.model';
import { Book } from '@core/models/book.model';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loans-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DialogModule, DropdownModule, ButtonModule, ListboxModule, TagModule],
  template: `
    <p-dialog header="Create New Loan" [(visible)]="visible" [modal]="true" [style]="{width: '50vw'}" [breakpoints]="{'960px': '75vw', '640px': '90vw'}" (onHide)="onCancel()" styleClass="p-fluid">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="formgrid grid">
          <div class="field col-12 md:col-6">
            <label for="approver" class="font-semibold">Approver <span class="text-red-500">*</span></label>
            <p-dropdown id="approver" formControlName="approver" [options]="users" optionLabel="name" optionValue="id" placeholder="Select approver" [filter]="true" appendTo="body"></p-dropdown>
          </div>
          <div class="field col-12 md:col-6">
            <label for="borrower" class="font-semibold">Borrower <span class="text-red-500">*</span></label>
            <p-dropdown id="borrower" formControlName="borrower" [options]="users" optionLabel="name" optionValue="id" placeholder="Select borrower" [filter]="true" appendTo="body"></p-dropdown>
          </div>
          <div class="field col-12">
            <label class="font-semibold">Books (select up to 3) <span class="text-red-500">*</span></label>
            <p-listbox [options]="_books" [(ngModel)]="selectedBookIds" [ngModelOptions]="{standalone: true}" optionValue="id" [multiple]="true" [checkbox]="true" [filter]="true" optionDisabled="isDisabled" styleClass="w-full" listStyleClass="max-h-15rem">
              <ng-template let-book pTemplate="item">
                <div class="flex align-items-center justify-content-between w-full pr-2">
                  <div class="flex flex-column">
                    <span class="font-medium">{{ book.title }}</span>
                    <span class="text-xs text-color-secondary">{{ book.author }}</span>
                  </div>
                  <p-tag *ngIf="!book.available" severity="danger" value="Unavailable"></p-tag>
                </div>
              </ng-template>
            </p-listbox>
            <small class="text-red-500 block mt-1" *ngIf="selectedBookIds.length > 3">Maximum 3 books per loan</small>
            <small class="text-red-500 block mt-1" *ngIf="selectedBookIds.length === 0 && formSubmitted">Select at least 1 book</small>
          </div>
        </div>
        <div class="flex justify-content-end gap-2 mt-4">
          <p-button label="Cancel" icon="pi pi-times" severity="secondary" text="true" (onClick)="onCancel()"></p-button>
          <p-button label="Create Loan" icon="pi pi-check" type="submit" [disabled]="form.invalid || selectedBookIds.length === 0 || selectedBookIds.length > 3"></p-button>
        </div>
      </form>
    </p-dialog>
  `,
  styles: []
})
export class LoansFormComponent {
  @Input() visible = false;
  @Input() users: User[] = [];
  
  _books: any[] = [];
  @Input() set books(val: Book[]) {
    this._books = val.map(b => ({ ...b, isDisabled: !b.available }));
  }

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateLoanDto>();

  form!: FormGroup;
  selectedBookIds: string[] = [];
  formSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      approver: ['', Validators.required],
      borrower: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.form.valid && this.selectedBookIds.length >= 1 && this.selectedBookIds.length <= 3) {
      this.save.emit({ ...this.form.value, borrowedBooks: [...this.selectedBookIds] });
      this.onCancel();
    }
  }

  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.form.reset();
    this.selectedBookIds = [];
    this.formSubmitted = false;
  }
}
