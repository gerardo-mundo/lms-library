/** Publication type enum matching the backend */
export type PublicationType = 'MAGAZINE' | 'PAPER';

/** Full Publication entity returned from the API */
export interface Publication {
  id: string;
  title: string;
  author: string;
  authorTwo: string | null;
  authorThree: string | null;
  authorFour: string | null;
  issn: string;
  publisher: string;
  type: PublicationType;
  category: string;
  volume: string;
  updatedAt?: string;
}

/** DTO for creating a new publication */
export interface CreatePublicationDto {
  title: string;
  author: string;
  authorTwo?: string | null;
  authorThree?: string | null;
  authorFour?: string | null;
  issn: string;
  publisher: string;
  type: PublicationType;
  category: string;
  volume: string;
}

/** DTO for updating an existing publication */
export type UpdatePublicationDto = Partial<CreatePublicationDto>;
