import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTickets } from '../services/api'

export default function StudentDashboard() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // NOTE: backend currently returns all tickets — once a userId/email field is added
    // to IncidentTicket, this should filter to the logged-in student's tickets only.
    getTickets()
      .then((res) => setTickets(res.data))
      .catch((err) => {
        console.error('Error fetching tickets:', err)
        setError('Failed to load your tickets.')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)' }}>Loading your tickets...</p>
  if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</p>

  return (
    <div className="card">
      <h2 style={{ marginBottom: '8px', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        My Submitted Tickets
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
        Track the status of your requests and view technician updates.
      </p>

      {tickets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>You haven't submitted any tickets yet.</p>
          <button className="btn-primary" onClick={() => navigate('/create-ticket')} style={{ width: 'auto', padding: '8px 24px' }}>
            Create a Ticket
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)' }}>
                <th style={th}>ID</th>
                <th style={th}>Title</th>
                <th style={th}>Status</th>
                <th style={th}>Updates</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover-lift" style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '14px', color: 'var(--text-muted)' }}>#{ticket.id}</td>
                  <td style={{ padding: '14px', fontWeight: '600', color: 'var(--text-main)' }}>{ticket.title}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      color: ticket.status === 'RESOLVED' ? '#10B981' : ticket.status === 'IN_PROGRESS' ? '#3B82F6' : '#F59E0B',
                      backgroundColor: ticket.status === 'RESOLVED' ? '#ECFDF5' : ticket.status === 'IN_PROGRESS' ? '#EFF6FF' : '#FFFBEB',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                    }}>
                      {ticket.status || 'OPEN'}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <button
                      className="btn-primary"
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                      style={{ width: 'auto', padding: '6px 16px', fontSize: '0.85rem', margin: '0', background: 'transparent', border: '1px solid var(--primary-accent)', color: 'var(--primary-accent)' }}
                    >
                      View Updates
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
