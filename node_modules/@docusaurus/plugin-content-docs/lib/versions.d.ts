/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { VersionMetadata } from './types';
import type { PluginOptions, VersionBanner } from '@docusaurus/plugin-content-docs';
import type { LoadContext } from '@docusaurus/types';
export declare function getVersionedDocsDirPath(siteDir: string, pluginId: string): string;
export declare function getVersionedSidebarsDirPath(siteDir: string, pluginId: string): string;
export declare function getVersionsFilePath(siteDir: string, pluginId: string): string;
export declare function readVersionsFile(siteDir: string, pluginId: string): Promise<string[] | null>;
export declare function readVersionNames(siteDir: string, options: Pick<PluginOptions, 'id' | 'disableVersioning' | 'includeCurrentVersion'>): Promise<string[]>;
export declare function getDefaultVersionBanner({ versionName, versionNames, lastVersionName, }: {
    versionName: string;
    versionNames: string[];
    lastVersionName: string;
}): VersionBanner | null;
export declare function getVersionBanner({ versionName, versionNames, lastVersionName, options, }: {
    versionName: string;
    versionNames: string[];
    lastVersionName: string;
    options: Pick<PluginOptions, 'versions'>;
}): VersionBanner | null;
export declare function getVersionBadge({ versionName, versionNames, options, }: {
    versionName: string;
    versionNames: string[];
    options: Pick<PluginOptions, 'versions'>;
}): boolean;
/**
 * Filter versions according to provided options.
 * Note: we preserve the order in which versions are provided;
 * the order of the onlyIncludeVersions array does not matter
 */
export declare function filterVersions(versionNamesUnfiltered: string[], options: Pick<PluginOptions, 'onlyIncludeVersions'>): string[];
export declare function readVersionsMetadata({ context, options, }: {
    context: Pick<LoadContext, 'siteDir' | 'baseUrl' | 'i18n'>;
    options: Pick<PluginOptions, 'id' | 'path' | 'sidebarPath' | 'routeBasePath' | 'tagsBasePath' | 'includeCurrentVersion' | 'disableVersioning' | 'lastVersion' | 'versions' | 'onlyIncludeVersions' | 'editUrl' | 'editCurrentVersion'>;
}): Promise<VersionMetadata[]>;
export declare function getDocsDirPaths(versionMetadata: Pick<VersionMetadata, 'contentPath' | 'contentPathLocalized'>): [string, string];
