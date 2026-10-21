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
    return this.http.post<ApiResponse<Book>>(
      `${environment.apiUrl}/books`,
      dto,
    );
  }

  update(id: string, dto: UpdateBookDto): Observable<ApiResponse<Book>> {
    return this.http.put<ApiResponse<Book>>(
      `${environment.apiUrl}/books/update/${id}`,
      dto,
    );
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${environment.apiUrl}/books/delete/${id}`,
    );
  }
}
