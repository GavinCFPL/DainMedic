import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 120000, // 2 minutes timeout for generation
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // TTD-driven optimization
  async generateTTDMolecules(request) {
    const response = await this.client.post('/generate/ttd', request);
    return response.data;
  }

  // Structure-based generation
  async generateStructureMolecules(formData) {
    const response = await this.client.post('/generate/structure', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Get generation status
  async getGenerationStatus(runId) {
    const response = await this.client.get(`/generate/status/${runId}`);
    return response.data;
  }

  // Download files
  async downloadFile(runId, fileType, molId = null) {
    let url = `/download/run/${runId}/${fileType}`;
    if (molId) {
      url += `?mol_id=${molId}`;
    }
    
    const response = await this.client.get(url, {
      responseType: 'blob',
    });
    
    return response.data;
  }

  // List all runs
  async listRuns() {
    const response = await this.client.get('/download/runs');
    return response.data;
  }

  // Helper method to trigger file download
  downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export default new ApiService();