import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock registration - in real app would call API
    localStorage.setItem('token', 'mock-token')
    navigate('/')
  }

  return (
    <div className="container" style={{maxWidth: 400, margin: '40px auto'}}>
      <div className="card">
        <div className="card-header primary">用户注册</div>
        <form onSubmit={handleRegister} style={{padding: 20}}>
          <input
            className="input"
            type="text"
            placeholder="姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="邮箱地址"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn" type="submit" style={{width: '100%'}}>注册</button>
        </form>
      </div>
    </div>
  )
}