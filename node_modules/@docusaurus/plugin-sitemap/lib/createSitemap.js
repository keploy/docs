"use strict";
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const sitemap_1 = require("sitemap");
const utils_common_1 = require("@docusaurus/utils-common");
async function createSitemap(siteConfig, routesPaths, options) {
    const { url: hostname } = siteConfig;
    if (!hostname) {
        throw new Error('URL in docusaurus.config.js cannot be empty/undefined.');
    }
    const { changefreq, priority } = options;
    const sitemapStream = new sitemap_1.SitemapStream({ hostname });
    routesPaths
        .filter((route) => !route.endsWith('404.html'))
        .forEach((routePath) => sitemapStream.write({
        url: (0, utils_common_1.applyTrailingSlash)(routePath, {
            trailingSlash: siteConfig.trailingSlash,
            baseUrl: siteConfig.baseUrl,
        }),
        changefreq,
        priority,
    }));
    sitemapStream.end();
    const generatedSitemap = (await (0, sitemap_1.streamToPromise)(sitemapStream)).toString();
    return generatedSitemap;
}
exports.default = createSitemap;
