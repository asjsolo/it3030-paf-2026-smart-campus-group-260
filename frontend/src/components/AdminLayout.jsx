import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationPanel from './NotificationPanel'

export default function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      textDecoration: 'none',
      color: isActive ? '#64b5f6' : '#bbb',
      backgroundColor: isActive ? 'rgba(100, 181, 246, 0.15)' : 'transparent',
      borderRadius: '8px',
      fontWeight: isActive ? '600' : '500',
      transition: 'all 0.2s ease',
      marginBottom: '8px',
      fontSize: '0.95rem',
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: '260px',
        backgroundColor: '#1a1a2e',
        borderRight: '1px solid #333',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        <div style={{ padding: '0 16px 32px 16px' }}>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏛️</span> SmartCampus
          </h2>
          {user && (
            <div style={{ marginTop: 12, fontSize: '0.85rem', color: '#ccc' }}>
              {user.name} · <span style={{ color: '#64b5f6' }}>ADMIN</span>
            </div>
          )}
        </div>

        <nav style={{ flex: 1 }}>
          <div style={{
            fontSize: '0.7rem', fontWeight: '700', color: '#888',
            textTransform: 'uppercase', letterSpacing: '0.5px',
            marginBottom: '12px', paddingLeft: '16px',
          }}>
            Management
          </div>
          <Link to="/admin" style={getLinkStyle('/admin')}>
            👥 User Management
          </Link>
          <Link to="/admin/resources" style={getLinkStyle('/admin/resources')}>
            📦 Resource Management
          </Link>

          <div style={{
            fontSize: '0.7rem', fontWeight: '700', color: '#888',
            textTransform: 'uppercase', letterSpacing: '0.5px',
            margin: '20px 0 12px', paddingLeft: '16px',
          }}>
            Campus
          </div>
          <Link to="/campus" style={getLinkStyle('/campus')}>
            🏫 Campus Dashboard
          </Link>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              color: '#ff6b6b',
              backgroundColor: 'transparent',
              borderRadius: '8px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.95rem',
              width: '100%',
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', backgroundColor: '#f0f2f5' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <NotificationPanel />
        </div>
        {children}
      </main>
    </div>
  )
}
