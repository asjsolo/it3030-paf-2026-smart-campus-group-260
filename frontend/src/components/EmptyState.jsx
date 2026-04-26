import React from 'react';

export default function EmptyState({ icon, title, description, actionButton }) {
  return (
    <div className="empty-state">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--text-light)' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-main)' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: actionButton ? '24px' : '0', maxWidth: '400px', margin: '0 auto 24px auto' }}>
        {description}
      </p>
      {actionButton && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {actionButton}
        </div>
      )}
    </div>
  );
}
