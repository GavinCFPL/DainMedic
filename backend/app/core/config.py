from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """Application configuration settings"""
    
    # API Configuration
    app_name: str = "DainMedic Drug Design API"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # External Services (optional)
    ttd_base_url: Optional[str] = None
    ttd_api_key: Optional[str] = None
    bionemo_endpoint: Optional[str] = None
    bionemo_api_key: Optional[str] = None
    alphafold_base_url: str = "https://alphafold.ebi.ac.uk/api/"
    
    # File Storage
    artifacts_dir: str = "app/data/artifacts"
    max_file_size: int = 100 * 1024 * 1024  # 100MB
    
    # Generation Limits
    max_molecules_per_run: int = 20
    max_concurrent_runs: int = 10
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Create global settings instance
settings = Settings()