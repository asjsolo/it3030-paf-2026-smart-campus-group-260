import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationPanel from './NotificationPanel'

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const role = user?.role

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
      }}>
        <div style={{ padding: '0 16px 32px 16px' }}>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>🎓</span> SmartCampus
          </h2>
          {user && (
            <div style={{ marginTop: 12, fontSize: '0.85rem', color: '#ccc' }}>
              {user.name} · <span style={{ color: '#64b5f6' }}>{role}</span>
            </div>
          )}
        </div>

        <nav style={{ flex: 1 }}>
          {role === 'TECHNICIAN' && (
            <Link to="/dashboard" style={getLinkStyle('/dashboard')}>
              📊 Master Dashboard
            </Link>
          )}

          {role === 'USER' && (
            <>
              <Link to="/my-tickets" style={getLinkStyle('/my-tickets')}>
                🗂️ My Tickets
              </Link>
              <Link to="/create-ticket" style={getLinkStyle('/create-ticket')}>
                📝 Create a Ticket
              </Link>
            </>
          )}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={handleLogout}
            style={{
              ...getLinkStyle('#logout'),
              width: '100%',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              color: '#ff6b6b',
              fontFamily: 'inherit',
              fontSize: '1rem',
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
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

    </div>
  )
}
