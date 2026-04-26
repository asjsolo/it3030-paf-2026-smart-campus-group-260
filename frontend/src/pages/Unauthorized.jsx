import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Unauthorized() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const goHome = () => {
    const dest =
      user?.role === 'ADMIN' ? '/admin'
      : user?.role === 'TECHNICIAN' ? '/dashboard'
      : '/my-tickets'
    navigate(dest, { replace: true })
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>🚫</div>
        <h2 style={styles.title}>Access Denied</h2>
        <p style={styles.desc}>
          You don't have permission to view this page.
        </p>
        <div style={styles.actions}>
          <button style={styles.btnPrimary} onClick={goHome}>
            Go to My Dashboard
          </button>
          <button style={styles.btnSecondary} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f2f5',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '48px 40px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    maxWidth: 380,
  },
  icon: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 },
  desc: { color: '#888', fontSize: 14, marginBottom: 24 },
  actions: { display: 'flex', flexDirection: 'column', gap: 10 },
  btnPrimary: {
    padding: '10px 24px',
    background: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '10px 24px',
    background: 'transparent',
    color: '#c0392b',
    border: '1.5px solid #c0392b',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
}
