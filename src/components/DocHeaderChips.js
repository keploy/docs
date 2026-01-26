import React from 'react';

/**
 * DocHeaderChips - Minimal metadata strip for doc pages
 * Shows tier/availability as subtle inline badges, not a competing card
 *
 * Usage in MDX:
 * import DocHeaderChips from '@site/src/components/DocHeaderChips';
 * <DocHeaderChips tier="oss" version="4.0.0" />
 * <DocHeaderChips tier="enterprise" />
 *
 * Props:
 * - tier: 'oss' | 'enterprise' | 'cloud' (optional)
 * - version: string (optional, e.g., "4.0.0")
 * - availability: array of strings (optional, e.g., ['cli', 'cloud'])
 */

const tierStyles = {
  oss: {
    label: 'Open Source',
    color: '#059669',
    bg: 'rgba(16, 185, 129, 0.08)',
    dotColor: '#10b981',
  },
  enterprise: {
    label: 'Enterprise',
    color: '#7c3aed',
    bg: 'rgba(139, 92, 246, 0.08)',
    dotColor: '#8b5cf6',
  },
  cloud: {
    label: 'Cloud',
    color: '#2563eb',
    bg: 'rgba(59, 130, 246, 0.08)',
    dotColor: '#3b82f6',
  },
};

export default function DocHeaderChips({ tier, version, availability = [] }) {
  const hasTier = tier && tierStyles[tier.toLowerCase()];
  const hasVersion = version && version.trim();
  const hasAvailability = availability && availability.length > 0;

  // Don't render if nothing to show
  if (!hasTier && !hasVersion && !hasAvailability) return null;

  const tierConfig = hasTier ? tierStyles[tier.toLowerCase()] : null;

  return (
    <div className="doc-meta">
      {tierConfig && (
        <span className="doc-meta__tier" style={{ color: tierConfig.color }}>
          <span className="doc-meta__dot" style={{ background: tierConfig.dotColor }} />
          {tierConfig.label}
        </span>
      )}
      {hasVersion && (
        <span className="doc-meta__version">
          v{version.replace(/^v/i, '')}
        </span>
      )}
      {hasAvailability && (
        <span className="doc-meta__availability">
          {availability.join(' · ')}
        </span>
      )}
      <style>{`
        .doc-meta {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }
        .doc-meta__tier {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-weight: 600;
          letter-spacing: 0.01em;
        }
        .doc-meta__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .doc-meta__version {
          font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
          font-size: 0.6875rem;
          font-weight: 500;
          color: #9ca3af;
          background: rgba(0, 0, 0, 0.04);
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
        }
        .doc-meta__availability {
          color: #9ca3af;
          font-weight: 500;
        }

        /* Dark mode */
        html[data-theme="dark"] .doc-meta {
          color: #9ca3af;
        }
        html[data-theme="dark"] .doc-meta__version {
          color: #6b7280;
          background: rgba(255, 255, 255, 0.06);
        }
        html[data-theme="dark"] .doc-meta__availability {
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}

