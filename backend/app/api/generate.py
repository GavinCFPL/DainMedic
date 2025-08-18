"""
Generation endpoints for drug design pipelines
"""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
import uuid
import asyncio
from pathlib import Path
from typing import Optional

from app.models.schemas import (
    TTDRequest, StructureRequest, GenerationResponse, 
    MoleculeRecord, GenerationStatus
)
from app.services.ttd import ttd_service
from app.services.rdkit_utils import rdkit_service  
from app.services.bionemo import bionemo_service
from app.services.protein import protein_service
from app.services.docking import docking_service
from app.core.config import settings

router = APIRouter()

# Simple in-memory storage for runs (in production, use database)
active_runs = {}

@router.post("/ttd", response_model=GenerationResponse)
async def generate_ttd_molecules(request: TTDRequest):
    """TTD-driven optimization flow"""
    run_id = str(uuid.uuid4())
    
    try:
        # Update run status
        active_runs[run_id] = {
            "status": GenerationStatus.RUNNING,
            "progress": 10,
            "molecules": []
        }
        
        # Fetch molecules from TTD
        ttd_molecules = await ttd_service.get_molecules_by_uniprot(request.uniprot_id)
        
        if not ttd_molecules:
            # Fallback to RDKit generated molecules
            fallback_smiles = rdkit_service.generate_fallback_molecules(request.max_molecules)
            ttd_molecules = [MoleculeRecord(smiles=smiles, mol_id=f"fallback_{i}") 
                           for i, smiles in enumerate(fallback_smiles)]
        
        active_runs[run_id]["progress"] = 30
        
        # Filter and optimize molecules
        optimized_molecules = []
        
        for i, mol in enumerate(ttd_molecules[:request.max_molecules]):
            # Calculate properties
            props = rdkit_service.calculate_properties(mol.smiles)
            
            # Update molecule with properties
            mol.qed_score = props.get("qed_score")
            mol.logp = props.get("logp")
            mol.molecular_weight = props.get("molecular_weight")
            mol.tpsa = props.get("tpsa")
            mol.hbd = props.get("hbd")
            mol.hba = props.get("hba")
            mol.rotatable_bonds = props.get("rotatable_bonds")
            
            # Filter based on criteria
            if (mol.qed_score and mol.qed_score >= request.qed_threshold and
                mol.logp and request.logp_range[0] <= mol.logp <= request.logp_range[1] and
                mol.molecular_weight and request.mw_range[0] <= mol.molecular_weight <= request.mw_range[1]):
                
                # Generate 2D image
                artifacts_dir = Path(settings.artifacts_dir) / run_id
                artifacts_dir.mkdir(parents=True, exist_ok=True)
                
                png_path = artifacts_dir / f"molecule_{i}.png"
                sdf_path = artifacts_dir / f"molecule_{i}.sdf"
                
                # Generate images and 3D conformers
                if rdkit_service.generate_2d_image(mol.smiles, str(png_path)):
                    mol.png_path = str(png_path)
                
                if rdkit_service.generate_3d_conformer(mol.smiles, str(sdf_path)):
                    mol.sdf_path = str(sdf_path)
                
                optimized_molecules.append(mol)
        
        active_runs[run_id]["progress"] = 90
        
        # Sort by QED score (descending)
        optimized_molecules.sort(key=lambda x: x.qed_score or 0, reverse=True)
        
        # Save SMILES file
        artifacts_dir = Path(settings.artifacts_dir) / run_id
        smiles_path = artifacts_dir / "molecules.smi"
        with open(smiles_path, 'w') as f:
            for mol in optimized_molecules:
                f.write(f"{mol.smiles}\t{mol.name or mol.mol_id}\n")
        
        # Update final status
        active_runs[run_id] = {
            "status": GenerationStatus.COMPLETED,
            "progress": 100,
            "molecules": optimized_molecules,
            "smiles_path": str(smiles_path)
        }
        
        return GenerationResponse(
            run_id=run_id,
            status=GenerationStatus.COMPLETED,
            message=f"Successfully optimized {len(optimized_molecules)} molecules for UniProt {request.uniprot_id}",
            molecules=optimized_molecules,
            progress=100
        )
        
    except Exception as e:
        active_runs[run_id] = {
            "status": GenerationStatus.FAILED,
            "progress": 0,
            "molecules": [],
            "error": str(e)
        }
        
        raise HTTPException(
            status_code=500, 
            detail=f"TTD generation failed: {str(e)}"
        )

