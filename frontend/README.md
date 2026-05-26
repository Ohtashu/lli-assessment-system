# Frontend (React + Ant Design)

## Architecture

- `src/main.jsx` — Entry point wrapped with AuthProvider
- `src/services/api.js` — Axios instance with JWT interceptor
- `src/context/AuthContext.jsx` — Auth state management (login/logout/token)
- `src/pages/LoginPage.jsx` — Login form with validation
- `src/pages/DashboardPage.jsx` — Main dashboard with metrics and asset table
- `src/components/ProtectedRoute.jsx` — Route guard for authenticated pages
- `src/App.jsx` — Router and route definitions

## Setup

```bash
cd frontend
npm install
```

## Environment Variables

Create a `.env.local` file (optional):
```
VITE_API_URL=http://localhost:3001/api
```

Default: `http://localhost:3001/api`

## Run

Development mode:
```bash
npm run dev
```

Opens at `http://localhost:5173` by default (Vite).

Production build:
```bash
npm run build
```

## Usage

### Using Auth Context

```jsx
import { useAuth } from './context/AuthContext'

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth()

  return (
    <>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login('email@example.com', 'password')}>
          Login
        </button>
      )}
    </>
  )
}
```

### Using API Service

```jsx
import api from './services/api'

// Automatically includes Authorization header if token exists
const fetchAssets = async () => {
  try {
    const { data } = await api.get('/assets')
    console.log(data)
  } catch (err) {
    console.error(err)
  }
}
```

## Pages

### Login Page (`/login`)
- Email and password form validation
- Error alerts for failed authentication
- Loading spinner during submission
- Auto-redirect to dashboard if already authenticated

### Dashboard Page (`/dashboard`)
- System header with logout button
- **Metrics Cards:** Total Assets, Active, In Repair, Total Investment Cost
- **Asset Inventory Table:** CRUD ready with:
  - Asset Tag, Name, Category, Status, Location, Value columns
  - Edit and Delete action buttons
  - Responsive table design
- Auto-fetches data on page load from API
- Handles loading and error states
