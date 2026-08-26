/** Full Book entity returned from the API */
export interface Book {
  id: string;
  title: string;
  author: string;
  authorTwo: string | null;
  authorThree: string | null;
  publisher: string;
  collection: string;
  acquisition: number;
  isbn: string;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** DTO for creating a new book */
export interface CreateBookDto {
  title: string;
  author: string;
  authorTwo?: string | null;
  authorThree?: string | null;
  publisher: string;
  collection: string;
  acquisition: number;
  isbn: string;
  available: boolean;
}

/** DTO for updating an existing book */
export type UpdateBookDto = Partial<CreateBookDto>;