@router.post("/structure", response_model=GenerationResponse)
async def generate_structure_molecules(
    protein_source: str = Form(...),
    uniprot_id: Optional[str] = Form(None),
    pdb_id: Optional[str] = Form(None),
    max_molecules: int = Form(10),
    use_bionemo: bool = Form(True),
    protein_file: Optional[UploadFile] = File(None)
):
    """Structure-based generation flow"""
    run_id = str(uuid.uuid4())
    
    try:
        # Update run status
        active_runs[run_id] = {
            "status": GenerationStatus.RUNNING,
            "progress": 10,
            "molecules": []
        }
        
        # Get protein structure
        protein_data = None
        
        if protein_source == "upload" and protein_file:
            protein_data = await protein_file.read()
            protein_data = protein_data.decode('utf-8')
            
        elif protein_source == "uniprot" and uniprot_id:
            protein_data = await protein_service.fetch_alphafold_structure(uniprot_id)
            
        elif protein_source == "pdb" and pdb_id:
            protein_data = await protein_service.fetch_pdb_structure(pdb_id)
        
        if not protein_data:
            raise HTTPException(
                status_code=400,
                detail="Could not obtain protein structure"
            )
        
        active_runs[run_id]["progress"] = 30
        
        # Save protein structure
        protein_path = protein_service.save_structure_to_file(protein_data, run_id)
        
        # Generate molecules
        if use_bionemo and bionemo_service.endpoint:
            generated_smiles = await bionemo_service.generate_molecules(protein_data, max_molecules)
        else:
            generated_smiles = bionemo_service._generate_fallback_molecules(max_molecules)
        
        active_runs[run_id]["progress"] = 60
        
        # Process generated molecules
        processed_molecules = []
        
        for i, smiles in enumerate(generated_smiles):
            # Calculate properties
            props = rdkit_service.calculate_properties(smiles)
            
            # Dock against protein (or fallback scoring)
            docking_score = docking_service.dock_molecule(smiles, protein_data)
            
            molecule = MoleculeRecord(
                smiles=smiles,
                mol_id=f"gen_{i}",
                qed_score=props.get("qed_score"),
                logp=props.get("logp"),
                molecular_weight=props.get("molecular_weight"),
                tpsa=props.get("tpsa"),
                hbd=props.get("hbd"),
                hba=props.get("hba"),
                rotatable_bonds=props.get("rotatable_bonds"),
                docking_score=docking_score
            )
            
            # Generate 2D image and 3D conformer
            artifacts_dir = Path(settings.artifacts_dir) / run_id
            artifacts_dir.mkdir(parents=True, exist_ok=True)
            
            png_path = artifacts_dir / f"molecule_{i}.png"
            sdf_path = artifacts_dir / f"molecule_{i}.sdf"
            
            if rdkit_service.generate_2d_image(smiles, str(png_path)):
                molecule.png_path = str(png_path)
            
            if rdkit_service.generate_3d_conformer(smiles, str(sdf_path)):
                molecule.sdf_path = str(sdf_path)
            
            processed_molecules.append(molecule)
        
        active_runs[run_id]["progress"] = 90
        
        # Sort by docking score (ascending - more negative is better)
        processed_molecules.sort(key=lambda x: x.docking_score or 0)
        
        # Save SMILES file
        artifacts_dir = Path(settings.artifacts_dir) / run_id
        smiles_path = artifacts_dir / "molecules.smi"
        with open(smiles_path, 'w') as f:
            for mol in processed_molecules:
                f.write(f"{mol.smiles}\t{mol.mol_id}\n")
        
        # Update final status
        active_runs[run_id] = {
            "status": GenerationStatus.COMPLETED,
            "progress": 100,
            "molecules": processed_molecules,
            "smiles_path": str(smiles_path),
            "protein_path": protein_path
        }
        
        return GenerationResponse(
            run_id=run_id,
            status=GenerationStatus.COMPLETED,
            message=f"Successfully generated {len(processed_molecules)} molecules",
            molecules=processed_molecules,
            progress=100
        )
        
    except Exception as e:
        active_runs[run_id] = {
            "status": GenerationStatus.FAILED,
            "progress": 0,
            "molecules": [],
            "error": str(e)
        }
        
        raise HTTPException(
            status_code=500,
            detail=f"Structure generation failed: {str(e)}"
        )

@router.get("/status/{run_id}", response_model=GenerationResponse)
async def get_generation_status(run_id: str):
    """Get status of a generation run"""
    if run_id not in active_runs:
        raise HTTPException(status_code=404, detail="Run not found")
    
    run_data = active_runs[run_id]
    
    return GenerationResponse(
        run_id=run_id,
        status=run_data["status"],
        message=f"Run {run_data['status']} ({run_data.get('progress', 0)}%)",
        molecules=run_data.get("molecules", []),
        progress=run_data.get("progress", 0)
    )