// @ts-check
// Import types
/** @typedef {import("./index.d").Options} WebpackFontPreloadPluginOptions */
/** @typedef {import('webpack').Compiler} WebpackCompiler */
/** @typedef {import('webpack').Compilation} WebpackCompilation */
/** @typedef {import('jsdom').DOMWindow} Document */

const RawSource = require("webpack-sources/lib/RawSource");
const JsDom = require("jsdom");

class WebpackFontPreloadPlugin {
  /**
   * @param {WebpackFontPreloadPluginOptions} options
   */
  constructor(options) {
    const defaults = {
      index: "index.html",
      extensions: ["woff", "woff2", "ttf", "eot"],
      crossorigin: true,
      /** @type {WebpackFontPreloadPluginOptions["loadType"]} */
      loadType: "preload",
      insertBefore: "head > title",
      replaceCallback: undefined,
      filter: undefined,
    };
    /** @type {WebpackFontPreloadPluginOptions} */
    this.options = { ...defaults, ...options };
  }

  /**
   * This method is called once by the webpack compiler while installing the plugin.
   * @param {WebpackCompiler} compiler
   */
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      this.constructor.name,
      (compilation, callback) => this.addFonts(compilation, callback)
    );
  }

  /**
   * Process the generated assets to add new <link> tags in the
   * generated html.
   *
   * @param {WebpackCompilation} compilation Compilation object from webpack hook
   * @param {(err?: Error) => void} callback Callback to be invoked after processing
   *
   */
  addFonts(compilation, callback) {
    try {
      if (this.options.index) {
        const { assets, outputOptions } = compilation;
        const assetNames = assets && (Object.keys(assets) || []);
        const index = assets[this.options.index];
        const indexSource = index && index.source();
        const publicPath = (outputOptions && outputOptions.publicPath) || "";
        if (indexSource) {
          let strLink = "";
          assetNames.forEach((asset) => {
            if (this.isFontAsset(asset) && this.isFiltered(asset)) {
              strLink += this.getLinkTag(asset, publicPath.toString());
            }
          });
          // If `replaceCallback` is specified then app is responsible to forming the updated
          // index.html by using the generated link string.
          if (this.options.replaceCallback) {
            // @ts-ignore
            assets[this.options.index] = new RawSource(
              this.options.replaceCallback({
                indexSource: indexSource.toString(),
                linksAsString: strLink,
              })
            );
          } else {
            // @ts-ignore
            assets[this.options.index] = new RawSource(
              this.appendLinks(indexSource.toString(), strLink)
            );
          }
        }
      }
    } catch (error) {
      // @ts-ignore
      return callback(error);
    }
    return callback();
  }

  /**
   * Parse the passed html string and add <link> tags.
   *
   * @param {string} html Source html string
   * @param {string} links String representation of all links
   * @returns {string} Modified html as string
   *
   */
  appendLinks(html, links) {
    const { JSDOM } = JsDom;
    const parsed = new JSDOM(html);
    const { document } = parsed && parsed.window;
    const head = document && document.getElementsByTagName("head")[0];
    const insertBeforeTag =
      document && document.querySelector(this.options.insertBefore);
    if (head) {
      if (!insertBeforeTag) {
        // The `insertBeforeTag` is not present. Prepend to head itself.
        head.innerHTML = `${links}${head.innerHTML.trim()}`;
      } else {
        const parent = insertBeforeTag.parentNode;
        const newNodes = Array.from(this.createNodeFromHtml(document, links));
        if (newNodes && newNodes.length > 0) {
          newNodes.forEach((n) => {
            parent.insertBefore(n, insertBeforeTag);
          });
        }
      }
      return parsed.serialize();
    }
    return html;
  }

  /**
   * Get the extension from name of the asset.
   *
   * @param {string} name Name of asset
   * @returns {string|null} Extension of asset
   *
   */
  getExtension(name) {
    const re = /(?:\.([^.]+))?$/;
    const results = re.exec(name);
    return results && results[1];
  }

  /**
   * Get the string representation of a <link> tag for provided name
   * and public path.
   *
   * @param {string} name Name of the font asset
   * @param {string} publicPath Public path from webpack configuration
   * @returns {string} String representaion of link
   *
   */
  getLinkTag(name, publicPath) {
    const { crossorigin, loadType } = this.options;
    return `<link
      rel="${loadType}"
      href="${publicPath}${name}"
      as="font"
      ${crossorigin ? "crossorigin" : ""}
    >`;
  }

  /**
   * Check if the specified asset is a font asset.
   *
   * @param {string} name Name of the asset
   * @returns {boolean} Returns true if font asset
   */
  isFontAsset(name) {
    const { extensions } = this.options;
    const extension = this.getExtension(name);
    if (extension && extensions) {
      return extensions.includes(extension);
    }
    return false;
  }

  /**
   * Check if the asset should be preloaded based on the `filter` option.
   * @param {string} name Name of the asset
   * @returns {boolean} true if the asset is allowed to be preloaded
   */
  isFiltered(name) {
    const { filter } = this.options;
    if (filter) {
      if (filter instanceof RegExp) {
        // Check that the asset name matches the filter regex.
        return filter.test(name);
      }
      // Check if the asset name contains the specified filter string.
      return name.includes(filter);
    }
    // If the filter is not defined, allow all the assets to preload.
    return true;
  }

  /**
   * Generate nodes/element from the Html string
   * @param {Document} document Document object from jsdom
   * @param {string} strHtml String representing the html
   * @returns {Array} Array of html nodes
   */
  createNodeFromHtml(document, strHtml) {
    const container = document.createElement("div");
    container.innerHTML = strHtml.trim();
    return container.childNodes;
  }
}

module.exports = WebpackFontPreloadPlugin;
