# Backend (ExpressJS + MSSQL)

## Architecture

- `src/index.js` — Server entry point; initializes DB pool and starts Express
- `src/server.js` — Express app with middleware and global error handler
- `src/config/db.js` — MSSQL connection pool configuration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example` and configure:
```bash
cp .env.example .env
```

3. Ensure MSSQL Server is running and create the database:
```bash
sqlcmd -S localhost -U sa -Q "CREATE DATABASE lli_assessment_db"
```

## Run

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server starts on `http://localhost:3001` by default.

## Health Check

```bash
curl http://localhost:3001/health
```
