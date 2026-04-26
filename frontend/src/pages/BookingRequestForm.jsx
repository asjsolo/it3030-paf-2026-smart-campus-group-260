import React, { useState } from 'react';
import { createBooking } from '../api/bookingApi';
import { Calendar, Users, Clock, AlignLeft, Building, ClipboardCheck, CalendarPlus, CheckCircle, AlertCircle, Layers } from 'lucide-react';
import Toast from '../components/Toast';

export default function BookingRequestForm() {
  const [formData, setFormData] = useState({
    resourceType: '',
    resourceId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: ''
  });
  const [toast, setToast] = useState(null); // { message, type }
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [submitError, setSubmitError] = useState(''); // New inline error state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setToast(null);
    setSubmitError('');
  };

  const validateTime = () => {
    if (!formData.resourceType) {
      setToast({ message: 'Resource Type is required.', type: 'error' });
      return false;
    }

    const now = new Date();
    const selectedDate = new Date(formData.date);
    
    selectedDate.setHours(23, 59, 59, 999);
    if (selectedDate < now) {
      setToast({ message: 'Booking date cannot be in the past.', type: 'error' });
      return false;
    }

    if (!formData.startTime) {
      setToast({ message: 'Start time cannot be empty.', type: 'error' });
      return false;
    }

    if (formData.startTime >= formData.endTime) {
      setToast({ message: 'End time must be after start time.', type: 'error' });
      return false;
    }

    if (!formData.purpose.trim()) {
      setToast({ message: 'Purpose is required.', type: 'error' });
      return false;
    }

    if (formData.expectedAttendees <= 0) {
      setToast({ message: 'Expected attendees must be greater than 0.', type: 'error' });
      return false;
    }

    return true;
  };

  const handlePreview = (e) => {
    e.preventDefault();
    if (validateTime()) {
      setShowSummary(true);
      setSubmitError('');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setToast(null);
    setSubmitError('');
    
    const requestedBy = localStorage.getItem('userEmail') || 'student@smartcampus.edu';

    try {
      await createBooking({ ...formData, requestedBy });
      setToast({ message: 'Booking request submitted successfully!', type: 'success' });
      setFormData({ resourceType: '', resourceId: '', date: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' });
      setShowSummary(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'This time slot is already booked for this resource.';
      setSubmitError(errorMessage); // Show inline error
    } finally {
      setLoading(false);
    }
  };

  const getResourceLabel = () => {
    switch (formData.resourceType) {
      case 'Room': return 'Room ID / Room Name';
      case 'Lab': return 'Lab ID / Lab Name';
      case 'Equipment': return 'Equipment ID / Equipment Name';
      default: return 'Resource ID / Name';
    }
  };

  const getResourcePlaceholder = () => {
    switch (formData.resourceType) {
      case 'Room': return 'E.g., Room A101 or Lecture Hall 01';
      case 'Lab': return 'E.g., Lab 105 or IT Lab 03';
      case 'Equipment': return 'E.g., Projector 12 or Camera Kit';
      default: return 'Select a resource type first...';
    }
  };

  return (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start', position: 'relative' }}>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Left side: Form */}
      <div className="card" style={{ flex: '1 1 500px', padding: '40px' }}>
        <h2 className="page-title"><CalendarPlus style={{ marginRight: '8px' }} size={28} className="text-primary" /> Request Resource Booking</h2>
        <p className="page-subtitle">Fill in the details below to request a smart campus resource.</p>

        {!showSummary ? (
          <form onSubmit={handlePreview}>
            
            <div className="form-row" style={{ display: 'flex', gap: '24px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Layers size={16} /> Resource Type</label>
                <select name="resourceType" value={formData.resourceType} onChange={handleChange} required className="form-control">
                  <option value="">Select Type...</option>
                  <option value="Room">Room</option>
                  <option value="Lab">Lab</option>
                  <option value="Equipment">Equipment</option>
                </select>
              </div>

              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Building size={16} /> {getResourceLabel()}</label>
                <input type="text" name="resourceId" value={formData.resourceId} onChange={handleChange} required className="form-control" placeholder={getResourcePlaceholder()} disabled={!formData.resourceType} />
              </div>
            </div>
            
            <div className="form-row" style={{ display: 'flex', gap: '24px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="form-control" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16} /> Expected Attendees</label>
                <input type="number" name="expectedAttendees" value={formData.expectedAttendees} onChange={handleChange} required min="1" className="form-control" />
              </div>
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '24px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} /> Start Time</label>
                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className="form-control" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} /> End Time</label>
                <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className="form-control" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AlignLeft size={16} /> Purpose</label>
              <textarea name="purpose" value={formData.purpose} onChange={handleChange} required rows="3" className="form-control" style={{ resize: 'vertical' }} placeholder="Why do you need this resource?"></textarea>
            </div>

            <div style={{ background: 'var(--primary-alpha)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <CheckCircle size={24} className="text-primary" />
              <div style={{ fontSize: '0.95rem', color: 'var(--primary-dark)', fontWeight: '600' }}>
                Please review your booking before submitting.
              </div>
            </div>

            <button className="btn btn-primary" type="submit" style={{ width: '100%', padding: '16px' }}>
              Review Booking details
            </button>
          </form>
        ) : (
          <div className="card" style={{ background: 'var(--surface-hover)', boxShadow: 'none' }}>
            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardCheck size={20} className="text-primary" /> Confirm your details
            </h3>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>Does everything look correct? You can edit the details if you made a mistake.</p>
            
            {submitError && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'var(--danger-bg)', 
                color: 'var(--danger)', 
                padding: '16px', 
                borderRadius: '8px', 
                marginBottom: '24px',
                border: '1px solid #fca5a5',
                fontWeight: '500'
              }}>
                <AlertCircle size={20} />
                {submitError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={() => setShowSummary(false)} className="btn btn-outline" style={{ flex: 1 }}>
                Edit Details
              </button>
              <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
                {loading ? 'Submitting...' : 'Confirm Request'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right side: Preview display */}
      <div className="glass-card" style={{ flex: '1 1 350px', padding: '32px', borderRadius: 'var(--radius-lg)' }}>
         <h3 style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Live Preview</h3>
         <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <li>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Resource Type</div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--primary-dark)' }}>{formData.resourceType || 'Not selected'}</div>
            </li>
            <li>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Resource Name</div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{formData.resourceId || 'Not specified'}</div>
            </li>
            <li>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Date & Time</div>
              <div style={{ fontWeight: '600' }}>
                {formData.date ? formData.date : '---'} 
                {formData.startTime && formData.endTime ? ` • ${formData.startTime} to ${formData.endTime}` : ''}
              </div>
            </li>
            <li>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Attendees</div>
              <div style={{ fontWeight: '600' }}>{formData.expectedAttendees || '0'} people</div>
            </li>
            <li>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Purpose</div>
              <div style={{ fontWeight: '500', color: 'var(--text-main)', lineHeight: '1.5' }}>{formData.purpose || '---'}</div>
            </li>
         </ul>
      </div>
    </div>
  );
}
