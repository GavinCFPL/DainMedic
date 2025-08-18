import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Slider,
  Alert,
  CircularProgress,
  Collapse,
} from '@mui/material';
import MoleculeResults from './MoleculeResults';
import ApiService from '../services/api';

function TTDOptimizationFlow() {
  const [uniprotId, setUniprotId] = useState('P00533');
  const [maxMolecules, setMaxMolecules] = useState(10);
  const [qedThreshold, setQedThreshold] = useState(0.5);
  const [logpRange, setLogpRange] = useState([-2.0, 5.0]);
  const [mwRange, setMwRange] = useState([200.0, 500.0]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!uniprotId.trim()) {
      setError('Please enter a UniProt ID');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const request = {
        uniprot_id: uniprotId.trim(),
        max_molecules: maxMolecules,
        qed_threshold: qedThreshold,
        logp_range: logpRange,
        mw_range: mwRange,
      };

      const response = await ApiService.generateTTDMolecules(request);
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
        TTD-Driven Optimization Flow
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Enter a UniProt ID to fetch known drug molecules from the Therapeutic Target Database,
        then optimize them for better ADMET properties and drug-likeness.
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="UniProt ID"
                value={uniprotId}
                onChange={(e) => setUniprotId(e.target.value)}
                placeholder="e.g., P00533 (EGFR)"
                helperText="Enter the UniProt ID of your target protein"
              />
            </Grid>
            
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
              <Typography gutterBottom>
                QED Score Threshold: {qedThreshold}
              </Typography>
              <Slider
                value={qedThreshold}
                onChange={(e, newValue) => setQedThreshold(newValue)}
                min={0.0}
                max={1.0}
                step={0.05}
                marks={[
                  { value: 0.0, label: '0.0' },
                  { value: 0.5, label: '0.5' },
                  { value: 1.0, label: '1.0' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>
                LogP Range: [{logpRange[0]}, {logpRange[1]}]
              </Typography>
              <Slider
                value={logpRange}
                onChange={(e, newValue) => setLogpRange(newValue)}
                min={-3.0}
                max={6.0}
                step={0.1}
                marks={[
                  { value: -2, label: '-2' },
                  { value: 0, label: '0' },
                  { value: 2, label: '2' },
                  { value: 5, label: '5' },
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>
                Molecular Weight Range: [{mwRange[0]}, {mwRange[1]}]
              </Typography>
              <Slider
                value={mwRange}
                onChange={(e, newValue) => setMwRange(newValue)}
                min={100}
                max={600}
                step={10}
                marks={[
                  { value: 200, label: '200' },
                  { value: 350, label: '350' },
                  { value: 500, label: '500' },
                ]}
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
                {loading ? 'Optimizing Molecules...' : 'Start Optimization'}
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
          title="Optimized Molecules"
          showDockingScores={false}
        />
      )}
    </Box>
  );
}

export default TTDOptimizationFlow;