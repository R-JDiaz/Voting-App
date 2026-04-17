import { AuthData, ElectionByCodeData } from "./data";
import { PublicElection, PublicFullElection } from "./models";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export type AuthResponse = ApiResponse<AuthData>;


//ELECTION
export type PublicElectionResponse = ApiResponse<PublicElection>;

export type PublicFullElectionResponse = ApiResponse<PublicFullElection>;

export type ElectionByCodeResponse = ApiResponse<ElectionByCodeData>;