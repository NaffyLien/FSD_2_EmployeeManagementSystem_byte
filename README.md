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
```

### Authentication

`POST /api/auth/login` is public. Example payload:

```json
{
	"email": "admin@example.com",
	"password": "change-me-now"
}
```

The response contains a JWT token. Send it for protected operations:

```http
Authorization: Bearer <token>
```

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
