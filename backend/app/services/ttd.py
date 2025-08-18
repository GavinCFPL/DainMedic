"""
TTD (Therapeutic Target Database) service for fetching target-associated molecules
"""
import csv
import httpx
from typing import List, Optional
from pathlib import Path
import pandas as pd

from app.models.schemas import MoleculeRecord
from app.core.config import settings

class TTDService:
    """Service for TTD integration with fallback to local data"""
    
    def __init__(self):
        self.base_url = settings.ttd_base_url
        self.api_key = settings.ttd_api_key
        self.fallback_path = Path("app/data/ttd_fallback.csv")
    
    async def get_molecules_by_uniprot(self, uniprot_id: str) -> List[MoleculeRecord]:
        """Get molecules associated with a UniProt target"""
        
        # Try live TTD API if configured
        if self.base_url and self.api_key:
            molecules = await self._fetch_from_ttd_api(uniprot_id)
            if molecules:
                return molecules
        
        # Fallback to local CSV data
        return self._fetch_from_fallback(uniprot_id)
    
    async def _fetch_from_ttd_api(self, uniprot_id: str) -> List[MoleculeRecord]:
        """Fetch from live TTD API (placeholder implementation)"""
        try:
            async with httpx.AsyncClient() as client:
                # This is a placeholder - actual TTD API endpoint would be different
                response = await client.get(
                    f"{self.base_url}/api/drug/target/{uniprot_id}",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    molecules = []
                    
                    for item in data.get("drugs", []):
                        if "smiles" in item:
                            molecule = MoleculeRecord(
                                smiles=item["smiles"],
                                mol_id=item.get("drug_id"),
                                name=item.get("name")
                            )
                            molecules.append(molecule)
                    
                    return molecules
        except Exception as e:
            print(f"Error fetching from TTD API: {e}")
        
        return []
    
    def _fetch_from_fallback(self, uniprot_id: str) -> List[MoleculeRecord]:
        """Fetch from local fallback CSV"""
        try:
            if not self.fallback_path.exists():
                return []
                
            df = pd.read_csv(self.fallback_path)
            
            # Filter by UniProt ID
            target_data = df[df['uniprot_id'] == uniprot_id]
            
            molecules = []
            for _, row in target_data.iterrows():
                if pd.notna(row.get('smiles')):
                    molecule = MoleculeRecord(
                        smiles=row['smiles'],
                        mol_id=row.get('drug_id'),
                        name=row.get('drug_name')
                    )
                    molecules.append(molecule)
            
            return molecules
            
        except Exception as e:
            print(f"Error reading fallback data: {e}")
            return []
    
    def create_fallback_data(self):
        """Create sample fallback data for testing"""
        fallback_data = [
            {
                "uniprot_id": "P00533",  # EGFR
                "drug_id": "D00001",
                "drug_name": "Gefitinib",
                "smiles": "COC1=C(C=C2C(=C1)N=CN=C2NC3=CC(=C(C=C3)F)Cl)OCCCN4CCOCC4"
            },
            {
                "uniprot_id": "P00533",  # EGFR
                "drug_id": "D00002", 
                "drug_name": "Erlotinib",
                "smiles": "C#CC1=CC=C(C=C1)NC2=C3C=C(C=CC3=NC=N2)OCCCN4CCOCC4"
            },
            {
                "uniprot_id": "P04626",  # ERBB2
                "drug_id": "D00003",
                "drug_name": "Lapatinib",
                "smiles": "CS(=O)(=O)CCNCC1=CC=C(C=C1)NC2=C3C=CC(=CC3=NC(=N2)NC4=CC(=C(C=C4)OCF)Cl)O"
            },
            {
                "uniprot_id": "P04626",  # ERBB2
                "drug_id": "D00004",
                "drug_name": "Trastuzumab-emtansine",
                "smiles": "CCC1=C(C(=CC=C1)C)N2C(=O)C(=C(C2=O)C)NC(=O)C3=CC(=CC=C3)NC(=O)C4=CC=C(C=C4)N"
            },
            {
                "uniprot_id": "P15692",  # VEGFA
                "drug_id": "D00005",
                "drug_name": "Bevacizumab-related",
                "smiles": "CN1C=NC2=C1C(=O)N(C(=O)N2C)C"
            },
            {
                "uniprot_id": "P35354",  # PTGS2 (COX-2)
                "drug_id": "D00006",
                "drug_name": "Celecoxib",
                "smiles": "CC1=CC=C(C=C1)C2=CC(=NN2C3=CC=C(C=C3)S(=O)(=O)N)C(F)(F)F"
            },
            {
                "uniprot_id": "P35354",  # PTGS2 (COX-2)
                "drug_id": "D00007",
                "drug_name": "Rofecoxib",
                "smiles": "CC1=CC=C(C=C1)C2=C(C(=O)O2)C3=CC=CC=C3S(=O)(=O)C"
            },
            {
                "uniprot_id": "P08253",  # MMP2
                "drug_id": "D00008",
                "drug_name": "Marimastat",
                "smiles": "CC(C)(C)NC(=O)C(CC1=CC=CC=C1)NC(=O)C(CC(C)C)NC(=O)C=O"
            }
        ]
        
        # Create the data directory if it doesn't exist
        self.fallback_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Write to CSV
        df = pd.DataFrame(fallback_data)
        df.to_csv(self.fallback_path, index=False)
        print(f"Created fallback data at {self.fallback_path}")

# Create global service instance
ttd_service = TTDService()