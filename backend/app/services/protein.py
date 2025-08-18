"""
Protein structure service for fetching and processing PDB/AlphaFold structures
"""
import httpx
import tempfile
from typing import Optional, Tuple
from pathlib import Path

from app.core.config import settings

class ProteinService:
    """Service for protein structure handling"""
    
    def __init__(self):
        self.alphafold_base_url = settings.alphafold_base_url
    
    async def fetch_alphafold_structure(self, uniprot_id: str) -> Optional[str]:
        """Fetch AlphaFold structure by UniProt ID"""
        try:
            async with httpx.AsyncClient() as client:
                # Fetch AlphaFold structure
                url = f"{self.alphafold_base_url}prediction/{uniprot_id}"
                response = await client.get(url, timeout=30.0)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Get the PDB file URL
                    if data and len(data) > 0:
                        pdb_url = data[0].get("pdbUrl")
                        if pdb_url:
                            # Download the PDB file
                            pdb_response = await client.get(pdb_url, timeout=60.0)
                            if pdb_response.status_code == 200:
                                return pdb_response.text
                                
        except Exception as e:
            print(f"Error fetching AlphaFold structure: {e}")
        
        return None
    
    async def fetch_pdb_structure(self, pdb_id: str) -> Optional[str]:
        """Fetch PDB structure by PDB ID"""
        try:
            async with httpx.AsyncClient() as client:
                url = f"https://files.rcsb.org/download/{pdb_id.upper()}.pdb"
                response = await client.get(url, timeout=60.0)
                
                if response.status_code == 200:
                    return response.text
                    
        except Exception as e:
            print(f"Error fetching PDB structure: {e}")
        
        return None
    
    def save_structure_to_file(self, structure_data: str, run_id: str) -> str:
        """Save structure data to file and return path"""
        artifacts_dir = Path(settings.artifacts_dir) / run_id
        artifacts_dir.mkdir(parents=True, exist_ok=True)
        
        structure_path = artifacts_dir / "protein.pdb"
        with open(structure_path, 'w') as f:
            f.write(structure_data)
        
        return str(structure_path)
    
    def extract_binding_site(self, structure_data: str) -> Optional[str]:
        """Extract binding site information (placeholder implementation)"""
        # In a real implementation, this would use tools like fpocket, CASTp, or BioPython
        # to identify binding sites/cavities
        return structure_data  # For now, return full structure

# Create global service instance
protein_service = ProteinService()