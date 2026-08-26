import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response.model';
import { User, CreateUserDto, UpdateUserDto } from '@core/models/user.model';

/** Abstract User repository */
export abstract class UserRepository {
  abstract getAll(): Observable<ApiResponse<User[]>>;
  abstract getById(id: string): Observable<ApiResponse<User>>;
  abstract create(dto: CreateUserDto): Observable<ApiResponse<User>>;
  abstract update(id: string, dto: UpdateUserDto): Observable<ApiResponse<User>>;
  abstract delete(id: string): Observable<ApiResponse<void>>;
}
