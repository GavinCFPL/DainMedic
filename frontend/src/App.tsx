import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NewJob from './pages/NewJob'
import JobDetail from './pages/JobDetail'
import MoleculeDetail from './pages/MoleculeDetail'
import AuthGuard from './components/AuthGuard'

const Header = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const logout = () => { localStorage.removeItem('token'); navigate('/login') }
  return (
    <div className="header">
      <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div className="brand">
          <Link to="/" style={{color:'#fff'}}>戴恩医药 DainMedic · 分子生成</Link>
        </div>
        <div className="nav" style={{display:'flex', alignItems:'center', gap:16}}>
          {token ? (
            <>
              <Link to="/" style={{color:'#fff'}}>控制台</Link>
              <Link to="/new" style={{color:'#fff'}}>新建任务</Link>
              <button className="btn" onClick={logout}>退出</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{color:'#fff'}}>登录</Link>
              <Link to="/register" style={{color:'#fff'}}>注册</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App(){
  return (
    <>
      <Header/>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<AuthGuard><Dashboard/></AuthGuard>}/>
          <Route path="/new" element={<AuthGuard><NewJob/></AuthGuard>}/>
          <Route path="/jobs/:id" element={<AuthGuard><JobDetail/></AuthGuard>}/>
          <Route path="/molecules/:id" element={<AuthGuard><MoleculeDetail/></AuthGuard>}/>
        </Routes>
      </div>
      <div className="footer">© {new Date().getFullYear()} 戴恩医药 DainMedic</div>
    </>
  )
}