import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response.model';
import { Loan, CreateLoanDto } from '@core/models/loan.model';

/** Abstract Loan repository */
export abstract class LoanRepository {
  abstract getAll(): Observable<ApiResponse<Loan[]>>;
  abstract getById(id: string): Observable<ApiResponse<Loan>>;
  abstract create(dto: CreateLoanDto): Observable<ApiResponse<Loan>>;
  abstract delete(id: string): Observable<ApiResponse<void>>;
  /** Mark a loan as completed / returned */
  abstract returnLoan(id: string): Observable<ApiResponse<Loan>>;
  /** Cancel an active loan */
  abstract cancelLoan(id: string): Observable<ApiResponse<Loan>>;
}
