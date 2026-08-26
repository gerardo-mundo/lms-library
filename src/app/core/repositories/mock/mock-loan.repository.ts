import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoanRepository } from '../interfaces/loan.repository';
import { Loan, CreateLoanDto } from '@core/models/loan.model';
import { ApiResponse, ok, err } from '@core/models/api-response.model';
import { User } from '@core/models/user.model';
import { Book } from '@core/models/book.model';

const MOCK_DELAY = 300;

// Inline mock users/books for loan references
const USERS: User[] = [
  { id: 'u001', name: 'Admin Prueba', email: 'admin@lms.com', isActive: true, lastLogin: '2026-08-24T13:05:02Z', enrollmentId: '', employeeKey: 'EMP001' },
  { id: 'u002', name: 'María García López', email: 'maria.garcia@university.edu', isActive: true, lastLogin: '2026-08-23T10:30:00Z', enrollmentId: '2024010001', employeeKey: '' },
  { id: 'u003', name: 'Carlos Hernández Torres', email: 'c.hernandez@university.edu', isActive: true, lastLogin: '2026-08-22T14:15:00Z', enrollmentId: '', employeeKey: 'EMP002' },
  { id: 'u004', name: 'Ana Martínez Rivera', email: 'ana.martinez@university.edu', isActive: true, lastLogin: '2026-08-21T09:45:00Z', enrollmentId: '2024010002', employeeKey: '' },
  { id: 'u007', name: 'Diego Ramírez Ortega', email: 'd.ramirez@university.edu', isActive: true, lastLogin: '2026-08-20T11:30:00Z', enrollmentId: '2024010003', employeeKey: '' },
];

const BOOKS: Book[] = [
  { id: 'b001', title: 'Clean Code', author: 'Robert C. Martin', authorTwo: null, authorThree: null, publisher: 'Prentice Hall', collection: 'Software Engineering', acquisition: 1, isbn: '0132350882', available: true },
  { id: 'b002', title: 'Design Patterns', author: 'Erich Gamma', authorTwo: 'Richard Helm', authorThree: 'Ralph Johnson', publisher: 'Addison-Wesley', collection: 'Computer Science', acquisition: 2, isbn: '0201633612', available: true },
  { id: 'b003', title: 'The Pragmatic Programmer', author: 'David Thomas', authorTwo: 'Andrew Hunt', authorThree: null, publisher: 'Addison-Wesley', collection: 'Software Engineering', acquisition: 1, isbn: '0135957052', available: false },
  { id: 'b005', title: 'Refactoring', author: 'Martin Fowler', authorTwo: null, authorThree: null, publisher: 'Addison-Wesley', collection: 'Software Engineering', acquisition: 1, isbn: '0134757599', available: true },
  { id: 'b008', title: 'AI: A Modern Approach', author: 'Stuart Russell', authorTwo: 'Peter Norvig', authorThree: null, publisher: 'Pearson', collection: 'Artificial Intelligence', acquisition: 4, isbn: '0134610997', available: true },
];

