import React from 'react';
import { CheckCircle2, Circle, XCircle } from 'lucide-react';

export default function BookingStatusTimeline({ status }) {
  // PENDING -> APPROVED -> (CANCELLED)
  // PENDING -> REJECTED
  const currentStatus = status?.toUpperCase();

  let steps = [];

  if (currentStatus === 'REJECTED') {
    steps = [
      { label: 'Pending', active: true, icon: <CheckCircle2 size={16} /> },
      { label: 'Rejected', active: true, isError: true, icon: <XCircle size={16} /> }
    ];
  } else if (currentStatus === 'CANCELLED') {
    steps = [
      { label: 'Pending', active: true, icon: <CheckCircle2 size={16} /> },
      { label: 'Approved', active: true, icon: <CheckCircle2 size={16} /> },
      { label: 'Cancelled', active: true, isNeutral: true, icon: <XCircle size={16} /> }
    ];
  } else {
    // Normal flow PENDING or APPROVED
    steps = [
      { 
        label: 'Pending', 
        active: currentStatus === 'PENDING' || currentStatus === 'APPROVED', 
        icon: currentStatus === 'PENDING' || currentStatus === 'APPROVED' ? <CheckCircle2 size={16} /> : <Circle size={16} /> 
      },
      { 
        label: 'Approved', 
        active: currentStatus === 'APPROVED', 
        icon: currentStatus === 'APPROVED' ? <CheckCircle2 size={16} /> : <Circle size={16} /> 
      }
    ];
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '0.8rem' }}>
      {steps.map((step, index) => {
        let color = 'var(--text-light)'; // default inactive
        if (step.active) {
          color = step.isError ? 'var(--danger)' : step.isNeutral ? 'var(--neutral)' : 'var(--primary-dark)';
        }

        return (
          <React.Fragment key={index}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color, fontWeight: step.active ? '600' : '500' }}>
              {step.icon}
              <span>{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div style={{ height: '2px', width: '20px', background: step.active ? color : 'var(--border)', borderRadius: '2px' }}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
