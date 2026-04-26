import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  LayoutDashboard, 
  CalendarCheck, 
  TicketCheck, 
  CalendarPlus, 
  CalendarDays, 
  FileEdit, 
  Files, 
  ShieldCheck, 
  GraduationCap, 
  LogOut 
} from 'lucide-react';

export default function Layout({ children, role, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const getLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // If there is no role (user is logged out) or we are on the login page, 
  // don't render the sidebar and topbar at all. Just render the children.
  if (!role || location.pathname === '/login') {
    return (
      <div style={{ minHeight: '100vh', width: '100%', background: 'var(--surface)' }}>
        {children}
      </div>
    );
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <Building2 size={28} />
            SmartCampus
          </div>
        </div>

        <nav className="sidebar-nav">
          {(role === 'TECHNICIAN' || role === 'ADMIN') && (
            <>
              <Link to="/admin/dashboard" className={getLinkClass('/admin/dashboard')}>
                <LayoutDashboard size={20} /> Dashboard
              </Link>
              <Link to="/admin/bookings" className={getLinkClass('/admin/bookings')}>
                <CalendarCheck size={20} /> Manage Bookings
              </Link>
              <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                <TicketCheck size={20} /> Master Tickets
              </Link>
            </>
          )}

          {role === 'STUDENT' && (
            <>
              <Link to="/student/dashboard" className={getLinkClass('/student/dashboard')}>
                <LayoutDashboard size={20} /> Dashboard
              </Link>
              <Link to="/bookings/request" className={getLinkClass('/bookings/request')}>
                <CalendarPlus size={20} /> Request Booking
              </Link>
              <Link to="/bookings/my" className={getLinkClass('/bookings/my')}>
                <CalendarDays size={20} /> My Bookings
              </Link>
              <div style={{ margin: '16px 0', borderBottom: '1px solid var(--border)' }}></div>
              <Link to="/create-ticket" className={getLinkClass('/create-ticket')}>
                <FileEdit size={20} /> Create Ticket
              </Link>
              <Link to="/my-tickets" className={getLinkClass('/my-tickets')}>
                <Files size={20} /> My Tickets
              </Link>
            </>
          )}
        </nav>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div className="role-badge">
              {role === 'ADMIN' ? <ShieldCheck size={18} /> : <GraduationCap size={18} />}
              {role || 'Guest'}
            </div>
            <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '8px 16px', gap: '8px' }}>
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </header>

        <main className="content-area">
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}