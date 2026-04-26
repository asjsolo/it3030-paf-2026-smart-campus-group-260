import React, { useState, useEffect } from 'react';
import { getAllBookings, approveBooking, rejectBooking, deleteBooking } from '../api/bookingApi';
import { CalendarCheck, Filter, Search, XCircle, Trash2, CheckCircle2 } from 'lucide-react';
import Toast from '../components/Toast';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import BookingStatusTimeline from '../components/BookingStatusTimeline';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterResource, setFilterResource] = useState('');

  // Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  
  // Notification
  const [toast, setToast] = useState(null);

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (err) {
      setToast({ message: 'Failed to fetch bookings.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = bookings;
    if (filterStatus) result = result.filter(b => b.status === filterStatus);
    if (filterDate) result = result.filter(b => b.date === filterDate);
    if (filterResource) result = result.filter(b => b.resourceId.toLowerCase().includes(filterResource.toLowerCase()));
    setFilteredBookings(result);
  }, [filterStatus, filterDate, filterResource, bookings]);

  const handleApprove = async (id) => {
    try {
      await approveBooking(id, 'Approved by Admin');
      setToast({ message: 'Booking approved successfully', type: 'success' });
      fetchBookings();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to approve booking.', type: 'error' });
    }
  };

  const openRejectModal = (id) => {
    setActiveBookingId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      setToast({ message: 'Rejection reason is required.', type: 'warning' });
      return;
    }
    try {
      await rejectBooking(activeBookingId, rejectReason);
      setRejectModalOpen(false);
      setToast({ message: 'Booking rejected successfully', type: 'info' });
      fetchBookings();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to reject booking.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking permanently?')) {
      try {
        await deleteBooking(id);
        setToast({ message: 'Booking deleted', type: 'info' });
        fetchBookings();
      } catch (err) {
        setToast({ message: err.response?.data?.message || 'Failed to delete booking.', type: 'error' });
      }
    }
  };

  if (loading) return <div className="empty-state" style={{ border: 'none' }}>Loading bookings...</div>;

  return (
    <div className="card">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <h2 className="page-title"><CalendarCheck size={28} className="text-primary" /> Admin Booking Management</h2>
      <p className="page-subtitle">Review, approve, and manage resource bookings across the campus.</p>
      
      {/* Filters Section */}
      <div className="form-row" style={{ marginBottom: '32px', padding: '24px', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Filter size={14} /> Filter by Status</label>
          <select className="form-control" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Filter size={14} /> Filter by Date</label>
          <input type="date" className="form-control" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Search size={14} /> Search Resource</label>
          <input type="text" className="form-control" placeholder="Room 101..." value={filterResource} onChange={e => setFilterResource(e.target.value)} />
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <EmptyState 
          icon={<Search size={48} />}
          title="No bookings match your filters."
          description="Try clearing your filters to see more results."
        />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Requested By</th>
                <th>Date & Time</th>
                <th>Status / Timeline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id}>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{booking.resourceType || 'RESOURCE'}</span><br/>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{booking.resourceId}</strong><br/>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Attendees: {booking.expectedAttendees}</span>
                  </td>
                  <td>{booking.requestedBy}</td>
                  <td>
                    {booking.date}<br/>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{booking.startTime} - {booking.endTime}</span>
                  </td>
                  <td>
                    <StatusBadge status={booking.status} />
                    <div style={{ marginTop: '4px' }}>
                      <BookingStatusTimeline status={booking.status} />
                    </div>
                    {booking.decisionReason && (
                      <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '200px', lineHeight: '1.4' }}>
                        Note: {booking.decisionReason}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {booking.status === 'PENDING' && (
                        <>
                          <button onClick={() => handleApprove(booking.id)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                            <CheckCircle2 size={16} /> Approve
                          </button>
                          <button onClick={() => openRejectModal(booking.id)} className="btn btn-danger" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                            <XCircle size={16} /> Reject
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(booking.id)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                        <Trash2 size={16} /> Delete
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
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <XCircle size={24} className="text-danger" /> Reject Booking
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Please provide a reason for rejecting this request.</p>
            
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
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px' }}>
              <button className="btn btn-outline" onClick={() => setRejectModalOpen(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmReject}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
