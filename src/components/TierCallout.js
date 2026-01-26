import React from 'react';
import { FaLock, FaUnlock, FaCloud, FaInfoCircle, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

/**
 * TierCallout - A callout box to clearly indicate Enterprise, OSS, or Cloud features
 *
 * Usage in MDX:
 * import TierCallout from '@site/src/components/TierCallout';
 *
 * <TierCallout type="enterprise">
 *   This feature is only available in Enterprise.
 * </TierCallout>
 *
 * <TierCallout type="oss">
 *   This feature is available in the open source version.
 * </TierCallout>
 */

const tierConfig = {
  enterprise: {
    icon: FaLock,
    label: 'Enterprise Feature',
    gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.04) 100%)',
    borderColor: '#8b5cf6',
    accentColor: '#7c3aed',
    iconBg: 'rgba(139, 92, 246, 0.15)',
  },
  oss: {
    icon: FaUnlock,
    label: 'Open Source',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.04) 100%)',
    borderColor: '#10b981',
    accentColor: '#059669',
    iconBg: 'rgba(16, 185, 129, 0.15)',
  },
  cloud: {
    icon: FaCloud,
    label: 'Cloud Only',
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.04) 100%)',
    borderColor: '#3b82f6',
    accentColor: '#2563eb',
    iconBg: 'rgba(59, 130, 246, 0.15)',
  },
  info: {
    icon: FaInfoCircle,
    label: 'Note',
    gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.04) 100%)',
    borderColor: '#6366f1',
    accentColor: '#4f46e5',
    iconBg: 'rgba(99, 102, 241, 0.15)',
  },
  warning: {
    icon: FaExclamationTriangle,
    label: 'Warning',
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.04) 100%)',
    borderColor: '#f59e0b',
    accentColor: '#d97706',
    iconBg: 'rgba(245, 158, 11, 0.15)',
  },
  success: {
    icon: FaCheckCircle,
    label: 'Success',
    gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.04) 100%)',
    borderColor: '#22c55e',
    accentColor: '#16a34a',
    iconBg: 'rgba(34, 197, 94, 0.15)',
  },
};

