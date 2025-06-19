import React from "react";
import { useLocation } from "@docusaurus/router";
import DropdownNavbarItem from "@theme-original/NavbarItem/DropdownNavbarItem";

export default function DropdownNavbarItemWrapper(props) {
  const { search, hash } = useLocation();

  // Update the first item's link dynamically
  props.items[0].to = `/server/installation/${search}${hash}`;

  return (
    <div className="relative group">
      <DropdownNavbarItem
        {...props}
        className="transition duration-300 ease-in-out text-gray-700 hover:text-keploybrightblue"
      />
      <div
        className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50"
      >
        {props.items.map((item, idx) => (
          <a
            key={idx}
            href={item.to}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-keployblue hover:text-black"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
