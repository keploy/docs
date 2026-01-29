import React from 'react';
import { FaLock, FaUnlock, FaCloud } from 'react-icons/fa';

/**
 * SidebarBadge - Small badge/chip for sidebar labels with clear Enterprise vs OSS distinction
 *
 * Usage in sidebar label customization or MDX:
 * <SidebarBadge type="oss" />
 * <SidebarBadge type="enterprise" />
 * <SidebarBadge type="cloud" />
 */

const badgeTypes = {
  oss: {
    label: 'OSS',
    icon: FaUnlock,
    bg: '#10b981',
    color: '#fff',
  },
  enterprise: {
    label: 'Enterprise',
    icon: FaLock,
    bg: '#7c3aed',
    color: '#fff',
  },
  cloud: {
    label: 'Cloud',
    icon: FaCloud,
    bg: '#3b82f6',
    color: '#fff',
  },
  beta: {
    label: 'Beta',
    icon: null,
    bg: 'rgba(245, 158, 11, 0.15)',
    color: '#d97706',
  },
  new: {
    label: 'New',
    icon: null,
    bg: 'rgba(236, 72, 153, 0.15)',
    color: '#db2777',
  },
};

export default function SidebarBadge({ type = 'oss', showIcon = true }) {
  const config = badgeTypes[type.toLowerCase()];
  if (!config) return null;
  const Icon = config.icon;
  const isPrimary = ['oss', 'enterprise', 'cloud'].includes(type.toLowerCase());

  return (
    <span
      className="sidebar-badge-v2"
      style={{
        background: config.bg,
        color: config.color,
        padding: isPrimary ? '0.125rem 0.4rem' : '0.1rem 0.35rem',
        fontSize: '0.625rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        borderRadius: '4px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.2rem',
        marginLeft: '0.4rem',
        verticalAlign: 'middle',
        lineHeight: 1,
        boxShadow: isPrimary ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      {showIcon && Icon && <Icon size={8} />}
      {config.label}
    </span>
  );
}

