import { User } from '../models/models';

export const USERS: User[] = [
  {
    id: 1,
    username: 'john_doe',
    email: 'john.doe@example.com',
    can_create_election: true
  },
  {
    id: 2,
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    can_create_election: false
  }
];