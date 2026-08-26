import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { PublicationRepository } from '@core/repositories/interfaces/publication.repository';
import { Publication, CreatePublicationDto, UpdatePublicationDto } from '@core/models/publication.model';
import { ApiResponse } from '@core/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class PublicationsService {
  private _items$ = new BehaviorSubject<Publication[]>([]);
  readonly items$ = this._items$.asObservable();
  private _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  constructor(private repo: PublicationRepository) {}

  loadAll(): void {
    this._loading$.next(true);
    this.repo.getAll().subscribe({ next: (r) => { if (!r.error) this._items$.next(r.data); this._loading$.next(false); }, error: () => this._loading$.next(false) });
  }
  create(dto: CreatePublicationDto): Observable<ApiResponse<Publication>> { return this.repo.create(dto).pipe(tap((r) => { if (!r.error) this.loadAll(); })); }
  update(id: string, dto: UpdatePublicationDto): Observable<ApiResponse<Publication>> { return this.repo.update(id, dto).pipe(tap((r) => { if (!r.error) this.loadAll(); })); }
  delete(id: string): Observable<ApiResponse<void>> { return this.repo.delete(id).pipe(tap((r) => { if (!r.error) this.loadAll(); })); }
}
