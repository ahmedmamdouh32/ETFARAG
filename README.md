# ETFARAG

ETFARAG is a movie discovery web application built as a university React team project. Browse movies from TMDB, search and filter by category, view rich movie details, save favorites, and manage your account.

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router
- Tailwind CSS
- Axios
- React Toastify

**Backend**
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core + SQL Server
- ASP.NET Identity + JWT authentication
- Swagger (development)

**External API**
- [The Movie Database (TMDB)](https://www.themoviedb.org/)

## Features

- Browse popular movies with category filter, sorting, and pagination
- Search movies by title
- Movie details: overview, cast, crew, trailer, recommendations, and similar movies
- Recently viewed movies (stored in browser localStorage)
- User registration and login with JWT
- Protected routes for favorites and profile
- Add and remove favorites (redirects guests to login and returns them after auth)
- Profile page: view account info, edit name, change password, logout
- Dark mode support
- Responsive layout

## Project Structure

```
ETFARAG/
├── api/                    # ASP.NET Core backend
│   ├── Controllers/        # Auth & Favorites API
│   ├── Services/           # Business logic
│   ├── DTOs/               # Request/response models
│   ├── Data/               # EF Core DbContext
│   └── Migrations/         # Database migrations
├── src/                    # React frontend
│   ├── api/                # Axios clients (backend + TMDB)
│   ├── components/         # UI and movie components
│   ├── context/            # Auth, Favorites, Theme
│   ├── hooks/              # Data-fetching hooks
│   ├── layouts/            # Main layout
│   ├── lib/                # Utilities (e.g. recently viewed)
│   ├── pages/              # Route pages
│   └── services/           # Auth service
├── index.html
└── package.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [.NET SDK 10](https://dotnet.microsoft.com/download)
- SQL Server (LocalDB or full instance)
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd ETFARAG
```

### 2. Frontend environment

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5127
VITE_API_KEY=your_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

### 3. Backend configuration

Update the connection string in `api/appsettings.json` if needed:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.;Database=ReactProjectDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

### 4. Install dependencies

```bash
npm install
```

### 5. Database migrations

From the `api` folder, apply migrations to create the database:

```bash
cd api
dotnet ef database update
```

## Running the Project

Start the backend and frontend in separate terminals.

**Terminal 1 — API**

```bash
cd api
dotnet run
```

API runs at: **http://localhost:5127**  
Swagger UI: **http://localhost:5127/swagger**

**Terminal 2 — Frontend**

```bash
npm run dev
```

App runs at: **http://localhost:5173**

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run Oxlint |
| `dotnet run` | Start the API (from `api/`) |
| `dotnet build` | Build the API |

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register a new user |
| POST | `/login` | No | Login and receive JWT |
| PUT | `/profile` | Yes | Update full name |
| POST | `/change-password` | Yes | Change password |

### Favorites (`/api/favorites`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | Get user's favorite movie IDs |
| POST | `/` | Yes | Add a movie to favorites |
| DELETE | `/{movieId}` | Yes | Remove a movie from favorites |
| GET | `/check/{movieId}` | Yes | Check if a movie is favorited |

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Home — browse movies |
| `/details/:id` | Public | Movie details |
| `/search` | Public | Search results |
| `/favorites` | Protected | User favorites |
| `/profile` | Protected | Profile & account settings |
| `/login` | Guest | Login |
| `/register` | Guest | Register |

## Team

ITI React team project.
