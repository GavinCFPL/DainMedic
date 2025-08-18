# DainMedic - AI-Driven Drug Design Platform

DainMedic is a comprehensive drug design platform that implements two end-to-end drug discovery pipelines:

1. **TTD-Driven Optimization Flow**: Optimizes known drug molecules from the Therapeutic Target Database
2. **Structure-Based Generation Flow**: Generates new molecules using protein structure information

## Features

### TTD-Driven Optimization Flow
- Input UniProt ID to fetch target-associated molecules
- Optimize structures for better ADMET properties and drug-likeness
- Filter by QED score, LogP, and molecular weight ranges
- Generate 2D PNG images and 3D SDF conformers
- Graceful fallback to bundled CSV data when TTD API is unavailable

### Structure-Based Generation Flow  
- Support for protein input via:
  - PDB file upload
  - UniProt ID (fetches from AlphaFold database)
  - PDB ID (fetches from RCSB PDB)
- BioNeMo integration with internal fallback generator
- Molecular docking with scoring (smina/vina support or fallback scoring)
- ADMET property calculation and drug-likeness assessment

### Key Capabilities
- **No Breaking Changes**: All existing functionality preserved
- **Graceful Fallbacks**: Works out-of-the-box without external API keys
- **RDKit Integration**: Molecular property calculation, 2D/3D structure generation
- **Download Support**: PNG, SMILES, and SDF file formats
- **Modern UI**: React frontend with Material-UI components
- **Docker Support**: Complete containerized deployment

## Architecture

```
DainMedic/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Configuration
│   │   ├── models/         # Data schemas
│   │   ├── services/       # Business logic
│   │   └── data/           # Data storage
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   └── services/       # API client
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml      # Container orchestration
```

## Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/GavinCFPL/DainMedic.git
cd DainMedic
```

2. **Start with Docker Compose**
```bash
docker-compose up --build
```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Local Development

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Generation Endpoints
- `POST /api/generate/ttd` - TTD-driven optimization
- `POST /api/generate/structure` - Structure-based generation  
- `GET /api/generate/status/{run_id}` - Check generation status

### Download Endpoints
- `GET /api/download/run/{run_id}/{file_type}` - Download generated files
- `GET /api/download/runs` - List all runs

## Configuration

### Environment Variables

Create `.env` file in the backend directory:

```env
# Optional external service configuration
TTD_BASE_URL=https://api.ttd.org
TTD_API_KEY=your_ttd_api_key

BIONEMO_ENDPOINT=https://api.nvidia.com/bionemo
BIONEMO_API_KEY=your_bionemo_api_key

# AlphaFold API (usually no key required)
ALPHAFOLD_BASE_URL=https://alphafold.ebi.ac.uk/api/

# Application settings
DEBUG=true
MAX_MOLECULES_PER_RUN=20
MAX_FILE_SIZE=104857600
```

## Fallback Data

The system includes fallback data for offline operation:

- **TTD Fallback**: `backend/app/data/ttd_fallback.csv` contains sample drug-target associations
- **Molecule Generation**: Internal RDKit-based generator when BioNeMo is unavailable
- **Structure Images**: Placeholder images when RDKit is not available
- **Docking**: Simple scoring function when smina/vina not installed

## Dependencies

### Backend
- FastAPI 0.104.1
- RDKit (via conda in Docker)
- Pandas, NumPy
- httpx for API calls
- Pillow for image processing

### Frontend  
- React 18.2.0
- Material-UI 5.14.0
- Axios for HTTP requests

### Optional Tools
- smina or AutoDock Vina for molecular docking
- External APIs: TTD, BioNeMo, AlphaFold

## Usage Examples

### TTD-Driven Optimization

```python
# Example TTD request
{
    "uniprot_id": "P00533",        # EGFR
    "max_molecules": 10,
    "qed_threshold": 0.5,
    "logp_range": [-2.0, 5.0],
    "mw_range": [200.0, 500.0]
}
```

### Structure-Based Generation

```python
# Example structure request (form data)
{
    "protein_source": "uniprot",
    "uniprot_id": "P00533",
    "max_molecules": 10,
    "use_bionemo": true
}
```

## Data Storage

Generated artifacts are stored in:
- `backend/app/data/artifacts/{run_id}/`
  - `molecule_{i}.png` - 2D structure images
  - `molecule_{i}.sdf` - 3D conformers
  - `molecules.smi` - SMILES file
  - `protein.pdb` - Input protein structure (structure-based flow)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes following the coding standards
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For issues, questions, or contributions:
- GitHub Issues: https://github.com/GavinCFPL/DainMedic/issues
- Documentation: See `/docs` directory (if available)

## Acknowledgments

- RDKit for molecular informatics capabilities
- NVIDIA BioNeMo for AI-powered molecule generation
- Therapeutic Target Database (TTD) for target-drug associations
- AlphaFold database for protein structures
- React and Material-UI for the user interface