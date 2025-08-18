import React from 'react'
import { useParams } from 'react-router-dom'

export default function JobDetail() {
  const { id } = useParams()

  return (
    <div>
      <div className="card">
        <div className="card-header info">任务详情 #{id}</div>
        <div style={{ padding: 20 }}>
          <p>任务详情页面 - 这里会显示任务的执行状态、生成的分子等信息。</p>
          <p>任务ID: {id}</p>
        </div>
      </div>
    </div>
  )
}