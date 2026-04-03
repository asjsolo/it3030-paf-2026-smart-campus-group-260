import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.navBrand}>🏛️ Smart Campus</span>
        <div style={styles.navRight}>
          <img src={user?.picture} alt="avatar" style={styles.avatar} />
          <span style={styles.navName}>{user?.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.welcomeCard}>
          <h2 style={styles.welcome}>Welcome back, {user?.name?.split(' ')[0]}!</h2>
          <p style={styles.role}>
            Role: <span style={styles.roleBadge}>{user?.role}</span>
          </p>
        </div>

        <div style={styles.grid}>
          <DashboardCard
            icon="🏢"
            title="Room Booking"
            description="Book lecture rooms, seminar halls, and common spaces."
            action="Browse Rooms"
          />
          <DashboardCard
            icon="🔬"
            title="Lab Reservation"
            description="Reserve laboratory equipment and computer labs."
            action="Browse Labs"
          />
          <DashboardCard
            icon="🔧"
            title="Report Fault"
            description="Report maintenance issues and track their resolution."
            action="Report Issue"
          />
          <DashboardCard
            icon="📋"
            title="My Bookings"
            description="View and manage your active reservations."
            action="View Bookings"
          />
        </div>
      </main>
    </div>
  )
}

function DashboardCard({ icon, title, description, action }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardIcon}>{icon}</div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardDesc}>{description}</p>
      <button style={styles.cardBtn}>{action}</button>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#f0f2f5' },
  nav: {
    background: '#1a1a2e',
    padding: '0 32px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  navBrand: { color: '#fff', fontSize: 20, fontWeight: 700 },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  avatar: { width: 36, height: 36, borderRadius: '50%', border: '2px solid #0f3460' },
  navName: { color: '#ccc', fontSize: 14 },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #555',
    color: '#ccc',
    padding: '6px 14px',
    borderRadius: 6,
    fontSize: 13,
  },
  main: { padding: '40px 32px', maxWidth: 1100, margin: '0 auto' },
  welcomeCard: {
    background: '#fff',
    borderRadius: 12,
    padding: '24px 28px',
    marginBottom: 28,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  welcome: { fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 },
  role: { color: '#666', fontSize: 14 },
  roleBadge: {
    background: '#0f3460',
    color: '#fff',
    padding: '2px 10px',
    borderRadius: 99,
    fontSize: 12,
    fontWeight: 600,
    marginLeft: 4,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 20,
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  cardIcon: { fontSize: 36 },
  cardTitle: { fontSize: 17, fontWeight: 700, color: '#1a1a2e' },
  cardDesc: { fontSize: 13, color: '#888', lineHeight: 1.5, flex: 1 },
  cardBtn: {
    marginTop: 8,
    padding: '9px 16px',
    background: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 600,
  },
}
