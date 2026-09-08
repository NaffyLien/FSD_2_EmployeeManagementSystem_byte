# Employee Management System

- CRUD endpoints for employee records (Create, Read, Update, Delete).
- Server-side validation for mandatory employee fields.
- Authentication required for admin-level operations (create/update/delete).
- Persisted data in PostgreSQL through Prisma, with sample seed data.
- Frontend interface to list, create, edit and delete employees (responsive).

## Backend API

Run the backend from `ems_backend`:

```bash
yarn install
yarn dev
```

Required environment variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/employee_db"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_REFRESH_SECRET="replace-with-a-different-long-random-secret"
```

### Authentication

`POST /api/auth/login` is public. Example payload:

```json
{
	"email": "admin@example.com",
	"password": "change-me-now"
}
```

The response contains a short-lived access token and a refresh token. Send the access token for protected operations:

```http
Authorization: Bearer <token>
```

When the access token expires, send the refresh token to `POST /api/auth/refresh`:

```json
{ "refreshToken": "<refresh-token>" }
```

The response contains a new access token. Refresh tokens expire after seven days.

### Employee routes

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/employees` | No | List employees |
| `GET` | `/api/employees/:id` | No | Get one employee |
| `POST` | `/api/employees` | Admin | Create an employee |
| `PATCH` | `/api/employees/:id` | Admin | Update an employee |
| `DELETE` | `/api/employees/:id` | Admin | Delete an employee |

Create payload:

```json
{
	"name": "Grace Hopper",
	"email": "grace.hopper@example.com",
	"post": "Software Engineer",
	"department": "Engineering",
	"salary": 95000
}
```

The update payload accepts any non-empty subset of those fields. `email` must be valid and `salary` must be a non-negative integer.

### Database and seed

Apply migrations and insert the sample admin and employees with:

```bash
yarn prisma migrate dev
yarn seed
```

The seed uses `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` when provided. Otherwise it creates `admin@example.com` with the password `change-me-now`; replace this password before using the API outside local development.

## Frontend

Run the frontend from `ems_frontend`:

```bash
npm install
npm run dev
```

Required environment variable (in `ems_frontend/.env`):

```env
VITE_API_URL=http://localhost:3000/api
```

Open `http://localhost:5173` in your browser. Log in with the seeded admin credentials, then use the dashboard to manage employees.

---

## Frontend Architecture and Workflow

The frontend follows the **Feature-Sliced Design (FSD)** methodology, a layered architecture that keeps codebase boundaries clear and ownership unambiguous. Every layer depends only on layers beneath it. The overall data flow is: **User Action → Hook → Store/Service → HTTP → Backend → Response → State Update → Re-render**.

### Directory layout

```
src/
  assets/           # Static assets (images, fonts)
  components/       # Atomic, reusable UI primitives
    Button/         # <Button /> — variant, size, loading states
    Input/          # <Input /> — label, error message, controlled
    Modal/          # <Modal /> — overlay, animated open/close, sizes
  features/         # Self-contained feature modules (the "I" in ACID)
    auth/           # Authentication: login, session, guards
      components/   # LoginForm — email/password form
      hooks/        # useLogin — form state + submit orchestration
      services/     # authApi — login() HTTP call
      index.ts      # Strict public API boundary (what other features may import)
    dashboard/      # Employee management UI
      components/   # EmployeeList, EmployeeForm, DeleteModal
      hooks/        # useEmployees (CRUD + list state), useFilteredEmployees
      services/     # employeeApi — fetch/create/update/delete HTTP calls
      index.ts
  hooks/            # Global cross-cutting hooks (ProtectedRoute, useAuth)
  layouts/          # Page-level wrappers (shell + nav)
    AuthLayout/     # Centered card, routes: /login
    AdminLayout/    # Sidebar + main area, routes: /, /employees
  store/            # Zustand state (the "C" & "D" in ACID — consistency + durability)
    authStore.ts    # Persists auth token and user object to localStorage
  utils/            # Pure, deterministic helpers (the "A" in ACID — atomicity)
    api.ts          # Axios instance, request/response interceptors
    types.ts        # Shared TypeScript interfaces
  styles/           # Root-level global CSS (reset, base tokens)
  App.tsx           # Route tree (routing layer)
  main.tsx          # React entry point
```

