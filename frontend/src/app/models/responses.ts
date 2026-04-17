import { AuthData, ElectionByCodeData } from "./data";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export type AuthResponse = ApiResponse<AuthData>;

export type ElectionByCodeResponse = ApiResponse<ElectionByCodeData>;