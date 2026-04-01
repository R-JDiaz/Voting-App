# Voting System Database Design

## Election
- id (INT, PK, AUTO_INCREMENT)
- title (VARCHAR)
- description (TEXT)
- start_date (DATETIME)
- end_date (DATETIME)
- status (ENUM: upcoming, ongoing, ended)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Position
- id (INT, PK, AUTO_INCREMENT)
- election_id (INT, FK → Election.id)
- name (VARCHAR)
- description (TEXT)
- max_votes (INT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Candidate
- id (INT, PK, AUTO_INCREMENT)
- position_id (INT, FK → Position.id)
- name (VARCHAR)
- party_list (VARCHAR, NULLABLE)
- bio (TEXT)
- image_url (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Voter
- id (INT, PK, AUTO_INCREMENT)
- username (VARCHAR)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- is_verified (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Vote
- id (INT, PK, AUTO_INCREMENT)
- voter_id (INT, FK → Voter.id)
- election_id (INT, FK → Election.id)
- position_id (INT, FK → Position.id)
- candidate_id (INT, FK → Candidate.id)
- created_at (TIMESTAMP)

## Admin
- id (INT, PK, AUTO_INCREMENT)
- username (VARCHAR)
- password_hash (VARCHAR)
- role (ENUM: admin, superadmin)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)