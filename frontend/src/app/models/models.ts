export interface User {
  id: number;
  username: string;
  email: string;
  can_create_election: boolean;
}

export interface Candidate {
  id: number;
  name: string;
}

export interface Position {
  id: number;
  title: string;
  candidates: Candidate[];
}

export interface PublicFullElection {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  positions: Position[];
}

export interface PublicElection {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}
