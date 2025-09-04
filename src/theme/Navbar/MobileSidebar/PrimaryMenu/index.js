import React, {useState} from "react";
import {useThemeConfig} from '@docusaurus/theme-common';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import NavbarItem from '@theme/NavbarItem';
import Link from "@docusaurus/Link";
function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items;
}
// The primary menu displays the navbar items
export default function NavbarMobilePrimaryMenu() {
  const [showProduct, setShowProduct] = useState(false);
  const [showBlog, setShowBlog] = useState(false);

  const mobileSidebar = useNavbarMobileSidebar();
  // TODO how can the order be defined for mobile?
  // Should we allow providing a different list of items?
  const items = useNavbarItems();
  return (
    <ul className="menu__list">

      <li className="menu__list-item">
        <button
          className="menu__link w-full"
          onClick={() => setShowProduct(!showProduct)}
          aria-expanded={showProduct}
          aria-controls="product-submenu"
          aria-haspopup="true"
        >
          <div className="flex justify-between items-center w-full">
            <div>Product</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`size-5 transition-transform duration-300 stroke-[3] ${
                showProduct ? 'rotate-90' : 'rotate-0'
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </button>

        {showProduct && (
          <ul
            id="product-submenu"
            className="menu__list "
            role="menu"
            aria-label="Product Submenu"
          >
            <li className="menu__list-item" role="none">
              <Link className="menu__link" role="menuitem" to="/running-keploy/utg-pr-agent/">
                Unit Testing
              </Link>
            </li>
            <li className="menu__list-item" role="none">
              <Link className="menu__link" role="menuitem" to="/keploy-explained/introduction">
                API Testing
              </Link>
            </li>
            <li className="menu__list-item" role="none">
              <Link className="menu__link" role="menuitem" to="/running-keploy/about-api-testing">
                Integration Testing
              </Link>
            </li>
          </ul>
        )}
      </li>

      <li className="menu__list-item">
        <button
          className="menu__link w-full"
          onClick={() => setShowBlog(!showBlog)}
          aria-expanded={showBlog}
          aria-controls="blog-submenu"
          aria-haspopup="true"
        >
          <div className="flex justify-between items-center w-full">
            <div>Blog</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`size-5 transition-transform duration-300 stroke-[3] ${
                showBlog ? 'rotate-90' : 'rotate-0'
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </button>

        {showBlog && (
          <ul
            id="blog-submenu"
            className="menu__list "
            role="menu"
            aria-label="Blog Submenu"
          >
            <li className="menu__list-item" role="none">
              <Link className="menu__link" role="menuitem" to="https://keploy.io/blog/technology">
                Technical Blogs
              </Link>
            </li>
            <li className="menu__list-item" role="none">
              <Link className="menu__link" role="menuitem" to="https://keploy.io/blog/community">
                Community Articles
              </Link>
            </li>
            <li className="menu__list-item" role="none">
              <Link className="menu__link" role="menuitem" to="/concepts/reference/glossary/">
                Glossary
              </Link>
            </li>
          </ul>
        )}
      </li>


      {items.map((item, i) => (
        <NavbarItem
          mobile
          {...item}
          onClick={() => mobileSidebar.toggle()}
          key={i}
        />
      ))}
    </ul>
  );
}
