import React from 'react'
import { useParams } from 'react-router-dom'

export default function MoleculeDetail() {
  const { id } = useParams()

  const mockMolecule = {
    id,
    target: 'EGFR',
    disease: '肺癌',
    uniprot_id: 'P00533',
    pdb_id: '1M17',
    smiles: 'CCc1ccc2ncnc(Nc3ccc(F)c(Cl)c3)c2c1',
    png_path: '/api/placeholder/300/200',
    druglikeness: 0.82,
    binding_score: -8.5,
    total_score: 0.756,
    admet: { qed: 0.82, admet_score: 0.65 }
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header primary">分子详情 #{id}</div>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
            <div>
              <img src={mockMolecule.png_path} alt="molecule" style={{ width: '100%', borderRadius: 10 }} />
              <div style={{ marginTop: 12 }}>
                <span className="badge badge-success">QED {mockMolecule.druglikeness}</span>
              </div>
            </div>
            
            <div>
              <h3>{mockMolecule.target} — {mockMolecule.disease}</h3>
              <div style={{ marginBottom: 16 }}>
                <strong>SMILES:</strong><br/>
                <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: 4, fontSize: 13 }}>
                  {mockMolecule.smiles}
                </code>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <strong>目标信息:</strong><br/>
                UniProt ID: {mockMolecule.uniprot_id}<br/>
                PDB ID: {mockMolecule.pdb_id}
              </div>
              
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-success">结合评分 {mockMolecule.binding_score}</span>
                <span className="badge badge-warning">ADMET {mockMolecule.admet.admet_score}</span>
                <span className="badge" style={{ background: '#e0e7ff', color: '#1e3a8a' }}>
                  总分 {mockMolecule.total_score}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header info">3D 结构查看器</div>
        <div style={{ padding: 20, textAlign: 'center', color: '#64748b' }}>
          <p>3D分子结构查看器将显示在这里</p>
          <p>(实际应用中会集成分子3D可视化组件)</p>
        </div>
      </div>
    </div>
  )
}