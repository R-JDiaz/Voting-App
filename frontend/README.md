# Voting System - Angular Frontend

A modern, responsive Angular frontend for the distributed voting system. Features include user authentication, election browsing, real-time voting, and results visualization.

## 🌟 Features

- **User Authentication**: Login, registration, and JWT-based session management
- **Elections Dashboard**: Browse active and upcoming elections
- **Real-time Voting**: Select candidates and submit votes for multiple positions
- **Results Viewing**: View live and final election results with percentages
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Role-Based UI**: Different interfaces for admin and regular users
- **Auto Token Refresh**: Seamless authentication with automatic token renewal
- **Form Validation**: Comprehensive client-side validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Angular CLI (v17 or higher)
- Backend API running (see backend README)

## 🚀 Installation

### 1. Install Dependencies

```bash
cd voting-system-frontend
npm install
```

### 2. Install Angular CLI Globally (if not installed)

```bash
npm install -g @angular/cli
```

### 3. Configure Environment

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'  // Your backend API URL
};
```

For production, edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com'
};
```

### 4. Start Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`

### 5. Build for Production

```bash
npm run build
# or
ng build --configuration production
```

Build artifacts will be in the `dist/` directory.

## 📁 Project Structure

```
voting-system-frontend/
│
├── src/
│   ├── app/
│   │   ├── components/           # UI Components
│   │   │   ├── login/           # Login page
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── login.component.html
│   │   │   │   └── login.component.css
│   │   │   ├── register/        # Registration page
│   │   │   │   ├── register.component.ts
│   │   │   │   ├── register.component.html
│   │   │   │   └── register.component.css
│   │   │   ├── home/            # Home/Dashboard
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   └── home.component.css
│   │   │   ├── navbar/          # Navigation bar
│   │   │   │   ├── navbar.component.ts
│   │   │   │   ├── navbar.component.html
│   │   │   │   └── navbar.component.css
│   │   │   └── election-detail/ # Voting interface
│   │   │       ├── election-detail.component.ts
│   │   │       ├── election-detail.component.html
│   │   │       └── election-detail.component.css
│   │   │
│   │   ├── services/            # Business Logic Services
│   │   │   ├── auth.service.ts        # Authentication
│   │   │   ├── election.service.ts    # Election management
│   │   │   ├── position.service.ts    # Position operations
│   │   │   ├── candidate.service.ts   # Candidate operations
│   │   │   ├── vote.service.ts        # Voting operations
│   │   │   ├── admin.service.ts       # Admin dashboard
│   │   │   └── user.service.ts        # User management
│   │   │
│   │   ├── guards/              # Route Protection
│   │   │   ├── auth.guard.ts          # Authentication guard
│   │   │   └── admin.guard.ts         # Admin role guard
│   │   │
│   │   ├── interceptors/        # HTTP Interceptors
│   │   │   └── auth.interceptor.ts    # JWT token injection
│   │   │
│   │   ├── models/              # TypeScript Interfaces
│   │   │   └── models.ts              # All data models
│   │   │
│   │   ├── app-routing.module.ts     # Route configuration
│   │   ├── app.module.ts              # Main module
│   │   ├── app.component.ts           # Root component
│   │   ├── app.component.html
│   │   └── app.component.css
│   │
│   ├── environments/           # Environment Config
│   │   ├── environment.ts            # Development
│   │   └── environment.prod.ts       # Production
│   │
│   ├── assets/                 # Static Assets
│   ├── index.html              # Main HTML
│   ├── main.ts                 # Bootstrap
│   └── styles.css              # Global Styles
│
├── angular.json                # Angular CLI config
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tsconfig.app.json           # App TypeScript config
├── .gitignore
└── README.md
```

## 🧩 Component Overview

### Authentication Components

#### Login Component (`components/login/`)
- User login with username/email and password
- Form validation
- Error handling
- Redirect after successful login

#### Register Component (`components/register/`)
- New user registration
- Password confirmation
- Email validation
- Success message and redirect

### Main Application Components

#### Home Component (`components/home/`)
- Dashboard view of all elections
- Separate sections for active and upcoming elections
- Quick stats display
- Navigation to election details

#### Navbar Component (`components/navbar/`)
- Responsive navigation menu
- User profile display
- Role-based menu items
- Logout functionality
- Mobile-friendly hamburger menu

#### Election Detail Component (`components/election-detail/`)
- View election information
- Browse positions and candidates
- Select candidates for voting
- Submit votes
- View results

## 🔐 Services

### AuthService (`services/auth.service.ts`)
Handles all authentication operations:
- `login()` - User login
- `register()` - User registration
- `logout()` - User logout
- `refreshToken()` - Renew access token
- `isAuthenticated` - Check login status
- `isAdmin` - Check admin role
- `currentUser` - Observable of current user

### ElectionService (`services/election.service.ts`)
Manages election data:
- `getAllElections()` - Get all elections
- `getElectionById()` - Get specific election
- `createElection()` - Create new election (admin)
- `updateElection()` - Update election (admin)

