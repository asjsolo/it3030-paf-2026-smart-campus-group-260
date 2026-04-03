import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getAllUsers, updateUserRole } from '../services/api'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    getAllUsers()
      .then((res) => setUsers(res.data))
      .catch(() => setMessage('Failed to load users.'))
      .finally(() => setLoadingUsers(false))
  }, [])

  const handleRoleChange = (id, newRole) => {
    updateUserRole(id, newRole)
      .then((res) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? res.data : u)))
        setMessage(`Role updated successfully.`)
        setTimeout(() => setMessage(''), 3000)
      })
      .catch(() => setMessage('Failed to update role.'))
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.navBrand}>🏛️ Smart Campus — Admin</span>
        <div style={styles.navRight}>
          <img src={user?.picture} alt="avatar" style={styles.avatar} />
          <span style={styles.navName}>{user?.name}</span>
          <span style={styles.adminBadge}>ADMIN</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main style={styles.main}>
        <h2 style={styles.heading}>Admin Dashboard</h2>

        {message && <div style={styles.toast}>{message}</div>}

        <div style={styles.statsRow}>
          <StatCard label="Total Users" value={users.length} icon="👥" />
          <StatCard
            label="Admins"
            value={users.filter((u) => u.role === 'ADMIN').length}
            icon="🛡️"
          />
          <StatCard
            label="Regular Users"
            value={users.filter((u) => u.role === 'USER').length}
            icon="🎓"
          />
        </div>

        <div style={styles.tableCard}>
          <h3 style={styles.tableTitle}>User Management</h3>
          {loadingUsers ? (
            <p style={styles.loading}>Loading users...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Role', 'Actions'].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        {u.picture && (
                          <img src={u.picture} alt="" style={styles.miniAvatar} />
                        )}
                        {u.name}
                      </div>
                    </td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.rolePill,
                        background: u.role === 'ADMIN' ? '#0f3460' : '#e8f0fe',
                        color: u.role === 'ADMIN' ? '#fff' : '#1a73e8',
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {u.id !== user?.id && (
                        <select
                          style={styles.select}
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div style={styles.statCard}>
      <span style={styles.statIcon}>{icon}</span>
      <div>
        <div style={styles.statValue}>{value}</div>
        <div style={styles.statLabel}>{label}</div>
      </div>
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
  navBrand: { color: '#fff', fontSize: 18, fontWeight: 700 },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  avatar: { width: 36, height: 36, borderRadius: '50%', border: '2px solid #e84393' },
  navName: { color: '#ccc', fontSize: 14 },
  adminBadge: {
    background: '#e84393',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 99,
    letterSpacing: 1,
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #555',
    color: '#ccc',
    padding: '6px 14px',
    borderRadius: 6,
    fontSize: 13,
  },
  main: { padding: '40px 32px', maxWidth: 1100, margin: '0 auto' },
  heading: { fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 24 },
  toast: {
    background: '#d4edda',
    color: '#155724',
    padding: '10px 16px',
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 14,
  },
  statsRow: { display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' },
  statCard: {
    background: '#fff',
    borderRadius: 12,
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    flex: '1 1 160px',
  },
  statIcon: { fontSize: 32 },
  statValue: { fontSize: 28, fontWeight: 700, color: '#1a1a2e' },
  statLabel: { fontSize: 13, color: '#888' },
  tableCard: {
    background: '#fff',
    borderRadius: 12,
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    overflowX: 'auto',
  },
  tableTitle: { fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 },
  loading: { color: '#888', fontSize: 14 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left',
    padding: '10px 14px',
    fontSize: 12,
    fontWeight: 700,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottom: '2px solid #f0f2f5',
  },
  tr: { borderBottom: '1px solid #f0f2f5' },
  td: { padding: '12px 14px', fontSize: 14, color: '#333' },
  userCell: { display: 'flex', alignItems: 'center', gap: 10 },
  miniAvatar: { width: 28, height: 28, borderRadius: '50%' },
  rolePill: {
    padding: '3px 10px',
    borderRadius: 99,
    fontSize: 12,
    fontWeight: 600,
  },
  select: {
    padding: '5px 10px',
    borderRadius: 6,
    border: '1px solid #ddd',
    fontSize: 13,
    background: '#fafafa',
  },
}
