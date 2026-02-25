import React from 'react';

export default function StatusBadge({ status }) {
  const config = {
    pending: { label: 'Pending', class: 'badge-pending' },
    approved: { label: 'Approved', class: 'badge-approved' },
    rejected: { label: 'Rejected', class: 'badge-rejected' },
  };

  const { label, class: cls } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-body ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'approved' ? 'bg-sage-500' :
        status === 'rejected' ? 'bg-red-500' : 'bg-clay-500'
      }`}></span>
      {label}
    </span>
  );
}
