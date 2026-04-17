# Voting System Database Design

## Elections
- id (INT, PK, AUTO_INCREMENT)
- title (VARCHAR)
- description (TEXT)
- start_date (DATETIME)
- end_date (DATETIME)
- creator_id (INT, FK → Users.id)
- is_public (BOOLEAN, DEFAULT true)
- room_code (VARCHAR, UNIQUE, NULLABLE)
- status (ENUM: upcoming, ongoing, ended)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Positions
- id (INT, PK, AUTO_INCREMENT)
- election_id (INT, FK → Election.id)
- name (VARCHAR)
- description (TEXT)
- max_votes (INT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

---

## ElectionRoomUsers
- id (INT, PK, AUTO_INCREMENT)
- election_room_id (INT, FK → ElectionRooms.id)
- user_id (INT, FK → Users.id)
- is_blocked (BOOLEAN, DEFAULT false)
- joined_at (TIMESTAMP)

> UNIQUE (election_room_id, user_id)

---

## Candidates
- id (INT, PK, AUTO_INCREMENT)
- position_id (INT, FK → Position.id)
- name (VARCHAR)
- party_list (VARCHAR, NULLABLE)
- bio (TEXT)
- image_url (VARCHAR, NULLABLE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Users
- id (INT, PK, AUTO_INCREMENT)
- username (VARCHAR)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- can_create_election (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Votes
- id (INT, PK, AUTO_INCREMENT)
- voter_id (INT, FK → Voter.id)
- election_id (INT, FK → Election.id)
- position_id (INT, FK → Position.id)
- candidate_id (INT, FK → Candidate.id)
- created_at (TIMESTAMP)

## Admins
- id (INT, PK, AUTO_INCREMENT)
- username (VARCHAR)
- password_hash (VARCHAR)
- role (ENUM: admin, superadmin)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)