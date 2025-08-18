import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
  Collapse,
  Switch,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import MoleculeResults from './MoleculeResults';
import ApiService from '../services/api';

function StructureGenerationFlow() {
  const [proteinSource, setProteinSource] = useState('upload');
  const [uniprotId, setUniprotId] = useState('P00533');
  const [pdbId, setPdbId] = useState('1M17');
  const [maxMolecules, setMaxMolecules] = useState(10);
  const [useBionemo, setUseBionemo] = useState(true);
  const [proteinFile, setProteinFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['.pdb', '.txt'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!validTypes.includes(fileExtension)) {
        setError('Please upload a PDB file (.pdb)');
        return;
      }
      
      setProteinFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (proteinSource === 'upload' && !proteinFile) {
      setError('Please upload a protein file');
      return;
    }
    
    if (proteinSource === 'uniprot' && !uniprotId.trim()) {
      setError('Please enter a UniProt ID');
      return;
    }
    
    if (proteinSource === 'pdb' && !pdbId.trim()) {
      setError('Please enter a PDB ID');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('protein_source', proteinSource);
      formData.append('max_molecules', maxMolecules);
      formData.append('use_bionemo', useBionemo);
      
      if (proteinSource === 'upload' && proteinFile) {
        formData.append('protein_file', proteinFile);
      } else if (proteinSource === 'uniprot') {
        formData.append('uniprot_id', uniprotId.trim());
      } else if (proteinSource === 'pdb') {
        formData.append('pdb_id', pdbId.trim());
      }

      const response = await ApiService.generateStructureMolecules(formData);
      setResults(response);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate molecules');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Structure-Based Generation Flow
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate new molecules using protein structure information. Upload a PDB file,
        fetch from AlphaFold using UniProt ID, or use a PDB ID.
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Protein Source</FormLabel>
                <RadioGroup
                  value={proteinSource}
                  onChange={(e) => setProteinSource(e.target.value)}
                  row
                >
                  <FormControlLabel value="upload" control={<Radio />} label="Upload PDB File" />
                  <FormControlLabel value="uniprot" control={<Radio />} label="UniProt ID" />
                  <FormControlLabel value="pdb" control={<Radio />} label="PDB ID" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {proteinSource === 'upload' && (
              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ mb: 2 }}
                >
                  Upload PDB File
                  <input
                    type="file"
                    hidden
                    accept=".pdb,.txt"
                    onChange={handleFileChange}
                  />
                </Button>
                {proteinFile && (
                  <Typography variant="body2" color="text.secondary">
                    Selected: {proteinFile.name}
                  </Typography>
                )}
              </Grid>
            )}

            {proteinSource === 'uniprot' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="UniProt ID"
                  value={uniprotId}
                  onChange={(e) => setUniprotId(e.target.value)}
                  placeholder="e.g., P00533"
                  helperText="Fetch structure from AlphaFold database"
                />
              </Grid>
            )}

            {proteinSource === 'pdb' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="PDB ID"
                  value={pdbId}
                  onChange={(e) => setPdbId(e.target.value)}
                  placeholder="e.g., 1M17"
                  helperText="Fetch structure from RCSB PDB"
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Molecules"
                type="number"
                value={maxMolecules}
                onChange={(e) => setMaxMolecules(Number(e.target.value))}
                inputProps={{ min: 1, max: 20 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useBionemo}
                    onChange={(e) => setUseBionemo(e.target.checked)}
                  />
                }
                label="Use BioNeMo for generation (falls back to internal generator if not configured)"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Generating Molecules...' : 'Generate Molecules'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Collapse in={!!error}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Collapse>

      {results && (
        <MoleculeResults 
          results={results} 
          title="Generated Molecules"
          showDockingScores={true}
        />
      )}
    </Box>
  );
}

export default StructureGenerationFlow;