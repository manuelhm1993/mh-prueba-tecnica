export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface LocalProfile {
  displayName: string;
  email: string;
}