@Injectable()
export class MockLoanRepository extends LoanRepository {
  private loans: Loan[] = [
    { id: 'l001', approver: USERS[0], borrower: USERS[1], borrowedBooks: [BOOKS[0], BOOKS[1]], active: true, status: 'APPROVED', borrowDate: '2026-08-20T10:00:00Z', returnDate: '2026-09-03T10:00:00Z' },
    { id: 'l002', approver: USERS[0], borrower: USERS[3], borrowedBooks: [BOOKS[2]], active: true, status: 'APPROVED', borrowDate: '2026-08-18T14:00:00Z', returnDate: '2026-09-01T14:00:00Z' },
    { id: 'l003', approver: USERS[2], borrower: USERS[4], borrowedBooks: [BOOKS[3], BOOKS[4]], active: false, status: 'COMPLETED', borrowDate: '2026-07-01T09:00:00Z', returnDate: '2026-07-15T09:00:00Z' },
    { id: 'l004', approver: USERS[0], borrower: USERS[1], borrowedBooks: [BOOKS[4]], active: false, status: 'CANCELLED', borrowDate: '2026-06-15T11:00:00Z', returnDate: '2026-06-29T11:00:00Z' },
    { id: 'l005', approver: USERS[2], borrower: USERS[3], borrowedBooks: [BOOKS[0], BOOKS[3], BOOKS[4]], active: false, status: 'LAPSED', borrowDate: '2026-05-01T08:00:00Z', returnDate: '2026-05-15T08:00:00Z' },
    { id: 'l006', approver: USERS[0], borrower: USERS[4], borrowedBooks: [BOOKS[1]], active: true, status: 'APPROVED', borrowDate: '2026-08-22T13:00:00Z', returnDate: '2026-09-05T13:00:00Z' },
    { id: 'l007', approver: USERS[2], borrower: USERS[1], borrowedBooks: [BOOKS[2], BOOKS[3]], active: false, status: 'COMPLETED', borrowDate: '2026-07-10T10:00:00Z', returnDate: '2026-07-24T10:00:00Z' },
    { id: 'l008', approver: USERS[0], borrower: USERS[3], borrowedBooks: [BOOKS[0]], active: true, status: 'APPROVED', borrowDate: '2026-08-23T09:30:00Z', returnDate: '2026-09-06T09:30:00Z' },
  ];

  getAll(): Observable<ApiResponse<Loan[]>> {
    return of(ok<Loan[]>([...this.loans])).pipe(delay(MOCK_DELAY));
  }

  getById(id: string): Observable<ApiResponse<Loan>> {
    const loan = this.loans.find((l) => l.id === id);
    return of(loan ? ok<Loan>(loan) : err<Loan>('Loan not found')).pipe(delay(MOCK_DELAY));
  }

  create(dto: CreateLoanDto): Observable<ApiResponse<Loan>> {
    const approver = USERS.find(u => u.id === dto.approver) ?? USERS[0];
    const borrower = USERS.find(u => u.id === dto.borrower) ?? USERS[1];
    const books = dto.borrowedBooks.map(bid => BOOKS.find(b => b.id === bid)).filter(Boolean) as Book[];
    const newLoan: Loan = {
      id: 'l' + String(this.loans.length + 1).padStart(3, '0'),
      approver,
      borrower,
      borrowedBooks: books,
      active: true,
      status: 'APPROVED',
      borrowDate: new Date().toISOString(),
      returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    };
    this.loans = [newLoan, ...this.loans];
    return of(ok<Loan>(newLoan, 'Loan created successfully')).pipe(delay(MOCK_DELAY));
  }

  delete(id: string): Observable<ApiResponse<void>> {
    const idx = this.loans.findIndex((l) => l.id === id);
    if (idx === -1) return of(err<void>('Loan not found')).pipe(delay(MOCK_DELAY));
    this.loans.splice(idx, 1);
    return of(ok<void>(undefined as unknown as void, 'Loan deleted')).pipe(delay(MOCK_DELAY));
  }

  returnLoan(id: string): Observable<ApiResponse<Loan>> {
    const idx = this.loans.findIndex((l) => l.id === id);
    if (idx === -1) return of(err<Loan>('Loan not found')).pipe(delay(MOCK_DELAY));
    this.loans[idx] = { ...this.loans[idx], active: false, status: 'COMPLETED', returnDate: new Date().toISOString() };
    return of(ok<Loan>(this.loans[idx], 'Loan returned successfully')).pipe(delay(MOCK_DELAY));
  }

  cancelLoan(id: string): Observable<ApiResponse<Loan>> {
    const idx = this.loans.findIndex((l) => l.id === id);
    if (idx === -1) return of(err<Loan>('Loan not found')).pipe(delay(MOCK_DELAY));
    this.loans[idx] = { ...this.loans[idx], active: false, status: 'CANCELLED' };
    return of(ok<Loan>(this.loans[idx], 'Loan cancelled successfully')).pipe(delay(MOCK_DELAY));
  }
}
