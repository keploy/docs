/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Sidebars } from './sidebars/types';
import type { CategoryGeneratedIndexMetadata, DocMetadata, LoadedVersion } from './types';
import type { GlobalVersion, GlobalSidebar, GlobalDoc } from '@docusaurus/plugin-content-docs/client';
export declare function toGlobalDataDoc(doc: DocMetadata): GlobalDoc;
export declare function toGlobalDataGeneratedIndex(doc: CategoryGeneratedIndexMetadata): GlobalDoc;
export declare function toGlobalSidebars(sidebars: Sidebars, version: LoadedVersion): Record<string, GlobalSidebar>;
export declare function toGlobalDataVersion(version: LoadedVersion): GlobalVersion;
