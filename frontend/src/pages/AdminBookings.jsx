import React, { useState, useEffect } from 'react';
import { getAllBookings, approveBooking, rejectBooking, deleteBooking } from '../api/bookingApi';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterResource, setFilterResource] = useState('');

  // Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  
  // Notification
  const [notification, setNotification] = useState('');

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter effect
  useEffect(() => {
    let result = bookings;
    if (filterStatus) result = result.filter(b => b.status === filterStatus);
    if (filterDate) result = result.filter(b => b.date === filterDate);
    if (filterResource) result = result.filter(b => b.resourceId.toLowerCase().includes(filterResource.toLowerCase()));
    setFilteredBookings(result);
  }, [filterStatus, filterDate, filterResource, bookings]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleApprove = async (id) => {
    try {
      await approveBooking(id, 'Approved by Admin');
      showNotification('✅ Booking Approved Successfully');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve booking.');
    }
  };

  const openRejectModal = (id) => {
    setActiveBookingId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }
    try {
      await rejectBooking(activeBookingId, rejectReason);
      setRejectModalOpen(false);
      showNotification('🚫 Booking Rejected');
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject booking.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking permanently?')) {
      try {
        await deleteBooking(id);
        showNotification('🗑️ Booking Deleted');
        fetchBookings();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete booking.');
      }
    }
  };

  const getStatusBadge = (status) => {
    return <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>;
  };

  if (loading) return <div className="empty-state">⏳ Loading bookings...</div>;

  return (
    <div className="card">
      <h2 className="page-title">📋 Admin Booking Management</h2>
      <p className="page-subtitle">Review, approve, and manage resource bookings across the campus.</p>
      
      {notification && <div className="toast">{notification}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      
      {/* Filters Section */}
      <div className="form-row" style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-sm)' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter by Status</label>
          <select className="form-control" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Filter by Date</label>
          <input type="date" className="form-control" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Search Resource</label>
          <input type="text" className="form-control" placeholder="Room 101..." value={filterResource} onChange={e => setFilterResource(e.target.value)} />
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <h3>No bookings match your filters.</h3>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Requested By</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id}>
                  <td>
                    <strong>{booking.resourceId}</strong><br/>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Attendees: {booking.expectedAttendees}</span>
                  </td>
                  <td>{booking.requestedBy}</td>
                  <td>
                    {booking.date}<br/>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{booking.startTime} - {booking.endTime}</span>
                  </td>
                  <td>
                    {getStatusBadge(booking.status)}
                    {booking.decisionReason && (
                      <div style={{ marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '150px' }}>
                        Note: {booking.decisionReason}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {booking.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleApprove(booking.id)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                            Approve
                          </button>
                          <button onClick={() => openRejectModal(booking.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                            Reject
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(booking.id)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '16px' }}>Reject Booking</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Please provide a reason for rejecting this request.</p>
            
            <div className="form-group">
              <label className="form-label">Rejection Reason</label>
              <textarea 
                className="form-control" 
                rows="3" 
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="The room is under maintenance..."
              ></textarea>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="btn btn-outline" onClick={() => setRejectModalOpen(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmReject}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