export default function TierCallout({ type = 'info', title, children }) {
  const config = tierConfig[type.toLowerCase()] || tierConfig.info;
  const Icon = config.icon;
  const displayTitle = title || config.label;

  return (
    <div className={`tier-callout tier-callout--${type}`}>
      <div className="tier-callout__icon-wrapper">
        <Icon className="tier-callout__icon" />
      </div>
      <div className="tier-callout__body">
        <div className="tier-callout__title">{displayTitle}</div>
        <div className="tier-callout__content">{children}</div>
      </div>
      <style>{`
        .tier-callout {
          display: flex;
          gap: 1rem;
          margin: 1.5rem 0;
          padding: 1.25rem 1.5rem;
          border-radius: 14px;
          border: 1px solid transparent;
          position: relative;
          overflow: hidden;
        }
        .tier-callout::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          border-radius: 14px 0 0 14px;
        }
        .tier-callout--enterprise {
          background: ${tierConfig.enterprise.gradient};
          border-color: rgba(139, 92, 246, 0.2);
        }
        .tier-callout--enterprise::before {
          background: linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%);
        }
        .tier-callout--oss {
          background: ${tierConfig.oss.gradient};
          border-color: rgba(16, 185, 129, 0.2);
        }
        .tier-callout--oss::before {
          background: linear-gradient(180deg, #10b981 0%, #059669 100%);
        }
        .tier-callout--cloud {
          background: ${tierConfig.cloud.gradient};
          border-color: rgba(59, 130, 246, 0.2);
        }
        .tier-callout--cloud::before {
          background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
        }
        .tier-callout--info {
          background: ${tierConfig.info.gradient};
          border-color: rgba(99, 102, 241, 0.2);
        }
        .tier-callout--info::before {
          background: linear-gradient(180deg, #6366f1 0%, #4f46e5 100%);
        }
        .tier-callout--warning {
          background: ${tierConfig.warning.gradient};
          border-color: rgba(245, 158, 11, 0.2);
        }
        .tier-callout--warning::before {
          background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
        }
        .tier-callout--success {
          background: ${tierConfig.success.gradient};
          border-color: rgba(34, 197, 94, 0.2);
        }
        .tier-callout--success::before {
          background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
        }
        
        /* Dark mode */
        html[data-theme="dark"] .tier-callout--enterprise {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(139, 92, 246, 0.06) 100%);
          border-color: rgba(139, 92, 246, 0.25);
        }
        html[data-theme="dark"] .tier-callout--oss {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0.06) 100%);
          border-color: rgba(16, 185, 129, 0.25);
        }
        html[data-theme="dark"] .tier-callout--cloud {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(59, 130, 246, 0.06) 100%);
          border-color: rgba(59, 130, 246, 0.25);
        }
        html[data-theme="dark"] .tier-callout--info {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(99, 102, 241, 0.06) 100%);
          border-color: rgba(99, 102, 241, 0.25);
        }
        html[data-theme="dark"] .tier-callout--warning {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(245, 158, 11, 0.06) 100%);
          border-color: rgba(245, 158, 11, 0.25);
        }
        html[data-theme="dark"] .tier-callout--success {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.18) 0%, rgba(34, 197, 94, 0.06) 100%);
          border-color: rgba(34, 197, 94, 0.25);
        }

        .tier-callout__icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tier-callout--enterprise .tier-callout__icon-wrapper {
          background: ${tierConfig.enterprise.iconBg};
          color: #7c3aed;
        }
        .tier-callout--oss .tier-callout__icon-wrapper {
          background: ${tierConfig.oss.iconBg};
          color: #059669;
        }
        .tier-callout--cloud .tier-callout__icon-wrapper {
          background: ${tierConfig.cloud.iconBg};
          color: #2563eb;
        }
        .tier-callout--info .tier-callout__icon-wrapper {
          background: ${tierConfig.info.iconBg};
          color: #4f46e5;
        }
        .tier-callout--warning .tier-callout__icon-wrapper {
          background: ${tierConfig.warning.iconBg};
          color: #d97706;
        }
        .tier-callout--success .tier-callout__icon-wrapper {
          background: ${tierConfig.success.iconBg};
          color: #16a34a;
        }

        html[data-theme="dark"] .tier-callout--enterprise .tier-callout__icon-wrapper { color: #a78bfa; }
        html[data-theme="dark"] .tier-callout--oss .tier-callout__icon-wrapper { color: #34d399; }
        html[data-theme="dark"] .tier-callout--cloud .tier-callout__icon-wrapper { color: #60a5fa; }
        html[data-theme="dark"] .tier-callout--info .tier-callout__icon-wrapper { color: #818cf8; }
        html[data-theme="dark"] .tier-callout--warning .tier-callout__icon-wrapper { color: #fbbf24; }
        html[data-theme="dark"] .tier-callout--success .tier-callout__icon-wrapper { color: #4ade80; }

        .tier-callout__icon {
          width: 18px;
          height: 18px;
        }
        .tier-callout__body {
          flex: 1;
          min-width: 0;
        }
        .tier-callout__title {
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.375rem;
        }
        .tier-callout--enterprise .tier-callout__title { color: #7c3aed; }
        .tier-callout--oss .tier-callout__title { color: #059669; }
        .tier-callout--cloud .tier-callout__title { color: #2563eb; }
        .tier-callout--info .tier-callout__title { color: #4f46e5; }
        .tier-callout--warning .tier-callout__title { color: #d97706; }
        .tier-callout--success .tier-callout__title { color: #16a34a; }

        html[data-theme="dark"] .tier-callout--enterprise .tier-callout__title { color: #a78bfa; }
        html[data-theme="dark"] .tier-callout--oss .tier-callout__title { color: #34d399; }
        html[data-theme="dark"] .tier-callout--cloud .tier-callout__title { color: #60a5fa; }
        html[data-theme="dark"] .tier-callout--info .tier-callout__title { color: #818cf8; }
        html[data-theme="dark"] .tier-callout--warning .tier-callout__title { color: #fbbf24; }
        html[data-theme="dark"] .tier-callout--success .tier-callout__title { color: #4ade80; }

        .tier-callout__content {
          font-size: 0.9375rem;
          line-height: 1.65;
          color: #374151;
        }
        html[data-theme="dark"] .tier-callout__content {
          color: #d1d5db;
        }
        .tier-callout__content p:last-child {
          margin-bottom: 0;
        }
        .tier-callout__content code {
          background: rgba(0, 0, 0, 0.06);
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-size: 0.875em;
        }
        html[data-theme="dark"] .tier-callout__content code {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}

