import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
      color: isActive ? 'var(--primary-accent)' : 'var(--text-muted)',
      backgroundColor: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
      borderRadius: 'var(--radius-sm)',
      fontWeight: isActive ? '600' : '500',
      transition: 'all 0.2s ease',
      marginBottom: '8px',
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
        backgroundColor: 'var(--surface-color)',
        borderRight: '1px solid var(--glass-border)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '0 16px 32px 16px' }}>
          <h2 style={{ color: 'var(--primary-accent)', margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>🎓</span> SmartCampus
          </h2>
          {user && (
            <div style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {user.name} · <span style={{ color: 'var(--primary-accent)' }}>{role}</span>
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
              color: '#EF4444',
              fontFamily: 'inherit',
              fontSize: '1rem',
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

    </div>
  )
}
