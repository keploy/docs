[![npm][npm]][npm-url]

# webpack-font-preload-plugin

A webpack plugin to allow preloading or prefetching of fonts.

## Introduction

The [preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content) value of the `<link>` element's `rel` attribute lets you declare fetch requests in the HTML's `<head>`, specifying resources that your page will need very soon, which you want to start loading early in the page lifecycle, before browsers' main rendering machinery kicks in. This ensures they are available earlier and are less likely to block the page's render, improving performance.

This plugin specifically targets fonts used with the application which are bundled using webpack. The plugin would add `<link>` tags in the begining of `<head>` of your html:

```html
<link rel="preload" href="/font1.woff" as="font" crossorigin />
<link rel="preload" href="/font2.woff" as="font" crossorigin />
```

## Getting Started

To begin, you'll need to install `webpack-font-preload-plugin`:

```console
$ npm install webpack-font-preload-plugin --save-dev
```

Then add the plugin to your `webpack` config. For example:

**webpack.config.js**

```js
const FontPreloadPlugin = require("webpack-font-preload-plugin");

module.exports = {
  plugins: [new FontPreloadPlugin()],
};
```

And run `webpack` via your preferred method.

## Options

### `index`

Type: `string`
Default: `index.html`
Optional: `true`

Name of the index file which needs modification.

```js
// in your webpack.config.js
new FontPreloadPlugin({
  index: "index.html",
});
```

### `extensions`

Type: `string[]`
Default: `['woff', 'woff2', 'ttf', 'eot']`
Optional: `true`

Default font extensions which should be used.

```js
// in your webpack.config.js
new FontPreloadPlugin({
  extensions: ["woff", "ttf", "eot"],
});
```

### `crossorigin`

Type: `boolean`
Default: `true`
Optional: `true`

Is the font request crossorigin or not.

```js
// in your webpack.config.js
new FontPreloadPlugin({
  crossorigin: true,
});
```

### `loadType`

Type: `string`
Default: `preload`
Optional: `true`

Type of load. It can be either `preload` or `prefetch`.

```js
// in your webpack.config.js
new FontPreloadPlugin({
  loadType: "preload",
});
```

### `insertBefore`

Type: `string`
Default: `head > title`
Optional: `true`

The selector for node before which the preload/prefetch links should be added.

```js
// in your webpack.config.js
new FontPreloadPlugin({
  // Add the preload statements before any other <link> tag present in html
  insertBefore: "head > link:nth-child(1)",
});
```

### `replaceCallback`

Type: `Function`
Default: `undefined`
Optional: `true`

Callback for doing custom manipulations to index.html for special use cases like templating or server side rendering. This callback would be passed an `object` as parameter with 2 keys:

- `indexSource`: Full source string of the index.html.
- `linksAsString`: `<link>` tags for preloading fonts as a string.

The consuming app can use this information to generate the final index.html
and must return an updated string which would be used as index.html after
webpack build.

```js
// in your webpack.config.js
new FontPreloadPlugin({
  replaceCallback: ({ indexSource, linksAsString }) => {
    return indexSource.replace("{{{links}}}", linksAsString);
  },
});
```

### `filter`

Type: `string`
Default: `undefined`
Optional: `true`

Expression for allowing more granular filtering of the font assets for doing a preload/prefetch. The filter is applied on the font assets selected by the `extensions` option. If the filter is a string, all the font assets which contain the string as part of the name are included in the preload and rest are ignored. In case filter is regex, the font asset's name is tested to match the regex for allowing preload. If you don't pass this option, all the font assets will be preloaded.

```js
// To only preload font's which have string `app-font` as part of there name.
new FontPreloadPlugin({
  filter: "app-font",
});

// To preload fonts which start with `mui` or `app` in there name.
new FontPreloadPlugin({
  filter: /^mui|^app/i,
});
```

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/webpack-font-preload-plugin
[npm-url]: https://npmjs.com/package/webpack-font-preload-plugin
