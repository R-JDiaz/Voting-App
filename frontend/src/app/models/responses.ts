import { AuthData, ElectionByCodeData } from "./data";
import { PublicElection, PublicFullElection } from "./models";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type AuthResponse = ApiResponse<AuthData>;


//ELECTION
export type GetAllPublicElectionResponse = ApiResponse<PublicElection[]>;

export type PublicElectionResponse = ApiResponse<PublicElection>;

export type PublicFullElectionResponse = ApiResponse<PublicFullElection>;

export type ElectionByCodeResponse = ApiResponse<ElectionByCodeData>;