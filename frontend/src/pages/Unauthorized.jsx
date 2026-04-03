import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Unauthorized() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>🚫</div>
        <h2 style={styles.title}>Access Denied</h2>
        <p style={styles.desc}>
          You don't have permission to view this page.
        </p>
        <button
          style={styles.btn}
          onClick={() => navigate(user?.role === 'ADMIN' ? '/admin' : '/dashboard')}
        >
          Go to Dashboard
        </button>
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
  btn: {
    padding: '10px 24px',
    background: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
  },
}
