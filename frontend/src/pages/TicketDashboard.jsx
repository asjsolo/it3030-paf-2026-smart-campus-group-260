import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTickets } from '../services/api'

export default function TicketDashboard() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getTickets()
      .then((res) => setTickets(res.data))
      .catch((err) => {
        console.error('Error fetching tickets:', err)
        setError('Failed to load tickets. Is the backend running?')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)' }}>Loading tickets...</p>
  if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</p>

  return (
    <div className="card">
      <h2 style={{ marginBottom: '24px', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        Active Incident Tickets
      </h2>

      {tickets.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No tickets found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)' }}>
                <th style={th}>ID</th>
                <th style={th}>Title</th>
                <th style={th}>Category</th>
                <th style={th}>Priority</th>
                <th style={th}>Location</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover-lift" style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '14px', color: 'var(--text-muted)' }}>#{ticket.id}</td>
                  <td style={{ padding: '14px', fontWeight: '600', color: 'var(--text-main)' }}>{ticket.title}</td>
                  <td style={{ padding: '14px' }}>{ticket.category}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      color: ticket.priority === 'High' ? '#EF4444' : ticket.priority === 'Medium' ? '#F59E0B' : '#10B981',
                      backgroundColor: ticket.priority === 'High' ? '#FEF2F2' : ticket.priority === 'Medium' ? '#FFFBEB' : '#ECFDF5',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                    }}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{ticket.location}</td>
                  <td style={{ padding: '14px', fontWeight: '500' }}>{ticket.status}</td>
                  <td style={{ padding: '14px' }}>
                    <button
                      className="btn-primary"
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                      style={{ width: 'auto', padding: '6px 16px', fontSize: '0.85rem', margin: '0' }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const th = { padding: '14px', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: '600' }
