export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
  email: string;
  can_create_election: boolean;
}
