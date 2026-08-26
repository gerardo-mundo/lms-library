import { Book } from './book.model';
import { User } from './user.model';

/** Loan status enum matching backend */
export type LoanStatus = 'APPROVED' | 'CANCELLED' | 'LAPSED' | 'COMPLETED';

/** Full Loan entity returned from the API (nested objects) */
export interface Loan {
  id: string;
  approver: User;
  borrower: User;
  borrowedBooks: Book[];
  active: boolean;
  status: LoanStatus;
  borrowDate: string;
  returnDate: string;
}

/** DTO for creating a new loan (IDs only) */
export interface CreateLoanDto {
  approver: string;
  borrower: string;
  borrowedBooks: string[]; // max 3 book IDs
}

/** Human-readable loan status labels */
export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  APPROVED: 'Approved',
  CANCELLED: 'Cancelled',
  LAPSED: 'Lapsed',
  COMPLETED: 'Completed',
};

/** Status severity for PrimeNG Tag component */
export const LOAN_STATUS_SEVERITY: Record<LoanStatus, string> = {
  APPROVED: 'success',
  CANCELLED: 'danger',
  LAPSED: 'warn',
  COMPLETED: 'info',
};
