import React from "react";
import {useLocation} from "@docusaurus/router";
import DropdownNavbarItem from "@theme-original/NavbarItem/DropdownNavbarItem";

export default function DropdownNavbarItemWrapper(props) {
  const {search, hash} = useLocation();
  props.items[0].to = `/docs/server/windows/installation${search}${hash}`;
  return (
    <>
      <DropdownNavbarItem {...props} />
    </>
  );
}
