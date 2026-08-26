import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book, CreateBookDto } from '@core/models/book.model';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-books-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, InputTextModule, CheckboxModule, ButtonModule, InputNumberModule],
  template: `
    <p-dialog [header]="editBook ? 'Edit Book' : 'Add New Book'" [(visible)]="visible" [modal]="true" [style]="{width: '50vw'}" [breakpoints]="{'960px': '75vw', '640px': '90vw'}" (onHide)="onCancel()" styleClass="p-fluid">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="formgrid grid">
          <div class="field col-12">
            <label for="title" class="font-semibold">Title <span class="text-red-500">*</span></label>
            <input pInputText id="title" formControlName="title" placeholder="Enter book title" autofocus />
          </div>
          <div class="field col-12 md:col-6">
            <label for="author" class="font-semibold">Author <span class="text-red-500">*</span></label>
            <input pInputText id="author" formControlName="author" placeholder="Primary author" />
          </div>
          <div class="field col-12 md:col-6">
            <label for="authorTwo" class="font-semibold">Author 2</label>
            <input pInputText id="authorTwo" formControlName="authorTwo" placeholder="Optional" />
          </div>
          <div class="field col-12 md:col-6">
            <label for="authorThree" class="font-semibold">Author 3</label>
            <input pInputText id="authorThree" formControlName="authorThree" placeholder="Optional" />
          </div>
          <div class="field col-12 md:col-6">
            <label for="publisher" class="font-semibold">Publisher <span class="text-red-500">*</span></label>
            <input pInputText id="publisher" formControlName="publisher" placeholder="Publisher name" />
          </div>
          <div class="field col-12 md:col-6">
            <label for="collection" class="font-semibold">Collection <span class="text-red-500">*</span></label>
            <input pInputText id="collection" formControlName="collection" placeholder="Collection name" />
          </div>
          <div class="field col-12 md:col-6">
            <label for="isbn" class="font-semibold">ISBN <span class="text-red-500">*</span></label>
            <input pInputText id="isbn" formControlName="isbn" placeholder="10-digit ISBN" maxlength="10" />
          </div>
          <div class="field col-12 md:col-6">
            <label for="acquisition" class="font-semibold">Acquisition</label>
            <p-inputNumber inputId="acquisition" formControlName="acquisition" [min]="0"></p-inputNumber>
          </div>
          <div class="field col-12 flex align-items-center mt-3">
            <p-checkbox inputId="available" formControlName="available" [binary]="true"></p-checkbox>
            <label for="available" class="ml-2 font-semibold cursor-pointer">Available</label>
          </div>
        </div>
        <div class="flex justify-content-end gap-2 mt-4">
          <p-button label="Cancel" icon="pi pi-times" severity="secondary" text="true" (onClick)="onCancel()"></p-button>
          <p-button label="{{ editBook ? 'Update' : 'Create' }}" icon="pi pi-check" type="submit" [disabled]="form.invalid"></p-button>
        </div>
      </form>
    </p-dialog>
  `,
  styles: []
})
export class BooksFormComponent implements OnChanges {
  @Input() visible = false;
  @Input() editBook: Book | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateBookDto>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editBook'] || changes['visible']) {
      if (this.visible) {
        if (this.editBook) {
          this.form.patchValue(this.editBook);
        } else {
          this.initForm();
        }
      }
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      authorTwo: [''],
      authorThree: [''],
      publisher: ['', Validators.required],
      collection: ['', Validators.required],
      isbn: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      acquisition: [1],
      available: [true],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const val = this.form.value;
      this.save.emit({
        ...val,
        authorTwo: val.authorTwo || null,
        authorThree: val.authorThree || null,
      });
      this.onCancel();
    }
  }

  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.initForm();
  }
}
