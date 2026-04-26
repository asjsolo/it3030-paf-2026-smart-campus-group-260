import React, { useState, useEffect } from 'react';
import { getBookingAnalytics } from '../api/bookingApi';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle2, XCircle, LayoutDashboard, CalendarCheck, TicketCheck, CalendarX2, TrendingUp, BarChart3, MapPin } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ 
    total: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0,
    topResource: 'Loading...', peakTime: 'Loading...', todayBookings: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getBookingAnalytics();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      {/* Hero Welcome Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: 'white', marginBottom: '32px', border: 'none', padding: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>Welcome back, Admin 👋</h1>
        <p style={{ fontSize: '1.15rem', opacity: 0.9, maxWidth: '600px' }}>
          Manage campus resource bookings and monitor real-time usage analytics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-title">Total Bookings</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--primary-alpha)', color: 'var(--primary)' }}>
              <BookOpen size={28} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-title">Pending Approvals</div>
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

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-title">Rejected</div>
              <div className="stat-value">{stats.rejected}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
              <XCircle size={28} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-title">Cancelled</div>
              <div className="stat-value">{stats.cancelled}</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--neutral-bg)', color: 'var(--neutral)' }}>
              <CalendarX2 size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Usage Insights Section */}
      <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.4rem' }}>
        <BarChart3 size={24} className="text-primary" /> Usage Insights
      </h3>
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '32px' }}>
        <div className="stat-card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="stat-icon" style={{ background: 'var(--primary-alpha)', color: 'var(--primary)', flexShrink: 0 }}>
            <MapPin size={28} />
          </div>
          <div>
            <div className="stat-title" style={{ marginBottom: '4px' }}>Top Resource</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>{stats.topResource}</div>
          </div>
        </div>

        <div className="stat-card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)', flexShrink: 0 }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <div className="stat-title" style={{ marginBottom: '4px' }}>Peak Booking Time</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>{stats.peakTime}</div>
          </div>
        </div>

        <div className="stat-card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success-dark)', flexShrink: 0 }}>
            <CalendarCheck size={28} />
          </div>
          <div>
            <div className="stat-title" style={{ marginBottom: '4px' }}>Today's Bookings</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>{stats.todayBookings}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ padding: '32px' }}>
        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LayoutDashboard size={20} className="text-primary" /> Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/admin/bookings')} className="btn btn-primary" style={{ padding: '16px 32px' }}>
            <CalendarCheck size={20} /> Manage Bookings
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ padding: '16px 32px' }}>
            <TicketCheck size={20} /> View Master Tickets
          </button>
        </div>
      </div>
    </div>
  );
}
