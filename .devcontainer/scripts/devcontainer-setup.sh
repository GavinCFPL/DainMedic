#!/bin/bash

# DainMedic Devcontainer Setup Script
# This script installs micromamba and sets up the conda environment for DainMedic

set -e

echo "🚀 Setting up DainMedic development environment..."

# Install micromamba
echo "📦 Installing micromamba..."
cd /tmp
curl -Ls https://micro.mamba.pm/api/micromamba/linux-64/latest | tar -xvj bin/micromamba
sudo mkdir -p /opt/micromamba/bin
sudo mv bin/micromamba /opt/micromamba/bin/
sudo ln -s /opt/micromamba/bin/micromamba /usr/local/bin/micromamba

# Initialize micromamba for all users
echo "🔧 Initializing micromamba..."
micromamba shell init -s bash -p /opt/micromamba
echo 'export PATH="/opt/micromamba/bin:$PATH"' >> /home/codespace/.bashrc

# Create the conda environment from environment.yml
echo "🐍 Creating dainmedic conda environment..."
cd /workspaces/DainMedic
micromamba create -n dainmedic -f backend/environment.yml -y

# Create local data directory
echo "📁 Creating local data directory..."
mkdir -p /workspaces/DainMedic/.data
chmod 755 /workspaces/DainMedic/.data

# Activate environment and test installation
echo "✅ Testing installation..."
micromamba run -n dainmedic python -c "import fastapi, uvicorn, rdkit; print('✓ All key dependencies installed successfully')"

echo "🎉 Setup complete! You can now start the backend with:"
echo "   micromamba run -n dainmedic python -m uvicorn main:app --host 0.0.0.0 --port 8000"
echo ""
echo "Or use the VS Code 'Start API (micromamba)' task."