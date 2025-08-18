from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Import routers
from app.api import generate, download

# Create the FastAPI app
app = FastAPI(
    title="DainMedic Drug Design API",
    description="AI-driven drug design pipelines with TTD optimization and structure-based generation",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create data directories if they don't exist
os.makedirs("app/data/artifacts", exist_ok=True)

# Mount static files for artifacts
app.mount("/static", StaticFiles(directory="app/data/artifacts"), name="static")

# Include routers
app.include_router(generate.router, prefix="/api/generate", tags=["generation"])
app.include_router(download.router, prefix="/api/download", tags=["download"])

@app.get("/")
async def root():
    return {"message": "DainMedic Drug Design API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)