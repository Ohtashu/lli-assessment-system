# LLI Assessment System - Asset & Inventory Management

A full-stack Asset and Inventory Management Web Application built as a technical assessment project. The system features secure user authentication and complete CRUD operations for corporate hardware assets.

## 🛠️ Tech Stack
- **Frontend:** ReactJS, Ant Design, Axios, Vite
- **Backend:** Node.js, ExpressJS
- **Database:** Microsoft SQL Server (MSSQL)
- **Authentication:** JSON Web Tokens (JWT), BcryptJS

---

## 📁 Repository Structure

```text
lli-assessment-system/
├── backend/             # Express API service
│   ├── src/
│   │   ├── config/      # MSSQL connection pool config
│   │   ├── controllers/ # HTTP request handlers
│   │   ├── middleware/  # JWT authorization middleware
│   │   ├── routes/      # REST API route declarations
│   │   └── services/    # SQL data access and business logic
│   └── .env.example
├── frontend/            # React client application
│   ├── src/
│   │   ├── components/  # Route guards and reusable components
│   │   ├── context/     # Auth context and global state
│   │   └── pages/       # Login and dashboard screens
│   └── .env.example
└── database/
    └── schema.sql       # MSSQL schema and seed data
```

---

## 🚀 Setup & Installation Instructions

Follow these step-by-step instructions to clone, configure, and run the application locally.

### 1. Database Setup
1. Open **SQL Server Management Studio (SSMS)** and connect to your local database engine.
2. Ensure **SQL Server and Windows Authentication Mode (Mixed Mode)** is enabled in the server properties security tab.
3. Open and execute the database schema script at [`database/schema.sql`](database/schema.sql) to create `AssetManagementDB` and seed the initial administration account.
4. Open **SQL Server Configuration Manager** and verify that **TCP/IP** protocols are enabled for your server instance, listening on port `1433`.

### 2. Backend Environment Configuration
Navigate into the `backend` directory and create a `.env` file with the following configuration:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourSecureSAPassword!
DB_NAME=AssetManagementDB
DB_ENCRYPT=true
DB_TRUST_CERT=true
JWT_SECRET=lli_secure_automation_token_2026
JWT_EXPIRY=7d
```

If your local SQL Server instance does not use a trusted certificate, adjust `DB_ENCRYPT` and `DB_TRUST_CERT` to match your setup.

### 3. Execution Scripts
Open two separate terminal windows in your code editor environment:

Terminal 1 (Backend API Engine):

```powershell
cd backend
npm install
npm run dev
```

Terminal 2 (Frontend Client UI):

```powershell
cd frontend
npm install
npm run dev
```

Open your web browser and navigate to the local client URL:

http://localhost:5173

Default Master Admin Login Credentials:

- Email: admin@lli.com
- Password: AdminPassword123!

---

## 🧠 Technical Challenges Encountered & Resolutions

- SQL Server connection setup: The backend initially failed to connect because the server authentication and network settings had to be aligned with the local MSSQL instance.
- Connection pool initialization: The MSSQL pool needed to load environment variables before the database configuration was created so the runtime connection settings were available immediately.
- Authentication and payload mapping: The asset create flow needed its request payload keys and SQL input mapping aligned with the actual database schema so `assigned_to` and `cost` are saved consistently on insert and update.

---

## Overview

This project is designed as a technical assessment reference for a full-stack asset management workflow. It includes login, protected routes, asset CRUD operations, and summary reporting.