/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export declare class GitNotFoundError extends Error {
}
export declare const getFileCommitDate: (file: string, { age, includeAuthor, }: {
    age?: "oldest" | "newest" | undefined;
    includeAuthor?: boolean | undefined;
}) => {
    date: Date;
    timestamp: number;
    author?: string | undefined;
};
//# sourceMappingURL=gitUtils.d.ts.map