import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * This page handles the redirect from the backend after Google OAuth2 login.
 * URL: /auth/callback?token=<jwt>
 */
export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    login(token)
      .then((user) => {
        const destination =
          user?.role === 'ADMIN' ? '/admin'
          : user?.role === 'TECHNICIAN' ? '/dashboard'
          : '/my-tickets'
        navigate(destination, { replace: true })
      })
      .catch(() => navigate('/login', { replace: true }))
  }, [])

  return (
    <div style={styles.center}>
      <p style={styles.text}>Signing you in...</p>
    </div>
  )
}

const styles = {
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
  },
}
