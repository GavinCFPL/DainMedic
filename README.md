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

# Stop services
docker compose down
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

### Notes

- The frontend uses `VITE_API_BASE_URL=http://backend:8000` for API communication within Docker
- All molecular data and generated artifacts persist in the `backend/app/data/` volume
- Services start automatically when opening the Codespace