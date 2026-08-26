import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response.model';
import { Publication, CreatePublicationDto, UpdatePublicationDto } from '@core/models/publication.model';

/** Abstract Publication repository */
export abstract class PublicationRepository {
  abstract getAll(): Observable<ApiResponse<Publication[]>>;
  abstract getById(id: string): Observable<ApiResponse<Publication>>;
  abstract create(dto: CreatePublicationDto): Observable<ApiResponse<Publication>>;
  abstract update(id: string, dto: UpdatePublicationDto): Observable<ApiResponse<Publication>>;
  abstract delete(id: string): Observable<ApiResponse<void>>;
}
