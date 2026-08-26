import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BookRepository } from '../interfaces/book.repository';
import { Book, CreateBookDto, UpdateBookDto } from '@core/models/book.model';
import { ApiResponse, ok, err } from '@core/models/api-response.model';

const MOCK_DELAY = 300;

@Injectable()
export class MockBookRepository extends BookRepository {
  private books: Book[] = [
    { id: 'b001', title: 'Clean Code', author: 'Robert C. Martin', authorTwo: null, authorThree: null, publisher: 'Prentice Hall', collection: 'Software Engineering', acquisition: 1, isbn: '0132350882', available: true },
    { id: 'b002', title: 'Design Patterns', author: 'Erich Gamma', authorTwo: 'Richard Helm', authorThree: 'Ralph Johnson', publisher: 'Addison-Wesley', collection: 'Computer Science', acquisition: 2, isbn: '0201633612', available: true },
    { id: 'b003', title: 'The Pragmatic Programmer', author: 'David Thomas', authorTwo: 'Andrew Hunt', authorThree: null, publisher: 'Addison-Wesley', collection: 'Software Engineering', acquisition: 1, isbn: '0135957052', available: false },
    { id: 'b004', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', authorTwo: 'Charles E. Leiserson', authorThree: 'Ronald L. Rivest', publisher: 'MIT Press', collection: 'Computer Science', acquisition: 3, isbn: '0262033844', available: true },
    { id: 'b005', title: 'Refactoring', author: 'Martin Fowler', authorTwo: null, authorThree: null, publisher: 'Addison-Wesley', collection: 'Software Engineering', acquisition: 1, isbn: '0134757599', available: true },
    { id: 'b006', title: 'Domain-Driven Design', author: 'Eric Evans', authorTwo: null, authorThree: null, publisher: 'Addison-Wesley', collection: 'Software Architecture', acquisition: 2, isbn: '0321125215', available: false },
    { id: 'b007', title: 'Structure and Interpretation of Computer Programs', author: 'Harold Abelson', authorTwo: 'Gerald Jay Sussman', authorThree: null, publisher: 'MIT Press', collection: 'Computer Science', acquisition: 1, isbn: '0262510871', available: true },
    { id: 'b008', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', authorTwo: 'Peter Norvig', authorThree: null, publisher: 'Pearson', collection: 'Artificial Intelligence', acquisition: 4, isbn: '0134610997', available: true },
    { id: 'b009', title: 'Computer Networking: A Top-Down Approach', author: 'James Kurose', authorTwo: 'Keith Ross', authorThree: null, publisher: 'Pearson', collection: 'Networking', acquisition: 2, isbn: '0133594149', available: true },
    { id: 'b010', title: 'Operating System Concepts', author: 'Abraham Silberschatz', authorTwo: 'Peter B. Galvin', authorThree: 'Greg Gagne', publisher: 'Wiley', collection: 'Operating Systems', acquisition: 3, isbn: '1119800366', available: false },
    { id: 'b011', title: 'Database System Concepts', author: 'Abraham Silberschatz', authorTwo: 'Henry F. Korth', authorThree: 'S. Sudarshan', publisher: 'McGraw-Hill', collection: 'Databases', acquisition: 2, isbn: '0078022150', available: true },
    { id: 'b012', title: 'The Art of Computer Programming', author: 'Donald E. Knuth', authorTwo: null, authorThree: null, publisher: 'Addison-Wesley', collection: 'Computer Science', acquisition: 1, isbn: '0201896834', available: true },
    { id: 'b013', title: 'Compilers: Principles, Techniques, and Tools', author: 'Alfred V. Aho', authorTwo: 'Monica S. Lam', authorThree: 'Ravi Sethi', publisher: 'Pearson', collection: 'Computer Science', acquisition: 2, isbn: '0321486811', available: true },
    { id: 'b014', title: 'Software Engineering', author: 'Ian Sommerville', authorTwo: null, authorThree: null, publisher: 'Pearson', collection: 'Software Engineering', acquisition: 5, isbn: '0133943038', available: true },
    { id: 'b015', title: 'Computer Architecture', author: 'John L. Hennessy', authorTwo: 'David A. Patterson', authorThree: null, publisher: 'Morgan Kaufmann', collection: 'Computer Architecture', acquisition: 2, isbn: '0128119055', available: false },
    { id: 'b016', title: 'Discrete Mathematics and Its Applications', author: 'Kenneth H. Rosen', authorTwo: null, authorThree: null, publisher: 'McGraw-Hill', collection: 'Mathematics', acquisition: 3, isbn: '0073383090', available: true },
    { id: 'b017', title: 'Linear Algebra and Its Applications', author: 'David C. Lay', authorTwo: 'Steven R. Lay', authorThree: 'Judi J. McDonald', publisher: 'Pearson', collection: 'Mathematics', acquisition: 2, isbn: '0321982384', available: true },
    { id: 'b018', title: 'Calculus: Early Transcendentals', author: 'James Stewart', authorTwo: null, authorThree: null, publisher: 'Cengage', collection: 'Mathematics', acquisition: 4, isbn: '1285741552', available: true },
    { id: 'b019', title: 'Probability and Statistics for Engineers', author: 'Ronald E. Walpole', authorTwo: 'Raymond H. Myers', authorThree: null, publisher: 'Pearson', collection: 'Statistics', acquisition: 3, isbn: '0321629116', available: false },
    { id: 'b020', title: 'Microservices Patterns', author: 'Chris Richardson', authorTwo: null, authorThree: null, publisher: 'Manning', collection: 'Software Architecture', acquisition: 1, isbn: '1617294543', available: true },
  ];

  getAll(): Observable<ApiResponse<Book[]>> {
    return of(ok<Book[]>([...this.books])).pipe(delay(MOCK_DELAY));
  }

  getById(id: string): Observable<ApiResponse<Book>> {
    const book = this.books.find((b) => b.id === id);
    return of(book ? ok<Book>(book) : err<Book>('Book not found')).pipe(delay(MOCK_DELAY));
  }

  create(dto: CreateBookDto): Observable<ApiResponse<Book>> {
    const newBook: Book = {
      ...dto,
      id: 'b' + String(this.books.length + 1).padStart(3, '0'),
      authorTwo: dto.authorTwo ?? null,
      authorThree: dto.authorThree ?? null,
    };
    this.books = [newBook, ...this.books];
    return of(ok<Book>(newBook, 'Book created successfully')).pipe(delay(MOCK_DELAY));
  }

  update(id: string, dto: UpdateBookDto): Observable<ApiResponse<Book>> {
    const idx = this.books.findIndex((b) => b.id === id);
    if (idx === -1) return of(err<Book>('Book not found')).pipe(delay(MOCK_DELAY));
    this.books[idx] = { ...this.books[idx], ...dto } as Book;
    return of(ok<Book>(this.books[idx], 'Book updated successfully')).pipe(delay(MOCK_DELAY));
  }

  delete(id: string): Observable<ApiResponse<void>> {
    const idx = this.books.findIndex((b) => b.id === id);
    if (idx === -1) return of(err<void>('Book not found')).pipe(delay(MOCK_DELAY));
    this.books.splice(idx, 1);
    return of(ok<void>(undefined as unknown as void, 'Book deleted successfully')).pipe(delay(MOCK_DELAY));
  }
}
