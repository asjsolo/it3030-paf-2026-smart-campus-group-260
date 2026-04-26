import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TicketDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  // Fetch tickets when the page loads
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/tickets');
      setTickets(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load tickets. Is the backend running?');
      setLoading(false);
    }
  };

  // --- SECURITY CHECK: Block Students Entirely ---
  if (userRole === 'STUDENT') {
    return (
      <div className="card" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2 style={{ color: '#EF4444' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)' }}>Students do not have permission to view the master dashboard.</p>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/create-ticket')} 
          style={{ width: 'auto', marginTop: '16px', padding: '10px 20px' }}
        >
          Go to File Request
        </button>
      </div>
    );
  }

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)' }}>Loading tickets...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</p>;

  return (
    <div className="card"> {/* Using your new global CSS card class! */}
      <h2 style={{ marginBottom: '24px', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        Active Incident Tickets
      </h2>
      
      {/* THE EXTRA SIGN OUT BUTTON WAS REMOVED FROM HERE! 🧹 */}

      {tickets.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No tickets found. Go file a request!</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)' }}>
                <th style={{ padding: '14px', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: '600' }}>ID</th>
                <th style={{ padding: '14px', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: '600' }}>Title</th>
                <th style={{ padding: '14px', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: '600' }}>Category</th>
                <th style={{ padding: '14px', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: '600' }}>Priority</th>
                <th style={{ padding: '14px', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: '600' }}>Location</th>
                <th style={{ padding: '14px', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '14px', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover-lift" style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '14px', color: 'var(--text-muted)' }}>#{ticket.id}</td>
                  <td style={{ padding: '14px', fontWeight: '600', color: 'var(--text-main)' }}>{ticket.title}</td>
                  <td style={{ padding: '14px' }}>{ticket.category}</td>
                  <td style={{ padding: '14px' }}>
                    {/* Themed Priority Badges */}
                    <span style={{ 
                      color: ticket.priority === 'High' ? '#EF4444' : ticket.priority === 'Medium' ? '#F59E0B' : '#10B981',
                      backgroundColor: ticket.priority === 'High' ? '#FEF2F2' : ticket.priority === 'Medium' ? '#FFFBEB' : '#ECFDF5',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: '600',
                      fontSize: '0.85rem'
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
  );
}