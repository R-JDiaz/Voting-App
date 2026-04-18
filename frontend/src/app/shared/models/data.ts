import { User } from './models';
//AUTH
export interface AuthData {
  user: User;
  token: string;
}


//ELECTION
export interface ElectionByCodeData {
  id: number;
  requiredPassword: boolean;
}