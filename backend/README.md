# Distributed Voting System API

A secure, scalable voting system backend built with Express.js and MySQL, featuring role-based access control, JWT authentication, and comprehensive election management capabilities.

## 🌟 Features

- **Secure Authentication**: JWT-based authentication with refresh tokens
- **Role-Based Access Control**: Admin and user roles with granular permissions
- **Election Management**: Create and manage elections with multiple positions
- **Position & Candidate Management**: Organize elections with various positions and candidates
- **Vote Tracking**: Secure vote submission with duplicate prevention
- **Real-time Results**: Live vote counting and result visualization
- **Admin Dashboard**: Comprehensive statistics and monitoring
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive request validation
- **Transaction Safety**: Database transactions for critical operations

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voting-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=voting_system
   
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d
   ```

4. **Run database migration**
   ```bash
   npm run migrate
   ```
   
   This will create:
   - Database schema
   - All required tables
   - Default admin user (username: `admin`, password: `admin123`)

5. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify installation**
   ```bash
   curl http://localhost:3000/health
   ```

## 📁 Project Structure

```
voting-system/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection configuration
│   ├── controllers/
│   │   ├── adminController.js   # Admin dashboard logic
│   │   ├── authController.js    # Authentication logic
│   │   ├── candidateController.js
│   │   ├── electionController.js
│   │   ├── positionController.js
│   │   ├── userController.js
│   │   └── voteController.js
│   ├── database/
│   │   └── migrate.js           # Database migration script
│   ├── middleware/
│   │   ├── auth.js              # Authentication & authorization
│   │   ├── errorHandler.js      # Global error handling
│   │   └── validate.js          # Request validation
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── candidateRoutes.js
│   │   ├── electionRoutes.js
│   │   ├── positionRoutes.js
│   │   ├── userRoutes.js
│   │   └── voteRoutes.js
│   ├── validators/
│   │   └── validators.js        # Input validation schemas
│   └── server.js                # Application entry point
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Database Schema

### Users
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email address
- `password_hash`: Bcrypt hashed password
- `role`: 'admin' or 'user'

### Elections
- `id`: Primary key
- `title`: Election title
- `description`: Optional description
- `countdown`: Time in seconds
- `is_active`: Boolean status
- `created_by`: Foreign key to users

### Positions
- `id`: Primary key
- `election_id`: Foreign key to elections
- `name`: Position name
- `description`: Optional description

### Candidates
- `id`: Primary key
- `position_id`: Foreign key to positions
- `name`: Candidate name

### Votes
- `id`: Primary key
- `user_id`: Foreign key to users
- `candidate_id`: Foreign key to candidates
- `election_id`: Foreign key to elections
- `position_id`: Foreign key to positions
- Unique constraint on (user_id, position_id) - prevents duplicate votes

## 🔌 API Endpoints

### Authentication (`/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login user |
| POST | `/auth/logout` | Public | Logout user |
| POST | `/auth/refresh` | Public | Refresh access token |

**Register Example:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login Example:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Admin (`/admin`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/dashboard` | Admin | Get dashboard statistics |

### Elections (`/elections`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/elections` | Admin | Create new election |
| PUT | `/elections/:election_id` | Admin | Update election |
| GET | `/elections` | Authenticated | Get all elections |
| GET | `/elections/:election_id` | Authenticated | Get specific election |

**Create Election Example:**
```bash
curl -X POST http://localhost:3000/elections \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Student Council Elections 2024",
    "description": "Annual student council elections",
    "countdown": 86400,
    "is_active": true
  }'
```

### Positions

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/elections/:election_id/positions` | Admin | Add position |
| PUT | `/positions/:position_id` | Admin | Update position |
| GET | `/positions/:position_id` | Authenticated | Get position details |
| GET | `/elections/:election_id/positions` | Authenticated | Get all positions |

**Create Position Example:**
```bash
curl -X POST http://localhost:3000/elections/1/positions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "President",
    "description": "Student council president"
  }'
```

### Candidates

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/positions/:position_id/candidates` | Admin | Add candidate |
| PUT | `/candidates/:candidate_id` | Admin | Update candidate |
| GET | `/candidates/:candidate_id` | Authenticated | Get candidate details |
| GET | `/positions/:position_id/candidates` | Authenticated | Get all candidates |

**Create Candidate Example:**
```bash
curl -X POST http://localhost:3000/positions/1/candidates \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith"
  }'
```

### Users (`/users`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/users` | Authenticated | Create user |
| GET | `/users/:user_id` | Authenticated | Get user details |
| PUT | `/users/:user_id` | Authenticated | Update user |
| GET | `/users` | Admin | Get all users |

### Votes (`/votes`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/votes` | Authenticated | Submit vote |
| GET | `/votes/results/:election_id` | Authenticated | Get election results |

**Submit Vote Example:**
```bash
curl -X POST http://localhost:3000/votes \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": 1
  }'
```

**Get Results Example:**
```bash
curl -X GET http://localhost:3000/votes/results/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After logging in, you'll receive:

1. **Access Token** - Short-lived token (1 hour) for API requests
2. **Refresh Token** - Long-lived token (7 days) to get new access tokens

### Using Access Tokens

Include the access token in the Authorization header:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Refreshing Tokens

When your access token expires, use the refresh endpoint:
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 👥 User Roles

### Admin
- Create/update/delete elections
- Manage positions and candidates
- View all users
- Access admin dashboard
- Full system access

### User (Voter)
- View elections and candidates
- Submit votes
- View results
- Update own profile

## 🛡️ Security Features

1. **Password Hashing**: Bcrypt with salt rounds
2. **JWT Authentication**: Secure token-based auth
3. **Rate Limiting**: Prevents brute force attacks
4. **Input Validation**: Comprehensive request validation
5. **SQL Injection Prevention**: Parameterized queries
6. **CORS Protection**: Configurable CORS policy
7. **Helmet.js**: Security headers
8. **Role-Based Access Control**: Granular permissions

## 🧪 Testing the API

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Login as Admin
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 3. Create an Election
```bash
# Replace YOUR_TOKEN with the access token from login
curl -X POST http://localhost:3000/elections \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Election",
    "is_active": true
  }'
```

### 4. View Dashboard
```bash
curl -X GET http://localhost:3000/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 3306 |
| DB_USER | Database user | root |
| DB_PASSWORD | Database password | - |
| DB_NAME | Database name | voting_system |
| JWT_SECRET | Access token secret | - |
| JWT_REFRESH_SECRET | Refresh token secret | - |
| JWT_EXPIRES_IN | Access token expiry | 1h |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiry | 7d |
| CORS_ORIGIN | Allowed CORS origin | * |
| RATE_LIMIT_WINDOW_MS | Rate limit window | 900000 |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## 📊 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

## 🚀 Deployment

### Production Checklist

1. ✅ Change default admin password
2. ✅ Set strong JWT secrets
3. ✅ Configure proper CORS origins
4. ✅ Enable HTTPS
5. ✅ Set NODE_ENV to production
6. ✅ Configure rate limiting
7. ✅ Set up database backups
8. ✅ Monitor server logs
9. ✅ Use environment variables for secrets

### Docker Deployment (Optional)

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review API endpoint examples

## 🔄 Version History

- **v1.0.0** - Initial release
  - JWT authentication
  - Role-based access control
  - Complete voting system
  - Admin dashboard

---

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Important:** Change the default admin password immediately after first login!
