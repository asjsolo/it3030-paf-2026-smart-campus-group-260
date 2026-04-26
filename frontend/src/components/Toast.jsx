import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const styles = {
    success: { borderLeft: '4px solid var(--success)', color: 'var(--success-dark)', icon: <CheckCircle2 size={20} /> },
    error: { borderLeft: '4px solid var(--danger)', color: 'var(--danger)', icon: <XCircle size={20} /> },
    warning: { borderLeft: '4px solid var(--warning)', color: 'var(--warning)', icon: <AlertCircle size={20} /> },
    info: { borderLeft: '4px solid var(--primary)', color: 'var(--primary-dark)', icon: <Info size={20} /> }
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div className="toast" style={{ borderLeft: currentStyle.borderLeft, zIndex: 1050 }}>
      <div style={{ color: currentStyle.color, display: 'flex', alignItems: 'center' }}>
        {currentStyle.icon}
      </div>
      <div style={{ flex: 1, color: 'var(--text-main)' }}>
        {message}
      </div>
      {onClose && (
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={16} />
        </button>
      )}
    </div>
  );
}
