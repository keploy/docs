/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { BlogContent } from './types';
import type { LoadContext, Plugin, OptionValidationContext, ValidationResult } from '@docusaurus/types';
import type { PluginOptions } from '@docusaurus/plugin-content-blog';
export default function pluginContentBlog(context: LoadContext, options: PluginOptions): Promise<Plugin<BlogContent>>;
export declare function validateOptions({ validate, options, }: OptionValidationContext<PluginOptions>): ValidationResult<PluginOptions>;
