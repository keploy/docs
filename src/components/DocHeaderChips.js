import React from 'react';
import { FaLock, FaUnlock, FaCloud, FaServer, FaFlask, FaStar } from 'react-icons/fa';

/**
 * DocHeaderChips - Display tier/offering badges at the top of doc pages
 * Replaces the old gray "Tier/Offering" box with a modern badge row
 *
 * Usage in MDX:
 * import DocHeaderChips from '@site/src/components/DocHeaderChips';
 * <DocHeaderChips chips={['enterprise', 'cloud']} />
 *
 * Available chip types: 'enterprise', 'oss', 'cloud', 'selfhosted', 'dedicated', 'beta', 'new'
 */

const chipConfig = {
  enterprise: {
    label: 'Enterprise',
    icon: FaLock,
    bg: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    color: '#fff',
    borderColor: 'transparent',
  },
  oss: {
    label: 'Open Source',
    icon: FaUnlock,
    bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#fff',
    borderColor: 'transparent',
  },
  cloud: {
    label: 'Cloud',
    icon: FaCloud,
    bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#fff',
    borderColor: 'transparent',
  },
  selfhosted: {
    label: 'Self-hosted',
    icon: FaServer,
    bg: 'rgba(16, 185, 129, 0.1)',
    color: '#059669',
    borderColor: '#10b981',
  },
  dedicated: {
    label: 'Dedicated',
    icon: FaServer,
    bg: 'rgba(59, 130, 246, 0.1)',
    color: '#2563eb',
    borderColor: '#3b82f6',
  },
  beta: {
    label: 'Beta',
    icon: FaFlask,
    bg: 'rgba(245, 158, 11, 0.1)',
    color: '#d97706',
    borderColor: '#f59e0b',
  },
  new: {
    label: 'New',
    icon: FaStar,
    bg: 'rgba(236, 72, 153, 0.1)',
    color: '#db2777',
    borderColor: '#ec4899',
  },
};

export default function DocHeaderChips({ chips = [] }) {
  if (!chips || chips.length === 0) return null;

  return (
    <div className="doc-chips-container">
      {chips.map((chip) => {
        const config = chipConfig[chip.toLowerCase()];
        if (!config) return null;
        const Icon = config.icon;
        const isPrimary = ['enterprise', 'oss', 'cloud'].includes(chip.toLowerCase());

        return (
          <span
            key={chip}
            className={`doc-chip ${isPrimary ? 'doc-chip--primary' : 'doc-chip--secondary'}`}
            style={{
              background: config.bg,
              color: config.color,
              border: isPrimary ? 'none' : `1px solid ${config.borderColor}`,
            }}
          >
            <Icon size={12} />
            {config.label}
          </span>
        );
      })}
      <style>{`
        .doc-chips-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          margin-top: -0.5rem;
        }
        .doc-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-radius: 6px;
          white-space: nowrap;
        }
        .doc-chip--primary {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .doc-chip--secondary {
          background: transparent !important;
        }
        html[data-theme="dark"] .doc-chip--secondary {
          border-color: currentColor !important;
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}

