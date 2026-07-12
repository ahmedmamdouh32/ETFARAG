# ETFARAG

ETFARAG is a movie discovery web application built as an ITI React team project. Browse movies from TMDB, search and filter by category, view rich movie details, save favorites, and manage your account — with multi-language support, lazy-loaded routes, and Google sign-in.

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router
- Tailwind CSS + shadcn/ui-style components
- Axios
- React Toastify
- react-helmet-async (dynamic page titles)
- i18next + react-i18next (English / Arabic)
- @react-oauth/google (Google sign-in)

**Backend**
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core + SQL Server
- ASP.NET Identity + JWT authentication
- Google.Apis.Auth (Google token validation)
- Swagger (development)

**External API**
- [The Movie Database (TMDB)](https://www.themoviedb.org/)

## Features

### Browse & Discovery
- Movie listing from TMDB with pagination, sorting, and genre filtering
- Filter, sort, and page state synced to URL query parameters
- Search page with 500ms debounce (`/search?q=...`)
- Recently viewed movies on Home (localStorage, up to 10 items)

### Movie Details
- Dynamic details page (`/details/:id`)
- Overview, cast, crew, vote stats, and genres
- YouTube trailer embed
- Recommendations and similar movies

### Favorites & Auth
- JWT registration and login (email + password)
- Google OAuth sign-in (optional)
- Protected routes for favorites and profile
- Add/remove favorites with instant UI updates and navbar count
- Guests redirected to login when favoriting; returned to the same page after auth
- Profile: edit name, change password, logout
- Auto-logout on expired or invalid sessions

### UI & UX
- Dark / light mode toggle
- Loading skeletons, empty states, and error states with retry
- Toast notifications for auth and favorite actions
- Scroll-to-top on route change
- Responsive navbar and layout
- Accessibility: aria labels, focus styles, dynamic titles

### Bonus
- **i18n** — English and Arabic with RTL layout support
- **Code splitting** — lazy-loaded pages via `React.lazy` + `Suspense`
- **OAuth** — Google sign-in integrated with the backend JWT flow

## Project Structure

```
ETFARAG/
├── api/                         # ASP.NET Core backend
│   ├── Controllers/             # Auth & Favorites endpoints
│   ├── Services/                # AuthService, FavoriteService
│   ├── DTOs/                    # Request/response models
│   ├── Data/                    # EF Core DbContext
│   └── Migrations/              # Database migrations
├── src/                         # React frontend
│   ├── api/                     # Axios clients (backend + TMDB)
│   ├── components/
│   │   ├── auth/                # GoogleLoginButton
│   │   ├── common/              # ProtectedRoute, PageLoader, ScrollToTop
│   │   ├── layout/              # Navbar, Footer
│   │   ├── movies/              # MovieCard, MovieGrid, Pagination, etc.
│   │   └── ui/                  # Button, Input, Card (shadcn-style)
│   ├── context/                 # Auth, Favorites, Theme
│   ├── hooks/                   # useMovies, useSearch, useMovieDetails, useDebounce
│   ├── i18n/                    # en.json, ar.json, i18n config
│   ├── layouts/                 # MainLayout
│   ├── lib/                     # recentlyViewed, utils
│   ├── pages/                   # Home, Details, Search, Favorites, Profile, Login, Register, NotFound
│   └── services/                # authService
├── index.html
└── package.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [.NET SDK 10](https://dotnet.microsoft.com/download)
- SQL Server (LocalDB or full instance)
- A free [TMDB API key](https://www.themoviedb.org/settings/api)
- A [Google OAuth Client ID](https://console.cloud.google.com/) (optional, for Google sign-in)

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
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 3. Backend configuration

Update `api/appsettings.json` if needed:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=ReactProjectDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "GoogleAuth": {
    "ClientId": "your_google_client_id_here"
  }
}
```

> Use the **same Google Client ID** in both `.env` and `appsettings.json`.

### 4. Google OAuth (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create an OAuth 2.0 Client ID (Web application)
3. Add authorized JavaScript origins:
   - `http://localhost:5173`
   - `https://etfarag-drab.vercel.app`
4. Copy the Client ID into `.env` and `appsettings.json`
5. Restart the API after updating `appsettings.json`

If `VITE_GOOGLE_CLIENT_ID` is not set, the Google button is hidden and email/password auth still works.

### 5. Install dependencies

```bash
npm install
```

### 6. Database migrations

From the `api` folder:

```bash
cd api
dotnet ef database update
```

## Running the Project

Start the backend and frontend in **separate terminals**.

**Terminal 1 — API**

```bash
cd api
dotnet run
```

- API: **http://localhost:5127**
- Swagger: **http://localhost:5127/swagger**

**Terminal 2 — Frontend**

```bash
npm run dev
```

- App: **http://localhost:5173**

## Deployed Frontend + Local Backend (Instructor Review)

The live frontend is deployed on Vercel. Auth, favorites, and profile use the **local API** running on the reviewer's machine.

**Live demo:** https://etfarag-drab.vercel.app/

### For the instructor

1. Clone the repo and open the `api` folder
2. Update `ConnectionStrings` in `api/appsettings.json` if needed
3. Run database migrations:
   ```bash
   cd api
   dotnet ef database update
   ```
4. Start the API:
   ```bash
   dotnet run
   ```
   API must be running at **http://localhost:5127**
5. Open **https://etfarag-drab.vercel.app/** in the browser
6. If Chrome asks for permission to access devices on your local network, click **Allow**

The deployed frontend is configured to call `http://localhost:5127` for auth and favorites. TMDB movie data is fetched directly from the browser.

### Vercel environment variables

Set these in the Vercel project settings, then redeploy:

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `http://localhost:5127` |
| `VITE_TMDB_BASE_URL` | `https://api.themoviedb.org/3` |
| `VITE_TMDB_API_KEY` | your TMDB API key |

### Backend CORS

`api/appsettings.json` includes the Vercel URL in `Cors:AllowedOrigins`:

```json
"Cors": {
  "AllowedOrigins": [
    "http://localhost:5173",
    "https://etfarag-drab.vercel.app"
  ]
}
```

If the Vercel URL changes, update this list and restart the API.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build frontend for production (with code splitting) |
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
| POST | `/google` | No | Google OAuth login and receive JWT |
| PUT | `/profile` | Yes | Update full name |
| POST | `/change-password` | Yes | Change password |

### Favorites (`/api/favorites`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | Get user's favorite movie IDs |
| POST | `/` | Yes | Add a movie to favorites |
| DELETE | `/{movieId}` | Yes | Remove a movie from favorites |
| GET | `/check/{movieId}` | Yes | Check if a movie is favorited |

## Frontend Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Home — browse movies (`?page=`, `sort_by=`, `category=`) |
| `/details/:id` | Public | Movie details |
| `/search` | Public | Search results (`?q=`, `?page=`) |
| `/favorites` | Protected | User favorites |
| `/profile` | Protected | Profile & account settings |
| `/login` | Guest | Login (email or Google) |
| `/register` | Guest | Register (email or Google) |
| `*` | Public | 404 Not Found |

## Internationalization

- Languages: **English (EN)** and **Arabic (AR)**
- Toggle via the language dropdown in the Navbar
- Preference saved in `localStorage`
- Arabic enables RTL layout (`dir="rtl"`)
- Translation files: `src/i18n/en.json`, `src/i18n/ar.json`

## Team

ITI React team project — Menofya | PD&BI46
