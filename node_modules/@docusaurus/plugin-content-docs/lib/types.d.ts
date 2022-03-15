/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Sidebars } from './sidebars/types';
import type { Tag, FrontMatterTag } from '@docusaurus/utils';
import type { BrokenMarkdownLink as IBrokenMarkdownLink, ContentPaths } from '@docusaurus/utils/lib/markdownLinks';
import type { VersionBanner } from '@docusaurus/plugin-content-docs';
export declare type DocFile = {
    contentPath: string;
    filePath: string;
    source: string;
    content: string;
    lastUpdate: LastUpdateData;
};
export declare type VersionMetadata = ContentPaths & {
    versionName: string;
    versionLabel: string;
    versionPath: string;
    tagsPath: string;
    versionEditUrl?: string | undefined;
    versionEditUrlLocalized?: string | undefined;
    versionBanner: VersionBanner | null;
    versionBadge: boolean;
    versionClassName: string;
    isLast: boolean;
    sidebarFilePath: string | false | undefined;
    routePriority: number | undefined;
};
export declare type LastUpdateData = {
    lastUpdatedAt?: number;
    formattedLastUpdatedAt?: string;
    lastUpdatedBy?: string;
};
export declare type DocFrontMatter = {
    id?: string;
    title?: string;
    tags?: FrontMatterTag[];
    hide_title?: boolean;
    hide_table_of_contents?: boolean;
    keywords?: string[];
    image?: string;
    description?: string;
    slug?: string;
    sidebar_label?: string;
    sidebar_position?: number;
    sidebar_class_name?: string;
    sidebar_custom_props?: Record<string, unknown>;
    displayed_sidebar?: string | null;
    pagination_label?: string;
    custom_edit_url?: string | null;
    parse_number_prefixes?: boolean;
    toc_min_heading_level?: number;
    toc_max_heading_level?: number;
    pagination_next?: string | null;
    pagination_prev?: string | null;
};
export declare type DocMetadataBase = LastUpdateData & {
    id: string;
    unversionedId: string;
    version: string;
    title: string;
    description: string;
    source: string;
    sourceDirName: string;
    slug: string;
    permalink: string;
    sidebarPosition?: number;
    editUrl?: string | null;
    tags: Tag[];
    frontMatter: DocFrontMatter & Record<string, unknown>;
};
export declare type DocNavLink = {
    title: string;
    permalink: string;
};
export declare type DocMetadata = DocMetadataBase & {
    sidebar?: string;
    previous?: DocNavLink;
    next?: DocNavLink;
};
export declare type CategoryGeneratedIndexMetadata = {
    title: string;
    description?: string;
    slug: string;
    permalink: string;
    sidebar: string;
    previous?: DocNavLink;
    next?: DocNavLink;
    image?: string;
    keywords?: string | readonly string[];
};
export declare type SourceToPermalink = {
    [source: string]: string;
};
export declare type VersionTag = {
    name: string;
    docIds: string[];
    permalink: string;
};
export declare type VersionTags = {
    [key: string]: VersionTag;
};
export declare type LoadedVersion = VersionMetadata & {
    versionPath: string;
    mainDocId: string;
    docs: DocMetadata[];
    sidebars: Sidebars;
    categoryGeneratedIndices: CategoryGeneratedIndexMetadata[];
};
export declare type LoadedContent = {
    loadedVersions: LoadedVersion[];
};
export declare type BrokenMarkdownLink = IBrokenMarkdownLink<VersionMetadata>;
export declare type DocsMarkdownOption = {
    versionsMetadata: VersionMetadata[];
    siteDir: string;
    sourceToPermalink: SourceToPermalink;
    onBrokenMarkdownLink: (brokenMarkdownLink: BrokenMarkdownLink) => void;
};
