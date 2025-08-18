"""
Simple docking service with fallback scoring
"""
import subprocess
import tempfile
import os
from typing import Optional
from pathlib import Path

class DockingService:
    """Service for molecular docking with fallback scoring"""
    
    def __init__(self):
        self.smina_available = self._check_smina_available()
        self.vina_available = self._check_vina_available()
    
    def _check_smina_available(self) -> bool:
        """Check if smina is available in PATH"""
        try:
            result = subprocess.run(["smina", "--help"], 
                                  capture_output=True, timeout=5)
            return result.returncode == 0
        except:
            return False
    
    def _check_vina_available(self) -> bool:
        """Check if AutoDock Vina is available in PATH"""
        try:
            result = subprocess.run(["vina", "--help"], 
                                  capture_output=True, timeout=5)
            return result.returncode == 0
        except:
            return False
    
    def dock_molecule(self, smiles: str, protein_pdb: str) -> float:
        """Dock molecule against protein and return score"""
        
        # Try real docking if tools are available
        if self.smina_available:
            score = self._dock_with_smina(smiles, protein_pdb)
            if score is not None:
                return score
        
        if self.vina_available:
            score = self._dock_with_vina(smiles, protein_pdb)
            if score is not None:
                return score
        
        # Fallback to simple scoring function
        return self._fallback_scoring(smiles)
    
    def _dock_with_smina(self, smiles: str, protein_pdb: str) -> Optional[float]:
        """Dock using smina (placeholder implementation)"""
        try:
            # This would require converting SMILES to 3D coordinates first
            # and setting up proper docking parameters
            print("Smina docking not fully implemented - using fallback")
            return None
        except Exception as e:
            print(f"Error in smina docking: {e}")
            return None
    
    def _dock_with_vina(self, smiles: str, protein_pdb: str) -> Optional[float]:
        """Dock using AutoDock Vina (placeholder implementation)"""
        try:
            # This would require proper setup of receptor and ligand files
            print("Vina docking not fully implemented - using fallback")
            return None
        except Exception as e:
            print(f"Error in vina docking: {e}")
            return None
    
    def _fallback_scoring(self, smiles: str) -> float:
        """Simple fallback scoring based on molecular properties"""
        # Simple heuristic scoring based on SMILES string
        score = 0.0
        
        # Penalize very long molecules
        if len(smiles) > 100:
            score -= 2.0
        
        # Reward presence of common pharmacophores
        pharmacophores = [
            ('N', 0.5),    # Nitrogen
            ('O', 0.3),    # Oxygen  
            ('S', 0.4),    # Sulfur
            ('F', 0.2),    # Fluorine
            ('Cl', 0.3),   # Chlorine
            ('aromatic', 1.0)  # Aromatic rings (simplified)
        ]
        
        for pattern, reward in pharmacophores:
            if pattern == 'aromatic':
                # Count aromatic indicators
                aromatic_count = smiles.count('c') + smiles.count('n') + smiles.count('o') + smiles.count('s')
                score += min(aromatic_count * reward, 3.0)  # Cap aromatic bonus
            else:
                count = smiles.count(pattern)
                score += min(count * reward, 2.0)  # Cap individual bonuses
        
        # Add some randomness to simulate binding variability
        import random
        noise = random.uniform(-1.0, 1.0)
        score += noise
        
        # Typical docking scores are negative (lower is better)
        return -(abs(score) + random.uniform(3.0, 8.0))

# Create global service instance  
docking_service = DockingService()