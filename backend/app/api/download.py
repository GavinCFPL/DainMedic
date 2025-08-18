"""
Download endpoints for generated artifacts
"""
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse, Response
import zipfile
import tempfile
from pathlib import Path
from typing import Optional

from app.models.schemas import DownloadRequest
from app.core.config import settings
from app.api.generate import active_runs

router = APIRouter()

@router.get("/run/{run_id}/{file_type}")
async def download_run_files(
    run_id: str,
    file_type: str,
    mol_id: Optional[str] = Query(None, description="Specific molecule ID")
):
    """Download files for a completed run"""
    
    if run_id not in active_runs:
        raise HTTPException(status_code=404, detail="Run not found")
    
    run_data = active_runs[run_id]
    
    if run_data["status"] != "completed":
        raise HTTPException(status_code=400, detail="Run not completed")
    
    artifacts_dir = Path(settings.artifacts_dir) / run_id
    
    if not artifacts_dir.exists():
        raise HTTPException(status_code=404, detail="Artifacts not found")
    
    if file_type == "smiles":
        # Return SMILES file
        smiles_path = artifacts_dir / "molecules.smi"
        if smiles_path.exists():
            return FileResponse(
                path=str(smiles_path),
                filename=f"{run_id}_molecules.smi",
                media_type="text/plain"
            )
        else:
            raise HTTPException(status_code=404, detail="SMILES file not found")
    
    elif file_type == "png":
        if mol_id:
            # Return specific molecule PNG
            molecules = run_data.get("molecules", [])
            target_mol = next((m for m in molecules if m.mol_id == mol_id), None)
            
            if not target_mol or not target_mol.png_path:
                raise HTTPException(status_code=404, detail="PNG not found for molecule")
            
            png_path = Path(target_mol.png_path)
            if png_path.exists():
                return FileResponse(
                    path=str(png_path),
                    filename=f"{run_id}_{mol_id}.png",
                    media_type="image/png"
                )
        else:
            # Return all PNGs as ZIP
            return await _create_zip_response(artifacts_dir, "*.png", f"{run_id}_images.zip")
    
    elif file_type == "sdf":
        if mol_id:
            # Return specific molecule SDF
            molecules = run_data.get("molecules", [])
            target_mol = next((m for m in molecules if m.mol_id == mol_id), None)
            
            if not target_mol or not target_mol.sdf_path:
                raise HTTPException(status_code=404, detail="SDF not found for molecule")
            
            sdf_path = Path(target_mol.sdf_path)
            if sdf_path.exists():
                return FileResponse(
                    path=str(sdf_path),
                    filename=f"{run_id}_{mol_id}.sdf",
                    media_type="chemical/x-mdl-sdfile"
                )
        else:
            # Return all SDFs as ZIP
            return await _create_zip_response(artifacts_dir, "*.sdf", f"{run_id}_structures.zip")
    
    elif file_type == "all":
        # Return everything as ZIP
        return await _create_zip_response(artifacts_dir, "*", f"{run_id}_all_files.zip")
    
    else:
        raise HTTPException(status_code=400, detail="Invalid file type")

@router.get("/molecule/{run_id}/{mol_id}/{file_type}")
async def download_molecule_file(run_id: str, mol_id: str, file_type: str):
    """Download specific file for a molecule"""
    return await download_run_files(run_id, file_type, mol_id)

async def _create_zip_response(artifacts_dir: Path, pattern: str, zip_filename: str) -> Response:
    """Create a ZIP file response with matching files"""
    
    # Find matching files
    if pattern == "*":
        files = list(artifacts_dir.glob("*"))
    else:
        files = list(artifacts_dir.glob(pattern))
    
    if not files:
        raise HTTPException(status_code=404, detail="No files found")
    
    # Create temporary ZIP file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".zip") as temp_zip:
        with zipfile.ZipFile(temp_zip.name, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file_path in files:
                if file_path.is_file():
                    # Add file to ZIP with relative name
                    zipf.write(file_path, file_path.name)
        
        # Read the ZIP file content
        with open(temp_zip.name, 'rb') as f:
            zip_content = f.read()
        
        # Clean up temporary file
        Path(temp_zip.name).unlink()
        
        return Response(
            content=zip_content,
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename={zip_filename}"}
        )

@router.get("/runs")
async def list_runs():
    """List all available runs"""
    runs_info = []
    
    for run_id, run_data in active_runs.items():
        runs_info.append({
            "run_id": run_id,
            "status": run_data["status"],
            "progress": run_data.get("progress", 0),
            "molecule_count": len(run_data.get("molecules", [])),
            "has_artifacts": (Path(settings.artifacts_dir) / run_id).exists()
        })
    
    return {"runs": runs_info}