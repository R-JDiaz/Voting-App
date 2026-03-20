export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  created_at?: string;
  votes_cast?: number;
}

export interface Election {
  id: number;
  title: string;
  description?: string;
  countdown: number;
  status: string;
  created_by?: number;
  created_by_username?: string;
  position_count?: number;
  total_votes?: number;
  created_at?: string;
  positions?: Position[];
}

export interface Position {
  id: number;
  election_id: number;
  name: string;
  description?: string;
  candidate_count?: number;
  election_title?: string;
  created_at?: string;
  candidates?: Candidate[];
}

export interface Candidate {
  id: number;
  position_id: number;
  name: string;
  position_name?: string;
  election_id?: number;
  election_title?: string;
  vote_count?: number;
  created_at?: string;
}

export interface Vote {
  id: number;
  user_id: number;
  candidate_id: number;
  election_id: number;
  position_id: number;
  voted_at: string;
}

export interface VoteResult {
  position_id: number;
  position_name: string;
  total_votes: number;
  total_candidates: number;
  candidates: {
    candidate_id: number;
    candidate_name: string;
    vote_count: number;
    vote_percentage: number;
  }[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: any[];
}

export interface DashboardStats {
  statistics: {
    total_elections: number;
    active_elections: number;
    total_users: number;
    total_votes: number;
    total_positions: number;
    total_candidates: number;
  };
  recentElections: Election[];
  recentUsers: User[];
  votingActivity: {
    date: string;
    vote_count: number;
  }[];
}
