export interface User {
  username: string;
  email?: string;
  role?: string;
  token?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn?: number;
}

