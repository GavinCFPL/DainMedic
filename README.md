# DainMedic

DainMedic is a comprehensive drug design and discovery platform combining FastAPI backend with RDKit integration and a modern React frontend.

## Codespaces One-Click with Docker

This repository is configured for instant development with GitHub Codespaces using Docker Compose.

### Quick Start

1. **Open in Codespaces**: Click the green "Code" button → "Codespaces" → "Create codespace on main"
2. **Automatic Setup**: The dev container will automatically run `docker compose up -d --build`
3. **Access Applications**: 
   - **Frontend**: `http://localhost:4173` (Vite React app)
   - **Backend API**: `http://localhost:8000` (FastAPI with RDKit)

### Manual Setup

If you need to manually start the services:

```bash
# Build and start all services
docker compose up -d --build

# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f backend
docker compose logs -f frontend

# Stop services
docker compose down

# Rebuild specific service
docker compose build backend
docker compose build frontend
```

### Environment Configuration

1. Copy the example environment file:
   ```bash
   cp backend/.env.example .env
   ```

2. Configure optional API keys for external services (TTD, BioNeMo, AlphaFold) in `.env`

### Architecture

- **Backend**: FastAPI application with RDKit for molecular operations (Port 8000)
- **Frontend**: Vite React application (Port 4173) 
- **Data Persistence**: Molecular artifacts stored in `backend/app/data/artifacts/`
- **Network**: Services communicate via Docker internal network

### Port Forwarding

The dev container automatically forwards:
- `8000`: Backend API server
- `4173`: Frontend development server

### Development Workflow

1. **Backend Development**: 
   - Edit files in `backend/`
   - The backend will restart automatically with uvicorn
   - API documentation available at `http://localhost:8000/docs`

2. **Frontend Development**:
   - Edit files in `frontend/src/`
   - Vite hot reload will update the UI automatically
   - Frontend communicates with backend via `VITE_API_BASE_URL`

### Troubleshooting

**If containers fail to start:**
```bash
# Check container status
docker compose ps

# View detailed logs
docker compose logs

# Restart specific service
docker compose restart backend

# Rebuild and restart
docker compose down
docker compose up -d --build
```

**Port conflicts:**
- If ports 8000 or 4173 are in use, modify the port mappings in `docker-compose.yml`
- Update the `forwardPorts` in `.devcontainer/devcontainer.json` accordingly

**Memory issues:**
- If builds fail due to memory constraints, try building services individually:
  ```bash
  docker compose build backend
  docker compose build frontend
  ```

### Notes

- The frontend uses `VITE_API_BASE_URL=http://backend:8000` for API communication within Docker
- All molecular data and generated artifacts persist in the `backend/app/data/` volume
- Services start automatically when opening the Codespace
- The setup includes minimal placeholder apps that will be replaced with full implementations