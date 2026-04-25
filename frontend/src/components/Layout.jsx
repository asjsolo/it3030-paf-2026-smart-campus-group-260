import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children, role }) {
  const location = useLocation();

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      textDecoration: 'none',
      color: isActive ? 'var(--primary-accent)' : 'var(--text-muted)',
      backgroundColor: isActive ? 'rgba(13, 148, 136, 0.1)' : 'transparent',
      borderRadius: 'var(--radius-sm)',
      fontWeight: isActive ? '600' : '500',
      transition: 'all 0.2s ease',
      marginBottom: '8px'
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    window.location.href = '/'; // Force a full reload back to the login screen
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: 'var(--surface-color)', 
        borderRight: '1px solid var(--border-color)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '0 16px 32px 16px' }}>
          <h2 style={{ color: 'var(--primary-accent)', margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>🎓</span> SmartCampus
          </h2>
        </div>

        <nav style={{ flex: 1 }}>
          {/* Technicians ONLY get the Master Dashboard */}
          {role === 'TECHNICIAN' && (
            <>
              <Link to="/dashboard" style={getLinkStyle('/dashboard')}>
                📊 Master Dashboard
              </Link>
              <Link to="/admin/bookings" style={getLinkStyle('/admin/bookings')}>
                📋 Manage Bookings
              </Link>
            </>
          )}

          {/* Students get their Personal Dashboard AND the Create Ticket button */}
          {role === 'STUDENT' && (
            <>
              <Link to="/my-tickets" style={getLinkStyle('/my-tickets')}>
                🗂️ My Tickets
              </Link>
              <Link to="/create-ticket" style={getLinkStyle('/create-ticket')}>
                📝 Create a Ticket
              </Link>
              <Link to="/bookings/my" style={getLinkStyle('/bookings/my')}>
                🗂️ My Bookings
              </Link>
              <Link to="/bookings/request" style={getLinkStyle('/bookings/request')}>
                📅 Request Booking
              </Link>
            </>
          )}
        </nav>

        {/* Persistent Bottom Section (Only Logout Remains!) */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={handleLogout} 
            style={{ 
              ...getLinkStyle('#logout'), 
              width: '100%', 
              border: 'none', 
              cursor: 'pointer', 
              textAlign: 'left', 
              color: '#EF4444', 
              fontFamily: 'inherit',
              fontSize: '1rem'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
      
    </div>
  );
}