# unist-util-flatmap

Create a new Unist tree by mapping (to an array) with the provided function and
then flattening.

Helper for creating [unist: Universal Syntax Tree](https://github.com/syntax-tree/unist).

## Installation

```sh
npm install unist-util-flatmap
```

## Usage

### `flatMap(AST, (node, index, parent) => /* array */): AST`

flatMap function returns new AST object, but the argument function should return
an array of ASTs.

```js
const assert = require('assert')
const assign = require('object-assign')
const flatMap = require('unist-util-flatmap')

// Input
const tree = {
  type: 'root',
  children: [
    {
      type: 'node',
      children: [{type: 'leaf', value: '1'}]
    },
    {type: 'leaf', value: '2'}
  ]
}

// Transform:
const actual = flatMap(tree, node => {
  if (node.type === 'leaf') {
    return [
      assign({}, node, {value: 'FIRST'}),
      assign({}, node, {value: 'SECOND'})
    ]
  }
  // No change
  return [node]
})

// Expected output:
const expected = {
  type: 'root',
  children: [
    {
      type: 'node',
      children: [
        {type: 'leaf', value: 'FIRST'},
        {type: 'leaf', value: 'SECOND'}
      ]
    },
    {type: 'leaf', value: 'FIRST'},
    {type: 'leaf', value: 'SECOND'}
  ]
}

assert.deepEqual(actual, expected)
```

## Tests

```sh
npm test
```

## License

[MIT](LICENSE)
