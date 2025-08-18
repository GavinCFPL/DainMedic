import React from 'react'
import { Link } from 'react-router-dom'

export default function MoleculeCard({ mol }:{mol:any}){
  const qed = typeof mol.druglikeness === 'number' ? mol.druglikeness : (mol.admet?.qed ?? undefined)
  const qedVal = typeof qed === 'number' ? Number(qed.toFixed(2)) : undefined
  const badgeClass = qedVal !== undefined ? (qedVal >= 0.7 ? 'badge-success' : (qedVal >= 0.5 ? 'badge-warning' : 'badge-danger')) : 'badge-warning'

  return (
    <div className="card" style={{padding:12}}>
      <div style={{display:'flex', gap:12}}>
        <div style={{position:'relative', width:160}}>
          {mol.png_path && <img className="mol-img" src={mol.png_path} alt="mol"/>}
          {qedVal !== undefined && (
            <span className={`badge badge-qed ${badgeClass}`}>QED {qedVal}</span>
          )}
        </div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700, marginBottom:4}}>{mol.target} — {mol.disease}</div>
          <div style={{fontSize:13, color:'#64748b', marginBottom:6}}>UniProt {mol.uniprot_id || '-'} | PDB {mol.pdb_id || '-'}</div>
          <div style={{fontSize:13, marginBottom:6}}>SMILES：<code>{mol.smiles}</code></div>
          <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:8}}>
            {typeof mol.binding_score === 'number' && <span className="badge badge-success">Binding {mol.binding_score.toFixed(2)}</span>}
            {mol.admet?.admet_score !== undefined && <span className="badge badge-warning">ADMET {Number(mol.admet.admet_score).toFixed(2)}</span>}
            {typeof mol.total_score === 'number' && <span className="badge" style={{background:'#e0e7ff', color:'#1e3a8a'}}>总分 {mol.total_score.toFixed(3)}</span>}
          </div>
          <div style={{marginTop:8}}>
            <Link className="btn" to={`/molecules/${mol.id}`}>查看详情</Link>
          </div>
        </div>
      </div>
    </div>
  )
}