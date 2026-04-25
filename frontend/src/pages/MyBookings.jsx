import React, { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking } from '../api/bookingApi';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const requestedBy = localStorage.getItem('userEmail') || 'student@smartcampus.edu';
      const data = await getUserBookings(requestedBy);
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(id);
        fetchBookings(); // refresh list
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel booking.');
      }
    }
  };

  const getStatusBadge = (status) => {
    let color = '';
    let bg = '';
    switch(status) {
      case 'PENDING': color = '#F59E0B'; bg = 'rgba(245, 158, 11, 0.1)'; break;
      case 'APPROVED': color = '#10B981'; bg = 'rgba(16, 185, 129, 0.1)'; break;
      case 'REJECTED': color = '#EF4444'; bg = 'rgba(239, 68, 68, 0.1)'; break;
      case 'CANCELLED': color = '#6B7280'; bg = 'rgba(107, 114, 128, 0.1)'; break;
      default: color = '#6B7280'; bg = 'rgba(107, 114, 128, 0.1)';
    }
    return <span style={{ color, backgroundColor: bg, padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>{status}</span>;
  };

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '24px', color: 'var(--text-color)' }}>🗂️ My Bookings</h1>
      {error && <div style={{ color: '#EF4444', marginBottom: '16px' }}>{error}</div>}
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {bookings.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>You have no bookings yet.</p>
        ) : (
          bookings.map(booking => (
            <div key={booking.id} style={{ backgroundColor: 'var(--surface-color)', padding: '20px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, color: 'var(--text-color)' }}>Resource: {booking.resourceId}</h3>
                  {getStatusBadge(booking.status)}
                </div>
                <p style={{ margin: '4px 0', color: 'var(--text-muted)' }}>Date: {booking.date} | Time: {booking.startTime} - {booking.endTime}</p>
                <p style={{ margin: '4px 0', color: 'var(--text-muted)' }}>Purpose: {booking.purpose} | Attendees: {booking.expectedAttendees}</p>
                {booking.decisionReason && (
                  <p style={{ margin: '8px 0 0 0', padding: '8px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px', fontSize: '0.9rem', color: 'var(--text-color)' }}>
                    <strong>Admin Comment:</strong> {booking.decisionReason}
                  </p>
                )}
              </div>
              <div>
                {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                  <button onClick={() => handleCancel(booking.id)} style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#EF4444', border: '1px solid #EF4444', borderRadius: '4px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
