import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser, registerUser } from '../services/api'

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('signin') // 'signin' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      const dest =
        user.role === 'ADMIN' ? '/admin'
        : user.role === 'TECHNICIAN' ? '/dashboard'
        : '/my-tickets'
      navigate(dest, { replace: true })
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Email and password are required.')
      return
    }
    setLoading(true)
    try {
      const res = await loginUser({ email: form.email, password: form.password })
      await login(res.data.token)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const res = await registerUser({ name: form.name, email: form.email, password: form.password })
      await login(res.data.token)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email may already be in use.')
    } finally {
      setLoading(false)
    }
  }

  const switchTab = (t) => {
    setTab(t)
    setError('')
    setForm({ name: '', email: '', password: '', confirm: '' })
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🏛️</div>
        <h1 style={styles.title}>Smart Campus</h1>
        <p style={styles.subtitle}>Operations Hub</p>

        {/* Tab switcher */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(tab === 'signin' ? styles.tabActive : {}) }}
            onClick={() => switchTab('signin')}
          >
            Sign In
          </button>
          <button
            style={{ ...styles.tab, ...(tab === 'signup' ? styles.tabActive : {}) }}
            onClick={() => switchTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {tab === 'signin' ? (
          <form onSubmit={handleSignIn} style={styles.form}>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button style={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} style={styles.form}>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Password (min. 6 characters)"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <input
              style={styles.input}
              type="password"
              name="confirm"
              placeholder="Confirm password"
              value={form.confirm}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button style={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        )}

        <div style={styles.divider}>
          <span style={styles.dividerText}>or</span>
        </div>

        <button style={styles.googleBtn} onClick={() => { window.location.href = '/oauth2/authorization/google' }}>
          <GoogleIcon />
          Continue with Google
        </button>

        <p style={styles.footer}>
          New users are assigned the <strong>User</strong> role by default.
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: 10 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '40px 40px 32px',
    maxWidth: 420,
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  logo: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: 700, color: '#1a1a2e', marginBottom: 2 },
  subtitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#0f3460',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 24,
  },
  tabs: {
    display: 'flex',
    borderRadius: 8,
    border: '1px solid #e0e0e0',
    overflow: 'hidden',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: '10px 0',
    border: 'none',
    background: '#f9f9f9',
    fontSize: 14,
    fontWeight: 600,
    color: '#888',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: '#0f3460',
    color: '#fff',
  },
  error: {
    background: '#fff0f0',
    border: '1px solid #ffcccc',
    color: '#c0392b',
    borderRadius: 6,
    padding: '8px 12px',
    fontSize: 13,
    marginBottom: 14,
    textAlign: 'left',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #e0e0e0',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    background: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 4,
    transition: 'background 0.2s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '18px 0',
    gap: 10,
  },
  dividerText: {
    color: '#bbb',
    fontSize: 13,
    flex: 1,
    textAlign: 'center',
    borderTop: '1px solid #e0e0e0',
    lineHeight: 0,
    position: 'relative',
    top: 0,
  },
  googleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '11px 20px',
    background: '#fff',
    border: '1.5px solid #e0e0e0',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: 20,
  },
  footer: {
    color: '#999',
    fontSize: 12,
    lineHeight: 1.7,
    marginTop: 0,
  },
}
