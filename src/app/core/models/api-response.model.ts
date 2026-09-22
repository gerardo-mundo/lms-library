/** Generic API response wrapper matching the backend contract */
export interface ApiResponse<T> {
  error: boolean;
  message: string;
  data: T;
}

interface Content<T> {
  content: T;
}

export interface PageableResponse<T> extends ApiResponse<Content<T>> {
  data: {
    content: T;
  };
}
/** Helper to create a successful response */
export function ok<T>(data: T, message = "Success"): ApiResponse<T> {
  return { error: false, message, data };
}

/** Helper to create an error response */
export function err<T>(message: string): ApiResponse<T> {
  return { error: true, message, data: null as unknown as T };
}
