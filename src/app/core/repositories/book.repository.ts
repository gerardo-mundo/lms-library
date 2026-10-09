import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { BookRepository } from "./interfaces/book.repository";

import { Book, CreateBookDto, UpdateBookDto } from "@core/models/book.model";
import {
  ApiResponse,
  ok,
  err,
  PageableResponse,
} from "@core/models/api-response.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env";

const MOCK_DELAY = 300;

@Injectable()
export class ApiBookRepository extends BookRepository {
  private books: Book[] = [];

  private http = inject(HttpClient);

  getAll(): Observable<PageableResponse<Book[]>> {
    return this.http.get<PageableResponse<Book[]>>(
      `${environment.apiUrl}/books/search`,
    );
  }

  getById(id: string): Observable<ApiResponse<Book>> {
    const book = this.books.find((b) => b.id === id);
    return of(book ? ok<Book>(book) : err<Book>("Book not found")).pipe(
      delay(MOCK_DELAY),
    );
  }

  create(dto: CreateBookDto): Observable<ApiResponse<Book>> {
    const newBook: Book = {
      ...dto,
      id: "b" + String(this.books.length + 1).padStart(3, "0"),
      authorTwo: dto.authorTwo ?? null,
      authorThree: dto.authorThree ?? null,
    };
    this.books = [newBook, ...this.books];
    return of(ok<Book>(newBook, "Book created successfully")).pipe(
      delay(MOCK_DELAY),
    );
  }

  update(id: string, dto: UpdateBookDto): Observable<ApiResponse<Book>> {
    const idx = this.books.findIndex((b) => b.id === id);
    if (idx === -1)
      return of(err<Book>("Book not found")).pipe(delay(MOCK_DELAY));
    this.books[idx] = { ...this.books[idx], ...dto } as Book;
    return of(ok<Book>(this.books[idx], "Book updated successfully")).pipe(
      delay(MOCK_DELAY),
    );
  }

  delete(id: string): Observable<ApiResponse<void>> {
    const idx = this.books.findIndex((b) => b.id === id);
    if (idx === -1)
      return of(err<void>("Book not found")).pipe(delay(MOCK_DELAY));
    this.books.splice(idx, 1);
    return of(
      ok<void>(undefined as unknown as void, "Book deleted successfully"),
    ).pipe(delay(MOCK_DELAY));
  }
}
