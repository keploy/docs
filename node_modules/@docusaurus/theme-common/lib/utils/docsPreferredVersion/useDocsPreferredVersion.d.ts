/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="@docusaurus/plugin-content-docs" />
import { type GlobalVersion } from '@docusaurus/plugin-content-docs/client';
export declare function useDocsPreferredVersion(pluginId?: string | undefined): {
    preferredVersion: GlobalVersion | null | undefined;
    savePreferredVersionName: (versionName: string) => void;
};
export declare function useDocsPreferredVersionByPluginId(): Record<string, GlobalVersion | null | undefined>;
//# sourceMappingURL=useDocsPreferredVersion.d.ts.map