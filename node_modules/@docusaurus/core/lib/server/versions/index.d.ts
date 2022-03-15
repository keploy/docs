/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { DocusaurusPluginVersionInformation } from '@docusaurus/types';
export declare function getPackageJsonVersion(packageJsonPath: string): Promise<string | undefined>;
export declare function getPluginVersion(pluginPath: string, siteDir: string): Promise<DocusaurusPluginVersionInformation>;
