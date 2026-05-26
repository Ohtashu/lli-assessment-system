# Frontend (React + Ant Design)

## Architecture

- `src/main.jsx` — Entry point wrapped with AuthProvider
- `src/services/api.js` — Axios instance with JWT interceptor
- `src/context/AuthContext.jsx` — Auth state management (login/logout/token)
- `src/App.jsx` — Root component

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
