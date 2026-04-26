import React, { useState, useEffect, useRef } from 'react';
import { getUserBookings, cancelBooking } from '../api/bookingApi';
import { ClipboardList, Trash2, CalendarX2, QrCode, Download } from 'lucide-react';
import Toast from '../components/Toast';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import BookingStatusTimeline from '../components/BookingStatusTimeline';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const requestedBy = localStorage.getItem('userEmail') || 'student@smartcampus.edu';
      const data = await getUserBookings(requestedBy);
      setBookings(data);
    } catch (err) {
      setToast({ message: 'Failed to fetch bookings.', type: 'error' });
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
        setToast({ message: 'Booking cancelled successfully.', type: 'success' });
        fetchBookings();
      } catch (err) {
        setToast({ message: err.response?.data?.message || 'Failed to cancel booking.', type: 'error' });
      }
    }
  };

  const downloadQR = (id) => {
    const canvas = document.getElementById(`qr-canvas-${id}`);
    if (!canvas) return;
    const pngFile = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.download = `Booking-${id}-QR.png`;
    downloadLink.href = pngFile;
    downloadLink.click();
  };

  if (loading) return <div className="empty-state" style={{ border: 'none' }}>Loading bookings...</div>;

  return (
    <div className="card">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <h2 className="page-title"><ClipboardList size={28} className="text-primary" /> My Bookings</h2>
      <p className="page-subtitle">View and manage your resource requests.</p>
      
      {bookings.length === 0 ? (
        <EmptyState 
          icon={<CalendarX2 size={48} />}
          title="No bookings yet"
          description="Create your first booking request to reserve a campus resource."
          actionButton={
            <button className="btn btn-primary" onClick={() => navigate('/bookings/request')}>
              Request Booking
            </button>
          }
        />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Timeline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <React.Fragment key={booking.id}>
                  <tr>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{booking.resourceType || 'RESOURCE'}</span><br/>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{booking.resourceId}</strong><br/>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Attendees: {booking.expectedAttendees}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '500' }}>{booking.date}</div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{booking.startTime} - {booking.endTime}</span>
                    </td>
                    <td>
                      <StatusBadge status={booking.status} />
                      {booking.decisionReason && (
                        <div style={{ fontSize: '0.85rem', color: booking.status === 'REJECTED' ? 'var(--danger)' : 'var(--text-muted)', marginTop: '8px', maxWidth: '200px' }}>
                          Note: {booking.decisionReason}
                        </div>
                      )}
                    </td>
                    <td>
                      <BookingStatusTimeline status={booking.status} />
                    </td>
                    <td>
                      {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                        <button onClick={() => handleCancel(booking.id)} className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '8px 16px', fontSize: '0.9rem' }}>
                          <Trash2 size={16} /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                  
                  {/* Expanded QR Code Area for Approved Bookings */}
                  {booking.status === 'APPROVED' && (
                    <tr style={{ backgroundColor: 'var(--surface-hover)' }}>
                      <td colSpan="5" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', background: 'var(--surface)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                          <div style={{ background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <QRCodeCanvas 
                              id={`qr-canvas-${booking.id}`}
                              value={JSON.stringify({
                                bookingId: booking.id,
                                resourceType: booking.resourceType || 'Resource',
                                resourceName: booking.resourceName || booking.resourceId,
                                date: booking.date,
                                startTime: booking.startTime,
                                endTime: booking.endTime
                              })}
                              size={120}
                              level="H"
                              includeMargin={true}
                            />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <QrCode className="text-primary" size={20} /> Verification Pass
                            </h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px', maxWidth: '400px' }}>
                              Show this QR code for verification when accessing <strong>{booking.resourceId}</strong> on {booking.date}.
                            </p>
                            <button onClick={() => downloadQR(booking.id)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                              <Download size={16} /> Download QR Code
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
