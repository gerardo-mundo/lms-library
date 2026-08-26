/** User roles matching backend enum */
export type UserRole =
  | 'ROLE_ADMIN'
  | 'ROLE_LIBRARIAN'
  | 'ROLE_PROFESSOR'
  | 'ROLE_STUDENT'
  | 'ROLE_ADMINISTRATIVE';

/** Full User entity returned from the API */
export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  lastLogin: string;
  enrollmentId: string;
  employeeKey: string;
}

/** DTO for creating a new user */
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  enrollmentId: string;
  employeeKey: string;
}

/** DTO for updating an existing user */
export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  enrollmentId?: string;
  employeeKey?: string;
}

/** Human-readable role labels for display */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ROLE_ADMIN: 'Administrator',
  ROLE_LIBRARIAN: 'Librarian',
  ROLE_PROFESSOR: 'Professor',
  ROLE_STUDENT: 'Student',
  ROLE_ADMINISTRATIVE: 'Administrative',
};
