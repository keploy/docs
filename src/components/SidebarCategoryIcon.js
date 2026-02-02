import React from 'react';
import {
  FaBook,
  FaRocket,
  FaCloud,
  FaCode,
  FaCog,
  FaShieldAlt,
  FaPlug,
  FaDatabase,
  FaServer,
  FaTerminal,
  FaLightbulb,
  FaGraduationCap,
  FaTools,
  FaLayerGroup,
  FaProjectDiagram,
  FaChartLine,
  FaLock,
} from 'react-icons/fa';
import {
  SiKubernetes,
  SiDocker,
  SiGithubactions,
} from 'react-icons/si';

/**
 * SidebarCategoryIcon - Icon component for sidebar top-level categories
 *
 * Usage: Import and use in custom sidebar item components
 *
 * @param {string} category - The category identifier
 */

const categoryIcons = {
  // Main categories
  'integration-testing': FaPlug,
  'api-testing': FaRocket,
  'keploy-cloud': FaCloud,
  'quickstart': FaRocket,
  'quickstarts': FaRocket,
  'concepts': FaLightbulb,
  'explanation': FaBook,
  'installation': FaTerminal,
  'configuration': FaCog,
  'running-keploy': FaTerminal,
  'ci-cd': SiGithubactions,
  'security': FaShieldAlt,
  'operation': FaTools,

  // Language / Framework categories
  'java': FaCode,
  'golang': FaCode,
  'python': FaCode,
  'javascript': FaCode,
  'typescript': FaCode,
  'rust': FaCode,

  // Infrastructure
  'docker': SiDocker,
  'kubernetes': SiKubernetes,
  'k8s': SiKubernetes,

  // Features
  'mocking': FaDatabase,
  'mock-registry': FaLayerGroup,
  'deduplication': FaProjectDiagram,
  'test-generation': FaChartLine,

  // Other
  'server': FaServer,
  'gsoc': FaGraduationCap,
  'hacktoberfest': FaGraduationCap,
  'enterprise': FaLock,
  'dependencies': FaLayerGroup,
};

export function getCategoryIcon(categoryLabel) {
  const key = categoryLabel.toLowerCase().replace(/\s+/g, '-');
  return categoryIcons[key] || null;
}

export default function SidebarCategoryIcon({
  category,
  size = 16,
  className = '',
}) {
  const Icon = getCategoryIcon(category);

  if (!Icon) return null;

  return (
    <span
      className={`sidebar-category-icon ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        marginRight: '0.5rem',
        borderRadius: '6px',
        background: 'rgba(139, 92, 246, 0.1)',
        color: '#7c3aed',
        flexShrink: 0,
      }}
    >
      <Icon size={size} />
      <style>{`
        html[data-theme="dark"] .sidebar-category-icon {
          background: rgba(139, 92, 246, 0.15);
          color: #a78bfa;
        }
      `}</style>
    </span>
  );
}

// Export icon mapping for use in sidebar configuration
export { categoryIcons };
