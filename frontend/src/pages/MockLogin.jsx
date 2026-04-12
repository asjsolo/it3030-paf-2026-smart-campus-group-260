import { useNavigate } from 'react-router-dom';

export default function MockLogin({ setRole }) {
  const navigate = useNavigate();

  const handleLogin = (selectedRole) => {
    // Save to local storage so it remembers who we are on refresh
    localStorage.setItem('userRole', selectedRole);
    setRole(selectedRole);
    
    // Send students to create a ticket, send techs to the dashboard
    if (selectedRole === 'STUDENT') {
      navigate('/create-ticket');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }} className="card animate-fade-in">
      <h2 style={{ color: 'var(--primary-accent)', marginBottom: '16px' }}>System Access</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        (Temporary Mock Login until Module E is integrated)
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button 
          className="btn-primary" 
          onClick={() => handleLogin('STUDENT')}
        >
          Login as Student (USER)
        </button>

        <button 
          className="btn-primary" 
          style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
          onClick={() => handleLogin('TECHNICIAN')}
        >
          Login as Technician / Staff
        </button>
      </div>
    </div>
  );
}