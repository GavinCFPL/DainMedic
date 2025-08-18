import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Download, Image, Science } from '@mui/icons-material';
import ApiService from '../services/api';

function MoleculeResults({ results, title, showDockingScores = false }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMolecule, setSelectedMolecule] = useState(null);

  const handleDownload = async (fileType, molId = null) => {
    if (!results.run_id) return;
    
    setDownloading(true);
    setError('');

    try {
      const blob = await ApiService.downloadFile(results.run_id, fileType, molId);
      
      let filename = `${results.run_id}_${fileType}`;
      if (molId) {
        filename = `${results.run_id}_${molId}.${fileType}`;
      } else {
        filename += fileType === 'smiles' ? '.smi' : `.${fileType}`;
      }
      
      ApiService.downloadBlob(blob, filename);
    } catch (err) {
      setError('Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

  const formatValue = (value, decimals = 2) => {
    return value !== null && value !== undefined 
      ? Number(value).toFixed(decimals) 
      : 'N/A';
  };

  if (!results || !results.molecules || results.molecules.length === 0) {
    return (
      <Alert severity="info">
        No molecules found or generated.
      </Alert>
    );
  }

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">{title}</Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => handleDownload('smiles')}
              disabled={downloading}
              sx={{ mr: 1 }}
            >
              Download SMILES
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => handleDownload('all')}
              disabled={downloading}
            >
              Download All Files
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Found {results.molecules.length} molecules (Run ID: {results.run_id})
        </Typography>

        <Grid container spacing={3}>
          {results.molecules.slice(0, 6).map((molecule, index) => (
            <Grid item xs={12} sm={6} md={4} key={molecule.mol_id || index}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" noWrap>
                      {molecule.name || molecule.mol_id || `Molecule ${index + 1}`}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={`QED: ${formatValue(molecule.qed_score)}`}
                      color={molecule.qed_score > 0.6 ? 'success' : 'default'}
                    />
                  </Box>

                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary">
                      SMILES:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        wordBreak: 'break-all'
                      }}
                    >
                      {molecule.smiles.length > 50 
                        ? `${molecule.smiles.substring(0, 50)}...` 
                        : molecule.smiles}
                    </Typography>
                  </Box>

                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption">LogP:</Typography>
                      <Typography variant="body2">{formatValue(molecule.logp)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption">MW:</Typography>
                      <Typography variant="body2">{formatValue(molecule.molecular_weight, 0)}</Typography>
                    </Grid>
                    {showDockingScores && (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="caption">Docking:</Typography>
                          <Typography variant="body2">{formatValue(molecule.docking_score)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption">TPSA:</Typography>
                          <Typography variant="body2">{formatValue(molecule.tpsa, 0)}</Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Image />}
                    onClick={() => handleDownload('png', molecule.mol_id)}
                    disabled={downloading}
                  >
                    PNG
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Science />}
                    onClick={() => handleDownload('sdf', molecule.mol_id)}
                    disabled={downloading}
                  >
                    SDF
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setSelectedMolecule(molecule)}
                  >
                    Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {results.molecules.length > 6 && (
          <Box mt={3}>
            <Alert severity="info">
              Showing first 6 molecules. Download all files to access complete results.
            </Alert>
          </Box>
        )}

        {/* Detailed Table View */}
        {results.molecules.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Detailed Results
            </Typography>
            <TableContainer component={Paper} elevation={1}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Molecule</TableCell>
                    <TableCell align="right">QED</TableCell>
                    <TableCell align="right">LogP</TableCell>
                    <TableCell align="right">MW</TableCell>
                    <TableCell align="right">TPSA</TableCell>
                    <TableCell align="right">HBD</TableCell>
                    <TableCell align="right">HBA</TableCell>
                    {showDockingScores && (
                      <TableCell align="right">Docking Score</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.molecules.map((molecule, index) => (
                    <TableRow key={molecule.mol_id || index}>
                      <TableCell>
                        {molecule.name || molecule.mol_id || `Mol ${index + 1}`}
                      </TableCell>
                      <TableCell align="right">{formatValue(molecule.qed_score)}</TableCell>
                      <TableCell align="right">{formatValue(molecule.logp)}</TableCell>
                      <TableCell align="right">{formatValue(molecule.molecular_weight, 0)}</TableCell>
                      <TableCell align="right">{formatValue(molecule.tpsa, 0)}</TableCell>
                      <TableCell align="right">{molecule.hbd || 'N/A'}</TableCell>
                      <TableCell align="right">{molecule.hba || 'N/A'}</TableCell>
                      {showDockingScores && (
                        <TableCell align="right">{formatValue(molecule.docking_score)}</TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Molecule Details Dialog */}
        <Dialog
          open={!!selectedMolecule}
          onClose={() => setSelectedMolecule(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Molecule Details: {selectedMolecule?.name || selectedMolecule?.mol_id}
          </DialogTitle>
          <DialogContent>
            {selectedMolecule && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>SMILES:</Typography>
                <Typography 
                  variant="body2" 
                  sx={{ fontFamily: 'monospace', mb: 2, p: 1, bgcolor: 'grey.100' }}
                >
                  {selectedMolecule.smiles}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">QED Score:</Typography>
                    <Typography variant="body1">{formatValue(selectedMolecule.qed_score)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">LogP:</Typography>
                    <Typography variant="body1">{formatValue(selectedMolecule.logp)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Molecular Weight:</Typography>
                    <Typography variant="body1">{formatValue(selectedMolecule.molecular_weight, 1)} Da</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">TPSA:</Typography>
                    <Typography variant="body1">{formatValue(selectedMolecule.tpsa, 1)} Ų</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">H-Bond Donors:</Typography>
                    <Typography variant="body1">{selectedMolecule.hbd || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">H-Bond Acceptors:</Typography>
                    <Typography variant="body1">{selectedMolecule.hba || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Rotatable Bonds:</Typography>
                    <Typography variant="body1">{selectedMolecule.rotatable_bonds || 'N/A'}</Typography>
                  </Grid>
                  {showDockingScores && (
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Docking Score:</Typography>
                      <Typography variant="body1">{formatValue(selectedMolecule.docking_score)}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedMolecule(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}

export default MoleculeResults;