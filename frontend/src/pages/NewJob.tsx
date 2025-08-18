import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NewJob() {
  const navigate = useNavigate()
  const [target, setTarget] = useState('')
  const [disease, setDisease] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock job creation - in real app would call API
    alert('任务创建成功！')
    navigate('/')
  }

  return (
    <div>
      <div className="card">
        <div className="card-header success">创建新任务</div>
        <form onSubmit={handleSubmit} style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>目标蛋白</label>
            <input
              className="input"
              type="text"
              placeholder="例如: EGFR, CDK4, etc."
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
            />
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>疾病类型</label>
            <input
              className="input"
              type="text"
              placeholder="例如: 肺癌, 乳腺癌, etc."
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>任务描述</label>
            <textarea
              className="input"
              rows={4}
              placeholder="描述您的分子生成需求..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn" type="submit">创建任务</button>
            <button className="btn ghost" type="button" onClick={() => navigate('/')}>取消</button>
          </div>
        </form>
      </div>
    </div>
  )
}