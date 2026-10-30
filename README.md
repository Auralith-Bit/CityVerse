# CityVerse — React + Express

CityVerse is a tourism web app for discovering **Butwal** and **Bhairahawa** in Rupandehi, Nepal.
It uses a React (Vite) frontend, a Node.js + Express REST API, and MySQL (managed with MySQL Workbench) via Prisma.

> This project replaces the older static site. The site is content-driven: browsing attractions is public, while all content management happens in a protected admin panel.

---

## Stack

| Layer | Technology |
| :-- | :-- |
| Frontend | React 18 + Vite + React Router |
| Backend | Node.js + Express |
| ORM | Prisma |
| Database | MySQL 8 (MySQL Workbench) |
| Auth | JWT (admin only) |
| Uploads | Multer (local `server/uploads`) |

---

## Features

- Public attraction browsing with filters (city, category, search)
- Rich attraction pages: photo gallery with lightbox, highlights, best time to visit, getting there, travel tips, related places
- Home page with city spotlight, featured attractions, transport info and testimonials
- About, Contact and Nightlife pages
- Dark mode (persisted)
- Admin panel:
  - Dashboard with content stats
  - Create / edit / delete places
  - Cover and multi-image gallery uploads
  - Highlights, best time, directions and travel tips editing
  - Create / edit / delete categories
  - Protected routes with JWT + role check
- Seeded with 12 destinations across Butwal and Bhairahawa, each with multiple photos

---

## Project Structure

```
CityVerse/
├── client/                      # React + Vite frontend
│   ├── public/images/          # Static images
│   └── src/
│       ├── api/                # fetch wrapper + image resolver
│       ├── components/         # Navbar, Footer, Layout, PlaceCard
│       │   └── admin/          # AdminLayout, ProtectedRoute
│       ├── context/            # AuthContext, ThemeContext
│       ├── hooks/              # useScrollReveal
│       ├── pages/              # Home, Places, PlaceDetail, About, Contact, Nightlife
│       │   └── admin/          # AdminLogin, Dashboard, ManagePlaces, PlaceForm, ManageCategories
│       ├── styles/             # Design system + page/admin styles
│       ├── utils/              # toasts
│       ├── App.jsx
│       └── main.jsx
└── server/                      # Express API
    ├── prisma/
    │   ├── schema.prisma       # MySQL models
    │   └── seed.js             # Admin user, categories, places
    ├── src/
    │   ├── config/             # Prisma client
    │   ├── controllers/        # auth, places, categories
    │   ├── middlewares/        # auth, upload, error handling
    │   ├── routes/             # auth, places, categories, admin
    │   ├── utils/              # slugify, HttpError
    │   └── index.js            # Express app
    └── uploads/                # Uploaded images
```

---

## Prerequisites

- Node.js 18+ (tested on v20)
- MySQL 8 running locally (or any reachable MySQL server)
- MySQL Workbench (optional, for browsing tables)

---

## 1. Database Setup

1. Open MySQL Workbench and create a database:

```sql
CREATE DATABASE cityverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Create a user or use an existing one (e.g. `root`).

---

## 2. Backend Setup

```bash
cd server
npm install
copy .env.example .env      # Windows
# cp .env.example .env      # macOS / Linux
```

Edit `server/.env` and set your MySQL credentials:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@127.0.0.1:3306/cityverse"
JWT_SECRET="a-long-random-secret"
CLIENT_ORIGIN="http://localhost:5173"
```

Then generate the Prisma client and create the tables:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init   # creates tables + migration
# or, for a quick sync without migrations:
# npm run prisma:push
```

Seed an admin user, categories and sample attractions:

```bash
npm run seed
```

Start the API:

```bash
npm run dev
```

The API runs on **http://localhost:5000** (health check: `/api/health`).

Default seeded admin (change in `.env` before seeding):

```
Email:    admin@cityverse.com
Password: admin123
```

---

## 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app runs on **http://localhost:5173**. Vite proxies `/api` and `/uploads` to `http://localhost:5000`, so no extra CORS setup is needed in development.

