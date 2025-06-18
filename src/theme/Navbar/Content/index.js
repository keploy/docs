/**
 * Enhanced Navbar Content Component - Fixed for Docusaurus
 * Keeps original structure while adding modern enhancements
 */
import React from 'react';
import clsx from 'clsx';
import {
  useThemeConfig,
  ErrorCauseBoundary,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import NavbarItem from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import SearchBar from '@theme/SearchBar';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import NavbarLogo from '@theme/Navbar/Logo';
import NavbarSearch from '@theme/Navbar/Search';

function useNavbarItems() {
  return useThemeConfig().navbar.items;
}

function NavbarItems({ items }) {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.
Please double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:
${JSON.stringify(item, null, 2)}`,
              { cause: error },
            )
          }>
          <div className="navbar__item text-white transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:text-indigo-400">
            <NavbarItem {...item} />
          </div>
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

function NavbarContentLayout({ left, right }) {
  return (
    <div className="navbar__inner">
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerLeft,
          'navbar__items flex items-center space-x-2 text-white'
        )}>
        {left}
      </div>
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerRight,
          'navbar__items navbar__items--right flex items-center space-x-2 text-white'
        )}>
        {right}
      </div>
    </div>
  );
}

export default function NavbarContent() {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);
  const searchBarItem = items.find((item) => item.type === 'search');

  return (
    <NavbarContentLayout
      left={
        <>
          {!mobileSidebar.disabled && (
            <div className="navbar__toggle transition-all duration-200 hover:scale-105 text-white">
              <NavbarMobileSidebarToggle />
            </div>
          )}
          <div className="navbar__brand transition-all duration-200 hover:scale-105 text-white">
            <NavbarLogo />
          </div>
          <NavbarItems items={leftItems} />
        </>
      }
      right={
        <>
          <NavbarItems items={rightItems} />
          <div className="navbar__toggle transition-all duration-200 hover:scale-105 text-white">
            <NavbarColorModeToggle />
          </div>
          {!searchBarItem && (
            <div className="navbar__search transition-all duration-200 hover:scale-105 text-white">
              <NavbarSearch>
                <SearchBar />
              </NavbarSearch>
            </div>
          )}
        </>
      }
    />
  );
}
