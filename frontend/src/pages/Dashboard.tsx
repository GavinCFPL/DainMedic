import React from 'react'
import MoleculeCard from '../components/MoleculeCard'

const mockMolecules = [
  {
    id: 1,
    target: 'EGFR',
    disease: '肺癌',
    uniprot_id: 'P00533',
    pdb_id: '1M17',
    smiles: 'CCc1ccc2ncnc(Nc3ccc(F)c(Cl)c3)c2c1',
    png_path: '/api/placeholder/160/120',
    druglikeness: 0.82,
    binding_score: -8.5,
    total_score: 0.756,
    admet: { qed: 0.82, admet_score: 0.65 }
  },
  {
    id: 2,
    target: 'CDK4',
    disease: '乳腺癌',
    uniprot_id: 'P11802',
    pdb_id: '2W96',
    smiles: 'CC(C)c1ccc(C(=O)Nc2ccc3nc(C)cc(C)c3c2)cc1',
    png_path: '/api/placeholder/160/120',
    druglikeness: 0.45,
    binding_score: -7.2,
    total_score: 0.623,
    admet: { qed: 0.45, admet_score: 0.58 }
  }
]

export default function Dashboard() {
  return (
    <div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header primary">控制台</div>
        <div style={{ padding: 20 }}>
          <h3>欢迎使用戴恩医药分子生成平台</h3>
          <p>这里显示您的任务概览和最新生成的分子。</p>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header info">最新分子</div>
        <div style={{ padding: 16 }}>
          <div className="grid">
            {mockMolecules.map(mol => (
              <MoleculeCard key={mol.id} mol={mol} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}