### PositionService (`services/position.service.ts`)
Handles position operations:
- `getPositionsByElection()` - Get positions for election
- `createPosition()` - Add position (admin)
- `updatePosition()` - Update position (admin)

### CandidateService (`services/candidate.service.ts`)
Manages candidates:
- `getCandidatesByPosition()` - Get candidates for position
- `createCandidate()` - Add candidate (admin)
- `updateCandidate()` - Update candidate (admin)

### VoteService (`services/vote.service.ts`)
Handles voting:
- `submitVote()` - Submit a vote
- `getElectionResults()` - Get results for election

### AdminService (`services/admin.service.ts`)
Admin dashboard operations:
- `getDashboard()` - Get dashboard statistics

### UserService (`services/user.service.ts`)
User management:
- `getAllUsers()` - Get all users (admin)
- `getUserById()` - Get user details
- `updateUser()` - Update user information

## 🛡️ Guards

### AuthGuard
Protects routes that require authentication. Redirects to login if not authenticated.

```typescript
{ path: 'home', component: HomeComponent, canActivate: [AuthGuard] }
```

### AdminGuard
Protects admin-only routes. Redirects to home if not admin.

```typescript
{ path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard] }
```

## 🔄 HTTP Interceptor

### AuthInterceptor
Automatically:
- Adds JWT token to all HTTP requests
- Handles 401 errors
- Refreshes expired tokens
- Retries failed requests with new token

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

Mobile features:
- Hamburger navigation menu
- Stacked layouts
- Touch-friendly buttons
- Optimized font sizes

## 🎨 Styling

### Global Styles (`src/styles.css`)
- Reset and base styles
- Utility classes
- Common patterns

### Component Styles
Each component has its own scoped CSS file for:
- Maintainability
- No style conflicts
- Better organization

### Color Scheme
- **Primary**: #667eea (Purple)
- **Secondary**: #764ba2 (Dark Purple)
- **Success**: #48bb78 (Green)
- **Danger**: #c53030 (Red)
- **Info**: #3182ce (Blue)

## 🔧 Development

### Running Tests
```bash
ng test
```

### Linting
```bash
ng lint
```

### Code Generation

Generate a new component:
```bash
ng generate component components/my-component
```

Generate a new service:
```bash
ng generate service services/my-service
```

## 📦 Build & Deploy

### Development Build
```bash
ng build
```

### Production Build
```bash
ng build --configuration production
```

### Deploy to Server
1. Build for production
2. Copy `dist/voting-system-frontend/` to your web server
3. Configure server to serve `index.html` for all routes
4. Set up environment variables

### Example nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/voting-system-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔌 API Integration

The frontend expects the backend API to be running. Default API URL is `http://localhost:3000`.

### API Endpoints Used:
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh token
- `GET /elections` - List elections
- `GET /elections/:id` - Get election
- `GET /elections/:id/positions` - Get positions
- `GET /positions/:id/candidates` - Get candidates
- `POST /votes` - Submit vote
- `GET /votes/results/:id` - Get results
- `GET /admin/dashboard` - Admin dashboard

## 🚨 Error Handling

The application handles errors gracefully:
- Display user-friendly error messages
- Log errors to console in development
- Automatic token refresh on 401 errors
- Validation errors displayed inline in forms

## 🔒 Security Features

- JWT token stored in localStorage
- HTTP-only recommendations for production
- CSRF protection via Angular
- XSS prevention via Angular sanitization
- Form validation
- Route guards
- Auto logout on token expiration

## 🎯 User Flows

### Voter Flow:
1. Register/Login
2. View elections dashboard
3. Select an active election
4. Vote for candidates in each position
5. Submit votes
6. View results

### Admin Flow:
1. Login as admin
2. Access admin dashboard
3. Create elections
4. Add positions
5. Add candidates
6. Activate/deactivate elections
7. Monitor voting

## 📝 Best Practices

- **Services**: All API calls go through services
- **Guards**: Protect routes appropriately
- **Interceptors**: Handle cross-cutting concerns
- **Models**: Type-safe data structures
- **Reactive Forms**: Validation and error handling
- **Observables**: Async data management
- **Component Communication**: Services for shared state

## 🆘 Troubleshooting

### Common Issues:

**Cannot connect to API**
- Verify backend is running
- Check `environment.ts` API URL
- Check CORS settings on backend

**Login fails**
- Check credentials
- Verify backend is accessible
- Check browser console for errors

**Token expired**
- Interceptor should auto-refresh
- Check refresh token validity
- Re-login if needed

**Build errors**
- Delete `node_modules` and reinstall
- Clear Angular cache: `ng cache clean`
- Check Angular CLI version

## 🔄 Future Enhancements

- [ ] Real-time updates with WebSockets
- [ ] Advanced result visualization (charts)
- [ ] Admin election management UI
- [ ] User profile management
- [ ] Vote history
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Dark mode
- [ ] PWA support
- [ ] Vote receipt/confirmation

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Happy Voting! 🗳️**
