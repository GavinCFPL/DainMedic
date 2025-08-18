#!/bin/bash

# DainMedic Development Startup Script

echo "🧬 Starting DainMedic Drug Design Platform..."

# Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Docker detected. Starting with Docker Compose..."
    docker-compose up --build
else
    echo "⚠️  Docker not found. Please install Docker and Docker Compose for the best experience."
    echo ""
    echo "Alternative: Manual startup (requires Node.js and Python)"
    echo ""
    echo "Backend setup:"
    echo "  cd backend && pip install -r requirements.txt && python main.py"
    echo ""
    echo "Frontend setup (new terminal):"  
    echo "  cd frontend && npm install && npm start"
    echo ""
    echo "Then visit http://localhost:3000"
fi