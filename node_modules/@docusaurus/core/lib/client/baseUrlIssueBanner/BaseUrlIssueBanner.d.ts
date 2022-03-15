/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="react" />
import './styles.module.css';
declare global {
    interface Window {
        __DOCUSAURUS_INSERT_BASEURL_BANNER: boolean;
    }
}
/**
 * We want to help the users with a bad baseUrl configuration (very common
 * error) Help message is inlined, and hidden if JS or CSS is able to load
 * Note: it might create false positives (ie network failures): not a big deal
 * Note: we only inline this for the homepage to avoid polluting all the site's
 * pages
 * @see https://github.com/facebook/docusaurus/pull/3621
 */
export default function BaseUrlIssueBanner(): JSX.Element | null;
