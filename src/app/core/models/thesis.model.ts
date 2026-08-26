/** Full Thesis entity returned from the API */
export interface Thesis {
  id: string;
  title: string;
  author: string;
  authorTwo: string | null;
  authorThree: string | null;
  university: string;
  thesisAdvisor: string;
  bachelorDegree: string;
}

/** DTO for creating a new thesis */
export interface CreateThesisDto {
  title: string;
  author: string;
  authorTwo?: string | null;
  authorThree?: string | null;
  university: string;
  thesisAdvisor: string;
  bachelorDegree: string;
}

/** DTO for updating an existing thesis */
export type UpdateThesisDto = Partial<CreateThesisDto>;
