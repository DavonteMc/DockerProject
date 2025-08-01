# DockerProject

This project implements a RESTful API for managing user records, built with Node.js, Express, and Prisma ORM. The API is connected to a PostgreSQL database and containerized using Docker and Docker Compose. It supports full CRUD operations and has been tested across Windows, macOS, and Ubuntu.

## Features

- Full CRUD support (`POST`, `GET`, `PUT`, `DELETE`) for user data
- PostgreSQL integration via Prisma ORM
- Multi-container Docker setup with Compose

## Project Structure

```plaintext
DockerProject/
├── backend/
│   ├── index.js
│   ├── prisma/
│   ├── package.json
│   └── backend.Dockerfile
├── frontend/
│   └── ... (Next.js)
├── compose.yaml
└── README.md
```

## Running the Project Locally

### Requirements

- Docker & Docker Compose
- Node.js v18+ (if running backend manually)
- Git (for cloning)

### Setup Steps

```bash
git clone https://github.com/DavonteMc/DockerProject.git
cd DockerProject
docker-compose up --build -d
```

Test the API:

```bash
curl http://localhost:4000/users
```

### Prisma (Optional: if modifying schema)

```bash
docker exec -it backend sh
npx prisma db push
```

## API Endpoints

| Method | Route              | Description               |
|--------|--------------------|---------------------------|
| POST   | `/users`           | Add a new user            |
| GET    | `/users`           | Retrieve all user         |
| GET    | `/users/:id`       | Retrieve user by ID       |
| PUT    | `/users/:id`       | Update user by ID         |
| DELETE | `/users/:id`       | Delete user by ID         |

Example `POST` body:

```json
{
  "name": "Davonte McLean",
  "email": "DavonteMclean@gmail.ca",
}
```

## Docker Commands

```bash
# Start containers
docker-compose up -d

# View running containers
docker ps

# View live resource stats
docker stats

# Enter DB CLI
docker exec -it db psql -U postgres

# Rebuild if code changes
docker-compose build backend
```

## 📄 License

MIT

## 🙏 Credits

- SAIT CPSY-300 Docker Project (Parts 1–4)
- Docker & Prisma Docs
- PostgreSQL Official Docker Image
