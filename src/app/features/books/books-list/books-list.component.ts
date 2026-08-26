import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../books.service';
import { BooksFormComponent } from '../books-form/books-form.component';
import { Book, CreateBookDto } from '@core/models/book.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BooksFormComponent, TableModule, ButtonModule, InputTextModule, TagModule, CardModule, IconFieldModule, InputIconModule],
  template: `
    <div class="fadein animation-duration-300">
      <div class="flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h1 class="text-3xl font-bold text-color m-0">Books</h1>
          <p class="text-color-secondary mt-1 mb-0">Manage your library's book collection</p>
        </div>
        <p-button label="Add Book" icon="pi pi-plus" (onClick)="openForm()"></p-button>
      </div>

      <p-card styleClass="shadow-1">
        <p-table 
          #dt
          [value]="books"
          [paginator]="true"
          [rows]="10"
          [loading]="(loading$ | async) ?? false"
          [globalFilterFields]="['title', 'author', 'isbn', 'publisher']"
          [rowHover]="true"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="caption">
            <div class="flex justify-content-end">
              <p-iconField iconPosition="left">
                <p-inputIcon styleClass="pi pi-search" />
                <input pInputText type="text" (input)="dt.filterGlobal($any($event.target).value, 'contains')" placeholder="Search books..." />
              </p-iconField>
            </div>
          </ng-template>
          
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="title">Title <p-sortIcon field="title"></p-sortIcon></th>
              <th pSortableColumn="author">Author <p-sortIcon field="author"></p-sortIcon></th>
              <th pSortableColumn="publisher">Publisher <p-sortIcon field="publisher"></p-sortIcon></th>
              <th pSortableColumn="isbn">ISBN <p-sortIcon field="isbn"></p-sortIcon></th>
              <th pSortableColumn="collection">Collection <p-sortIcon field="collection"></p-sortIcon></th>
              <th pSortableColumn="available">Status <p-sortIcon field="available"></p-sortIcon></th>
              <th class="w-8rem text-center">Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-book>
            <tr>
              <td class="font-semibold max-w-16rem text-overflow-ellipsis overflow-hidden white-space-nowrap" [title]="book.title">{{ book.title }}</td>
              <td>
                {{ book.author }}
                <div *ngIf="book.authorTwo" class="text-xs text-color-secondary">{{ book.authorTwo }}</div>
              </td>
              <td>{{ book.publisher }}</td>
              <td><code class="text-sm surface-ground p-1 border-round">{{ book.isbn }}</code></td>
              <td>{{ book.collection }}</td>
              <td>
                <p-tag [severity]="book.available ? 'success' : 'danger'" [value]="book.available ? 'Available' : 'Unavailable'"></p-tag>
              </td>
              <td class="text-center">
                <div class="flex justify-content-center gap-2">
                  <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="info" (onClick)="openForm(book)"></p-button>
                  <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="confirmDelete(book)"></p-button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="empty">
            <div class="flex flex-column align-items-center justify-content-center p-5 text-color-secondary">
              <i class="pi pi-book text-4xl mb-3"></i>
              <span class="text-lg">No books found.</span>
            </div>
          </ng-template>
        </p-table>
      </p-card>

      <app-books-form [(visible)]="formVisible" [editBook]="selectedBook" (save)="onSave($event)" />
    </div>
  `,
  styles: []
})
export class BooksListComponent implements OnInit {
  private booksService = inject(BooksService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  loading$ = this.booksService.loading$;
  books: Book[] = [];
  
  formVisible = false;
  selectedBook: Book | null = null;

  ngOnInit(): void {
    this.booksService.loadAll();
    this.booksService.books$.subscribe((books) => (this.books = books));
  }

  openForm(book?: Book): void {
    this.selectedBook = book ?? null;
    this.formVisible = true;
  }

  onSave(dto: CreateBookDto): void {
    if (this.selectedBook) {
      this.booksService.update(this.selectedBook.id, dto).subscribe((res) => {
        if (res.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Book updated successfully' });
        }
      });
    } else {
      this.booksService.create(dto).subscribe((res) => {
        if (res.error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Book created successfully' });
        }
      });
    }
  }

  confirmDelete(book: Book): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete <strong>${book.title}</strong>?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.booksService.delete(book.id).subscribe((res) => {
          if (res.error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
          } else {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Book deleted successfully' });
          }
        });
      }
    });
  }
}
