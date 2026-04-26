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
    return <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>;
  };

  if (loading) return <div className="empty-state">⏳ Loading bookings...</div>;

  return (
    <div className="card">
      <h2 className="page-title">🗂️ My Bookings</h2>
      <p className="page-subtitle">View and manage your resource requests.</p>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      {bookings.length === 0 ? (
        <div className="empty-state">
          <h3>No bookings found.</h3>
          <p>You haven't made any resource requests yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Admin Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td style={{ fontWeight: '600' }}>{booking.resourceId}</td>
                  <td>
                    {booking.date}<br/>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{booking.startTime} - {booking.endTime}</span>
                  </td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td style={{ maxWidth: '200px', fontSize: '0.9rem' }}>
                    {booking.decisionReason ? (
                      <span style={{ color: booking.status === 'REJECTED' ? 'var(--danger-color)' : 'inherit' }}>
                        {booking.decisionReason}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                  <td>
                    {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                      <button onClick={() => handleCancel(booking.id)} className="btn btn-outline" style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}>
                        Cancel
                      </button>
                    )}
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
