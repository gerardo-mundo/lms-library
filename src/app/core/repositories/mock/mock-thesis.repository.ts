import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ThesisRepository } from '../interfaces/thesis.repository';
import { Thesis, CreateThesisDto, UpdateThesisDto } from '@core/models/thesis.model';
import { ApiResponse, ok, err } from '@core/models/api-response.model';

const MOCK_DELAY = 300;

@Injectable()
export class MockThesisRepository extends ThesisRepository {
  private theses: Thesis[] = [
    { id: 't001', title: 'Machine Learning for Predictive Maintenance in IoT Systems', author: 'María García López', authorTwo: null, authorThree: null, university: 'Universidad Nacional Autónoma de México', thesisAdvisor: 'Dr. Carlos Hernández', bachelorDegree: 'Computer Science' },
    { id: 't002', title: 'Blockchain-Based Supply Chain Management', author: 'Juan Carlos Pérez', authorTwo: 'Ana Martínez Rivera', authorThree: null, university: 'Instituto Politécnico Nacional', thesisAdvisor: 'Dra. Laura Sánchez', bachelorDegree: 'Software Engineering' },
    { id: 't003', title: 'Natural Language Processing for Spanish Medical Texts', author: 'Roberto Díaz Moreno', authorTwo: null, authorThree: null, university: 'Universidad de Guadalajara', thesisAdvisor: 'Dr. Fernando Ruiz', bachelorDegree: 'Computer Science' },
    { id: 't004', title: 'Deep Learning Approaches for Image Classification in Agriculture', author: 'Patricia Flores Guzmán', authorTwo: 'Alejandro Vega Cruz', authorThree: null, university: 'Tecnológico de Monterrey', thesisAdvisor: 'Dr. Miguel Ángel Torres', bachelorDegree: 'Data Science' },
    { id: 't005', title: 'Secure Authentication Systems Using Biometric Data', author: 'Diego Ramírez Ortega', authorTwo: null, authorThree: null, university: 'Universidad Autónoma Metropolitana', thesisAdvisor: 'Dra. Sofía Morales', bachelorDegree: 'Cybersecurity' },
    { id: 't006', title: 'Cloud Computing Optimization for Small Businesses', author: 'Lucía Mendoza Ríos', authorTwo: null, authorThree: null, university: 'Universidad Nacional Autónoma de México', thesisAdvisor: 'Dr. Ricardo Jiménez', bachelorDegree: 'Information Technology' },
    { id: 't007', title: 'Computer Vision for Autonomous Vehicle Navigation', author: 'Carlos Alberto Navarro', authorTwo: 'Elena Torres Paz', authorThree: 'Marco Reyes Luna', university: 'Instituto Politécnico Nacional', thesisAdvisor: 'Dr. Andrés Castillo', bachelorDegree: 'Mechatronics' },
    { id: 't008', title: 'Quantum Computing Algorithms for Optimization Problems', author: 'Fernanda Vargas Herrera', authorTwo: null, authorThree: null, university: 'Tecnológico de Monterrey', thesisAdvisor: 'Dr. Pablo Estrada', bachelorDegree: 'Physics' },
    { id: 't009', title: 'Augmented Reality Applications in Education', author: 'Miguel Ángel Cruz Solís', authorTwo: 'Daniela Rojas Cárdenas', authorThree: null, university: 'Universidad de Guadalajara', thesisAdvisor: 'Dra. Isabel Guerrero', bachelorDegree: 'Education Technology' },
    { id: 't010', title: 'Cybersecurity Risk Assessment Framework for Healthcare', author: 'Andrea Domínguez Castro', authorTwo: null, authorThree: null, university: 'Universidad Autónoma de Nuevo León', thesisAdvisor: 'Dr. Héctor Molina', bachelorDegree: 'Cybersecurity' },
    { id: 't011', title: 'Big Data Analytics for Urban Mobility Patterns', author: 'Sebastián Lara Medina', authorTwo: null, authorThree: null, university: 'Universidad Nacional Autónoma de México', thesisAdvisor: 'Dra. Carmen Delgado', bachelorDegree: 'Computer Science' },
    { id: 't012', title: 'Microservices Architecture for E-Government Systems', author: 'Valeria Ortiz Fuentes', authorTwo: 'Rodrigo Salazar Peña', authorThree: null, university: 'Instituto Politécnico Nacional', thesisAdvisor: 'Dr. Arturo Villalobos', bachelorDegree: 'Software Engineering' },
    { id: 't013', title: 'Fuzzy Logic Control Systems for Industrial Automation', author: 'Emilio Contreras Ramos', authorTwo: null, authorThree: null, university: 'Tecnológico de Monterrey', thesisAdvisor: 'Dr. Julio César Aguilar', bachelorDegree: 'Electrical Engineering' },
    { id: 't014', title: 'Sentiment Analysis on Social Media for Brand Monitoring', author: 'Gabriela Sandoval Luna', authorTwo: null, authorThree: null, university: 'Universidad de Guadalajara', thesisAdvisor: 'Dra. Teresa Paredes', bachelorDegree: 'Computer Science' },
    { id: 't015', title: 'Robotic Process Automation in Financial Institutions', author: 'Javier Moreno Ávila', authorTwo: 'Camila Herrera Díaz', authorThree: null, university: 'Universidad Autónoma Metropolitana', thesisAdvisor: 'Dr. Enrique Romero', bachelorDegree: 'Finance Technology' },
    { id: 't016', title: 'Edge Computing for Real-Time Video Processing', author: 'Natalia Campos Vera', authorTwo: null, authorThree: null, university: 'Universidad Autónoma de Nuevo León', thesisAdvisor: 'Dr. Oscar Guzmán', bachelorDegree: 'Computer Science' },
    { id: 't017', title: 'Genetic Algorithms for Scheduling Problems', author: 'Tomás Espinoza Rivas', authorTwo: null, authorThree: null, university: 'Universidad Nacional Autónoma de México', thesisAdvisor: 'Dra. Adriana Solís', bachelorDegree: 'Mathematics' },
    { id: 't018', title: 'Internet of Things Security Protocols Analysis', author: 'Mónica Aguilar Santos', authorTwo: 'Iván Peña Cortés', authorThree: null, university: 'Instituto Politécnico Nacional', thesisAdvisor: 'Dr. Gabriel Mendoza', bachelorDegree: 'Cybersecurity' },
    { id: 't019', title: 'Sustainable Software Engineering Practices', author: 'Ricardo Luna Valdez', authorTwo: null, authorThree: null, university: 'Tecnológico de Monterrey', thesisAdvisor: 'Dra. Mariana Reyes', bachelorDegree: 'Software Engineering' },
    { id: 't020', title: 'Data Visualization Techniques for Scientific Research', author: 'Paola Jiménez Arce', authorTwo: null, authorThree: null, university: 'Universidad de Guadalajara', thesisAdvisor: 'Dr. Luis Enrique Vega', bachelorDegree: 'Data Science' },
  ];

