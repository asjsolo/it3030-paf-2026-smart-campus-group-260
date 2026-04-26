import React, { useState, useEffect } from 'react';
import { getUserBookings } from '../api/bookingApi';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle2, CalendarPlus, FileEdit } from 'lucide-react';

export default function StudentDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const requestedBy = localStorage.getItem('userEmail') || 'student@smartcampus.edu';
        const data = await getUserBookings(requestedBy);
        setStats({
          total: data.length,
          pending: data.filter(b => b.status === 'PENDING').length,
          approved: data.filter(b => b.status === 'APPROVED').length,
        });
      } catch (err) {
        console.error('Failed to fetch student dashboard stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      {/* Hero Welcome Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: 'white', marginBottom: '32px', border: 'none', padding: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>Book Campus Resources Easily</h1>
        <p style={{ fontSize: '1.15rem', opacity: 0.9, maxWidth: '600px' }}>
          Reserve study rooms, labs, and specialized equipment seamlessly.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-title">My Total Requests</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--primary-alpha)', color: 'var(--primary)' }}>
              <ClipboardList size={28} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-title">Pending</div>
              <div className="stat-value">{stats.pending}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
              <Clock size={28} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-title">Approved</div>
              <div className="stat-value">{stats.approved}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success-dark)' }}>
              <CheckCircle2 size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ padding: '32px' }}>
        <h3 style={{ marginBottom: '24px' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/bookings/request')} className="btn btn-primary" style={{ padding: '16px 32px' }}>
            <CalendarPlus size={20} /> Request Resource Booking
          </button>
          <button onClick={() => navigate('/bookings/my')} className="btn btn-outline" style={{ padding: '16px 32px' }}>
            <ClipboardList size={20} /> View My Bookings
          </button>
          <button onClick={() => navigate('/create-ticket')} className="btn btn-outline" style={{ padding: '16px 32px' }}>
            <FileEdit size={20} /> Create Incident Ticket
          </button>
        </div>
      </div>
    </div>
  );
}