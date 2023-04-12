'use strict'

const fs = require('fs')

const inputFile = process.argv[2] || './input/nodes.json'
const outputFile = process.argv[3] || './output/output.json'
const expectedFile = process.argv[4]

const nodes = require(inputFile)

const childParse = (nodeId = null) => {
  return nodes
    .filter((x) => x.parentId === nodeId)
    .map((node) => {
      return {
        ...node,
        children: childParse(node.nodeId)
      }
    })
    .sort((a) => (!a.previousSiblingId ? 1 : -1))
    .reduce((acc, curr) => {
      const index =
        acc.findIndex((x) => x.nodeId === curr.previousSiblingId) || 0
      acc.splice(index + 1, 0, curr)
      return acc
    }, [])
}

/* Main */
const output = childParse()
fs.writeFileSync(outputFile, JSON.stringify(output))

/* Check if output is as expected */
if (expectedFile) {
  const expected = require(expectedFile)
  console.log(
    JSON.stringify(output) === JSON.stringify(expected) ? 'OK' : 'FAIL'
  )
}
