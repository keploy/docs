/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
declare const windowSizes: {
    readonly desktop: "desktop";
    readonly mobile: "mobile";
    readonly ssr: "ssr";
};
declare type WindowSize = keyof typeof windowSizes;
export default function useWindowSize(): WindowSize;
export {};
//# sourceMappingURL=useWindowSize.d.ts.map