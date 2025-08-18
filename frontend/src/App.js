import React, { useState } from 'react';
import { 
  ThemeProvider, 
  createTheme,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Tab,
  Tabs,
  Box
} from '@mui/material';
import TTDOptimizationFlow from './components/TTDOptimizationFlow';
import StructureGenerationFlow from './components/StructureGenerationFlow';

// Blue-themed design as mentioned in the problem statement
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#0d47a1',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            DainMedic - AI Drug Design Platform
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="TTD-Driven Optimization" />
              <Tab label="Structure-Based Generation" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <TTDOptimizationFlow />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <StructureGenerationFlow />
          </TabPanel>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;