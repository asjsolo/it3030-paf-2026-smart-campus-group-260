import { useEffect, useState } from 'react'
import {
  getAllUsers,
  updateUserRole,
  createUser,
  updateUser,
  toggleUserActive,
} from '../services/api'

const EDITABLE_ROLES = ['USER', 'TECHNICIAN']

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'TECHNICIAN' })
  const [creating, setCreating] = useState(false)
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
      setNewUser({ name: '', email: '', password: '', role: 'TECHNICIAN' })
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

  return (
    <>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 24 }}>User Management</h2>

        {message && (
          <div style={{ background: '#d4edda', color: '#155724', padding: '10px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
          <StatCard label="Total" value={users.length} icon="👥" />
          <StatCard label="Admins" value={users.filter((u) => u.role === 'ADMIN').length} icon="🛡️" />
          <StatCard label="Technicians" value={users.filter((u) => u.role === 'TECHNICIAN').length} icon="🔧" />
          <StatCard label="Students" value={users.filter((u) => u.role === 'USER').length} icon="🎓" />
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 28 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>Create Technician or Student Account</h3>
          {error && !modal && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#c0392b', borderRadius: 6, padding: '8px 12px', fontSize: 13, marginBottom: 12 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleCreateUser} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, alignItems: 'center' }}>
            <input style={inputStyle} type="text" name="name" placeholder="Full name" value={newUser.name} onChange={handleNewUserChange} />
            <input style={inputStyle} type="email" name="email" placeholder="Email address" value={newUser.email} onChange={handleNewUserChange} />
            <input style={inputStyle} type="password" name="password" placeholder="Password (min. 6)" value={newUser.password} onChange={handleNewUserChange} />
            <select style={inputStyle} name="role" value={newUser.role} onChange={handleNewUserChange}>
              <option value="TECHNICIAN">Technician</option>
              <option value="USER">Student</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button style={{ padding: '10px 16px', background: '#0f3460', color: '#fff', border: 'none', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: 'pointer' }} type="submit" disabled={creating}>
              {creating ? 'Creating…' : 'Create Account'}
            </button>
          </form>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>All Users</h3>
          {loadingUsers ? (
            <p style={{ color: '#888', fontSize: 14 }}>Loading users...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '2px solid #f0f2f5' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isAdmin = u.role === 'ADMIN'
                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f0f2f5' }}>
                      <td style={{ padding: '12px 14px', fontSize: 14, color: '#333' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {u.picture && <img src={u.picture} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />}
                          {u.name}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 14, color: '#333' }}>{u.email}</td>
                      <td style={{ padding: '12px 14px', fontSize: 14, color: '#333' }}>
                        <span style={{ ...pillBase, ...rolePillColor(u.role) }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 14, color: '#333' }}>
                        <span style={{
                          ...pillBase,
                          background: u.active ? '#e8f5e9' : '#fdecea',
                          color: u.active ? '#27ae60' : '#c0392b',
                        }}>
                          {u.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 14, color: '#333' }}>
                        {isAdmin ? (
                          <span style={{ color: '#bbb', fontSize: 13 }}>—</span>
                        ) : (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <button style={{ padding: '5px 10px', background: '#e8f0fe', color: '#1a73e8', border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: 'pointer' }} onClick={() => openView(u)}>View</button>
                            <button style={{ padding: '5px 10px', background: '#fff3e0', color: '#e67e22', border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: 'pointer' }} onClick={() => openEdit(u)}>Edit</button>
                            <button
                              style={{ padding: '5px 10px', background: u.active ? '#fdecea' : '#e8f5e9', color: u.active ? '#c0392b' : '#27ae60', border: 'none', borderRadius: 5, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
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
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={closeModal}>
          <div style={{ background: '#fff', borderRadius: 12, width: '90%', maxWidth: 480, padding: '24px 28px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>
                {modal.mode === 'view' ? 'User Details' : 'Edit User'}
              </h3>
              <button style={{ background: 'transparent', border: 'none', fontSize: 18, color: '#888', cursor: 'pointer' }} onClick={closeModal}>✕</button>
            </div>

            {modal.mode === 'view' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Row label="Name" value={modal.data.name} />
                <Row label="Email" value={modal.data.email} />
                <Row label="Role">
                  <span style={{ ...pillBase, ...rolePillColor(modal.data.role) }}>{modal.data.role}</span>
                </Row>
                <Row label="Status">
                  <span style={{
                    ...pillBase,
                    background: modal.data.active ? '#e8f5e9' : '#fdecea',
                    color: modal.data.active ? '#27ae60' : '#c0392b',
                  }}>
                    {modal.data.active ? 'Active' : 'Inactive'}
                  </span>
                </Row>
                <Row label="ID" value={modal.data.id} />
              </div>
            ) : (
              <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {error && <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#c0392b', borderRadius: 6, padding: '8px 12px', fontSize: 13, marginBottom: 12 }}>{error}</div>}
                <label style={labelStyle}>Name</label>
                <input style={inputStyle} name="name" value={editForm.name} onChange={handleEditChange} />
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} name="email" type="email" value={editForm.email} onChange={handleEditChange} />
                <label style={labelStyle}>Role</label>
                <select style={inputStyle} name="role" value={editForm.role} onChange={handleEditChange}>
                  {EDITABLE_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <label style={labelStyle}>New password (leave blank to keep)</label>
                <input style={inputStyle} name="password" type="password" placeholder="Optional" value={editForm.password} onChange={handleEditChange} />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="button" style={{ padding: '9px 16px', background: '#f0f2f5', color: '#555', border: 'none', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: 'pointer' }} onClick={closeModal}>Cancel</button>
                  <button type="submit" style={{ padding: '9px 16px', background: '#0f3460', color: '#fff', border: 'none', borderRadius: 7, fontSize: 14, fontWeight: 600, cursor: 'pointer' }} disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

const inputStyle = { padding: '10px 12px', border: '1.5px solid #e0e0e0', borderRadius: 7, fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box', width: '100%' }
const labelStyle = { fontSize: 12, color: '#888', fontWeight: 600, marginTop: 6 }
const pillBase = { padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, display: 'inline-block' }

function Row({ label, value, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f2f5' }}>
      <span style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 14, color: '#222' }}>{children ?? value}</span>
    </div>
  )
}

function rolePillColor(role) {
  switch (role) {
    case 'ADMIN':      return { background: '#0f3460', color: '#fff' }
    case 'TECHNICIAN': return { background: '#e8f5e9', color: '#27ae60' }
    default:           return { background: '#e8f0fe', color: '#1a73e8' }
  }
}

function StatCard({ label, value, icon }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flex: '1 1 160px' }}>
      <span style={{ fontSize: 32 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e' }}>{value}</div>
        <div style={{ fontSize: 13, color: '#888' }}>{label}</div>
      </div>
    </div>
  )
}
