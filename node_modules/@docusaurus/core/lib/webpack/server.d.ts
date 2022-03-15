/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Configuration } from 'webpack';
import type { Props } from '@docusaurus/types';
export default function createServerConfig({ props, onLinksCollected, }: {
    props: Props;
    onLinksCollected?: (staticPagePath: string, links: string[]) => void;
}): Promise<Configuration>;
