import React from 'react';
import DocSidebarItemCategory from '@theme-original/DocSidebarItem/Category';
import { getCategoryIcon } from '@site/src/components/SidebarCategoryIcon';

export default function DocSidebarItemCategoryWrapper(props) {
  const { item, level } = props;
  const Icon = level === 1 ? getCategoryIcon(item.label) : null;

  // Only add icon styling for top-level categories
  if (level === 1 && Icon) {
    return (
      <div className="sidebar-category-with-icon">
        <style>{`
          .sidebar-category-with-icon > .menu__list-item-collapsible > a.menu__link,
          .sidebar-category-with-icon > a.menu__link--sublist {
            display: flex;
            align-items: center;
          }
          .sidebar-category-with-icon > .menu__list-item-collapsible > a.menu__link::before,
          .sidebar-category-with-icon > a.menu__link--sublist::before {
            content: '';
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            margin-right: 0.5rem;
            border-radius: 6px;
            background: rgba(139, 92, 246, 0.1);
            flex-shrink: 0;
          }
          html[data-theme="dark"] .sidebar-category-with-icon > .menu__list-item-collapsible > a.menu__link::before,
          html[data-theme="dark"] .sidebar-category-with-icon > a.menu__link--sublist::before {
            background: rgba(139, 92, 246, 0.15);
          }
        `}</style>
        <DocSidebarItemCategory {...props} />
      </div>
    );
  }

  return <DocSidebarItemCategory {...props} />;
}

