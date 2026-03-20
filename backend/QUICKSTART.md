# 🚀 Quick Start Guide - Voting System

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd voting-system
npm install
```

### Step 2: Configure Database
```bash
# Copy environment template
cp .env.example .env

# Edit .env and update these values:
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
JWT_SECRET=your-random-secret-key-here
JWT_REFRESH_SECRET=your-random-refresh-secret-key
```

### Step 3: Initialize Database
```bash
npm run migrate
```
✅ This creates the database, tables, and default admin user

### Step 4: Start Server
```bash
npm run dev
```

### Step 5: Test
```bash
curl http://localhost:3000/health
```

## 🎯 First API Calls

### 1. Login as Admin
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
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

Copy the `accessToken` for next requests!

### 2. Create an Election
```bash
# Replace YOUR_TOKEN with the accessToken from above
curl -X POST http://localhost:3000/elections \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Election",
    "description": "Testing the system",
    "countdown": 3600,
    "is_active": true
  }'
```

### 3. Add a Position
```bash
# Use election_id from previous response (usually 1)
curl -X POST http://localhost:3000/elections/1/positions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "President",
    "description": "Class president"
  }'
```

### 4. Add Candidates
```bash
# Use position_id from previous response (usually 1)
curl -X POST http://localhost:3000/positions/1/candidates \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Johnson"}'

curl -X POST http://localhost:3000/positions/1/candidates \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Bob Smith"}'
```

### 5. Register a Voter
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "voter1",
    "email": "voter1@example.com",
    "password": "password123"
  }'
```

### 6. Vote (as the new user)
```bash
# Login as voter first
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "voter1",
    "password": "password123"
  }'

# Then submit vote with voter's token
curl -X POST http://localhost:3000/votes \
  -H "Authorization: Bearer VOTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"candidate_id": 1}'
```

### 7. View Results
```bash
curl -X GET http://localhost:3000/votes/results/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📊 Using Postman

1. Import `postman_collection.json` into Postman
2. Set variables:
   - `baseUrl`: http://localhost:3000
   - `accessToken`: (after login)
3. Run requests in order from the collection

## 🔐 Default Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

⚠️ **Change this password immediately in production!**

## 🛠️ Common Commands

```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start

# Re-run migration (⚠️ drops all data)
npm run migrate

# Check if server is running
curl http://localhost:3000/health
```

## 📝 Troubleshooting

### "Cannot connect to database"
- Check MySQL is running
- Verify DB credentials in `.env`
- Ensure database user has CREATE privileges

### "Port 3000 already in use"
- Change PORT in `.env` file
- Or stop the process using port 3000

### "Invalid token"
- Token might be expired (1 hour)
- Login again to get a new token
- Or use refresh token endpoint

### "Insufficient permissions"
- Check user role (admin vs user)
- Admin-only endpoints require admin role
- Users can only access their own data

## 🎓 Next Steps

1. ✅ Change admin password
2. ✅ Set strong JWT secrets
3. ✅ Create your first real election
4. ✅ Invite users to vote
5. ✅ Monitor results in admin dashboard

## 📚 Full Documentation

See `README.md` for:
- Complete API reference
- Detailed security features
- Deployment guide
- Database schema
- Advanced configuration

## 🆘 Need Help?

- Check `README.md` for detailed docs
- View `FOLDER_STRUCTURE.md` for code organization
- Import `postman_collection.json` for API examples
- Review error messages - they're descriptive!

---

**Happy Voting! 🗳️**
