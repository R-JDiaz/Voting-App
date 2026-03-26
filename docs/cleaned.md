# 1. Authentication & Role System
## Backend
- Login (username/email/phone + password)
- Registration (with optional electionID auto-join)
- JWT Authentication (access + refresh tokens)
- Password hashing (bcrypt)
- Input validation & sanitization

## Role System (RBAC)
### Roles:
### User (default)
- Election Creator (permission-based)

### Admin
<pre>User field:
canCreateElection: boolean </pre>
- Middleware to protect routes based on roles/permissions

## Frontend
- Login/Register UI with validation
- Role-based UI rendering (show/hide features)
- Auto-join election via invite/electionID

# 2. Election Creation & Management (User + Admin Controlled)
## Backend
### Users with permission (canCreateElection = true) can:
- Create elections
- Edit elections (before start)
- Delete their own elections
- Election creation includes:
    + Title, description
    + Positions (with candidates)
    + Party system
    + Start & end time
    + Visibility (public/private)
    + Password protection (optional)
    
### Admin can:
Grant/Revoke election creation permission
- Delete or override any election
- Monitor all user-created elections

## Frontend
- “Create Election” button (only visible if permitted)
- Election creation wizard (multi-step form)
- Manage own elections dashboard
- Visibility settings UI (public/private/password)

# 3. Core Voting System
## Backend
- Cast vote endpoint (single/multi-choice)
- Prevent duplicate votes:
   + User-based
   + Session/IP/device tracking
- Validate election status (only active elections)
- Real-time vote counting (WebSockets)
- Store vote history
- Lock elections after deadline
- Audit logs for all votes

## Frontend
- Candidate cards (image, name, party, description)
- Voting interface (single/multi-select)
- Vote confirmation modal
- Animated success/error feedback
- Disabled voting states (voted/ended)

# 4. Election Room (Real-Time System)
## Backend
- WebSocket-based communication
- Separate room per election
- Join/Leave election rooms:
  + Public
  + Password-protected
- Real-time vote updates
- Chat system per election
- Broadcast admin/creator updates

## Frontend
- Election room UI:
- Chat box
- Live vote updates
- Notifications panel
- Interactive UI (animations, cursor effects)

# 5. User Features
## Backend
- Profile management:
  + Username, email, phone, password
  + Profile image upload
- Track joined elections
- Store participation history
- Push notification system

## Frontend
- Profile page (edit + image upload)
- User dashboard:
  + Joined elections
  + Completed election results
- Notification system (real-time alerts)


# 6. Admin Panel & Moderation
## Backend
- Manage users:
  + Block/unblock
  + Delete users
- Manage permissions:
  + Grant/Revoke canCreateElection
- Monitor elections:
- View all elections
- Remove abusive elections
- View audit logs:
  + Votes
  + Admin actions
- Dashboard analytics

## Frontend
- Admin dashboard UI
- User management panel
- Permission control UI
- Election monitoring tools
- Logs viewer interface

# 7. Real-Time Analytics & Leaderboards
## Backend
- Real-time vote aggregation
- Leaderboard generation
- Historical results storage
- Metrics tracking (votes over time)

## Frontend
- Animated leaderboards
- Live charts (bar/pie)
- Dynamic ranking updates
- Smooth transitions

# 8. Advanced System Features
## Backend
- Audit Logs
- Track votes (who, when, what)
- Track admin actions
- Scheduled Tasks
- Auto-start elections
- Auto-end elections
- Push Notifications
- Election updates
- Result announcements
- Advanced Filtering
  + By category
  + By status (active/upcoming/ended)
  + By popularity
- Batch Upload
- Import candidates via CSV/Excel
- Versioning System
- Track election changes
- Rollback functionality

## Frontend
- Notification system (toast/live updates)
- Filter/search UI
- File upload UI with validation
- Version history viewer + rollback UI
- Animated election state changes

# 1. Database Design

## Election Schema
- Id (PK)
- ElectionRoomId
- Title, Description
- Positions
- Party
- Visibility (public/private)
- Password (optional, hashed)
- StartAt, EndAt
- CreatedAt, UpdatedAt

## Candidate Schema
- Id (PK)
- Name
- Party (default: none)
- Image
- Description

## User 
- canCreateElection: boolean

## Relations
- Election → Positions → Candidates
- Election → Users
- Election → Votes

