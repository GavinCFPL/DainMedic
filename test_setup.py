#!/usr/bin/env python3
"""
Simple test script for DainMedic backend functionality
"""
import sys
import os
sys.path.append('/home/runner/work/DainMedic/DainMedic/backend')

def test_imports():
    """Test that all modules can be imported"""
    try:
        from app.services.rdkit_utils import rdkit_service
        from app.services.ttd import ttd_service
        from app.services.bionemo import bionemo_service
        from app.services.protein import protein_service
        from app.services.docking import docking_service
        from app.models.schemas import MoleculeRecord, TTDRequest, StructureRequest
        print("✓ All modules imported successfully")
        return True
    except Exception as e:
        print(f"✗ Import error: {e}")
        return False

def test_rdkit_fallback():
    """Test RDKit fallback functionality"""
    try:
        from app.services.rdkit_utils import rdkit_service
        
        # Test fallback molecules
        molecules = rdkit_service.generate_fallback_molecules(5)
        assert len(molecules) == 5
        print(f"✓ Generated {len(molecules)} fallback molecules")
        
        # Test property calculation (with or without RDKit)
        props = rdkit_service.calculate_properties(molecules[0])
        assert 'qed_score' in props
        assert 'logp' in props
        print("✓ Property calculation working (fallback or RDKit)")
        
        return True
    except Exception as e:
        print(f"✗ RDKit fallback test failed: {e}")
        return False

def test_ttd_fallback():
    """Test TTD fallback data"""
    try:
        from app.services.ttd import ttd_service
        import asyncio
        
        async def test_ttd():
            # Test fallback data loading
            molecules = await ttd_service.get_molecules_by_uniprot("P00533")
            assert len(molecules) > 0
            print(f"✓ TTD fallback: found {len(molecules)} molecules for P00533")
            return True
        
        return asyncio.run(test_ttd())
    except Exception as e:
        print(f"✗ TTD fallback test failed: {e}")
        return False

def test_file_structure():
    """Test that required files and directories exist"""
    base_path = '/home/runner/work/DainMedic/DainMedic'
    
    required_files = [
        'backend/main.py',
        'backend/requirements.txt',
        'backend/Dockerfile',
        'backend/app/data/ttd_fallback.csv',
        'frontend/package.json',
        'frontend/src/App.js',
        'frontend/Dockerfile',
        'docker-compose.yml',
        'README.md'
    ]
    
    all_exist = True
    for file_path in required_files:
        full_path = os.path.join(base_path, file_path)
        if os.path.exists(full_path):
            print(f"✓ {file_path}")
        else:
            print(f"✗ {file_path} missing")
            all_exist = False
    
    return all_exist

def main():
    """Run all tests"""
    print("Running DainMedic functionality tests...\n")
    
    tests = [
        ("File Structure", test_file_structure),
        ("Module Imports", test_imports),
        ("RDKit Fallback", test_rdkit_fallback),
        ("TTD Fallback", test_ttd_fallback),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n--- {test_name} ---")
        if test_func():
            passed += 1
            print(f"✓ {test_name} PASSED")
        else:
            print(f"✗ {test_name} FAILED")
    
    print(f"\n--- Results ---")
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("✓ All tests passed! DainMedic is ready for use.")
        sys.exit(0)
    else:
        print("✗ Some tests failed. Check the output above.")
        sys.exit(1)

if __name__ == "__main__":
    main()