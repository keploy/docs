/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { TOCItem } from '@docusaurus/types';
export declare type TOCTreeNode = {
    readonly value: string;
    readonly id: string;
    readonly level: number;
    readonly children: readonly TOCTreeNode[];
};
export declare function useTreeifiedTOC(toc: TOCItem[]): readonly TOCTreeNode[];
export declare function useFilteredAndTreeifiedTOC({ toc, minHeadingLevel, maxHeadingLevel, }: {
    toc: readonly TOCItem[];
    minHeadingLevel: number;
    maxHeadingLevel: number;
}): readonly TOCTreeNode[];
//# sourceMappingURL=tocUtils.d.ts.map