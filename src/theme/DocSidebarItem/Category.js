import React from "react";
import DocSidebarItemCategory from "@theme-original/DocSidebarItem/Category";

// Sidebar categories render as Docusaurus draws them. Top-level groups are
// styled as small-caps headings through their `sidebar-group` className
// (versioned_sidebars/*), in src/css/docs-theme.css.
export default function DocSidebarItemCategoryWrapper(props) {
  return <DocSidebarItemCategory {...props} />;
}
