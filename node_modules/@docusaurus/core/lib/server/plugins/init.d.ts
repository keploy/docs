/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import type { ImportedPluginModule, LoadContext, PluginModule, PluginConfig, PluginOptions, InitializedPlugin } from '@docusaurus/types';
export declare type NormalizedPluginConfig = {
    plugin: PluginModule;
    options: PluginOptions;
    pluginModule?: {
        path: string;
        module: ImportedPluginModule;
    };
};
export declare function normalizePluginConfigs(pluginConfigs: PluginConfig[], pluginRequire: NodeRequire): Promise<NormalizedPluginConfig[]>;
export default function initPlugins({ pluginConfigs, context, }: {
    pluginConfigs: PluginConfig[];
    context: LoadContext;
}): Promise<InitializedPlugin[]>;
