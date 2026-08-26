import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BookRepository } from '@core/repositories/interfaces/book.repository';
import { Book, CreateBookDto, UpdateBookDto } from '@core/models/book.model';
import { ApiResponse } from '@core/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private _books$ = new BehaviorSubject<Book[]>([]);
  readonly books$ = this._books$.asObservable();

  private _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  constructor(private repo: BookRepository) {}

  loadAll(): void {
    this._loading$.next(true);
    this.repo.getAll().subscribe({
      next: (res) => {
        if (!res.error) this._books$.next(res.data);
        this._loading$.next(false);
      },
      error: () => this._loading$.next(false),
    });
  }

  create(dto: CreateBookDto): Observable<ApiResponse<Book>> {
    return this.repo.create(dto).pipe(tap((res) => { if (!res.error) this.loadAll(); }));
  }

  update(id: string, dto: UpdateBookDto): Observable<ApiResponse<Book>> {
    return this.repo.update(id, dto).pipe(tap((res) => { if (!res.error) this.loadAll(); }));
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.repo.delete(id).pipe(tap((res) => { if (!res.error) this.loadAll(); }));
  }
}