When the frontend and API are deployed on the same origin, leave `VITE_API_URL` empty. To use a separately hosted API, set its origin in `client/.env`:

```env
VITE_API_URL="https://your-api-domain.com"
```

### Deploy to Vercel

The root `vercel.json` configures the Vite frontend and Express API as services in one Vercel project:

1. Import the repository root as the Vercel project root so Vercel can read the root `vercel.json`.
2. The `client` service builds the Vite app; the `server` service runs Express. The rewrites expose `/api/*` and `/uploads/*` through the server and send all other paths to the frontend.
3. Configure the Vercel project's environment variables for the API, including `DATABASE_URL`, `JWT_SECRET`, and `CLIENT_ORIGIN` set to the deployment's exact public origin (for example, `https://your-project.vercel.app`). Add comma-separated origins if the API must accept requests from multiple origins.
4. Leave `VITE_API_URL` empty for same-origin routing. If you set it to a separate API origin, configure that API's CORS allowlist accordingly.

The MySQL database must be hosted separately and reachable from Vercel. Admin uploads are not deployment-ready yet: the current implementation writes to the server's local filesystem, which is not durable on Vercel, and Vercel's Express runtime does not serve files with `express.static()`. Move uploads to an external object-storage service before relying on admin-uploaded images in production.

---

## Scripts

### Server

| Script | Description |
| :-- | :-- |
| `npm run dev` | Start API with nodemon |
| `npm start` | Start API |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run Prisma migrations |
| `npm run prisma:push` | Push schema to DB without migrations |
| `npm run seed` | Seed admin, categories and places |

### Client

| Script | Description |
| :-- | :-- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to `client/dist` |
| `npm run preview` | Preview the production build |

---

## API Reference

Base URL: `http://localhost:5000`

### Auth

| Method | Endpoint | Access | Description |
| :-- | :-- | :-- | :-- |
| POST | `/api/auth/login` | Public | `{ email, password }` → `{ user, token }` |
| GET | `/api/auth/me` | Admin | Current user profile |

### Public

| Method | Endpoint | Description |
| :-- | :-- | :-- |
| GET | `/api/places` | List published places. Query: `city`, `category`, `search`, `featured` |
| GET | `/api/places/:slug` | Single published place |
| GET | `/api/categories` | List categories with place counts |

### Admin (`Authorization: Bearer <token>`)

| Method | Endpoint | Description |
| :-- | :-- | :-- |
| GET | `/api/admin/stats` | Dashboard counts |
| GET | `/api/admin/places` | List all places (incl. drafts) |
| GET | `/api/admin/places/:id` | Get one place |
| POST | `/api/admin/places` | Create place |
| PUT | `/api/admin/places/:id` | Update place |
| DELETE | `/api/admin/places/:id` | Delete place |
| POST | `/api/admin/upload` | Upload image (`multipart/form-data`, field `image`) |
| POST | `/api/admin/categories` | Create category |
| PUT | `/api/admin/categories/:id` | Update category |
| DELETE | `/api/admin/categories/:id` | Delete category (blocked if it has places) |

---

## Database Models

- **users** — id, name, email (unique), password (bcrypt), role (`ADMIN` | `EDITOR`)
- **categories** — id, name, slug (unique), description
- **places** — id, title, slug, description, highlights (JSON), bestTime, gettingThere, travelTips, city (`BUTWAL` | `BHAIRAHWA`), address, distanceKm, rating, reviewCount, coverImage, isFeatured, isPublished, categoryId
- **place_images** — id, url, alt, placeId

All tables are visible and editable in MySQL Workbench.

---

## Notes

- Only admins can access `/admin`. Public users cannot create accounts.
- Images may be either static paths (`/images/...`) or uploaded files (`/uploads/...`).
- Seeded place photos live in `client/public/images/places/`; attribution and licenses are listed in `client/public/images/places/CREDITS.md`.
- `README2.md` is kept out of version control via `.gitignore`.
