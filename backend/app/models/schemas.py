from pydantic import BaseModel, Field
from typing import List, Optional, Union
from enum import Enum

class GenerationStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running" 
    COMPLETED = "completed"
    FAILED = "failed"

class MoleculeRecord(BaseModel):
    """Represents a molecule with its properties"""
    smiles: str
    mol_id: Optional[str] = None
    name: Optional[str] = None
    qed_score: Optional[float] = None
    logp: Optional[float] = None
    molecular_weight: Optional[float] = None
    tpsa: Optional[float] = None
    hbd: Optional[int] = None
    hba: Optional[int] = None
    rotatable_bonds: Optional[int] = None
    docking_score: Optional[float] = None
    png_path: Optional[str] = None
    sdf_path: Optional[str] = None

class TTDRequest(BaseModel):
    """Request for TTD-driven optimization"""
    uniprot_id: str = Field(..., description="UniProt ID of the target protein")
    max_molecules: int = Field(default=10, ge=1, le=20, description="Maximum number of molecules to optimize")
    qed_threshold: float = Field(default=0.5, ge=0.0, le=1.0, description="QED score threshold")
    logp_range: tuple[float, float] = Field(default=(-2.0, 5.0), description="LogP range (min, max)")
    mw_range: tuple[float, float] = Field(default=(200.0, 500.0), description="Molecular weight range")

class StructureRequest(BaseModel):
    """Request for structure-based generation"""
    protein_source: str = Field(..., description="Type of protein source: 'upload', 'uniprot', or 'pdb'")
    uniprot_id: Optional[str] = Field(None, description="UniProt ID for AlphaFold structure")
    pdb_id: Optional[str] = Field(None, description="PDB ID to fetch")
    max_molecules: int = Field(default=10, ge=1, le=20, description="Maximum number of molecules to generate")
    use_bionemo: bool = Field(default=True, description="Whether to use BioNeMo for generation")

class GenerationResponse(BaseModel):
    """Response for generation requests"""
    run_id: str
    status: GenerationStatus
    message: str
    molecules: List[MoleculeRecord] = []
    progress: Optional[int] = None
    
class DownloadRequest(BaseModel):
    """Request for downloading generated files"""
    run_id: str
    file_type: str = Field(..., description="File type: 'png', 'smiles', 'sdf'")
    mol_id: Optional[str] = Field(None, description="Specific molecule ID, if not provided downloads all")