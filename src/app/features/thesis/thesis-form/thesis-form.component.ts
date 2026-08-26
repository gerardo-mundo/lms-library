import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Thesis, CreateThesisDto } from '@core/models/thesis.model';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-thesis-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, InputTextModule, ButtonModule],
  template: `
    <p-dialog [header]="editItem ? 'Edit Thesis' : 'Add New Thesis'" [(visible)]="visible" [modal]="true" [style]="{width: '50vw'}" [breakpoints]="{'960px': '75vw', '640px': '90vw'}" (onHide)="onCancel()" styleClass="p-fluid">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="formgrid grid">
          <div class="field col-12">
            <label for="title" class="font-semibold">Title <span class="text-red-500">*</span></label>
            <input pInputText id="title" formControlName="title" placeholder="Thesis title" autofocus />
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
            <label for="university" class="font-semibold">University <span class="text-red-500">*</span></label>
            <input pInputText id="university" formControlName="university" placeholder="University name" />
          </div>
          <div class="field col-12 md:col-6">
            <label for="thesisAdvisor" class="font-semibold">Thesis Advisor <span class="text-red-500">*</span></label>
            <input pInputText id="thesisAdvisor" formControlName="thesisAdvisor" placeholder="Advisor name" />
          </div>
          <div class="field col-12 md:col-6">
            <label for="bachelorDegree" class="font-semibold">Bachelor Degree <span class="text-red-500">*</span></label>
            <input pInputText id="bachelorDegree" formControlName="bachelorDegree" placeholder="Degree name" />
          </div>
        </div>
        <div class="flex justify-content-end gap-2 mt-4">
          <p-button label="Cancel" icon="pi pi-times" severity="secondary" text="true" (onClick)="onCancel()"></p-button>
          <p-button label="{{ editItem ? 'Update' : 'Create' }}" icon="pi pi-check" type="submit" [disabled]="form.invalid"></p-button>
        </div>
      </form>
    </p-dialog>
  `,
  styles: []
})
export class ThesisFormComponent implements OnChanges {
  @Input() visible = false;
  @Input() editItem: Thesis | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateThesisDto>();
  form!: FormGroup;

  constructor(private fb: FormBuilder) { this.initForm(); }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editItem'] || changes['visible']) {
      if (this.visible) { this.editItem ? this.form.patchValue(this.editItem) : this.initForm(); }
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required], author: ['', Validators.required],
      authorTwo: [''], authorThree: [''],
      university: ['', Validators.required], thesisAdvisor: ['', Validators.required],
      bachelorDegree: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const v = this.form.value;
      this.save.emit({ ...v, authorTwo: v.authorTwo || null, authorThree: v.authorThree || null });
      this.onCancel();
    }
  }

  onCancel(): void { this.visible = false; this.visibleChange.emit(false); this.initForm(); }
}
