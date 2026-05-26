# LLI Assessment System - Setup & Run Guide

## Prerequisites

- **Node.js v14+** with npm ([Download](https://nodejs.org/))
- **MSSQL Server** (local or remote)
- **Git** for version control

## Project Structure

```
lli-assessment-system/
├── backend/                    # ExpressJS API
│   ├── src/
│   │   ├── index.js           # Entry point
│   │   ├── server.js          # Express app
│   │   ├── config/db.js       # DB pool
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── services/
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── main.jsx           # Entry point
│   │   ├── App.jsx            # Router
│   │   ├── pages/
│   │   ├── services/api.js
│   │   ├── context/
│   │   └── components/
│   ├── package.json
│   ├── .env.example
│   └── README.md
└── database/
    └── schema.sql             # MSSQL schema
```

## Installation

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 3. Setup Environment Variables

**Backend (.env)**
```bash
cd ../backend
cp .env.example .env
```

Edit `.env` with your database credentials:
```
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourStrong!Passw0rd
DB_NAME=lli_assessment_db
DB_ENCRYPT=false
DB_TRUST_CERT=false
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=7d
```

**Frontend (.env.local)**
```bash
cd ../frontend
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_API_URL=http://localhost:3001/api
```

## Database Setup

### Create MSSQL Database

Using SQL Server Management Studio or sqlcmd:

```sql
CREATE DATABASE lli_assessment_db;
GO

USE lli_assessment_db;
GO
```

Or use the provided schema:
```bash
sqlcmd -S localhost -U sa -P YourPassword -i database/schema.sql
```

### Seed Initial Users (optional)

```sql
USE lli_assessment_db;
GO

-- Create test users
INSERT INTO Users (email, name, password_hash, role)
VALUES 
  ('alice@example.com', 'Alice Admin', '$2a$10$...', 'Admin'),
  ('bob@example.com', 'Bob Staff', '$2a$10$...', 'Staff');
GO
```

To hash passwords, use bcryptjs in Node:
```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('password123', 10);
console.log(hash);
```

## Running the Application

### Terminal 1: Start Backend

```bash
cd backend
npm run dev
```

Output:
```
[DB] Connected to MSSQL Server
[Server] Listening on http://localhost:3001
```

### Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```

Output:
```
VITE v5.0.0 ready in ... ms

➜ Local: http://localhost:5173/
```

## Access the Application

1. Open browser: **http://localhost:5173**
2. Login with credentials:
   - Email: `alice@example.com`
   - Password: `test123` (or your seeded password)

## Available Commands

### Backend

```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
```

### Frontend

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## API Endpoints

### Health Check
```bash
GET http://localhost:3001/health
```

### Authentication
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}
```

### Assets (all require JWT token in Authorization header)
```bash
GET    /api/assets                # List assets with filters
POST   /api/assets                # Create asset
GET    /api/assets/:id            # Get single asset
PUT    /api/assets/:id            # Update asset
DELETE /api/assets/:id            # Delete asset
```

### Reports
```bash
GET /api/reports/summary          # Get aggregate metrics
```

## Troubleshooting

### npm install fails

```bash
npm cache clean --force
rm -r node_modules
rm package-lock.json
npm install
```

### Database connection error

- Verify MSSQL Server is running
- Check credentials in `.env`
- Ensure database exists: `lli_assessment_db`

### Port already in use

Change port in `.env`:
```
PORT=3002
```

Then update frontend `.env.local`:
```
VITE_API_URL=http://localhost:3002/api
```

### CORS errors

Ensure frontend URL matches `CORS_ORIGIN` in backend `.env`

## Project Status

✅ **Complete Features:**
- User authentication with JWT
- Asset CRUD operations
- Real-time analytics dashboard
- Protected routes
- Form validation
- Error handling
- Responsive design

## Development Notes

- Backend uses Express.js with MSSQL connection pooling
- Frontend uses React 18 with Vite + Ant Design
- All database queries use parameterized inputs (SQL injection safe)
- JWT tokens stored in localStorage with auto-refresh on 401
- Metrics calculated via SQL aggregation (COUNT, SUM, GROUP BY)

## Deployment

See individual README files:
- [Backend Deployment](backend/README.md)
- [Frontend Deployment](frontend/README.md)

## Support

For issues or questions, check:
- Backend logs in terminal
- Browser console (F12)
- `npm audit` for vulnerabilities
- MSSQL Server logs

---

**Created:** May 26, 2026
**Version:** 1.0.0
