/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
interface UseSearchPageReturn {
    searchQuery: string;
    setSearchQuery: (newSearchQuery: string) => void;
    generateSearchPageLink: (targetSearchQuery: string) => string;
}
export default function useSearchPage(): UseSearchPageReturn;
export {};
//# sourceMappingURL=useSearchPage.d.ts.map