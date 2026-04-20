import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  getAllUsers,
  updateUserRole,
  createUser,
  updateUser,
  toggleUserActive,
} from '../services/api'

const ROLE_OPTIONS = ['USER', 'STAFF', 'TECHNICIAN', 'ADMIN']
const EDITABLE_ROLES = ['USER', 'STAFF', 'TECHNICIAN']

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'STAFF' })
  const [creating, setCreating] = useState(false)

  // Modal state: { mode: 'view' | 'edit', data: user } or null
  const [modal, setModal] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getAllUsers()
      .then((res) => setUsers(res.data))
      .catch(() => setMessage('Failed to load users.'))
      .finally(() => setLoadingUsers(false))
  }, [])

  const showToast = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3500)
  }

  const handleRoleChange = (id, newRole) => {
    updateUserRole(id, newRole)
      .then((res) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? res.data : u)))
        showToast('Role updated.')
      })
      .catch(() => showToast('Failed to update role.'))
  }

  const handleNewUserChange = (e) => {
    setNewUser((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    if (!newUser.name || !newUser.email || !newUser.password) {
      setError('All fields are required.')
      return
    }
    if (newUser.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setCreating(true)
    try {
      const res = await createUser(newUser)
      setUsers((prev) => [...prev, res.data])
      showToast(`${res.data.role} account created for ${res.data.email}`)
      setNewUser({ name: '', email: '', password: '', role: 'STAFF' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user. Email may already be in use.')
    } finally {
      setCreating(false)
    }
  }

  const openView = (u) => setModal({ mode: 'view', data: u })

  const openEdit = (u) => {
    setEditForm({ name: u.name, email: u.email, role: u.role, password: '' })
    setModal({ mode: 'edit', data: u })
    setError('')
  }

  const closeModal = () => {
    setModal(null)
    setEditForm(null)
    setError('')
  }

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editForm.name || !editForm.email) {
      setError('Name and email are required.')
      return
    }
    if (editForm.password && editForm.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setSaving(true)
    try {
      const res = await updateUser(modal.data.id, editForm)
      setUsers((prev) => prev.map((u) => (u.id === modal.data.id ? res.data : u)))
      showToast('User updated.')
      closeModal()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = (u) => {
    const action = u.active ? 'deactivate' : 'activate'
    if (!window.confirm(`Are you sure you want to ${action} ${u.name}?`)) return
    toggleUserActive(u.id)
      .then((res) => {
        setUsers((prev) => prev.map((x) => (x.id === u.id ? res.data : x)))
        showToast(`Account ${res.data.active ? 'activated' : 'deactivated'}.`)
      })
      .catch(() => showToast('Failed to change account status.'))
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
          <StatCard label="Total" value={users.length} icon="👥" />
          <StatCard label="Admins" value={users.filter((u) => u.role === 'ADMIN').length} icon="🛡️" />
          <StatCard label="Staff" value={users.filter((u) => u.role === 'STAFF').length} icon="💼" />
          <StatCard label="Technicians" value={users.filter((u) => u.role === 'TECHNICIAN').length} icon="🔧" />
          <StatCard label="Users" value={users.filter((u) => u.role === 'USER').length} icon="🎓" />
        </div>

        {/* Create Staff / Technician form */}
        <div style={styles.createCard}>
          <h3 style={styles.tableTitle}>Create Staff or Technician Account</h3>
          {error && !modal && <div style={styles.errorBox}>{error}</div>}
          <form onSubmit={handleCreateUser} style={styles.createForm}>
            <input style={styles.input} type="text" name="name" placeholder="Full name"
                   value={newUser.name} onChange={handleNewUserChange} />
            <input style={styles.input} type="email" name="email" placeholder="Email address"
                   value={newUser.email} onChange={handleNewUserChange} />
            <input style={styles.input} type="password" name="password" placeholder="Password (min. 6)"
                   value={newUser.password} onChange={handleNewUserChange} />
            <select style={styles.input} name="role" value={newUser.role} onChange={handleNewUserChange}>
              <option value="STAFF">Staff</option>
              <option value="TECHNICIAN">Technician</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button style={styles.createBtn} type="submit" disabled={creating}>
              {creating ? 'Creating…' : 'Create Account'}
            </button>
          </form>
        </div>

        <div style={styles.tableCard}>
          <h3 style={styles.tableTitle}>User Management</h3>
          {loadingUsers ? (
            <p style={styles.loading}>Loading users...</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isAdmin = u.role === 'ADMIN'
                  return (
                    <tr key={u.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                          {u.picture && <img src={u.picture} alt="" style={styles.miniAvatar} />}
                          {u.name}
                        </div>
                      </td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.rolePill, ...rolePillColor(u.role) }}>{u.role}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusPill,
                          background: u.active ? '#e8f5e9' : '#fdecea',
                          color: u.active ? '#27ae60' : '#c0392b',
                        }}>
                          {u.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {isAdmin ? (
                          <span style={styles.noActions}>—</span>
                        ) : (
                          <div style={styles.actions}>
                            <button style={styles.btnView} onClick={() => openView(u)}>View</button>
                            <button style={styles.btnEdit} onClick={() => openEdit(u)}>Edit</button>
                            <button
                              style={u.active ? styles.btnDeactivate : styles.btnActivate}
                              onClick={() => handleToggleActive(u)}
                            >
                              {u.active ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* View / Edit Modal */}
      {modal && (
        <div style={styles.backdrop} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {modal.mode === 'view' ? 'User Details' : 'Edit User'}
              </h3>
              <button style={styles.closeBtn} onClick={closeModal}>✕</button>
            </div>

            {modal.mode === 'view' ? (
              <div style={styles.viewBody}>
                <Row label="Name" value={modal.data.name} />
                <Row label="Email" value={modal.data.email} />
                <Row label="Role">
                  <span style={{ ...styles.rolePill, ...rolePillColor(modal.data.role) }}>
                    {modal.data.role}
                  </span>
                </Row>
                <Row label="Status">
                  <span style={{
                    ...styles.statusPill,
                    background: modal.data.active ? '#e8f5e9' : '#fdecea',
                    color: modal.data.active ? '#27ae60' : '#c0392b',
                  }}>
                    {modal.data.active ? 'Active' : 'Inactive'}
                  </span>
                </Row>
                <Row label="ID" value={modal.data.id} />
              </div>
            ) : (
              <form onSubmit={handleSaveEdit} style={styles.editBody}>
                {error && <div style={styles.errorBox}>{error}</div>}
                <label style={styles.label}>Name</label>
                <input style={styles.input} name="name" value={editForm.name} onChange={handleEditChange} />
                <label style={styles.label}>Email</label>
                <input style={styles.input} name="email" type="email" value={editForm.email} onChange={handleEditChange} />
                <label style={styles.label}>Role</label>
                <select style={styles.input} name="role" value={editForm.role} onChange={handleEditChange}>
                  {EDITABLE_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <label style={styles.label}>New password (leave blank to keep)</label>
                <input style={styles.input} name="password" type="password"
                       placeholder="Optional" value={editForm.password} onChange={handleEditChange} />
                <div style={styles.modalActions}>
                  <button type="button" style={styles.btnCancel} onClick={closeModal}>Cancel</button>
                  <button type="submit" style={styles.btnSave} disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, children }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowLabel}>{label}</span>
      <span style={styles.rowValue}>{children ?? value}</span>
    </div>
  )
}

function rolePillColor(role) {
  switch (role) {
    case 'ADMIN':      return { background: '#0f3460', color: '#fff' }
    case 'STAFF':      return { background: '#fff3e0', color: '#e67e22' }
    case 'TECHNICIAN': return { background: '#e8f5e9', color: '#27ae60' }
    default:           return { background: '#e8f0fe', color: '#1a73e8' }
  }
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
    background: '#1a1a2e', padding: '0 32px', height: 64,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  navBrand: { color: '#fff', fontSize: 18, fontWeight: 700 },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  avatar: { width: 36, height: 36, borderRadius: '50%', border: '2px solid #e84393' },
  navName: { color: '#ccc', fontSize: 14 },
  adminBadge: {
    background: '#e84393', color: '#fff', fontSize: 10, fontWeight: 700,
    padding: '3px 8px', borderRadius: 99, letterSpacing: 1,
  },
  logoutBtn: {
    background: 'transparent', border: '1px solid #555', color: '#ccc',
    padding: '6px 14px', borderRadius: 6, fontSize: 13, cursor: 'pointer',
  },
  main: { padding: '40px 32px', maxWidth: 1200, margin: '0 auto' },
  heading: { fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 24 },
  toast: {
    background: '#d4edda', color: '#155724', padding: '10px 16px',
    borderRadius: 8, marginBottom: 20, fontSize: 14,
  },
  statsRow: { display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' },
  statCard: {
    background: '#fff', borderRadius: 12, padding: '20px 24px',
    display: 'flex', alignItems: 'center', gap: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flex: '1 1 160px',
  },
  statIcon: { fontSize: 32 },
  statValue: { fontSize: 28, fontWeight: 700, color: '#1a1a2e' },
  statLabel: { fontSize: 13, color: '#888' },
  tableCard: {
    background: '#fff', borderRadius: 12, padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto',
  },
  createCard: {
    background: '#fff', borderRadius: 12, padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 28,
  },
  createForm: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12, alignItems: 'center',
  },
  input: {
    padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 7,
    fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box', width: '100%',
  },
  createBtn: {
    padding: '10px 16px', background: '#0f3460', color: '#fff',
    border: 'none', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  errorBox: {
    background: '#fff0f0', border: '1px solid #ffcccc', color: '#c0392b',
    borderRadius: 6, padding: '8px 12px', fontSize: 13, marginBottom: 12,
  },
  tableTitle: { fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 },
  loading: { color: '#888', fontSize: 14 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left', padding: '10px 14px', fontSize: 12, fontWeight: 700,
    color: '#888', textTransform: 'uppercase', letterSpacing: 0.5,
    borderBottom: '2px solid #f0f2f5',
  },
  tr: { borderBottom: '1px solid #f0f2f5' },
  td: { padding: '12px 14px', fontSize: 14, color: '#333' },
  userCell: { display: 'flex', alignItems: 'center', gap: 10 },
  miniAvatar: { width: 28, height: 28, borderRadius: '50%' },
  rolePill: {
    padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600,
    display: 'inline-block',
  },
  statusPill: {
    padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600,
    display: 'inline-block',
  },
  actions: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  noActions: { color: '#bbb', fontSize: 13 },
  btnView: {
    padding: '5px 10px', background: '#e8f0fe', color: '#1a73e8',
    border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: 'pointer',
  },
  btnEdit: {
    padding: '5px 10px', background: '#fff3e0', color: '#e67e22',
    border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: 'pointer',
  },
  btnDeactivate: {
    padding: '5px 10px', background: '#fdecea', color: '#c0392b',
    border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: 'pointer',
  },
  btnActivate: {
    padding: '5px 10px', background: '#e8f5e9', color: '#27ae60',
    border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: 'pointer',
  },

  // Modal
  backdrop: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  modal: {
    background: '#fff', borderRadius: 12, width: '90%', maxWidth: 480,
    padding: '24px 28px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: { fontSize: 18, fontWeight: 700, color: '#1a1a2e' },
  closeBtn: {
    background: 'transparent', border: 'none', fontSize: 18, color: '#888',
    cursor: 'pointer',
  },
  viewBody: { display: 'flex', flexDirection: 'column', gap: 10 },
  row: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 0', borderBottom: '1px solid #f0f2f5',
  },
  rowLabel: { fontSize: 13, color: '#888', fontWeight: 600 },
  rowValue: { fontSize: 14, color: '#222' },
  editBody: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 12, color: '#888', fontWeight: 600, marginTop: 6 },
  modalActions: {
    display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16,
  },
  btnCancel: {
    padding: '9px 16px', background: '#f0f2f5', color: '#555',
    border: 'none', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  btnSave: {
    padding: '9px 16px', background: '#0f3460', color: '#fff',
    border: 'none', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
}
