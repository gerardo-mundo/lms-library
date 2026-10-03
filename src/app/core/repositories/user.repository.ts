import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { UserRepository } from "./interfaces/user.repository";
import { User, CreateUserDto, UpdateUserDto } from "@core/models/user.model";
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
export class MockUserRepository extends UserRepository {
  private http = inject(HttpClient);
  private users: User[] = [];

  getAll(): Observable<PageableResponse<User[]>> {
    return this.http.get<PageableResponse<User[]>>(
      `${environment.apiUrl}/users/search`,
    );
  }

  getById(id: string): Observable<ApiResponse<User>> {
    const user = this.users.find((u) => u.id === id);
    return of(user ? ok<User>(user) : err<User>("User not found")).pipe(
      delay(MOCK_DELAY),
    );
  }

  create(dto: CreateUserDto): Observable<ApiResponse<User>> {
    const newUser: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role,
      enrollmentId: dto.enrollmentId,
      employeeKey: dto.employeeKey,
    };

    return this.http.post<ApiResponse<User>>(
      `${environment.apiUrl}/users`,
      newUser,
    );
  }

  update(id: string, dto: UpdateUserDto): Observable<ApiResponse<User>> {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1)
      return of(err<User>("User not found")).pipe(delay(MOCK_DELAY));
    this.users[idx] = { ...this.users[idx], ...dto } as User;
    return of(ok<User>(this.users[idx], "User updated successfully")).pipe(
      delay(MOCK_DELAY),
    );
  }

  delete(id: string): Observable<ApiResponse<void>> {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1)
      return of(err<void>("User not found")).pipe(delay(MOCK_DELAY));
    this.users.splice(idx, 1);
    return of(ok<void>(undefined as unknown as void, "User deleted")).pipe(
      delay(MOCK_DELAY),
    );
  }
}
