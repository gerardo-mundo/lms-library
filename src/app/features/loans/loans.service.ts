import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoanRepository } from '@core/repositories/interfaces/loan.repository';
import { Loan, CreateLoanDto } from '@core/models/loan.model';
import { ApiResponse } from '@core/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class LoansService {
  private _items$ = new BehaviorSubject<Loan[]>([]);
  readonly items$ = this._items$.asObservable();
  private _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  constructor(private repo: LoanRepository) {}
  loadAll(): void { this._loading$.next(true); this.repo.getAll().subscribe({ next: (r) => { if (!r.error) this._items$.next(r.data); this._loading$.next(false); }, error: () => this._loading$.next(false) }); }
  create(dto: CreateLoanDto): Observable<ApiResponse<Loan>> { return this.repo.create(dto).pipe(tap((r) => { if (!r.error) this.loadAll(); })); }
  delete(id: string): Observable<ApiResponse<void>> { return this.repo.delete(id).pipe(tap((r) => { if (!r.error) this.loadAll(); })); }
  returnLoan(id: string): Observable<ApiResponse<Loan>> { return this.repo.returnLoan(id).pipe(tap((r) => { if (!r.error) this.loadAll(); })); }
  cancelLoan(id: string): Observable<ApiResponse<Loan>> { return this.repo.cancelLoan(id).pipe(tap((r) => { if (!r.error) this.loadAll(); })); }
}
