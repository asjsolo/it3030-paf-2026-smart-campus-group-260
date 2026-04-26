import React from 'react';
import { BadgeCheck, Clock, XCircle, Ban } from 'lucide-react';

export default function StatusBadge({ status }) {
  const getBadgeProps = (statusStr) => {
    switch (statusStr?.toUpperCase()) {
      case 'PENDING':
        return { className: 'badge badge-pending', icon: <Clock size={14} />, text: 'Pending' };
      case 'APPROVED':
        return { className: 'badge badge-approved', icon: <BadgeCheck size={14} />, text: 'Approved' };
      case 'REJECTED':
        return { className: 'badge badge-rejected', icon: <XCircle size={14} />, text: 'Rejected' };
      case 'CANCELLED':
        return { className: 'badge badge-cancelled', icon: <Ban size={14} />, text: 'Cancelled' };
      default:
        return { className: 'badge', icon: null, text: statusStr || 'Unknown' };
    }
  };

  const props = getBadgeProps(status);

  return (
    <span className={props.className}>
      {props.icon} {props.text}
    </span>
  );
}
