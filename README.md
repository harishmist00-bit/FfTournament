# FF Battle Arena (frontend)

Free Fire tournament platform. React + TypeScript + Vite + Tailwind CSS + React Router + Axios + GSAP + Lucide.
This phase is the complete frontend running on mock services. It is structured to plug into Django REST Framework + MySQL next.

## Requirements
- Node.js 18 or newer, npm 9 or newer

## Install and run
```bash
npm install
cp .env.example .env      # optional
npm run dev               # http://localhost:5173
npm run build             # type-checks (tsc) and builds to dist/
npm run preview           # serve the production build
```

Demo logins (any password with 6+ characters): `admin@ffbattlearena.gg` (admin area at `/admin`) and `player@ffbattlearena.gg`.

## Environment variables
| Name | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000/api` | Base URL of the Django API |

## Architecture
```
src/
  animations/   GSAP: hero intro, scroll reveals, counters, page + menu transitions (respects prefers-reduced-motion)
  components/   Reusable UI (Navbar, Footer, cards, tables) and components/ui (Button, Panel, Modal, states, controls)
  context/      AuthContext (JWT session state)
  data/db.ts    In-memory mock database (20 teams, 100 players, 10 tournaments, 24 matches, 10 news)
  hooks/        useAsync (loading/error/data), useDocumentTitle, useReveal, useLookups
  layouts/      MainLayout (public) and AdminLayout
  pages/        Public + user dashboard routes
  admin/        Admin routes
  services/     api.ts (central Axios instance) + one service per resource
  types/        TypeScript interfaces (Tournament, Team, Player, Match, MatchResult, Standing, NewsItem, User, Registration)
  utils/        formatting, scoring rules, error mapping
```
Components never call Axios. They call service functions (`getTournaments()`, `getTournament(slug)`, `getTeams()`, `getTeam(id)`, `getMatches()`, `getStandings()`, `getNews()`, ...) and render loading, error, empty and success states through `useAsync` + `AsyncView`.

## Django REST integration
Expected endpoints (trailing slashes, DRF default):

| Frontend function | Request |
|---|---|
| `getTournaments / getTournament(slug)` | `GET /api/tournaments/`, `GET /api/tournaments/:slug/` |
| `createTournament / updateTournament / deleteTournament` | `POST /api/tournaments/`, `PUT|DELETE /api/tournaments/:id/` |
| `getTeams / getTeam(id)` | `GET /api/teams/`, `GET /api/teams/:id/` |
| `getPlayers / getPlayer(id)` | `GET /api/players/`, `GET /api/players/:id/` |
| `getMatches / getMatch / createMatch / updateMatch` | `GET /api/matches/`, `POST /api/matches/`, `PUT /api/matches/:id/` |
| `submitResults` | `POST /api/results/` |
| `getStandings(tournamentId, group)` | `GET /api/standings/?tournament=&group=` |
| `getNews / getNewsItem(slug)` | `GET /api/news/`, `GET /api/news/:slug/` |
| `register / login / refresh / getMe` | `POST /api/auth/register/`, `POST /api/auth/login/`, `POST /api/auth/refresh/`, `GET /api/auth/me/` |
| `getRegistrations / updateRegistrationStatus / registerTeam` | `GET|POST /api/registrations/`, `PATCH /api/registrations/:id/` |

Auth uses JWT (e.g. `djangorestframework-simplejwt`): `login` returns `{ access, refresh }`. The Axios interceptor in `services/api.ts` attaches `Authorization: Bearer <access>` and refreshes once on a 401.

## MySQL / Django expectations
Models mirror `src/types/index.ts`: Tournament, Team, Player, Match, MatchResult, Standing, NewsItem, User (with `role`), Registration. Use `snake_case` in Django and map to the camelCase types inside each service (so components never depend on the API shape). Standings must be updated server-side inside one transaction when `POST /api/results/` is saved. Scoring is in `src/utils/scoring.ts` (placement table 12/9/8/7/6/5/4/3/2/1, 1 point per kill); mirror it in Django.

## Replacing the mock services
Each function in `src/services/*.ts` has a comment with the Django call. Swap the body, for example:
```ts
// before
export const getTournaments = (): Promise<Tournament[]> => mock(() => tournaments);
// after
export const getTournaments = async (): Promise<Tournament[]> => {
  const { data } = await api.get('/tournaments/');
  return data.results.map(toTournament); // map snake_case -> Tournament
};
```
Then delete `src/data/db.ts` and the `mock()` helper. Tokens are stored via `TOKEN_KEYS` in `api.ts`; consider httpOnly cookies for production.