### Data flow per feature

#### Authentication (`features/auth`)

```
LoginForm
  └─ useLogin hook (local form state + validation)
       └─ authApi.login() → POST /api/auth/login
            └─ Response: { token, user }
                 └─ useAuthStore.login() → persist token + user to localStorage
                      └─ navigate → / (ProtectedRoute now passes)
```

The `ProtectedRoute` component wraps every admin route. Before rendering its child, it reads `isAuthenticated` from the `useAuthStore`. If the user is not logged in, a `<Navigate to="/login" />` redirect replaces the route. When the API interceptor receives a `401 Unauthorized` (e.g. token expired), it clears localStorage and forces a redirect to `/login`.

#### Dashboard / Employee Management (`features/dashboard`)

```
EmployeeList (UI shell)
  └─ useEmployees hook
       ├─ On mount: employeeApi.fetchEmployees() → GET /api/employees
       │    └─ setEmployees(data), setLoading(false)
       ├─ Search + Department filters (useMemo — derived, no extra network)
       ├─ "Add Employee" → open Modal → EmployeeForm
       │    └─ EmployeeForm (controlled inputs + validation)
       │         └─ employeeApi.createEmployee(payload) → POST /api/employees
       │              └─ onSaved(newEmp) → useEmployees.addEmployee(newEmp)
       ├─ "Edit" on row → open Modal → EmployeeForm (pre-filled)
       │    └─ employeeApi.updateEmployee(id, payload) → PATCH /api/employees/:id
       │         └─ onSaved(updated) → useEmployees.updateEmployee(updated)
       └─ "Delete" → open DeleteModal
            └─ onConfirm → useEmployees.removeEmployee(id)
                 └─ employeeApi.deleteEmployee(id) → DELETE /api/employees/:id
```

### FSD layer rules (who can import whom)

```
pages / layouts → features → components + store + utils
components      → utils only
store            → utils only
utils            → (no deps)
```

Each feature's `index.ts` is its **strict public API boundary**. Other features must import only from that file, never reach into `components/` or `services/` directly. This guarantees that refactoring internals of one feature never breaks another.

### State management (the "C" & "D" in ACID)

- **Consistency**: All mutations go through typed service functions (`employeeApi.*`, `authApi.*`) that throw on non-2xx responses. The Zustand store (`authStore`) is the single source of truth for auth state and is persisted to `localStorage` via the `persist` middleware.
- **Durability**: Auth data survives page refreshes because it lives in `localStorage`. CRUD mutations are immediately reflected in local state (optimistic update), so the UI updates without waiting for another fetch. On 401 the interceptor wipes the store and redirects, preventing stale state from persisting.

### HTTP layer (the "A" in ACID — atomicity)

The `api.ts` singleton uses Axios with a single base URL. Every request automatically attaches the `Authorization: Bearer <token>` header via a request interceptor (reads from `localStorage` on each call so a freshly set token is picked up immediately). The response interceptor catches all `401` responses globally, clears auth state, and redirects to the login page — this is a cross-cutting concern handled once, not repeated in every service.

### Responsive behavior

- **Login page**: Card is centered, max-width 420px. On screens below 480px padding is reduced.
- **Admin layout sidebar**: Full width (260px) on desktop; collapses to a 70px icon-only rail on tablets (≤ 768px).
- **Employee table**: Scrolls horizontally on mobile (≤ 768px) with a 700px min-width so columns never collapse.
- **Modals**: Full-screen bottom-sheet on mobile (≤ 640px) instead of centered dialog.

### Running the full stack

1. Start the backend: `cd ems_backend && yarn install && yarn dev`
2. Seed the database: `cd ems_backend && yarn prisma migrate dev && yarn seed`
3. Start the frontend: `cd ems_frontend && npm install && npm run dev`
4. Open `http://localhost:5173`, log in with `admin@example.com` / `change-me-now`
