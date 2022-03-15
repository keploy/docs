/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { GlobalPluginData, GlobalVersion, GetActivePluginOptions, ActivePlugin, ActiveDocContext, DocVersionSuggestions } from '@docusaurus/plugin-content-docs/client';
export declare function getActivePlugin(allPluginDatas: Record<string, GlobalPluginData>, pathname: string, options?: GetActivePluginOptions): ActivePlugin | undefined;
export declare const getLatestVersion: (data: GlobalPluginData) => GlobalVersion;
export declare const getActiveVersion: (data: GlobalPluginData, pathname: string) => GlobalVersion | undefined;
export declare const getActiveDocContext: (data: GlobalPluginData, pathname: string) => ActiveDocContext;
export declare const getDocVersionSuggestions: (data: GlobalPluginData, pathname: string) => DocVersionSuggestions;
