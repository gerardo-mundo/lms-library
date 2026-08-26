import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicationsService } from '../publications.service';
import { PublicationsFormComponent } from '../publications-form/publications-form.component';
import { Publication, CreatePublicationDto } from '@core/models/publication.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-publications-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PublicationsFormComponent, TableModule, ButtonModule, InputTextModule, TagModule, CardModule, IconFieldModule, InputIconModule],
  template: `
    <div class="fadein animation-duration-300">
      <div class="flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h1 class="text-3xl font-bold text-color m-0">Publications</h1>
          <p class="text-color-secondary mt-1 mb-0">Manage magazines and papers</p>
        </div>
        <p-button label="Add Publication" icon="pi pi-plus" (onClick)="openForm()"></p-button>
      </div>

      <p-card styleClass="shadow-1">
        <p-table 
          #dt
          [value]="items"
          [paginator]="true"
          [rows]="10"
          [loading]="(loading$ | async) ?? false"
          [globalFilterFields]="['title', 'author', 'issn', 'publisher', 'type']"
          [rowHover]="true"
          styleClass="p-datatable-sm"
        >
          <ng-template pTemplate="caption">
            <div class="flex justify-content-end">
              <p-iconField iconPosition="left">
                <p-inputIcon styleClass="pi pi-search" />
                <input pInputText type="text" (input)="dt.filterGlobal($any($event.target).value, 'contains')" placeholder="Search publications..." />
              </p-iconField>
            </div>
          </ng-template>
          
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="title">Title <p-sortIcon field="title"></p-sortIcon></th>
              <th pSortableColumn="author">Author <p-sortIcon field="author"></p-sortIcon></th>
              <th pSortableColumn="publisher">Publisher <p-sortIcon field="publisher"></p-sortIcon></th>
              <th pSortableColumn="type">Type <p-sortIcon field="type"></p-sortIcon></th>
              <th pSortableColumn="category">Category <p-sortIcon field="category"></p-sortIcon></th>
              <th pSortableColumn="issn">ISSN <p-sortIcon field="issn"></p-sortIcon></th>
              <th class="w-8rem text-center">Actions</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-item>
            <tr>
              <td class="font-semibold max-w-16rem text-overflow-ellipsis overflow-hidden white-space-nowrap" [title]="item.title">{{ item.title }}</td>
              <td>{{ item.author }}</td>
              <td>{{ item.publisher }}</td>
              <td>
                <p-tag [severity]="item.type === 'MAGAZINE' ? 'info' : 'warning'" [value]="item.type"></p-tag>
              </td>
              <td>{{ item.category }}</td>
              <td><code class="text-sm surface-ground p-1 border-round">{{ item.issn }}</code></td>
              <td class="text-center">
                <div class="flex justify-content-center gap-2">
                  <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="info" (onClick)="openForm(item)"></p-button>
                  <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="confirmDelete(item)"></p-button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="empty">
            <div class="flex flex-column align-items-center justify-content-center p-5 text-color-secondary">
              <i class="pi pi-file-pdf text-4xl mb-3"></i>
              <span class="text-lg">No publications found.</span>
            </div>
          </ng-template>
        </p-table>
      </p-card>

      <app-publications-form [(visible)]="formVisible" [editItem]="selectedItem" (save)="onSave($event)" />
    </div>
  `,
  styles: []
})
export class PublicationsListComponent implements OnInit {
  private svc = inject(PublicationsService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  loading$ = this.svc.loading$;
  items: Publication[] = [];
  
  formVisible = false;
  selectedItem: Publication | null = null;

  ngOnInit(): void { 
    this.svc.loadAll(); 
    this.svc.items$.subscribe((d) => (this.items = d)); 
  }

  openForm(item?: Publication): void { 
    this.selectedItem = item ?? null; 
    this.formVisible = true; 
  }

  onSave(dto: CreatePublicationDto): void {
    if (this.selectedItem) { 
      this.svc.update(this.selectedItem.id, dto).subscribe((r) => {
        if (r.error) this.messageService.add({ severity: 'error', summary: 'Error', detail: r.message });
        else this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Publication updated' });
      });
    } else { 
      this.svc.create(dto).subscribe((r) => {
        if (r.error) this.messageService.add({ severity: 'error', summary: 'Error', detail: r.message });
        else this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Publication created' });
      });
    }
  }

  confirmDelete(item: Publication): void { 
    this.confirmationService.confirm({
      message: `Are you sure you want to delete <strong>${item.title}</strong>?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.svc.delete(item.id).subscribe((r) => {
          if (r.error) this.messageService.add({ severity: 'error', summary: 'Error', detail: r.message });
          else this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Publication deleted' });
        });
      }
    });
  }
}
