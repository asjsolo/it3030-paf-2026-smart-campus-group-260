import React, { useState, useEffect } from 'react';
import { getAllBookings } from '../api/bookingApi';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAllBookings();
        setStats({
          total: data.length,
          pending: data.filter(b => b.status === 'PENDING').length,
          approved: data.filter(b => b.status === 'APPROVED').length,
          rejected: data.filter(b => b.status === 'REJECTED').length,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      {/* Hero Welcome Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: 'white', marginBottom: '32px', border: 'none' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>Welcome back, Admin 👋</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px' }}>
          Here is an overview of campus resource bookings today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-title">Total Bookings</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--primary-alpha)', color: 'var(--primary)' }}>📊</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-title">Pending Approvals</div>
              <div className="stat-value">{stats.pending}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>⏳</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-title">Approved</div>
              <div className="stat-value">{stats.approved}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>✅</div>
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-title">Rejected</div>
              <div className="stat-value">{stats.rejected}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>🚫</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 style={{ marginBottom: '24px' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/admin/bookings')} className="btn btn-primary">
            📋 Manage Bookings
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn btn-outline">
            🎫 View Master Tickets
          </button>
        </div>
      </div>
    </div>
  );
}
