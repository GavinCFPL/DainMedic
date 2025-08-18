"""
BioNeMo service for molecule generation with fallbacks
"""
import httpx
from typing import List, Optional
import random

from app.models.schemas import MoleculeRecord
from app.core.config import settings
from app.services.rdkit_utils import rdkit_service

class BioNeMoService:
    """Service for BioNeMo integration with fallback generation"""
    
    def __init__(self):
        self.endpoint = settings.bionemo_endpoint
        self.api_key = settings.bionemo_api_key
    
    async def generate_molecules(self, protein_data: str, count: int = 10) -> List[str]:
        """Generate molecules using BioNeMo or fallback method"""
        
        # Try BioNeMo API if configured
        if self.endpoint and self.api_key:
            molecules = await self._generate_with_bionemo(protein_data, count)
            if molecules:
                return molecules
        
        # Fallback to internal generation
        return self._generate_fallback_molecules(count)
    
    async def _generate_with_bionemo(self, protein_data: str, count: int) -> List[str]:
        """Generate molecules using BioNeMo API (placeholder implementation)"""
        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    "protein_structure": protein_data,
                    "num_molecules": count,
                    "diversity_threshold": 0.7,
                    "drug_likeness": True
                }
                
                response = await client.post(
                    f"{self.endpoint}/generate",
                    json=payload,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    timeout=120.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data.get("molecules", [])
                    
        except Exception as e:
            print(f"Error calling BioNeMo API: {e}")
        
        return []
    
    def _generate_fallback_molecules(self, count: int) -> List[str]:
        """Generate molecules using internal fallback method"""
        print("Using fallback molecule generation (BioNeMo not configured)")
        
        # Use RDKit's fallback molecules and add some variation
        base_molecules = rdkit_service.generate_fallback_molecules(count * 2)
        
        # Add some additional diverse drug-like molecules
        additional_molecules = [
            "CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)C",  # Imatinib-like
            "COC1=CC2=C(C=C1)C(=CN2)C(=O)N3CCN(CC3)C4=CC=C(C=C4)F",  # Fluorinated compound
            "CC(C)(C)C1=CC=C(C=C1)C(=O)NC2=CC=C(C=C2)N3CCCC3",  # Substituted aniline
            "CN1C=NC2=C1C(=O)N(C(=O)N2C)C3=CC=CC=C3",  # Theophylline-like
            "COC1=CC=C(C=C1)CCN2C=NC3=CC=CC=C32",  # Benzimidazole derivative
            "CC1=CC=C(C=C1)S(=O)(=O)N2CCCC2C(=O)N3CCN(CC3)C",  # Sulfonamide
            "CN(C)C1=CC=C(C=C1)C=C2C=CC(=CC2=O)N(C)C",  # Chromophore
            "COC1=CC=C(C=C1)NC(=O)C2=CC=C(C=C2)C#N",  # Nitrile compound
        ]
        
        all_molecules = base_molecules + additional_molecules
        
        # Randomly select and return requested count
        selected = random.sample(all_molecules, min(count, len(all_molecules)))
        return selected

# Create global service instance
bionemo_service = BioNeMoService()