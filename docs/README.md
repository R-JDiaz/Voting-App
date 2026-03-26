# 🗳️ Distributed Voting System

A production-ready, full-stack voting system with MySQL master-slave replication, load-balanced backend servers, and real-time updates. Built with Express.js, Angular, and Docker.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)
![MySQL](https://img.shields.io/badge/mysql-8.0-orange.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![Angular](https://img.shields.io/badge/angular-17-red.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### Core Functionality
- ✅ **Multi-Election Support** - Create and manage multiple concurrent elections
- ✅ **Position-Based Voting** - Organize elections with multiple positions
- ✅ **Candidate Management** - Add unlimited candidates per position
- ✅ **Real-Time Results** - Live vote counting and result updates
- ✅ **One Vote Per Position** - Prevents duplicate voting

### Security & Authentication
- 🔐 **JWT Authentication** - Secure token-based authentication
- 🔐 **Role-Based Access Control** - Admin and user permissions
- 🔐 **Password Encryption** - Bcrypt hashing
- 🔐 **Rate Limiting** - Protection against brute force attacks

### Performance & Scalability
- ⚡ **Load Balancer** - 3 backend servers with nginx
- ⚡ **Master-Slave Replication** - 1 master + 2 slave databases
- ⚡ **Read/Write Splitting** - Automatic query routing
- ⚡ **Round-Robin Load Balancing** - Distributes requests across servers

### User Experience
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 📱 **Modern UI** - Beautiful gradient design
- 📱 **Real-Time Updates** - Live vote counts
- 📱 **Form Validation** - Client and server-side validation

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend (Angular)                      │
│                http://localhost:4200                     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Load Balancer (Nginx)                       │
│                http://localhost:3000                     │
└──────┬────────────────┬────────────────┬────────────────┘
       │                │                │
       ▼                ▼                ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Backend  │     │ Backend  │     │ Backend  │
│ Server 1 │     │ Server 2 │     │ Server 3 │
│  :3001   │     │  :3002   │     │  :3003   │
└─────┬────┘     └─────┬────┘     └─────┬────┘
      │                │                │
      └────────────────┼────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │ Writes       │ Reads         │
        ▼              ▼               ▼
   ┌────────┐    ┌────────┐     ┌────────┐
   │ Master │────│ Slave1 │     │ Slave2 │
   │  :3306 │    │  :3307 │     │  :3308 │
   └────────┘    └────────┘     └────────┘
```

### Components
- **Frontend**: Angular application (Port 4200)
- **Load Balancer**: Nginx distributing requests (Port 3000)
- **Backend Servers**: 3 Express.js instances (Ports 3001, 3002, 3003)
- **Master Database**: Handles all writes (Port 3306)
- **Slave Databases**: Handle reads (Ports 3307, 3308)

---

## 📦 Prerequisites

### Required Software

| Software | Minimum Version | Download |
|----------|----------------|----------|
| Docker | 20.10+ | [Get Docker](https://docs.docker.com/get-docker/) |
| Docker Compose | 2.0+ | [Get Docker Compose](https://docs.docker.com/compose/install/) |
| Git | 2.30+ | [Get Git](https://git-scm.com/downloads) |

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 5GB free space
- **OS**: Linux, macOS, or Windows (with WSL2)
- **Ports**: 3000-3003, 3306-3308, 4200 must be available

### Verify Installation

```bash
# Check Docker
docker --version

# Check Docker Compose
docker-compose --version

# Check Git
git --version

# Check if ports are available
netstat -tuln | grep -E ':(3000|3001|3002|3003|3306|3307|3308|4200)'
# Should return empty (ports available)
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/college-of-mary-immaculate/Voting-App-Finals-Last.git
cd Voting-App-Finals-Last
```

### 2. Start All Services

```bash
# Start all containers
docker-compose up -d

# This will start:
# - Nginx Load Balancer (port 3000)
# - 3 Backend Servers (ports 3001, 3002, 3003)
# - MySQL Master (port 3306)
# - 2 MySQL Slaves (ports 3307, 3308)
# - Angular Frontend (port 4200)
```

### 3. Set Up Database Replication

```bash
# Make scripts executable (first time only)
chmod +x setup-repl.sh migrate.sh

# Set up master-slave replication
./setup-repl.sh

# Wait for replication to initialize
sleep 30
```

### 4. Run Database Migration

```bash
# Create database schema and seed data
./migrate.sh

# This creates:
# - All database tables
# - Indexes and constraints
# - Default admin user (username: admin, password: admin123)
```

### 5. Verify Installation

```bash
# Check all containers are running
docker-compose ps

# Expected output:
# NAME                STATUS    PORTS
# nginx-lb            Up        0.0.0.0:3000->80/tcp
# backend-1           Up        0.0.0.0:3001->3000/tcp
# backend-2           Up        0.0.0.0:3002->3000/tcp
# backend-3           Up        0.0.0.0:3003->3000/tcp
# mysql-master        Up        0.0.0.0:3306->3306/tcp
# mysql-slave1        Up        0.0.0.0:3307->3306/tcp
# mysql-slave2        Up        0.0.0.0:3308->3306/tcp
# voting-frontend     Up        0.0.0.0:4200->4200/tcp

# Test the application
curl http://localhost:3000/health
# Should return: {"success":true,"message":"Server is running"}
```

### 6. Access the Application

Open your browser and navigate to:

- **Frontend**: [http://localhost:4200](http://localhost:4200)
- **Backend API (via Load Balancer)**: [http://localhost:3000](http://localhost:3000)

### 7. Login with Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change the admin password immediately after first login!

---

## 💻 Usage

### For Administrators

#### Create an Election

1. Login with admin credentials
2. Click **"Admin Dashboard"**
3. Click **"Create Election"**
4. Fill in details:
   - Title: "Student Council Elections 2024"
   - Description: "Annual elections"
   - Countdown: 86400 (seconds = 24 hours)
   - Status: ✓ Active
5. Click **"Create"**

#### Add Positions and Candidates

1. Select your election
2. Click **"Add Position"**
   - Name: "President"
   - Description: "Student council president"
3. Click on the position
4. Click **"Add Candidate"**
   - Name: "John Doe"
5. Repeat for all candidates

#### Monitor Results

- View **"Admin Dashboard"** for statistics
- Check **"Election Results"** for live vote counts
- See voting activity and trends

### For Voters

#### Register and Vote

1. Click **"Register"** on homepage
2. Fill in registration form:
   - Username (min 3 characters)
   - Email address
   - Password (min 6 characters)
3. Click **"Register"**
4. Login with your credentials
5. Browse **"Active Elections"**
6. Click on an election to vote
7. Select one candidate per position
8. Click **"Submit Votes"**

#### View Results

1. Click on any election
2. Click **"View Results"**
3. See live vote counts and percentages
4. Results update in real-time

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000
```

All requests go through the nginx load balancer which distributes them across 3 backend servers.

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer {accessToken}
```

### Core Endpoints

#### Authentication

**Register User**
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Logout**
```http
POST /auth/logout
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Elections

**Get All Elections**
```http
GET /elections
Authorization: Bearer {accessToken}
```

**Create Election** (Admin Only)
```http
POST /elections
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Student Council 2024",
  "description": "Annual elections",
  "countdown": 86400,
  "is_active": true
}
```

**Get Election Details**
```http
GET /elections/{election_id}
Authorization: Bearer {accessToken}
```

**Update Election** (Admin Only)
```http
PUT /elections/{election_id}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "is_active": false
}
```

#### Positions

**Get Positions for Election**
```http
GET /elections/{election_id}/positions
Authorization: Bearer {accessToken}
```

**Create Position** (Admin Only)
```http
POST /elections/{election_id}/positions
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "President",
  "description": "Student council president"
}
```

#### Candidates

**Get Candidates for Position**
```http
GET /positions/{position_id}/candidates
Authorization: Bearer {accessToken}
```

**Create Candidate** (Admin Only)
```http
POST /positions/{position_id}/candidates
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "John Doe"
}
```

#### Voting

**Submit Vote**
```http
POST /votes
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "candidate_id": 1
}
```

Note: You can only vote once per position. Duplicate votes will be rejected.

**Get Election Results**
```http
GET /votes/results/{election_id}
Authorization: Bearer {accessToken}
```

Response:
```json
{
  "success": true,
  "data": {
    "election": {
      "id": 1,
      "title": "Student Council Elections 2024"
    },
    "results": [
      {
        "position_id": 1,
        "position_name": "President",
        "total_votes": 150,
        "candidates": [
          {
            "candidate_id": 1,
            "candidate_name": "John Doe",
            "vote_count": 80,
            "vote_percentage": 53.33
          }
        ]
      }
    ]
  }
}
```

#### Admin Dashboard

**Get Dashboard Statistics** (Admin Only)
```http
GET /admin/dashboard
Authorization: Bearer {accessToken}
```

Response:
```json
{
  "success": true,
  "data": {
    "statistics": {
      "total_elections": 5,
      "active_elections": 2,
      "total_users": 150,
      "total_votes": 450
    },
    "recentElections": [...],
    "recentUsers": [...],
    "votingActivity": [...]
  }
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### Containers Won't Start

**Problem**: Containers show "Restarting" or "Exited"

**Solution**:
```bash
# Check logs
docker-compose logs backend-1
docker-compose logs mysql-master

# Check if ports are in use
lsof -i :3000
lsof -i :3306

# Stop conflicting services
sudo service mysql stop
sudo service nginx stop

# Restart containers
docker-compose restart
```

#### Database Replication Not Working

**Problem**: Slaves not replicating from master

**Solution**:
```bash
# Check slave status
docker exec mysql-slave1 mysql -uroot -prootpassword \
  -e "SHOW SLAVE STATUS\G" | grep Running

# Should show:
# Slave_IO_Running: Yes
# Slave_SQL_Running: Yes

# If not, re-run setup script
./setup-repl.sh
```

#### Load Balancer Not Distributing

**Problem**: All requests go to one backend server

**Solution**:
```bash
# Check nginx config
docker exec nginx-lb cat /etc/nginx/nginx.conf

# Verify all backends are healthy
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health

# Restart nginx
docker-compose restart nginx-lb
```

#### Frontend Can't Connect to Backend

**Problem**: CORS errors or connection refused

**Solution**:
```bash
# Check backend is running
curl http://localhost:3000/health

# Verify CORS settings in backend/.env
CORS_ORIGIN=http://localhost:4200

# Check frontend environment
cat frontend/src/environments/environment.ts

# Rebuild frontend
cd frontend && ng build
```

#### "Already Voted" Error

**Problem**: User trying to vote twice

**Solution**:
This is expected - one vote per position per user. To reset for testing:

```bash
# Delete user's votes (DEVELOPMENT ONLY!)
docker exec mysql-master mysql -uroot -prootpassword voting_system \
  -e "DELETE FROM votes WHERE user_id = {user_id};"
```

#### JWT Token Expired

**Problem**: "Invalid or expired token" error

**Solution**:
```bash
# Tokens expire after 1 hour by default
# Frontend should auto-refresh using refresh token
# If refresh token also expired, user must re-login

# To extend token lifetime, edit backend/.env:
JWT_EXPIRES_IN=24h
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend-1
docker-compose logs -f mysql-master
docker-compose logs -f nginx-lb

# Last 100 lines
docker-compose logs --tail=100 backend-1

# Save logs to file
docker-compose logs > debug.log
```

### Checking Service Health

```bash
# Check all containers
docker-compose ps

# Check nginx load balancer
curl http://localhost:3000/health

# Check individual backend servers
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health

# Check database replication
docker exec mysql-slave1 mysql -uroot -prootpassword \
  -e "SHOW SLAVE STATUS\G"
```

### Restarting Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend-1
docker-compose restart mysql-master

# Stop all services
docker-compose down

# Start all services
docker-compose up -d

# Rebuild and restart
docker-compose up -d --build
```

### Reset Everything (DANGER!)

```bash
# This will delete ALL data!
docker-compose down -v
docker-compose up -d
./setup-repl.sh
./migrate.sh
```

---

## 📂 Project Structure

```
Voting-App-Finals-Last/
│
├── backend/                  # Express.js Backend
│   ├── src/
│   │   ├── config/          # Database & app config
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, validation, etc.
│   │   ├── routes/          # API endpoints
│   │   └── server.js        # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                 # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # UI components
│   │   │   ├── services/    # API services
│   │   │   ├── guards/      # Route guards
│   │   │   └── models/      # TypeScript interfaces
│   │   └── environments/    # Config files
│   ├── angular.json
│   └── package.json
│
├── nginx/                    # Load Balancer Config
│   └── nginx.conf           # Nginx configuration
│
├── mysql-config/            # MySQL Configuration
│   ├── master/
│   │   └── my.cnf
│   ├── slave1/
│   │   └── my.cnf
│   └── slave2/
│       └── my.cnf
│
├── docker-compose.yml       # Docker orchestration
├── setup-repl.sh           # Setup replication
├── migrate.sh              # Database migration
└── README.md               # This file
```

---

## 🔗 Useful Commands

### Docker Commands
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Restart service
docker-compose restart backend-1

# Rebuild and start
docker-compose up -d --build
```

### Database Commands
```bash
# Connect to master
docker exec -it mysql-master mysql -uroot -prootpassword voting_system

# Connect to slave
docker exec -it mysql-slave1 mysql -uroot -prootpassword voting_system

# Check replication
docker exec mysql-slave1 mysql -uroot -prootpassword \
  -e "SHOW SLAVE STATUS\G"

# Backup database
docker exec mysql-master mysqldump -uroot -prootpassword \
  voting_system > backup.sql

# Restore database
docker exec -i mysql-master mysql -uroot -prootpassword \
  voting_system < backup.sql
```

### Backend Commands
```bash
# Access backend container
docker exec -it backend-1 sh

# View backend logs
docker-compose logs -f backend-1

# Run migration
./migrate.sh
```

### Frontend Commands
```bash
# Access frontend container
docker exec -it voting-frontend sh

# Rebuild frontend
cd frontend && ng build
```

---

## 📊 System Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 4200 | Angular application |
| Load Balancer | 3000 | Nginx (public API endpoint) |
| Backend Server 1 | 3001 | Express instance 1 |
| Backend Server 2 | 3002 | Express instance 2 |
| Backend Server 3 | 3003 | Express instance 3 |
| MySQL Master | 3306 | Write operations |
| MySQL Slave 1 | 3307 | Read operations |
| MySQL Slave 2 | 3308 | Read operations |

---

## 🛡️ Security Notes

### Default Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Database:**
- Root Password: `rootpassword`
- User: `votinguser`
- Password: `votingpass`

⚠️ **IMPORTANT**: Change these credentials before deploying to production!

### Changing Credentials

**1. Change Admin Password:**
```bash
# After logging in as admin, go to profile settings
# Or use API:
curl -X PUT http://localhost:3000/users/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"password": "new-secure-password"}'
```

**2. Change Database Passwords:**
Edit `docker-compose.yml` and update:
```yaml
MYSQL_ROOT_PASSWORD: your-new-root-password
MYSQL_PASSWORD: your-new-user-password
```

Then restart:
```bash
docker-compose down
docker-compose up -d
```

**3. Change JWT Secrets:**
Edit `backend/.env`:
```bash
JWT_SECRET=your-super-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
```

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- Express.js team
- Angular team
- MySQL team
- Docker team
- Nginx team

---

## 📞 Support

For issues and questions:
- GitHub Issues: [Report a bug](https://github.com/college-of-mary-immaculate/Voting-App-Finals-Last/issues)
- Repository: [View source](https://github.com/college-of-mary-immaculate/Voting-App-Finals-Last)

---

**Built with ❤️ by College of Mary Immaculate**

**Happy Voting! 🗳️**