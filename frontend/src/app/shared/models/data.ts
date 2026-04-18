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

export interface CountdownInterface {
  days: number;
  hours: number;
  minutes: number;
  seconds: number
}

export interface DateTimeRange {
  startDate : string,
  endDate : string
}
