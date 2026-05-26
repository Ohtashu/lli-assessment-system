# IT Asset & Hardware Inventory Management System

A full-stack enterprise asset tracking portal built from the ground up for the LLI Technical Assessment. This system enables the internal MIS team to manage, verify, audit, and track corporate hardware distributed across departments while generating live aggregate reporting insights.

---

## 🛠️ Technology Stack Matrix

- **Frontend Interface:** ReactJS (Vite Build Framework) & Ant Design UI Component Suite
- **API Services:** Node.js & ExpressJS (Modular, Decoupled Clean Architecture layers)
- **Database Architecture:** Microsoft SQL Server (MSSQL 2025)
- **Security & State:** JSON Web Tokens (JWT) & State Persistence Management

---

## 📁 Repository Structure

```text
lli-assessment-system/
├── backend/             # ExpressJS API Service Source Layer
│   ├── src/
│   │   ├── config/      # MSSQL Connection Pools
│   │   ├── controllers/ # HTTP Request/Response Controllers
│   │   ├── middleware/  # JWT Guard Authorization Handlers
│   │   ├── routes/      # REST API Route Declarations
│   │   └── services/    # Parameterized SQL Data Processing Business Logic
│   └── .env.example
├── frontend/            # React Client Application Source Layer
│   ├── src/
│   │   ├── components/  # Reusable Route Guards & Wrappers
│   │   ├── context/     # Global Active Auth Context Hooks
│   │   └── pages/       # Dashboard Tables & Login Screens
│   └── .env.example
└── database/
    └── schema.sql       # Relational MSSQL Tables, Constraints, & Seed Records