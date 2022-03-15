/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { type ReactNode } from 'react';
declare type DocSidebarItemsExpandedState = {
    expandedItem: number | null;
    setExpandedItem: (a: number | null) => void;
};
export declare function DocSidebarItemsExpandedStateProvider({ children, }: {
    children: ReactNode;
}): JSX.Element;
export declare function useDocSidebarItemsExpandedState(): DocSidebarItemsExpandedState;
export {};
//# sourceMappingURL=docSidebarItemsExpandedState.d.ts.map