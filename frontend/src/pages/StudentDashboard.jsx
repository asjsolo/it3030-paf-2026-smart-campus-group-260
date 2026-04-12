import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      // NOTE: For a real app, this endpoint would be filtered by the logged-in student's ID (e.g., /api/tickets/student/1)
      // Since we are mocking auth with just roles right now, we will fetch all tickets.
      const response = await axios.get('http://localhost:8082/api/tickets');
      setTickets(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load your tickets.');
      setLoading(false);
    }
  };

  // Block Technicians from using the Student Dashboard
  if (userRole === 'TECHNICIAN') {
    return (
      <div className="card" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2 style={{ color: '#EF4444' }}>Technician Route</h2>
        <p style={{ color: 'var(--text-muted)' }}>Technicians should use the Master Dashboard.</p>
        <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ width: 'auto', marginTop: '16px', padding: '10px 20px' }}>
          Go to Master Dashboard
        </button>
      </div>
    );
  }

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-muted)' }}>Loading your tickets...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</p>;

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
                <th style={{ padding: '14px', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: '600' }}>ID</th>
                <th style={{ padding: '14px', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: '600' }}>Title</th>
                <th style={{ padding: '14px', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '14px', borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: '600' }}>Updates</th>
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
                      fontSize: '0.85rem'
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
  );
}