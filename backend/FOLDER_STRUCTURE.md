# Voting System - Folder Structure

```
voting-system/
│
├── src/                                    # Source code directory
│   │
│   ├── config/                            # Configuration files
│   │   └── database.js                    # MySQL database connection pool
│   │
│   ├── controllers/                       # Business logic controllers
│   │   ├── adminController.js             # Admin dashboard & statistics
│   │   ├── authController.js              # Authentication (login, register, logout, refresh)
│   │   ├── candidateController.js         # Candidate CRUD operations
│   │   ├── electionController.js          # Election CRUD operations
│   │   ├── positionController.js          # Position CRUD operations
│   │   ├── userController.js              # User management
│   │   └── voteController.js              # Vote submission & results
│   │
│   ├── database/                          # Database scripts
│   │   └── migrate.js                     # Database migration & setup script
│   │
│   ├── middleware/                        # Express middleware
│   │   ├── auth.js                        # JWT authentication & role authorization
│   │   ├── errorHandler.js                # Global error handling & 404
│   │   └── validate.js                    # Request validation middleware
│   │
│   ├── routes/                            # API route definitions
│   │   ├── adminRoutes.js                 # Admin endpoints
│   │   ├── authRoutes.js                  # Authentication endpoints
│   │   ├── candidateRoutes.js             # Candidate endpoints
│   │   ├── electionRoutes.js              # Election endpoints
│   │   ├── positionRoutes.js              # Position endpoints
│   │   ├── userRoutes.js                  # User endpoints
│   │   └── voteRoutes.js                  # Voting & results endpoints
│   │
│   ├── validators/                        # Input validation schemas
│   │   └── validators.js                  # express-validator schemas
│   │
│   └── server.js                          # Main application entry point
│
├── .env.example                           # Environment variables template
├── .gitignore                             # Git ignore rules
├── package.json                           # NPM dependencies & scripts
├── README.md                              # Project documentation
├── postman_collection.json                # API testing collection
└── FOLDER_STRUCTURE.md                    # This file

```

## Directory Descriptions

### `/src/config`
Contains application configuration files, primarily database connection setup.

### `/src/controllers`
Business logic layer. Each controller handles specific domain operations:
- **adminController**: Dashboard statistics, system overview
- **authController**: User authentication, token management
- **candidateController**: Candidate management for positions
- **electionController**: Election creation, updates, retrieval
- **positionController**: Position management within elections
- **userController**: User profile and account management
- **voteController**: Vote submission, validation, and result calculation

### `/src/database`
Database-related scripts including migration and seeding utilities.

### `/src/middleware`
Express middleware functions:
- **auth.js**: JWT token verification and role-based access control
- **errorHandler.js**: Centralized error handling and HTTP status codes
- **validate.js**: Request validation execution

### `/src/routes`
API endpoint definitions. Each route file maps HTTP methods to controller functions.

### `/src/validators`
Input validation rules using express-validator for request sanitization and validation.

## Database Tables

```
users                    # User accounts with roles
├── id (PK)
├── username (UNIQUE)
├── email (UNIQUE)
├── password_hash
├── role (admin/user)
└── timestamps

elections                # Voting elections
├── id (PK)
├── title
├── description
├── countdown
├── is_active
├── created_by (FK → users)
└── timestamps

positions                # Positions within elections
├── id (PK)
├── election_id (FK → elections)
├── name
├── description
└── timestamps

candidates               # Candidates for positions
├── id (PK)
├── position_id (FK → positions)
├── name
└── timestamps

votes                    # Cast votes
├── id (PK)
├── user_id (FK → users)
├── candidate_id (FK → candidates)
├── election_id (FK → elections)
├── position_id (FK → positions)
├── voted_at
└── UNIQUE (user_id, position_id)

refresh_tokens           # JWT refresh tokens
├── id (PK)
├── user_id (FK → users)
├── token
├── expires_at
└── created_at
```

## Key Features by File

### Authentication Flow
- `authController.js` - Handles login, registration, token generation
- `auth.js` (middleware) - Verifies JWT tokens on protected routes
- `authRoutes.js` - Defines auth endpoints

### Voting Flow
1. User authenticates via `authRoutes.js`
2. Views elections via `electionRoutes.js`
3. Views positions via `positionRoutes.js`
4. Views candidates via `candidateRoutes.js`
5. Submits vote via `voteRoutes.js`
6. Views results via `voteRoutes.js`

### Admin Flow
1. Admin authenticates with admin role
2. Creates election via `electionRoutes.js`
3. Adds positions via `positionRoutes.js`
4. Adds candidates via `candidateRoutes.js`
5. Views dashboard via `adminRoutes.js`

## File Interactions

```
HTTP Request
    ↓
server.js (entry point)
    ↓
Route Handler (routes/)
    ↓
Middleware (auth, validate)
    ↓
Controller (controllers/)
    ↓
Database (config/database.js)
    ↓
Response + Error Handler
```

## Environment Configuration

All environment-specific settings are in `.env`:
- Server configuration (PORT, NODE_ENV)
- Database credentials (DB_HOST, DB_USER, etc.)
- JWT secrets and expiration times
- CORS and security settings

## API Testing

Use `postman_collection.json` to:
1. Import into Postman or Insomnia
2. Set environment variables (baseUrl, tokens)
3. Test all endpoints with sample data
4. Validate responses and error handling
