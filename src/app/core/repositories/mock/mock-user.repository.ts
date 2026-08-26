import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { UserRepository } from '../interfaces/user.repository';
import { User, CreateUserDto, UpdateUserDto } from '@core/models/user.model';
import { ApiResponse, ok, err } from '@core/models/api-response.model';

const MOCK_DELAY = 300;

@Injectable()
export class MockUserRepository extends UserRepository {
  private users: User[] = [
    { id: 'u001', name: 'Admin Prueba', email: 'admin@lms.com', isActive: true, lastLogin: '2026-08-24T13:05:02Z', enrollmentId: '', employeeKey: 'EMP001' },
    { id: 'u002', name: 'María García López', email: 'maria.garcia@university.edu', isActive: true, lastLogin: '2026-08-23T10:30:00Z', enrollmentId: '2024010001', employeeKey: '' },
    { id: 'u003', name: 'Carlos Hernández Torres', email: 'c.hernandez@university.edu', isActive: true, lastLogin: '2026-08-22T14:15:00Z', enrollmentId: '', employeeKey: 'EMP002' },
    { id: 'u004', name: 'Ana Martínez Rivera', email: 'ana.martinez@university.edu', isActive: true, lastLogin: '2026-08-21T09:45:00Z', enrollmentId: '2024010002', employeeKey: '' },
    { id: 'u005', name: 'Roberto Díaz Moreno', email: 'r.diaz@university.edu', isActive: false, lastLogin: '2026-07-15T16:20:00Z', enrollmentId: '2023010001', employeeKey: '' },
    { id: 'u006', name: 'Patricia Flores Guzmán', email: 'p.flores@university.edu', isActive: true, lastLogin: '2026-08-24T08:10:00Z', enrollmentId: '', employeeKey: 'EMP003' },
    { id: 'u007', name: 'Diego Ramírez Ortega', email: 'd.ramirez@university.edu', isActive: true, lastLogin: '2026-08-20T11:30:00Z', enrollmentId: '2024010003', employeeKey: '' },
    { id: 'u008', name: 'Lucía Mendoza Ríos', email: 'l.mendoza@university.edu', isActive: true, lastLogin: '2026-08-19T13:00:00Z', enrollmentId: '2024010004', employeeKey: '' },
    { id: 'u009', name: 'Fernando Ruiz Castillo', email: 'f.ruiz@university.edu', isActive: true, lastLogin: '2026-08-18T15:45:00Z', enrollmentId: '', employeeKey: 'EMP004' },
    { id: 'u010', name: 'Sofía Morales Vega', email: 's.morales@university.edu', isActive: false, lastLogin: '2026-06-01T10:00:00Z', enrollmentId: '2022010001', employeeKey: '' },
    { id: 'u011', name: 'Miguel Ángel Torres', email: 'm.torres@university.edu', isActive: true, lastLogin: '2026-08-23T17:30:00Z', enrollmentId: '', employeeKey: 'EMP005' },
    { id: 'u012', name: 'Gabriela Sandoval Luna', email: 'g.sandoval@university.edu', isActive: true, lastLogin: '2026-08-22T09:15:00Z', enrollmentId: '2025010001', employeeKey: '' },
    { id: 'u013', name: 'Javier Moreno Ávila', email: 'j.moreno@university.edu', isActive: true, lastLogin: '2026-08-21T14:00:00Z', enrollmentId: '2025010002', employeeKey: '' },
    { id: 'u014', name: 'Camila Herrera Díaz', email: 'c.herrera@university.edu', isActive: true, lastLogin: '2026-08-20T16:30:00Z', enrollmentId: '2024010005', employeeKey: '' },
    { id: 'u015', name: 'Emilio Contreras Ramos', email: 'e.contreras@university.edu', isActive: true, lastLogin: '2026-08-19T08:45:00Z', enrollmentId: '', employeeKey: 'EMP006' },
    { id: 'u016', name: 'Natalia Campos Vera', email: 'n.campos@university.edu', isActive: false, lastLogin: '2026-05-10T12:00:00Z', enrollmentId: '2023010002', employeeKey: '' },
    { id: 'u017', name: 'Tomás Espinoza Rivas', email: 't.espinoza@university.edu', isActive: true, lastLogin: '2026-08-24T07:00:00Z', enrollmentId: '2025010003', employeeKey: '' },
    { id: 'u018', name: 'Mónica Aguilar Santos', email: 'm.aguilar@university.edu', isActive: true, lastLogin: '2026-08-23T11:20:00Z', enrollmentId: '', employeeKey: 'EMP007' },
    { id: 'u019', name: 'Ricardo Luna Valdez', email: 'r.luna@university.edu', isActive: true, lastLogin: '2026-08-22T13:40:00Z', enrollmentId: '2024010006', employeeKey: '' },
    { id: 'u020', name: 'Paola Jiménez Arce', email: 'p.jimenez@university.edu', isActive: true, lastLogin: '2026-08-21T10:10:00Z', enrollmentId: '2025010004', employeeKey: '' },
  ];

  getAll(): Observable<ApiResponse<User[]>> {
    return of(ok<User[]>([...this.users])).pipe(delay(MOCK_DELAY));
  }

  getById(id: string): Observable<ApiResponse<User>> {
    const user = this.users.find((u) => u.id === id);
    return of(user ? ok<User>(user) : err<User>('User not found')).pipe(delay(MOCK_DELAY));
  }

  create(dto: CreateUserDto): Observable<ApiResponse<User>> {
    const newUser: User = {
      id: 'u' + String(this.users.length + 1).padStart(3, '0'),
      name: dto.name,
      email: dto.email,
      isActive: true,
      lastLogin: new Date().toISOString(),
      enrollmentId: dto.enrollmentId,
      employeeKey: dto.employeeKey,
    };
    this.users = [newUser, ...this.users];
    return of(ok<User>(newUser, 'User created successfully')).pipe(delay(MOCK_DELAY));
  }

  update(id: string, dto: UpdateUserDto): Observable<ApiResponse<User>> {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return of(err<User>('User not found')).pipe(delay(MOCK_DELAY));
    this.users[idx] = { ...this.users[idx], ...dto } as User;
    return of(ok<User>(this.users[idx], 'User updated successfully')).pipe(delay(MOCK_DELAY));
  }

  delete(id: string): Observable<ApiResponse<void>> {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return of(err<void>('User not found')).pipe(delay(MOCK_DELAY));
    this.users.splice(idx, 1);
    return of(ok<void>(undefined as unknown as void, 'User deleted')).pipe(delay(MOCK_DELAY));
  }
}
