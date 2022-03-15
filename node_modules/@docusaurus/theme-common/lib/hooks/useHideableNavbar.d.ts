/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
declare type UseHideableNavbarReturns = {
    readonly navbarRef: (node: HTMLElement | null) => void;
    readonly isNavbarVisible: boolean;
};
export default function useHideableNavbar(hideOnScroll: boolean): UseHideableNavbarReturns;
export {};
//# sourceMappingURL=useHideableNavbar.d.ts.map