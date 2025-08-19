# DainMedic Devcontainer Guide

This repository is configured for instant development with GitHub Codespaces using a micromamba-based devcontainer that provides all necessary dependencies for the DainMedic backend.

## 🚀 Quick Start

1. **Open in Codespaces**: 
   - Click the green "Code" button → "Codespaces" → "Create codespace on main"
   - Wait for the automatic setup to complete (2-3 minutes)

2. **Start the API**:
   - **Option A (Recommended)**: Use VS Code Command Palette (`Ctrl+Shift+P`) → "Tasks: Run Task" → "Start API (micromamba)"
   - **Option B**: Use VS Code Run/Debug → "Launch API with Uvicorn (Codespaces)"
   - **Option C**: Manual terminal command: `micromamba run -n dainmedic python -m uvicorn main:app --host 0.0.0.0 --port 8000`

3. **Access the API**: Port 8000 will automatically forward and open in your browser

## 🏗️ What Gets Set Up Automatically

The devcontainer automatically:

### Environment Setup
- Installs **micromamba** (fast conda alternative)
- Creates a **`dainmedic` conda environment** from `backend/environment.yml`
- Installs all dependencies: RDKit, FastAPI, uvicorn, numpy, pandas, etc.

### Development Configuration  
- Configures VS Code with Python support and extensions
- Sets up proper Python interpreter path
- Creates a local `.data` directory for database storage
- Configures environment variables to avoid permission issues

### Port Forwarding
- **Port 8000**: Backend API server (auto-opens browser)
- API available at: `https://<codespace-name>-8000.app.github.dev`

## 🛠️ Available VS Code Tasks

Access via Command Palette (`Ctrl+Shift+P`) → "Tasks: Run Task":

| Task | Description |
|------|-------------|
| **Start API (micromamba)** | Start the FastAPI server with hot reload |
| **Test Backend Dependencies** | Verify all Python packages are installed |
| **Check Micromamba Environment** | List available conda environments |

## 🐛 Debug Configuration

Two debug configurations are available via VS Code Run/Debug panel:

1. **Launch API (Codespaces)**: Debug the FastAPI app directly
2. **Launch API with Uvicorn (Codespaces)**: Debug using uvicorn with reload

Both configurations:
- Use the correct Python interpreter from the conda environment
- Set proper environment variables (DATABASE_URL, SECRET_KEY)
- Run dependency tests before launching

## 📁 Directory Structure

```
DainMedic/
├── .devcontainer/
│   ├── devcontainer.json          # Container configuration
│   └── scripts/
│       └── devcontainer-setup.sh  # Setup script
├── .vscode/
│   ├── tasks.json                 # VS Code tasks
│   └── launch.json               # Debug configurations
├── .data/                        # Local database storage (auto-created)
├── backend/
│   ├── environment.yml           # Conda environment definition
│   └── app/
│       └── main.py              # FastAPI application
└── README_DEVCONTAINER.md       # This file
```

## 🔧 Environment Variables

The devcontainer sets these automatically:

| Variable | Value | Purpose |
|----------|--------|---------|
| `DATABASE_URL` | `sqlite:////workspaces/DainMedic/.data/dainmedic.sqlite` | Local database to avoid `/data` permission issues |
| `SECRET_KEY` | `dev-secret-key-change-in-production` | Default secret for development |
| `PATH` | Includes `/opt/micromamba/bin` | Access to micromamba commands |

## 🧪 Testing Your Setup

Run these commands in the terminal to verify everything works:

```bash
# Check micromamba installation
micromamba --version

# List environments  
micromamba info -e

# Test Python dependencies
micromamba run -n dainmedic python -c "import fastapi, uvicorn, rdkit; print('✓ Success!')"

# Start the API manually
cd backend/app
micromamba run -n dainmedic python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🔍 API Endpoints

Once running, these endpoints are available:

- **Root**: `GET /` - Basic API info
- **Health Check**: `GET /health` - Service status
- **OpenAPI Docs**: `/docs` - Interactive API documentation  
- **ReDoc**: `/redoc` - Alternative API documentation

## 🆘 Troubleshooting

### "No module named uvicorn" Error
This error occurs when the conda environment isn't activated. Solutions:
1. Use the VS Code tasks (recommended)
2. Always prefix commands with `micromamba run -n dainmedic`
3. Activate the environment: `micromamba activate dainmedic`

### Permission Denied for /data
The devcontainer uses `.data/` in the workspace to avoid this issue. If you see this error:
1. Check `DATABASE_URL` environment variable is set correctly
2. Verify `.data` directory exists and is writable

### Port Not Forwarding
1. Check the VS Code "PORTS" tab
2. Ensure you're using `--host 0.0.0.0` when starting the server
3. Try manually forwarding port 8000 in VS Code

### Setup Script Failed
1. Check the terminal output during container creation
2. Try running `.devcontainer/scripts/devcontainer-setup.sh` manually
3. Ensure you have a stable internet connection for package downloads

## 🔄 Manual Setup (if needed)

If automatic setup fails, run these commands:

```bash
# Install micromamba
curl -Ls https://micro.mamba.pm/api/micromamba/linux-64/latest | tar -xvj bin/micromamba
sudo mkdir -p /opt/micromamba/bin
sudo mv bin/micromamba /opt/micromamba/bin/
sudo ln -s /opt/micromamba/bin/micromamba /usr/local/bin/micromamba

# Create environment
micromamba create -n dainmedic -f backend/environment.yml -y

# Create data directory
mkdir -p .data
```

## 📚 Next Steps

With your environment ready:

1. **Explore the API**: Visit `/docs` endpoint for interactive documentation
2. **Add Features**: Modify `backend/app/main.py` to add new endpoints
3. **Install Additional Packages**: Add to `backend/environment.yml` and rebuild environment
4. **Database Setup**: The SQLite database will be created automatically in `.data/`

## 🤝 Contributing

When contributing:
- Test your changes with the provided VS Code tasks
- Ensure the API starts successfully with `micromamba run -n dainmedic`
- All molecular processing features require RDKit (included in environment)
- Use the debug configurations for step-through debugging

---

**Ready to build the future of drug discovery! 💊🔬**