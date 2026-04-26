import React, { useState } from 'react';
import { createBooking } from '../api/bookingApi';

export default function BookingRequestForm() {
  const [formData, setFormData] = useState({
    resourceId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const validateTime = () => {
    const now = new Date();
    const selectedDate = new Date(formData.date);
    
    selectedDate.setHours(23, 59, 59, 999);
    if (selectedDate < now) {
      setError('Cannot book a resource in the past.');
      return false;
    }

    if (formData.startTime >= formData.endTime) {
      setError('End time must be after start time.');
      return false;
    }

    return true;
  };

  const handlePreview = (e) => {
    e.preventDefault();
    if (validateTime()) {
      setShowSummary(true);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    
    const requestedBy = localStorage.getItem('userEmail') || 'student@smartcampus.edu';

    try {
      await createBooking({ ...formData, requestedBy });
      setMessage('✅ Booking request submitted successfully!');
      setFormData({ resourceId: '', date: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' });
      setShowSummary(false);
    } catch (err) {
      setError('⚠️ ' + (err.response?.data?.message || 'This time slot is already booked.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '650px', margin: '0 auto' }}>
      <h2 className="page-title">📅 Request Resource Booking</h2>
      <p className="page-subtitle">Fill in the details below to request a smart campus resource.</p>
      
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!showSummary ? (
        <form onSubmit={handlePreview}>
          <div className="form-group">
            <label className="form-label">🏢 Resource ID / Name</label>
            <input type="text" name="resourceId" value={formData.resourceId} onChange={handleChange} required className="form-control" />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">📆 Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} className="form-control" />
            </div>
            <div className="form-group">
              <label className="form-label">👥 Expected Attendees</label>
              <input type="number" name="expectedAttendees" value={formData.expectedAttendees} onChange={handleChange} required min="1" className="form-control" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">🕒 Start Time</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className="form-control" />
            </div>
            <div className="form-group">
              <label className="form-label">🕕 End Time</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className="form-control" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">📝 Purpose</label>
            <textarea name="purpose" value={formData.purpose} onChange={handleChange} required rows="3" className="form-control" style={{ resize: 'vertical' }}></textarea>
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: '100%', padding: '14px' }}>
            Preview Booking
          </button>
        </form>
      ) : (
        <div className="card" style={{ backgroundColor: 'var(--bg-color)', boxShadow: 'none' }}>
          <h3 style={{ marginBottom: '16px' }}>📋 Booking Summary Preview</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <li><strong>Resource:</strong> {formData.resourceId}</li>
            <li><strong>Date:</strong> {formData.date}</li>
            <li><strong>Time:</strong> {formData.startTime} - {formData.endTime}</li>
            <li><strong>Attendees:</strong> {formData.expectedAttendees}</li>
            <li><strong>Purpose:</strong> {formData.purpose}</li>
          </ul>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => setShowSummary(false)} className="btn btn-outline" style={{ flex: 1 }}>
              Edit
            </button>
            <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
              {loading ? '⏳ Submitting...' : '✅ Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
