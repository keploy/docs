import React from "react";

/**
 * ProductTier - Compact inline chips for doc metadata
 * Replaces the old large "Tier/Offering" card with small inline chips
 *
 * Usage:
 * <ProductTier tiers="Open Source" />
 * <ProductTier tiers="Open Source, Enterprise" offerings="Self-Hosted" />
 */

const chipStyles = {
  // Tier chips
  'open source': { label: 'OSS', color: '#059669', bg: 'rgba(16, 185, 129, 0.1)' },
  'oss': { label: 'OSS', color: '#059669', bg: 'rgba(16, 185, 129, 0.1)' },
  'enterprise': { label: 'Enterprise', color: '#7c3aed', bg: 'rgba(139, 92, 246, 0.1)' },
  'cloud': { label: 'Cloud', color: '#2563eb', bg: 'rgba(59, 130, 246, 0.1)' },

  // Offering chips - simplified labels
  'self-hosted': { label: 'Self-Hosted', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.08)' },
  'dedicated': { label: 'Dedicated', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.08)' },
  'local': { label: 'Local', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.08)' },
};

const ProductTier = ({ tiers, offerings }) => {
  // Parse tiers and offerings into arrays
  const tierList = tiers
    ? (Array.isArray(tiers) ? tiers : tiers.split(',').map(t => t.trim()))
    : [];

  // Skip offerings that are confusing for OSS (like "Self-Hosted, Dedicated")
  // Only show offerings if explicitly needed
  const offeringList = offerings && !tierList.some(t => t.toLowerCase().includes('open source'))
    ? (Array.isArray(offerings) ? offerings : offerings.split(',').map(o => o.trim()))
    : [];

  const allChips = [...tierList, ...offeringList];

  if (allChips.length === 0) return null;

  return (
    <div className="product-tier-chips">
      {allChips.map((chip, index) => {
        const key = chip.toLowerCase().trim();
        const style = chipStyles[key] || {
          label: chip.trim(),
          color: '#6b7280',
          bg: 'rgba(107, 114, 128, 0.08)'
        };
        return (
          <span
            key={index}
            className="product-tier-chip"
            style={{ color: style.color, background: style.bg }}
          >
            {style.label}
          </span>
        );
      })}
      <style>{`
        .product-tier-chips {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 0.375rem;
          margin-bottom: 0;
        }
        .product-tier-chip {
          display: inline-flex;
          align-items: center;
          padding: 0.1875rem 0.5rem;
          font-size: 0.6875rem;
          font-weight: 600;
          border-radius: 4px;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        html[data-theme="dark"] .product-tier-chip {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default ProductTier;
