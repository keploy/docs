import React from 'react';
import clsx from 'clsx';
import NavbarNavLink from '@theme/NavbarItem/NavbarNavLink';
export default function DefaultNavbarItemMobile({
  className,
  isDropdownItem,
  ...props
}) {
  return (
    <li className="menu__list-item">
      <NavbarNavLink className={clsx('menu__link', className)} {...props} />
    </li>
  );
}
