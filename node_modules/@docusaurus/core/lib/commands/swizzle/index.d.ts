/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { SwizzleOptions } from './common';
export default function swizzle(siteDir: string, themeNameParam: string | undefined, componentNameParam: string | undefined, optionsParam: Partial<SwizzleOptions>): Promise<void>;
