import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response.model';
import { Book, CreateBookDto, UpdateBookDto } from '@core/models/book.model';

/** Abstract Book repository — swap mock ↔ HTTP via Angular DI */
export abstract class BookRepository {
  abstract getAll(): Observable<ApiResponse<Book[]>>;
  abstract getById(id: string): Observable<ApiResponse<Book>>;
  abstract create(dto: CreateBookDto): Observable<ApiResponse<Book>>;
  abstract update(id: string, dto: UpdateBookDto): Observable<ApiResponse<Book>>;
  abstract delete(id: string): Observable<ApiResponse<void>>;
}
