/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { ContentPaths } from './markdownLinks';
declare type DataFileParams = {
    filePath: string;
    contentPaths: ContentPaths;
};
export declare function getDataFilePath({ filePath, contentPaths, }: DataFileParams): Promise<string | undefined>;
/**
 * Looks up for a data file in the content paths, returns the normalized object.
 * Throws when validation fails; returns undefined when file not found
 */
export declare function getDataFileData<T>(params: DataFileParams & {
    fileType: string;
}, validate: (content: unknown) => T): Promise<T | undefined>;
export declare function getContentPathList(contentPaths: ContentPaths): string[];
export declare function findFolderContainingFile(folderPaths: string[], relativeFilePath: string): Promise<string | undefined>;
export declare function getFolderContainingFile(folderPaths: string[], relativeFilePath: string): Promise<string>;
export {};
//# sourceMappingURL=dataFileUtils.d.ts.map