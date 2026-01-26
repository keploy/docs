import React from 'react';

/**
 * TierCallout - Compact inline chips for doc metadata
 * Shows tier, platform, and feature tags as small inline chips
 *
 * Usage in MDX:
 * import TierCallout from '@site/src/components/TierCallout';
 *
 * <TierCallout chips={['oss', 'local', 'record-replay']} />
 * <TierCallout chips={['enterprise', 'cloud', 'ebpf']} />
 *
 * Available chips:
 * - Tier: 'oss', 'enterprise', 'cloud'
 * - Platform: 'local', 'docker', 'k8s', 'ci'
 * - Features: 'record-replay', 'ai-gen', 'ebpf', 'kernel-5.10'
 */

const chipStyles = {
  // Tier chips
  oss: { label: 'OSS', color: '#059669', bg: 'rgba(16, 185, 129, 0.1)' },
  'open-source': { label: 'Open Source', color: '#059669', bg: 'rgba(16, 185, 129, 0.1)' },
  enterprise: { label: 'Enterprise', color: '#7c3aed', bg: 'rgba(139, 92, 246, 0.1)' },
  cloud: { label: 'Cloud', color: '#2563eb', bg: 'rgba(59, 130, 246, 0.1)' },

  // Platform chips
  local: { label: 'Local Laptop', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
  docker: { label: 'Docker', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.1)' },
  k8s: { label: 'Kubernetes', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  ci: { label: 'CI/CD', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },

  // Feature chips
  'record-replay': { label: 'Record & Replay', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  'ai-gen': { label: 'AI Generation', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
  ebpf: { label: 'eBPF', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  'kernel-5.10': { label: 'Kernel ≥ 5.10', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
  linux: { label: 'Linux', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
  macos: { label: 'macOS', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
  windows: { label: 'Windows', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.1)' },
};

export default function TierCallout({ chips = [], type, children }) {
  // Support legacy 'type' prop - convert to chips array
  if (type && !chips.length) {
    chips = [type];
  }

  // If children are provided, render as a subtle note (legacy support)
  if (children) {
    return (
      <div className="tier-note">
        {chips.length > 0 && (
          <div className="tier-note__chips">
            {chips.map((chip) => {
              const style = chipStyles[chip.toLowerCase()] || { label: chip, color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' };
              return (
                <span key={chip} className="tier-chip" style={{ color: style.color, background: style.bg }}>
                  {style.label}
                </span>
              );
            })}
          </div>
        )}
        <div className="tier-note__content">{children}</div>
        <style>{`
          .tier-note {
            margin: 0.75rem 0;
            padding: 0.75rem 1rem;
            background: rgba(0, 0, 0, 0.02);
            border-radius: 8px;
            border-left: 3px solid #e5e7eb;
          }
          html[data-theme="dark"] .tier-note {
            background: rgba(255, 255, 255, 0.02);
            border-left-color: #374151;
          }
          .tier-note__chips {
            display: flex;
            flex-wrap: wrap;
            gap: 0.375rem;
            margin-bottom: 0.5rem;
          }
          .tier-note__content {
            font-size: 0.875rem;
            color: #6b7280;
            line-height: 1.5;
          }
          html[data-theme="dark"] .tier-note__content {
            color: #9ca3af;
          }
          .tier-note__content p:last-child {
            margin-bottom: 0;
          }
        `}</style>
      </div>
    );
  }

  // Render as inline chips only
  if (!chips.length) return null;

  return (
    <div className="tier-chips">
      {chips.map((chip) => {
        const style = chipStyles[chip.toLowerCase()] || { label: chip, color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' };
        return (
          <span key={chip} className="tier-chip" style={{ color: style.color, background: style.bg }}>
            {style.label}
          </span>
        );
      })}
      <style>{`
        .tier-chips {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 0.375rem;
          margin-bottom: 0.75rem;
        }
        .tier-chip {
          display: inline-flex;
          align-items: center;
          padding: 0.1875rem 0.5rem;
          font-size: 0.6875rem;
          font-weight: 600;
          border-radius: 4px;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        
        /* Dark mode adjustments */
        html[data-theme="dark"] .tier-chip {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}

