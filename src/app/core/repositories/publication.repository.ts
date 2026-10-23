import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { PublicationRepository } from "./interfaces/publication.repository";
import {
  Publication,
  CreatePublicationDto,
  UpdatePublicationDto,
} from "@core/models/publication.model";
import { ApiResponse, ok, err } from "@core/models/api-response.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env";

const MOCK_DELAY = 300;

@Injectable()
export class ApiPublicationRepository extends PublicationRepository {
  private publications: Publication[] = [];

  private http = inject(HttpClient);

  getAll(): Observable<ApiResponse<Publication[]>> {
    return this.http.get<ApiResponse<Publication[]>>(
      `${environment.apiUrl}/publications`,
    );
  }

  getById(id: string): Observable<ApiResponse<Publication>> {
    const pub = this.publications.find((p) => p.id === id);
    return of(
      pub ? ok<Publication>(pub) : err<Publication>("Publication not found"),
    ).pipe(delay(MOCK_DELAY));
  }

  create(dto: CreatePublicationDto): Observable<ApiResponse<Publication>> {
    return this.http.post<ApiResponse<Publication>>(
      `${environment.apiUrl}/publications`,
      dto,
    );
  }

  update(
    id: string,
    dto: UpdatePublicationDto,
  ): Observable<ApiResponse<Publication>> {
    const idx = this.publications.findIndex((p) => p.id === id);
    if (idx === -1)
      return of(err<Publication>("Publication not found")).pipe(
        delay(MOCK_DELAY),
      );
    this.publications[idx] = {
      ...this.publications[idx],
      ...dto,
      updatedAt: new Date().toISOString(),
    } as Publication;
    return of(
      ok<Publication>(
        this.publications[idx],
        "Publication updated successfully",
      ),
    ).pipe(delay(MOCK_DELAY));
  }

  delete(id: string): Observable<ApiResponse<void>> {
    const idx = this.publications.findIndex((p) => p.id === id);
    if (idx === -1)
      return of(err<void>("Publication not found")).pipe(delay(MOCK_DELAY));
    this.publications.splice(idx, 1);
    return of(
      ok<void>(undefined as unknown as void, "Publication deleted"),
    ).pipe(delay(MOCK_DELAY));
  }
}
