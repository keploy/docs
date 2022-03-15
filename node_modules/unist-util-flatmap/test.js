const assert = require('assert')
const assign = require('object-assign')
const flatMap = require('.')

describe('should not traverse into children of filtered out nodes', function() {
  it('should map specified node', function() {
    const ast = {
      type: 'root',
      children: [
        {
          type: 'node',
          children: [{type: 'leaf', value: '1'}]
        },
        {type: 'leaf', value: '2'}
      ]
    }
    const actual = flatMap(ast, function(node) {
      if (node.type === 'leaf') {
        return [
          assign({}, node, {value: 'FIRST'}),
          assign({}, node, {value: 'SECOND'})
        ]
      }
      // No change
      return [node]
    })
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
  })
  context('when return null', function() {
    it('should map as empty object', function() {
      const ast = {
        type: 'root',
        children: [
          {
            type: 'node',
            children: [{type: 'leaf', value: '1'}]
          },
          {type: 'leaf', value: '2'}
        ]
      }
      const actual = flatMap(ast, function(node) {
        if (node.type === 'leaf') {
          return null
        }
        // No change
        return [node]
      })
      const expected = {
        type: 'root',
        children: [
          {
            type: 'node',
            children: []
          }
        ]
      }
      assert.deepEqual(actual, expected)
    })
  })

  context('when pass empty object', function() {
    it('should work map', function() {
      const ast = {}
      const actual = flatMap(ast, function() {
        return [
          {
            value: 'test'
          }
        ]
      })
      const expected = {
        value: 'test'
      }
      assert.deepEqual(actual, expected)
    })
  })
})
