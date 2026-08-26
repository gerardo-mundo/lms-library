import { UserRole } from './user.model';

/** Login request body */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Auth response from the backend */
export interface AuthResponse {
  token: string;
  expiresIn: number;     // milliseconds
  lastLogin: string;     // ISO datetime
}

/** JWT payload structure decoded from the token */
export interface JwtPayload {
  role: UserRole;
  name: string;
  id: string;
  sub: string;           // email
  iat: number;           // issued at (epoch seconds)
  exp: number;           // expiration (epoch seconds)
}