  getAll(): Observable<ApiResponse<Thesis[]>> {
    return of(ok<Thesis[]>([...this.theses])).pipe(delay(MOCK_DELAY));
  }

  getById(id: string): Observable<ApiResponse<Thesis>> {
    const thesis = this.theses.find((t) => t.id === id);
    return of(thesis ? ok<Thesis>(thesis) : err<Thesis>('Thesis not found')).pipe(delay(MOCK_DELAY));
  }

  create(dto: CreateThesisDto): Observable<ApiResponse<Thesis>> {
    const newThesis: Thesis = {
      ...dto,
      id: 't' + String(this.theses.length + 1).padStart(3, '0'),
      authorTwo: dto.authorTwo ?? null,
      authorThree: dto.authorThree ?? null,
    };
    this.theses = [newThesis, ...this.theses];
    return of(ok<Thesis>(newThesis, 'Thesis created successfully')).pipe(delay(MOCK_DELAY));
  }

  update(id: string, dto: UpdateThesisDto): Observable<ApiResponse<Thesis>> {
    const idx = this.theses.findIndex((t) => t.id === id);
    if (idx === -1) return of(err<Thesis>('Thesis not found')).pipe(delay(MOCK_DELAY));
    this.theses[idx] = { ...this.theses[idx], ...dto } as Thesis;
    return of(ok<Thesis>(this.theses[idx], 'Thesis updated successfully')).pipe(delay(MOCK_DELAY));
  }

  delete(id: string): Observable<ApiResponse<void>> {
    const idx = this.theses.findIndex((t) => t.id === id);
    if (idx === -1) return of(err<void>('Thesis not found')).pipe(delay(MOCK_DELAY));
    this.theses.splice(idx, 1);
    return of(ok<void>(undefined as unknown as void, 'Thesis deleted successfully')).pipe(delay(MOCK_DELAY));
  }
}
