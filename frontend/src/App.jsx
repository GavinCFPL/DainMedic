import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState('Connecting...')

  useEffect(() => {
    // Test connection to backend
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    
    fetch(`${apiUrl}/health`)
      .then(response => response.json())
      .then(data => {
        setBackendStatus(`Backend is ${data.status}`)
      })
      .catch(error => {
        setBackendStatus('Backend connection failed')
        console.error('Backend connection error:', error)
      })
  }, [])

  return (
    <>
      <div>
        <h1>DainMedic</h1>
        <p>Drug Design and Discovery Platform</p>
        <div>
          <h3>System Status</h3>
          <p>Backend: {backendStatus}</p>
          <p>Frontend: Running ✅</p>
        </div>
      </div>
    </>
  )
}

export default App