import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PublicationRepository } from '../interfaces/publication.repository';
import { Publication, CreatePublicationDto, UpdatePublicationDto } from '@core/models/publication.model';
import { ApiResponse, ok, err } from '@core/models/api-response.model';

const MOCK_DELAY = 300;

function genPub(id: string, title: string, author: string, a2: string | null, a3: string | null, a4: string | null, issn: string, publisher: string, type: 'MAGAZINE' | 'PAPER', category: string, volume: string): Publication {
  return { id, title, author, authorTwo: a2, authorThree: a3, authorFour: a4, issn, publisher, type, category, volume };
}

@Injectable()
export class MockPublicationRepository extends PublicationRepository {
  private publications: Publication[] = [
    genPub('p001', 'IEEE Transactions on Software Engineering', 'IEEE Computer Society', null, null, null, '00985589', 'IEEE', 'MAGAZINE', 'Software Engineering', 'Vol. 50'),
    genPub('p002', 'Deep Learning in Medical Imaging', 'Sarah Chen', 'Michael Torres', 'Lisa Park', null, '10459823', 'Springer', 'PAPER', 'Artificial Intelligence', 'Vol. 12'),
    genPub('p003', 'ACM Computing Surveys', 'ACM', null, null, null, '03600300', 'ACM Press', 'MAGAZINE', 'Computer Science', 'Vol. 56'),
    genPub('p004', 'Scalable Microservices Patterns', 'James Wilson', 'Emily Rodriguez', null, null, '15582345', 'OReilly', 'PAPER', 'Software Architecture', 'Vol. 8'),
    genPub('p005', 'Nature Machine Intelligence', 'Nature Publishing', null, null, null, '25225839', 'Nature', 'MAGAZINE', 'Machine Learning', 'Vol. 6'),
    genPub('p006', 'Quantum Error Correction Review', 'Ana Ruiz', 'Peter Schmidt', 'Yuki Tanaka', 'Raj Patel', '14739876', 'IOP Publishing', 'PAPER', 'Quantum Computing', 'Vol. 3'),
    genPub('p007', 'Journal of Systems and Software', 'Elsevier', null, null, null, '01641212', 'Elsevier', 'MAGAZINE', 'Software Engineering', 'Vol. 205'),
    genPub('p008', 'Blockchain Consensus Mechanisms', 'David Kim', 'Rachel Green', null, null, '22897654', 'IEEE', 'PAPER', 'Distributed Systems', 'Vol. 15'),
    genPub('p009', 'Communications of the ACM', 'ACM', null, null, null, '00010782', 'ACM Press', 'MAGAZINE', 'Computer Science', 'Vol. 67'),
    genPub('p010', 'Federated Learning for Privacy AI', 'Maria Santos', 'John Lee', 'Priya Sharma', null, '33456721', 'Springer', 'PAPER', 'Artificial Intelligence', 'Vol. 9'),
    genPub('p011', 'Computer Networks', 'Elsevier', null, null, null, '13891286', 'Elsevier', 'MAGAZINE', 'Networking', 'Vol. 237'),
    genPub('p012', 'Edge Computing Optimization', 'Kevin OBrien', 'Sofia Mendez', null, null, '44567890', 'ACM Press', 'PAPER', 'Cloud Computing', 'Vol. 4'),
    genPub('p013', 'IEEE Security and Privacy', 'IEEE', null, null, null, '15407993', 'IEEE', 'MAGAZINE', 'Cybersecurity', 'Vol. 22'),
    genPub('p014', 'Adversarial ML Attacks and Defenses', 'Alex Turner', 'Nina Kowalski', 'Hassan Ali', 'Wei Zhang', '55678901', 'MIT Press', 'PAPER', 'Cybersecurity', 'Vol. 7'),
    genPub('p015', 'Software Practice and Experience', 'Wiley', null, null, null, '00380644', 'Wiley', 'MAGAZINE', 'Software Engineering', 'Vol. 54'),
    genPub('p016', 'Graph Neural Networks for RecSys', 'Yuki Sato', 'Carlos Vega', null, null, '66789012', 'Springer', 'PAPER', 'Machine Learning', 'Vol. 11'),
    genPub('p017', 'IEEE IoT Journal', 'IEEE', null, null, null, '23274662', 'IEEE', 'MAGAZINE', 'IoT', 'Vol. 11'),
    genPub('p018', 'Sustainable Computing Algorithms', 'Emma Watson', 'Pablo Ruiz', 'Aisha Khan', null, '77890123', 'ACM Press', 'PAPER', 'Green Computing', 'Vol. 2'),
    genPub('p019', 'Artificial Intelligence Review', 'Springer', null, null, null, '02692821', 'Springer', 'MAGAZINE', 'Artificial Intelligence', 'Vol. 57'),
    genPub('p020', 'Transfer Learning Low-Resource Langs', 'Mohammed Hassan', 'Julia Fernandez', null, null, '88901234', 'Elsevier', 'PAPER', 'NLP', 'Vol. 6'),
  ];

  getAll(): Observable<ApiResponse<Publication[]>> {
    return of(ok<Publication[]>([...this.publications])).pipe(delay(MOCK_DELAY));
  }

  getById(id: string): Observable<ApiResponse<Publication>> {
    const pub = this.publications.find((p) => p.id === id);
    return of(pub ? ok<Publication>(pub) : err<Publication>('Publication not found')).pipe(delay(MOCK_DELAY));
  }

  create(dto: CreatePublicationDto): Observable<ApiResponse<Publication>> {
    const newPub: Publication = {
      ...dto,
      id: 'p' + String(this.publications.length + 1).padStart(3, '0'),
      authorTwo: dto.authorTwo ?? null,
      authorThree: dto.authorThree ?? null,
      authorFour: dto.authorFour ?? null,
      updatedAt: new Date().toISOString(),
    };
    this.publications = [newPub, ...this.publications];
    return of(ok<Publication>(newPub, 'Publication created successfully')).pipe(delay(MOCK_DELAY));
  }

  update(id: string, dto: UpdatePublicationDto): Observable<ApiResponse<Publication>> {
    const idx = this.publications.findIndex((p) => p.id === id);
    if (idx === -1) return of(err<Publication>('Publication not found')).pipe(delay(MOCK_DELAY));
    this.publications[idx] = { ...this.publications[idx], ...dto, updatedAt: new Date().toISOString() } as Publication;
    return of(ok<Publication>(this.publications[idx], 'Publication updated successfully')).pipe(delay(MOCK_DELAY));
  }

  delete(id: string): Observable<ApiResponse<void>> {
    const idx = this.publications.findIndex((p) => p.id === id);
    if (idx === -1) return of(err<void>('Publication not found')).pipe(delay(MOCK_DELAY));
    this.publications.splice(idx, 1);
    return of(ok<void>(undefined as unknown as void, 'Publication deleted')).pipe(delay(MOCK_DELAY));
  }
}
