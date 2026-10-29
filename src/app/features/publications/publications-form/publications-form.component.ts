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
import {
  Publication,
  CreatePublicationDto,
  PublicationType,
} from "@core/models/publication.model";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";
import { SelectChangeEvent } from "primeng/select";

@Component({
  selector: "app-publications-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
  ],
  template: `
    <p-dialog
      [header]="editItem ? 'Edit Publication' : 'Add New Publication'"
      [(visible)]="visible"
      [modal]="true"
      [style]="{ width: '50vw' }"
      [breakpoints]="{ '960px': '75vw', '640px': '90vw' }"
      (onHide)="onCancel()"
      styleClass="p-fluid"
    >
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="formgrid grid">
          <div class="field col-12">
            <label for="title" class="font-semibold"
              >Title <span class="text-red-500">*</span></label
            >
            <input
              class="w-full"
              pInputText
              id="title"
              formControlName="title"
              placeholder="Publication title"
              autofocus
            />
          </div>
          <div class="field col-12 md:col-6">
            <label for="author" class="font-semibold"
              >Author <span class="text-red-500">*</span></label
            >
            <input
              class="w-full"
              pInputText
              id="author"
              formControlName="author"
              placeholder="Primary author"
            />
          </div>
          <div class="field col-12 md:col-6">
            <label for="authorTwo" class="font-semibold">Author 2</label>
            <input
              class="w-full"
              pInputText
              id="authorTwo"
              formControlName="authorTwo"
              placeholder="Optional"
            />
          </div>
          <div class="field col-12 md:col-6">
            <label for="authorThree" class="font-semibold">Author 3</label>
            <input
              class="w-full"
              pInputText
              id="authorThree"
              formControlName="authorThree"
              placeholder="Optional"
            />
          </div>
          <div class="field col-12 md:col-6">
            <label for="authorFour" class="font-semibold">Author 4</label>
            <input
              class="w-full"
              pInputText
              id="authorFour"
              formControlName="authorFour"
              placeholder="Optional"
            />
          </div>
          <div class="field col-12 md:col-6">
            <label for="issn" class="font-semibold"
              >ISSN <span class="text-red-500">*</span></label
            >
            <input
              class="w-full"
              pInputText
              id="issn"
              formControlName="issn"
              placeholder="8-character ISSN"
              maxlength="8"
            />
          </div>
          <div class="field col-12 md:col-6">
            <label for="publisher" class="font-semibold"
              >Publisher <span class="text-red-500">*</span></label
            >
            <input
              class="w-full"
              pInputText
              id="publisher"
              formControlName="publisher"
              placeholder="Publisher name"
            />
          </div>
          <div class="field col-12 md:col-6">
            <label for="type" class="font-semibold"
              >Type <span class="text-red-500">*</span></label
            >
            <p-dropdown
              class="w-full"
              id="type"
              formControlName="type"
              [options]="typeOptions"
              appendTo="body"
              (onChange)="onChangeSelectedValue($event)"
            ></p-dropdown>
          </div>
          <div class="field col-12 md:col-6">
            @if (type == "PAPER") {
              <label for="category" class="font-semibold">Category</label>
              <input
                class="w-full"
                pInputText
                id="category"
                formControlName="category"
                placeholder="Category"
              />
            } @else {
              <label for="volume" class="font-semibold">Volume</label>
              <input
                class="w-full"
                pInputText
                id="volume"
                formControlName="volume"
                placeholder="e.g. Vol. 12"
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
export class PublicationsFormComponent implements OnChanges {
  @Input() visible = false;
  @Input() editItem: Publication | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreatePublicationDto>();
  form!: FormGroup;

  typeOptions = [
    { label: "Magazine", value: "MAGAZINE" },
    { label: "Paper", value: "PAPER" },
  ];

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnChanges(c: SimpleChanges): void {
    if (c["editItem"] || c["visible"]) {
      if (this.visible) {
        this.editItem ? this.form.patchValue(this.editItem) : this.initForm();
      }
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: ["", Validators.required],
      author: ["", Validators.required],
      authorTwo: [""],
      authorThree: [""],
      authorFour: [""],
      issn: [
        "",
        [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
      ],
      publisher: ["", Validators.required],
      type: ["MAGAZINE" as PublicationType, Validators.required],
      category: [""],
      volume: [""],
    });
  }

  get type(): string {
    return this.form.get("type")?.value;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const v = this.form.value;
      this.save.emit({
        ...v,
        authorTwo: v.authorTwo || null,
        authorThree: v.authorThree || null,
        authorFour: v.authorFour || null,
      });
      this.onCancel();
    }
  }

  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.initForm();
  }

  onChangeSelectedValue(e: SelectChangeEvent) {
    this.form.patchValue({ category: "", volume: "", ...this.form });
  }
}
