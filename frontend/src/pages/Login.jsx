import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Zap, Calendar, ShieldCheck, UserRound, ArrowRight } from 'lucide-react';

export default function Login({ setRole }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleSelection, setRoleSelection] = useState('STUDENT');

  const handleRoleSelect = (role) => {
    setRoleSelection(role);
    if (role === 'STUDENT') setEmail('student@smartcampus.edu');
    if (role === 'ADMIN') setEmail('admin@smartcampus.edu');
    setPassword('password123'); // Demo password fill
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    localStorage.setItem('userRole', roleSelection);
    localStorage.setItem('userEmail', email);
    setRole(roleSelection);
    
    if (roleSelection === 'STUDENT') {
      navigate('/student/dashboard');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="login-layout">
      {/* Left Side - Welcome Section */}
      <div className="login-left">
        <div className="login-left-content">
          <div style={{ marginBottom: '32px' }}>
            <Building2 size={64} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, marginBottom: '24px' }}>
            Smart Campus Operations Hub
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', marginBottom: '48px', maxWidth: '400px' }}>
            Book campus resources, manage approvals, and track your requests in one unified platform.
          </p>

          <div className="feature-list">
            <div className="feature-card">
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
                <Zap size={24} color="var(--primary-light)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Easy Booking</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Request rooms and equipment in seconds.</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
                <Calendar size={24} color="var(--primary-light)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Conflict-Free Scheduling</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Smart validation prevents double bookings automatically.</p>
              </div>
            </div>

            <div className="feature-card">
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px' }}>
                <ShieldCheck size={24} color="var(--primary-light)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Admin Workflows</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Streamlined approval process for campus administrators.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '48px', border: 'none', boxShadow: '0 24px 48px rgba(15, 23, 42, 0.05)' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)' }}>Sign In</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1.1rem' }}>Access your campus workspace.</p>

          <div className="role-selector">
            <div 
              className={`role-card ${roleSelection === 'STUDENT' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('STUDENT')}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <UserRound size={40} className={roleSelection === 'STUDENT' ? 'text-primary' : 'text-muted'} />
              </div>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-main)' }}>Student</div>
            </div>
            <div 
              className={`role-card ${roleSelection === 'ADMIN' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('ADMIN')}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <ShieldCheck size={40} className={roleSelection === 'ADMIN' ? 'text-primary' : 'text-muted'} />
              </div>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-main)' }}>Admin</div>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ marginBottom: '10px' }}>Email Address</label>
              <input 
                type="email" 
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '8px', fontWeight: '500' }}>
                Demo hint: {roleSelection === 'STUDENT' ? 'student@smartcampus.edu' : 'admin@smartcampus.edu'}
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '40px' }}>
              <label className="form-label" style={{ marginBottom: '10px' }}>Password</label>
              <input 
                type="password" 
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.15rem' }}>
              Access Dashboard <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
