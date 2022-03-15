/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { type ReactNode } from 'react';
declare type TabGroupChoiceContextValue = {
    readonly tabGroupChoices: {
        readonly [groupId: string]: string;
    };
    readonly setTabGroupChoices: (groupId: string, newChoice: string) => void;
};
export declare function TabGroupChoiceProvider({ children, }: {
    children: ReactNode;
}): JSX.Element;
export declare function useTabGroupChoice(): TabGroupChoiceContextValue;
export {};
//# sourceMappingURL=tabGroupChoiceUtils.d.ts.map