import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response.model';
import { Thesis, CreateThesisDto, UpdateThesisDto } from '@core/models/thesis.model';

/** Abstract Thesis repository */
export abstract class ThesisRepository {
  abstract getAll(): Observable<ApiResponse<Thesis[]>>;
  abstract getById(id: string): Observable<ApiResponse<Thesis>>;
  abstract create(dto: CreateThesisDto): Observable<ApiResponse<Thesis>>;
  abstract update(id: string, dto: UpdateThesisDto): Observable<ApiResponse<Thesis>>;
  abstract delete(id: string): Observable<ApiResponse<void>>;
}
