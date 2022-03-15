/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { BlogContent } from './types';
import type { TranslationFiles } from '@docusaurus/types';
import type { PluginOptions } from '@docusaurus/plugin-content-blog';
export declare function getTranslationFiles(options: PluginOptions): TranslationFiles;
export declare function translateContent(content: BlogContent, translationFiles: TranslationFiles): BlogContent;
